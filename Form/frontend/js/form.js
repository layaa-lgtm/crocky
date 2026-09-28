document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: {
            street: document.getElementById('streetAddress').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        },
        birthdate: document.getElementById('birthdate').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        occupation: document.getElementById('occupation').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(checkbox => checkbox.value)
    };

    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showSuccessMessage('User data submitted successfully!');
            e.target.reset();
        } else {
            showErrorMessage('Error submitting data');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Error submitting data');
    }
});

function resetForm() {
    document.getElementById('userForm').reset();
}

function showSuccessMessage(message) {
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showErrorMessage(message) {
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    return toast;
}

// Add form validation
const inputs = document.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.classList.add('error');
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            input.parentNode.appendChild(errorMessage);
        }
    });

    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `+1 (${value}`;
        } else if (value.length <= 6) {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    e.target.value = value;
});

// Add ZIP code validation
document.getElementById('zipCode').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
});

// Add these helper functions at the top of your file
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

// Update the date validation
document.getElementById('birthdate').addEventListener('change', (e) => {
    const birthDate = new Date(e.target.value);
    const age = calculateAge(birthDate);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18); // Must be at least 18 years old
    
    if (isNaN(birthDate.getTime())) {
        e.target.setCustomValidity('Please enter a valid date');
    } else if (birthDate > new Date()) {
        e.target.setCustomValidity('Birth date cannot be in the future');
    } else if (age < 18) {
        e.target.setCustomValidity(`Must be at least 18 years old (you are ${age} years old)`);
    } else if (age > 120) {
        e.target.setCustomValidity('Please enter a valid birth date');
    } else {
        e.target.setCustomValidity('');
    }

    // Show validation message
    if (e.target.validationMessage) {
        const errorDiv = e.target.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'error-message';
            div.textContent = e.target.validationMessage;
            e.target.parentElement.appendChild(div);
        } else {
            errorDiv.textContent = e.target.validationMessage;
        }
    }
});

// Set max date for birthdate input (18 years ago)
const birthdateInput = document.getElementById('birthdate');
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
birthdateInput.max = maxDate.toISOString().split('T')[0]; 