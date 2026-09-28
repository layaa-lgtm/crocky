Here's a comprehensive markdown documentation for your project:

```markdown
# User Management System Documentation

## Overview
A full-stack web application for managing user information with a Go backend, MongoDB database, and vanilla JavaScript frontend. The system provides user registration, analytics dashboard, and data management capabilities.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Go (Golang)
- **Database**: MongoDB
- **Container**: Docker
- **API**: RESTful architecture

## Project Structure
```tree
project/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── form.js
│   │   └── analytics.js
│   ├── index.html
│   └── analytics.html
├── backend/
│   └── main.go
└── docker-compose.yaml
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Go 1.16+
- MongoDB
- Modern web browser

### Running the Project

1. **Start MongoDB and Backend using Docker**:
```bash
docker-compose up -d
```

2. **Run Backend Directly (Alternative)**:
```bash
cd backend
go run main.go
```

3. **Access the Application**:
- Form: `http://localhost:8080`
- Analytics Dashboard: `http://localhost:8080/analytics.html`

## API Documentation

### Endpoints

#### 1. Create User
```http
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (123) 456-7890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "birthdate": "1990-01-01",
  "gender": "male",
  "occupation": "Engineer"
}
```

#### 2. Get All Users
```http
GET /api/users
```

#### 3. Delete User
```http
DELETE /api/users/{id}
```

### Testing API with cURL

1. **Create User**:
```bash
curl -X POST http://localhost:8080/api/users \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (123) 456-7890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "birthdate": "1990-01-01",
  "gender": "male",
  "occupation": "Engineer"
}'
```

2. **Get All Users**:
```bash
curl http://localhost:8080/api/users
```

3. **Delete User**:
```bash
curl -X DELETE http://localhost:8080/api/users/{user_id}
```

## Data Models

### User Schema
```go
type User struct {
    ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
    FirstName string            `json:"firstName" bson:"firstName"`
    LastName  string            `json:"lastName" bson:"lastName"`
    Email     string            `json:"email" bson:"email"`
    Phone     string            `json:"phone" bson:"phone"`
    Address   Address           `json:"address" bson:"address"`
    Birthdate string            `json:"birthdate" bson:"birthdate"`
    Gender    string            `json:"gender" bson:"gender"`
}

type Address struct {
    Street  string `json:"street" bson:"street"`
    City    string `json:"city" bson:"city"`
    State   string `json:"state" bson:"state"`
    ZipCode string `json:"zipCode" bson:"zipCode"`
    Country string `json:"country" bson:"country"`
}
```

## Features

### Form Validation
- Required field validation
- Email format validation
- Phone number formatting
- Age verification (18+ years)
- ZIP code validation
- Real-time feedback

### Analytics Dashboard
- Total user count
- Country distribution
- Today's entries
- User search functionality
- Detailed user view
- Delete confirmation
- Responsive design

## Error Handling

### Backend Error Codes
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

### Frontend Validation
- Form field validation
- Age restriction (18+)
- Phone number formatting
- Required fields
- Email format

## Development

### Backend Development
```bash
# Run with hot reload (using air)
air

# Build binary
go build -o app main.go
```

### Frontend Development
- Serve using any static file server
- No build process required
- Direct browser refresh for updates

## Docker Configuration
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

## Security Considerations
- CORS enabled for development
- Input validation on both frontend and backend
- No sensitive data exposure
- Error handling without stack traces

## Logging
- Backend logs with levels (INFO/ERROR)
- Request logging
- Error logging
- Operation logging

## Future Improvements
1. User authentication
2. Data export functionality
3. More analytics features
4. Image upload capability
5. Email verification
6. Password protection
7. User roles and permissions
8. Activity logging
9. Backup functionality
10. API rate limiting

## Troubleshooting

### Common Issues
1. MongoDB connection failures
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. API Errors
   - Verify server is running
   - Check request format
   - Validate data types

3. Frontend Issues
   - Clear browser cache
   - Check console for errors
   - Verify API endpoints

### Debug Commands
```bash
# Check MongoDB status
docker ps | grep mongo

# Check backend logs
docker logs backend

# Test MongoDB connection
mongosh mongodb://localhost:27017
```
```

This documentation provides a comprehensive overview of your project, including setup instructions, API documentation, features, and troubleshooting guides. You can save this as `README.md` in your project root directory.
