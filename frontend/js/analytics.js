let users = [];

async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:8080/api/users');
        users = await response.json();
        
        updateDashboardStats();
        renderUserTable();
        showSuccessMessage('Data refreshed successfully');
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Error fetching data');
    }
}

function updateDashboardStats() {
    document.getElementById('userCount').textContent = users.length;
    
    // Count unique countries
    const uniqueCountries = new Set(users.map(user => user.address.country));
    document.getElementById('countryCount').textContent = uniqueCountries.size;
    
    // Count today's entries more accurately
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = users.filter(user => {
        const entryDate = new Date(user.birthdate).toISOString().split('T')[0];
        return entryDate === today;
    }).length;
    document.getElementById('todayCount').textContent = todayEntries;
}

function renderUserTable() {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address.city}, ${user.address.country}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-button" onclick="showUserDetails('${user._id}')">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="delete-button" onclick="showDeleteConfirmation('${user._id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showUserDetails(userId) {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const age = calculateAge(user.birthdate);
    const formattedDate = formatDate(user.birthdate);

    const modal = document.getElementById('userDetailsModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="user-details">
            <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>First Name</label>
                        <span>${user.firstName}</span>
                    </div>
                    <div class="detail-item">
                        <label>Last Name</label>
                        <span>${user.lastName}</span>
                    </div>
                    <div class="detail-item">
                        <label>Email</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="detail-item">
                        <label>Phone</label>
                        <span>${user.phone}</span>
                    </div>
                    <div class="detail-item">
                        <label>Gender</label>
                        <span>${user.gender}</span>
                    </div>
                    <div class="detail-item">
                        <label>Birth Date</label>
                        <span>${formattedDate} (${age} years old)</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Address Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Street</label>
                        <span>${user.address.street}</span>
                    </div>
                    <div class="detail-item">
                        <label>City</label>
                        <span>${user.address.city}</span>
                    </div>
                    <div class="detail-item">
                        <label>State</label>
                        <span>${user.address.state}</span>
                    </div>
                    <div class="detail-item">
                        <label>ZIP Code</label>
                        <span>${user.address.zipCode}</span>
                    </div>
                    <div class="detail-item">
                        <label>Country</label>
                        <span>${user.address.country}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function showDeleteConfirmation(userId) {
    const modal = document.getElementById('deleteConfirmModal');
    const confirmButton = document.getElementById('confirmDeleteButton');
    
    // Clear any previous onclick handlers
    confirmButton.onclick = async () => {
        await deleteUser(userId);
        closeModal('deleteConfirmModal');
    };
    
    modal.classList.add('show');
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove user from local array
            users = users.filter(user => user._id !== userId);
            // Update UI
            updateDashboardStats();
            renderUserTable();
            showSuccessMessage('User deleted successfully');
        } else {
            const errorData = await response.text();
            showErrorMessage(`Error deleting user: ${errorData}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Error deleting user');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    
    // Add fade-out animation
    modal.classList.add('fade-out');
    
    // Remove the fade-out class and reset after animation
    setTimeout(() => {
        modal.classList.remove('fade-out');
    }, 300);
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    renderFilteredUsers(filteredUsers);
});

function renderFilteredUsers(filteredUsers) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address.city}, ${user.address.country}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-button" onclick="showUserDetails('${user._id}')">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="delete-button" onclick="showDeleteConfirmation('${user._id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add these helper functions to analytics.js as well
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Initialize dashboard
fetchUserData(); 