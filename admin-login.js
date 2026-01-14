// ====== ADMIN LOGIN LOGIC ======
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const passwordInput = document.getElementById('adminPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');
    
    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin-panel.html';
    }
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        const correctPassword = "rose123"; // Default password - change this!
        
        // Get login button
        const loginBtn = this.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        const originalGradient = loginBtn.style.background;
        
        // Show loading state
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        loginBtn.disabled = true;
        loginBtn.style.cursor = 'not-allowed';
        
        // Simulate API call delay
        setTimeout(() => {
            if (password === correctPassword) {
                // Success
                loginBtn.innerHTML = '<i class="fas fa-check"></i> Access Granted!';
                loginBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                
                // Save login state if remember me is checked
                if (rememberMe.checked) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminLastLogin', new Date().toISOString());
                } else {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                }
                
                // Redirect to dashboard after success animation
                setTimeout(() => {
                    window.location.href = 'admin-panel.html';
                }, 1000);
                
                // Add success animation to form
                loginForm.classList.add('success');
                
            } else {
                // Error
                loginBtn.innerHTML = '<i class="fas fa-times"></i> Wrong Password!';
                loginBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                
                // Shake animation
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
                
                // Clear password field
                passwordInput.value = '';
                passwordInput.focus();
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    loginBtn.innerHTML = originalText;
                    loginBtn.style.background = originalGradient;
                    loginBtn.disabled = false;
                    loginBtn.style.cursor = 'pointer';
                }, 2000);
            }
        }, 1500); // Simulate server delay
    });
    
    // Forgot password functionality
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show password hint
            const hint = document.querySelector('.password-hint span');
            if (hint) {
                const originalText = hint.textContent;
                hint.textContent = 'Password is: rose123';
                hint.style.color = '#ff6b6b';
                hint.style.fontWeight = 'bold';
                
                setTimeout(() => {
                    hint.textContent = originalText;
                    hint.style.color = '';
                    hint.style.fontWeight = '';
                }, 5000);
            }
        });
    }
    
    // Add floating hearts animation
    createFloatingHearts();
    
    // Add sparkle effect on input focus
    passwordInput.addEventListener('focus', function() {
        this.parentElement.classList.add('sparkle');
    });
    
    passwordInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('sparkle');
    });
});

// Create floating hearts animation
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    // Create additional hearts
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        
        // Random position
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 15 + Math.random() * 10;
        
        heart.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: 110%;
            font-size: ${0.8 + Math.random() * 1}rem;
            color: rgba(255, 107, 157, ${0.2 + Math.random() * 0.3});
            animation: float ${duration}s linear infinite ${delay}s;
        `;
        
        container.appendChild(heart);
    }
}

// Add CSS for sparkle effect
const style = document.createElement('style');
style.textContent = `
    .input-with-icon.sparkle::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #ff6b9d, #ffd700, #ff6b9d, #ffd700);
        background-size: 400% 400%;
        border-radius: 17px;
        z-index: -1;
        animation: sparkleBorder 3s ease infinite;
        filter: blur(2px);
        opacity: 0.5;
    }
    
    @keyframes sparkleBorder {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    .success {
        animation: successPulse 0.5s ease;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);