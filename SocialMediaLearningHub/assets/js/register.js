// DOM Elements
const form = document.getElementById('signupForm');
const profilePicInput = document.getElementById('profilePic');
const profilePicPreview = document.getElementById('profilePicPreview');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordToggle = document.getElementById('passwordToggle');
const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

// Form Validation Rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        pattern: /^[A-Za-z\s]+$/,
        message: 'Please enter a valid first name (letters only)'
    },
    lastName: {
        required: true,
        minLength: 2,
        pattern: /^[A-Za-z\s]+$/,
        message: 'Please enter a valid last name (letters only)'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        message: 'Password must be at least 8 characters long and include letters, numbers, and special characters'
    },
    confirmPassword: {
        required: true,
        match: 'password',
        message: 'Passwords do not match'
    },
    dateOfBirth: {
        required: true,
        age: 13,
        message: 'You must be at least 13 years old to register'
    }
};

// Profile Picture Preview
profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Password Visibility Toggle
function togglePasswordVisibility(inputElement, toggleElement) {
    toggleElement.addEventListener('click', () => {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        inputElement.setAttribute('type', type);
        toggleElement.classList.toggle('fa-eye');
        toggleElement.classList.toggle('fa-eye-slash');
    });
}

togglePasswordVisibility(passwordInput, passwordToggle);
togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);

// Validation Functions
function validateField(field) {
    const rules = validationRules[field.id];
    const errorElement = field.nextElementSibling.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Required Check
    if (rules.required && !field.value.trim()) {
        isValid = false;
        errorMessage = `${field.labels[0].textContent} is required`;
    }
    // Minimum Length Check
    else if (rules.minLength && field.value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Minimum ${rules.minLength} characters required`;
    }
    // Pattern Check
    else if (rules.pattern && !rules.pattern.test(field.value)) {
        isValid = false;
        errorMessage = rules.message;
    }
    // Password Match Check
    else if (rules.match && field.value !== document.getElementById(rules.match).value) {
        isValid = false;
        errorMessage = rules.message;
    }
    // Age Check
    else if (rules.age && field.id === 'dateOfBirth') {
        const age = calculateAge(new Date(field.value));
        if (age < rules.age) {
            isValid = false;
            errorMessage = rules.message;
        }
    }

    // Update UI
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
    errorElement.textContent = errorMessage;

    return isValid;
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Form Submit Handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(validationRules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Check Terms and Conditions
    const termsCheck = document.getElementById('termsCheck');
    if (!termsCheck.checked) {
        termsCheck.nextElementSibling.nextElementSibling.textContent = 'You must agree to the Terms and Conditions';
        isValid = false;
    }

    if (isValid) {
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...';
            submitButton.disabled = true;

            // Collect form data
            const formData = new FormData(form);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                dateOfBirth: formData.get('dateOfBirth'),
                profilePic: await getBase64(profilePicInput.files[0])
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showAlert('success', 'Account created successfully! Redirecting to login...');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            showAlert('danger', 'An error occurred. Please try again.');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
});

// Real-time validation
Object.keys(validationRules).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
});

// Utility Functions
function getBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showAlert(type, message) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    form.insertAdjacentHTML('beforebegin', alertHTML);
}