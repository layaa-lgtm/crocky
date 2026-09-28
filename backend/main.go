package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Create custom loggers that write to standard output
var (
	InfoLogger  = log.New(os.Stdout, "\033[34mINFO: \033[0m", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(os.Stdout, "\033[31mERROR: \033[0m", log.Ldate|log.Ltime|log.Lshortfile)
)

type Address struct {
	Street  string `json:"street" bson:"street"`
	City    string `json:"city" bson:"city"`
	State   string `json:"state" bson:"state"`
	ZipCode string `json:"zipCode" bson:"zipCode"`
	Country string `json:"country" bson:"country"`
}

type User struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	FirstName string             `json:"firstName" bson:"firstName"`
	LastName  string             `json:"lastName" bson:"lastName"`
	Email     string             `json:"email" bson:"email"`
	Phone     string             `json:"phone" bson:"phone"`
	Address   Address            `json:"address" bson:"address"`
	Birthdate string             `json:"birthdate" bson:"birthdate"`
	Gender    string             `json:"gender" bson:"gender"`
}

var client *mongo.Client
var collection *mongo.Collection

func main() {
	InfoLogger.Println("Server starting...")

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := "mongodb://localhost:27017/form"
	InfoLogger.Printf("Attempting to connect to MongoDB at: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		ErrorLogger.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Check connection
	err = client.Ping(ctx, nil)
	if err != nil {
		ErrorLogger.Fatalf("Failed to ping MongoDB: %v", err)
	}
	InfoLogger.Println("Successfully connected to MongoDB")

	collection = client.Database("form").Collection("users")

	// Set up router
	router := mux.NewRouter()
	router.HandleFunc("/api/users", createUser).Methods("POST")
	router.HandleFunc("/api/users", getUsers).Methods("GET")
	router.HandleFunc("/api/users/{id}", deleteUser).Methods("DELETE")

	// Set up CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	// Start server
	handler := c.Handler(router)
	InfoLogger.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func createUser(w http.ResponseWriter, r *http.Request) {
	InfoLogger.Printf("Received POST request from %s", r.RemoteAddr)

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		ErrorLogger.Printf("Failed to decode request body: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	InfoLogger.Printf("Received user data: %+v", user)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Generate a new ObjectID if not provided
	if user.ID.IsZero() {
		user.ID = primitive.NewObjectID()
		InfoLogger.Printf("Generated new ObjectID: %s", user.ID.Hex())
	}

	_, err := collection.InsertOne(ctx, user)
	if err != nil {
		ErrorLogger.Printf("Failed to insert user into database: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	InfoLogger.Printf("Successfully created user with ID: %s", user.ID.Hex())
	json.NewEncoder(w).Encode(user)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	InfoLogger.Printf("Received GET request from %s", r.RemoteAddr)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		ErrorLogger.Printf("Failed to fetch users: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var users []User
	if err = cursor.All(ctx, &users); err != nil {
		ErrorLogger.Printf("Failed to decode users: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	InfoLogger.Printf("Successfully retrieved %d users", len(users))
	json.NewEncoder(w).Encode(users)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	InfoLogger.Printf("Received DELETE request for user ID: %s from %s", id, r.RemoteAddr)

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		ErrorLogger.Printf("Invalid ObjectID format: %s, error: %v", id, err)
		http.Error(w, fmt.Sprintf("Invalid ID format: %v", err), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		ErrorLogger.Printf("Failed to delete user %s: %v", id, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		ErrorLogger.Printf("User not found with ID: %s", id)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	InfoLogger.Printf("Successfully deleted user with ID: %s", id)
	w.WriteHeader(http.StatusOK)
}
