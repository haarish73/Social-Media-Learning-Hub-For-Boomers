// Form state management
const formData = {
    currentStep: 1,
    totalSteps: 4,
    userData: {
        fullName: '',
        email: '',
        password: '',
        avatar: null,
        bio: '',
        interests: []
    }
};

// DOM Elements
const elements = {
    form: document.getElementById('signupForm'),
    steps: document.querySelectorAll('.form-step'),
    progressBar: document.querySelector('.progress-bar'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    submitBtn: document.getElementById('submitBtn'),
    passwordInput: document.getElementById('password'),
    passwordToggle: document.getElementById('togglePassword'),
    passwordStrength: document.querySelector('.password-strength .progress-bar'),
    avatarInput: document.getElementById('avatarInput'),
    avatarPreview: document.getElementById('avatarPreview'),
    interestBadges: document.querySelectorAll('.interest-badge'),
    termsCheck: document.getElementById('termsCheck'),
    summaryInfo: document.querySelector('.summary-info') // Fixed this selector
};

// Initialize event listeners
function initializeEventListeners() {
    elements.form.addEventListener('submit', handleSubmit);
    elements.prevBtn.addEventListener('click', previousStep);
    elements.nextBtn.addEventListener('click', nextStep);
    elements.passwordInput.addEventListener('input', updatePasswordStrength);
    elements.passwordToggle.addEventListener('click', togglePasswordVisibility);
    elements.avatarInput.addEventListener('change', handleAvatarUpload);
    elements.interestBadges.forEach(badge => {
        badge.addEventListener('click', toggleInterest);
    });
}

// Navigation functions
function updateStep(step) {
    // Update progress bar
    elements.progressBar.style.width = `${(step / formData.totalSteps) * 100}%`;
    
    // Show/hide steps
    elements.steps.forEach((stepElement, index) => {
        stepElement.classList.toggle('active', index + 1 === step);
    });
    
    // Update buttons
    elements.prevBtn.style.display = step === 1 ? 'none' : 'block';
    elements.nextBtn.style.display = step === formData.totalSteps ? 'none' : 'block';
    elements.submitBtn.style.display = step === formData.totalSteps ? 'block' : 'none';
    
    formData.currentStep = step;
}

function previousStep() {
    if (formData.currentStep > 1) {
        updateStep(formData.currentStep - 1);
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (formData.currentStep < formData.totalSteps) {
            updateStep(formData.currentStep + 1);
            if (formData.currentStep === formData.totalSteps) {
                updateSummary();
            }
        }
    }
}

// Validation functions
function validateCurrentStep() {
    const currentStepElement = elements.steps[formData.currentStep - 1];
    const inputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }

        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
    });

    // Additional validation for password on step 1
    if (formData.currentStep === 1 && elements.passwordInput.value.length < 8) {
        elements.passwordInput.classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
}

// Password strength meter
function updatePasswordStrength() {
    const password = elements.passwordInput.value;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;

    elements.passwordStrength.style.width = `${strength}%`;
    
    if (strength <= 25) {
        elements.passwordStrength.className = 'progress-bar bg-danger';
    } else if (strength <= 50) {
        elements.passwordStrength.className = 'progress-bar bg-warning';
    } else if (strength <= 75) {
        elements.passwordStrength.className = 'progress-bar bg-info';
    } else {
        elements.passwordStrength.className = 'progress-bar bg-success';
    }
}

function togglePasswordVisibility() {
    const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
    elements.passwordInput.type = type;
    elements.passwordToggle.innerHTML = `<i class="fas fa-${type === 'password' ? 'eye' : 'eye-slash'}"></i>`;
}

// Avatar handling
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.avatarPreview.src = e.target.result;
            formData.userData.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Interest selection
function toggleInterest(event) {
    const badge = event.target;
    badge.classList.toggle('selected');
    
    const interest = badge.textContent;
    if (badge.classList.contains('selected')) {
        formData.userData.interests.push(interest);
    } else {
        const index = formData.userData.interests.indexOf(interest);
        if (index > -1) {
            formData.userData.interests.splice(index, 1);
        }
    }
}

// Summary update
function updateSummary() {
    const summary = ` 
        <p><strong>Name:</strong> ${document.getElementById('fullName').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
        <p><strong>Bio:</strong> ${document.getElementById('bio').value || 'Not provided'}</p>
        <p><strong>Interests:</strong> ${formData.userData.interests.join(', ') || 'None selected'}</p>
        <p><strong>Avatar:</strong> <img src="${formData.userData.avatar}" alt="User Avatar" style="width: 50px; height: 50px; border-radius: 50%;"></p>
    `;
    elements.summaryInfo.innerHTML = summary;
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    
    if (!elements.termsCheck.checked) {
        elements.termsCheck.classList.add('is-invalid');
        return;
    }

    // Collect all form data
    formData.userData = {
        ...formData.userData,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        bio: document.getElementById('bio').value
    };

    // Here you would typically send the data to a backend
    console.log('Form data submitted:', formData.userData);
    alert('Form submitted successfully!');
}

// Initialize the form steps
initializeEventListeners();
updateStep(formData.currentStep);
