// ====== SPECIAL OFFERS MANAGEMENT LOGIC ======

// Note: currentOffer is declared in admin-dashboard.js, so we use window.currentOffer
let selectedGradient = 'pink-gold';
let customGradient = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Admin Offers Management Initialized');
    
    // Initialize offer management
    initializeGradientOptions();
    initializeOfferForm();
    loadCurrentOffer();
    
    // Set up event listeners
    setupOfferEventListeners();
    
    // Initialize custom gradient builder
    initializeCustomGradientBuilder();
});

// Initialize gradient options
function initializeGradientOptions() {
    const gradientOptionsContainer = document.getElementById('gradientOptions');
    if (!gradientOptionsContainer) {
        console.error('❌ Gradient options container not found');
        return;
    }
    
    console.log('✨ Initializing gradient options');
    
    const gradients = [
        { id: 'pink-gold', name: 'Pink & Gold', previewClass: 'pink-gold' },
        { id: 'purple-pink', name: 'Purple & Pink', previewClass: 'purple-pink' },
        { id: 'blue-purple', name: 'Blue & Purple', previewClass: 'blue-purple' },
        { id: 'sunset', name: 'Sunset', previewClass: 'sunset' },
        { id: 'emerald', name: 'Emerald', previewClass: 'emerald' },
        { id: 'custom', name: 'Custom', previewClass: 'custom' }
    ];
    
    gradientOptionsContainer.innerHTML = gradients.map(gradient => `
        <button class="gradient-option ${gradient.id === selectedGradient ? 'active' : ''}" 
                data-gradient="${gradient.id}">
            <div class="gradient-preview ${gradient.previewClass}">
                ${gradient.id === 'custom' ? '<i class="fas fa-palette"></i>' : ''}
            </div>
            <span>${gradient.name}</span>
        </button>
    `).join('');
    
    // Add event listeners to gradient options
    const gradientOptions = gradientOptionsContainer.querySelectorAll('.gradient-option');
    gradientOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('🎨 Gradient selected:', this.getAttribute('data-gradient'));
            
            // Update active option
            gradientOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update selected gradient
            selectedGradient = this.getAttribute('data-gradient');
            
            // Show/hide custom gradient builder
            const customBuilder = document.getElementById('customGradientBuilder');
            if (selectedGradient === 'custom') {
                customBuilder.style.display = 'block';
                updateCustomGradientPreview();
            } else {
                customBuilder.style.display = 'none';
                customGradient = null;
            }
        });
    });
}

// Initialize custom gradient builder
function initializeCustomGradientBuilder() {
    const color1 = document.getElementById('color1');
    const color2 = document.getElementById('color2');
    const color3 = document.getElementById('color3');
    const direction = document.getElementById('gradientDirection');
    
    if (!color1 || !color2 || !color3 || !direction) {
        console.error('❌ Custom gradient elements not found');
        return;
    }
    
    console.log('🎨 Initializing custom gradient builder');
    
    // Update preview when colors change
    [color1, color2, color3, direction].forEach(element => {
        element.addEventListener('input', updateCustomGradient);
        element.addEventListener('change', updateCustomGradient);
    });
    
    // Initial update
    updateCustomGradient();
}

// Update custom gradient preview
function updateCustomGradient() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const color3 = document.getElementById('color3').value;
    const direction = document.getElementById('gradientDirection').value;
    
    const gradientPreview = document.getElementById('customGradientPreview');
    if (!gradientPreview) return;
    
    // Create gradient string
    let gradientString;
    if (direction === 'circle') {
        gradientString = `radial-gradient(circle, ${color1}, ${color2}, ${color3})`;
    } else {
        gradientString = `linear-gradient(${direction}, ${color1}, ${color2}, ${color3})`;
    }
    
    // Update preview
    gradientPreview.style.background = gradientString;
    
    // Save custom gradient
    customGradient = gradientString;
    console.log('🎨 Custom gradient updated:', gradientString);
}

// Update custom gradient preview (for initialization)
function updateCustomGradientPreview() {
    const gradientPreview = document.getElementById('customGradientPreview');
    if (!gradientPreview) return;
    
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const color3 = document.getElementById('color3').value;
    const direction = document.getElementById('gradientDirection').value;
    
    let gradientString;
    if (direction === 'circle') {
        gradientString = `radial-gradient(circle, ${color1}, ${color2}, ${color3})`;
    } else {
        gradientString = `linear-gradient(${direction}, ${color1}, ${color2}, ${color3})`;
    }
    
    gradientPreview.style.background = gradientString;
}

// Initialize offer form
function initializeOfferForm() {
    const titleInput = document.getElementById('offerTitle');
    const descriptionInput = document.getElementById('offerDescription');
    const durationInput = document.getElementById('offerDuration');
    
    if (!titleInput || !descriptionInput || !durationInput) {
        console.error('❌ Offer form elements not found');
        return;
    }
    
    console.log('📝 Initializing offer form');
    
    // Update character counts
    [titleInput, descriptionInput].forEach(input => {
        input.addEventListener('input', updateCharCount);
    });
    
    // Initial character count update
    updateCharCount.call(titleInput);
    updateCharCount.call(descriptionInput);
}

// Update character count
function updateCharCount() {
    const maxLength = this.getAttribute('maxlength');
    const currentLength = this.value.length;
    const charCount = this.nextElementSibling;
    
    if (charCount && charCount.classList.contains('char-count')) {
        charCount.textContent = `${currentLength}/${maxLength} characters`;
        
        // Add warning if near limit
        if (currentLength > maxLength * 0.8) {
            charCount.style.color = '#ef4444';
        } else {
            charCount.style.color = '#999';
        }
    }
}

// Load current offer
function loadCurrentOffer() {
    console.log('📦 Loading current offer from localStorage');
    
    try {
        const savedOffer = localStorage.getItem('healingHandsSpecialOffer');
        if (savedOffer) {
            // Use window.currentOffer to avoid conflict with dashboard.js
            window.currentOffer = JSON.parse(savedOffer);
            console.log('✅ Offer loaded:', window.currentOffer);
            displayCurrentOffer(window.currentOffer);
            
            // Enable delete button
            const deleteBtn = document.getElementById('deleteOfferBtn');
            if (deleteBtn) {
                deleteBtn.disabled = false;
            }
        } else {
            console.log('ℹ️ No saved offer found');
        }
    } catch (error) {
        console.error('❌ Error loading offer:', error);
        window.currentOffer = null;
    }
}

// Display current offer in preview
function displayCurrentOffer(offer) {
    const offerPreview = document.getElementById('currentOfferPreview');
    if (!offerPreview) {
        console.error('❌ Offer preview container not found');
        return;
    }
    
    console.log('👀 Displaying current offer:', offer.title);
    
    // Parse gradient from stored offer
    let gradientStyle = offer.gradient;
    
    offerPreview.innerHTML = `
        <div class="offer-display" style="background: ${gradientStyle}; padding: 2rem; border-radius: 12px; text-align: center; color: white; min-height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h4 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${offer.title}</h4>
            <p style="font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.5;">${offer.body}</p>
            <small style="opacity: 0.8; font-size: 0.9rem;">Shows after ${offer.duration || 1} minute on website</small>
        </div>
    `;
}

// Set up offer event listeners
function setupOfferEventListeners() {
    console.log('🔗 Setting up offer event listeners');
    
    const previewBtn = document.getElementById('previewOfferBtn');
    const deleteBtn = document.getElementById('deleteOfferBtn');
    const publishBtn = document.getElementById('publishOfferBtn');
    
    // Preview offer
    if (previewBtn) {
        console.log('✅ Found preview button');
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👁️ Preview button clicked');
            previewOffer();
        });
    } else {
        console.error('❌ Preview button not found');
    }
    
    // Delete current offer
    if (deleteBtn) {
        console.log('✅ Found delete button');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🗑️ Delete button clicked');
            deleteCurrentOffer();
        });
    } else {
        console.error('❌ Delete button not found');
    }
    
    // Publish offer
    if (publishBtn) {
        console.log('✅ Found publish button');
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🚀 Publish button clicked');
            publishOffer();
        });
    } else {
        console.error('❌ Publish button not found');
    }
}

// Preview offer
function previewOffer() {
    console.log('👁️ Starting offer preview');
    
    const offerData = getOfferFormData();
    if (!offerData) {
        console.error('❌ Invalid offer data');
        return;
    }
    
    console.log('✅ Offer data valid:', offerData);
    
    // Create or update preview modal
    createPreviewModal(offerData);
}

// Create preview modal
function createPreviewModal(offerData) {
    console.log('🔄 Creating preview modal');
    
    // Remove existing modal if any
    const existingModal = document.querySelector('.offer-preview-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="offer-preview-modal active" id="offerPreviewModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Offer Preview</h3>
                    <button class="close-modal" id="closePreviewModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="offer-preview" id="liveOfferPreview">
                        <div class="offer-preview-content" style="background: ${offerData.gradient}; padding: 3rem; border-radius: 15px; text-align: center; color: white; min-height: 250px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
                            <h3 style="font-size: 2rem; margin-bottom: 1.5rem; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">${offerData.title}</h3>
                            <p style="font-size: 1.2rem; margin-bottom: 2rem; line-height: 1.6; max-width: 400px; text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);">${offerData.body}</p>
                            <button id="previewBookBtn" style="background: white; color: #333; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
                                <i class="fas fa-calendar-check" style="margin-right: 0.5rem;"></i>
                                Book Now
                            </button>
                        </div>
                    </div>
                    <p class="preview-note">This is how your offer will appear to customers after ${offerData.duration || 1} minute on the website.</p>
                </div>
                <div class="modal-footer">
                    <button class="edit-offer-btn" id="editOfferBtn">
                        <i class="fas fa-edit"></i>
                        Edit Again
                    </button>
                    <button class="confirm-publish-btn" id="confirmPublishBtn">
                        <i class="fas fa-check-circle"></i>
                        Yes, Publish This
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal event listeners
    setupModalEventListenersAfterCreation(offerData);
    
    console.log('✅ Preview modal created');
}

// Set up modal event listeners after creation
function setupModalEventListenersAfterCreation(offerData) {
    console.log('🔗 Setting up modal listeners');
    
    const closeBtn = document.getElementById('closePreviewModal');
    const editBtn = document.getElementById('editOfferBtn');
    const confirmBtn = document.getElementById('confirmPublishBtn');
    const previewModal = document.getElementById('offerPreviewModal');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('❌ Closing preview modal');
            if (previewModal) {
                previewModal.classList.remove('active');
                setTimeout(() => {
                    if (previewModal.parentNode) {
                        previewModal.remove();
                    }
                }, 300);
            }
        });
    }
    
    // Edit button
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            console.log('✏️ Edit button clicked');
            if (previewModal) {
                previewModal.classList.remove('active');
                setTimeout(() => {
                    if (previewModal.parentNode) {
                        previewModal.remove();
                    }
                }, 300);
            }
            
            // Focus on title input
            const titleInput = document.getElementById('offerTitle');
            if (titleInput) {
                titleInput.focus();
            }
        });
    }
    
    // Confirm publish button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            console.log('✅ Confirm publish clicked');
            if (saveOffer(offerData)) {
                // Close modal
                if (previewModal) {
                    previewModal.classList.remove('active');
                    setTimeout(() => {
                        if (previewModal.parentNode) {
                            previewModal.remove();
                        }
                    }, 300);
                }
                
                // Show success message
                showNotification('Special offer published successfully! ✨', 'success');
            }
        });
    }
    
    // Close modal when clicking outside
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                console.log('🖱️ Clicked outside modal');
                this.classList.remove('active');
                setTimeout(() => {
                    if (this.parentNode) {
                        this.remove();
                    }
                }, 300);
            }
        });
    }
    
    // Add hover effect to preview button
    const previewBookBtn = document.getElementById('previewBookBtn');
    if (previewBookBtn) {
        previewBookBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        previewBookBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    }
}

// Get offer form data
function getOfferFormData() {
    const titleInput = document.getElementById('offerTitle');
    const descriptionInput = document.getElementById('offerDescription');
    const durationInput = document.getElementById('offerDuration');
    
    if (!titleInput || !descriptionInput || !durationInput) {
        console.error('❌ Form inputs not found');
        showNotification('Form elements not found!', 'error');
        return null;
    }
    
    const title = titleInput.value.trim();
    const body = descriptionInput.value.trim();
    const duration = parseInt(durationInput.value) || 1;
    
    console.log('📋 Form data:', { title, body, duration });
    
    // Validation
    if (!title || !body) {
        showNotification('Please fill in all offer details! 📝', 'error');
        return null;
    }
    
    if (title.length > 50) {
        showNotification('Title must be 50 characters or less! ✂️', 'error');
        return null;
    }
    
    if (body.length > 200) {
        showNotification('Description must be 200 characters or less! ✂️', 'error');
        return null;
    }
    
    if (duration < 1 || duration > 10) {
        showNotification('Duration must be between 1 and 10 minutes! ⏰', 'error');
        return null;
    }
    
    // Get gradient based on selection
    let gradient;
    if (selectedGradient === 'custom' && customGradient) {
        gradient = customGradient;
    } else {
        gradient = getGradientValue(selectedGradient);
    }
    
    console.log('🎨 Selected gradient:', gradient);
    
    return {
        title: title,
        body: body,
        gradient: gradient,
        duration: duration,
        createdAt: new Date().toISOString()
    };
}

// Get gradient value by name
function getGradientValue(gradientName) {
    const gradients = {
        'pink-gold': 'linear-gradient(135deg, #ff6b9d, #ffd700)',
        'purple-pink': 'linear-gradient(135deg, #8b5cf6, #ff6b9d)',
        'blue-purple': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'sunset': 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)',
        'emerald': 'linear-gradient(135deg, #10b981, #3b82f6)'
    };
    
    return gradients[gradientName] || gradients['pink-gold'];
}

// Save offer to localStorage
function saveOffer(offerData) {
    console.log('💾 Saving offer to localStorage:', offerData);
    
    try {
        // Save to localStorage
        localStorage.setItem('healingHandsSpecialOffer', JSON.stringify(offerData));
        
        // Update current offer (use window. to access global variable)
        window.currentOffer = offerData;
        
        // Update preview
        displayCurrentOffer(offerData);
        
        // Enable delete button
        const deleteBtn = document.getElementById('deleteOfferBtn');
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }
        
        // Clear form
        clearOfferForm();
        
        console.log('✅ Offer saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving offer:', error);
        showNotification('Error saving offer! 💥', 'error');
        return false;
    }
}

// Publish offer
function publishOffer() {
    console.log('🚀 Publishing offer');
    
    const offerData = getOfferFormData();
    if (!offerData) {
        console.error('❌ Cannot publish - invalid offer data');
        return;
    }
    
    // Show confirmation
    if (confirm(`Are you sure you want to publish "${offerData.title}"? It will be visible to customers.`)) {
        console.log('✅ User confirmed publish');
        if (saveOffer(offerData)) {
            showNotification('Special offer published successfully! ✨', 'success');
        }
    } else {
        console.log('❌ User cancelled publish');
    }
}

// Delete current offer
function deleteCurrentOffer() {
    console.log('🗑️ Deleting current offer');
    
    if (!window.currentOffer) {
        showNotification('No offer to delete! 🤷‍♀️', 'warning');
        return;
    }
    
    // Show confirmation
    if (confirm(`Are you sure you want to delete "${window.currentOffer.title}"?`)) {
        console.log('✅ User confirmed delete');
        
        try {
            // Remove from localStorage
            localStorage.removeItem('healingHandsSpecialOffer');
            
            // Clear current offer
            window.currentOffer = null;
            
            // Update preview
            const offerPreview = document.getElementById('currentOfferPreview');
            if (offerPreview) {
                offerPreview.innerHTML = `
                    <p class="no-offer">
                        <i class="fas fa-gift" style="font-size: 2rem; color: #e0e0e0; margin-bottom: 1rem; display: block;"></i>
                        No active offer. Create one below!
                    </p>
                `;
            }
            
            // Disable delete button
            const deleteBtn = document.getElementById('deleteOfferBtn');
            if (deleteBtn) {
                deleteBtn.disabled = true;
            }
            
            // Clear form
            clearOfferForm();
            
            console.log('✅ Offer deleted successfully');
            showNotification('Special offer deleted successfully! 🗑️', 'success');
        } catch (error) {
            console.error('❌ Error deleting offer:', error);
            showNotification('Error deleting offer! 💥', 'error');
        }
    } else {
        console.log('❌ User cancelled delete');
    }
}

// Clear offer form
function clearOfferForm() {
    console.log('🧹 Clearing offer form');
    
    const titleInput = document.getElementById('offerTitle');
    const descriptionInput = document.getElementById('offerDescription');
    const durationInput = document.getElementById('offerDuration');
    
    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (durationInput) durationInput.value = '1';
    
    // Reset gradient selection
    selectedGradient = 'pink-gold';
    customGradient = null;
    
    // Update gradient options UI
    const gradientOptions = document.querySelectorAll('.gradient-option');
    gradientOptions.forEach(option => {
        if (option.getAttribute('data-gradient') === 'pink-gold') {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Hide custom gradient builder
    const customBuilder = document.getElementById('customGradientBuilder');
    if (customBuilder) {
        customBuilder.style.display = 'none';
    }
    
    // Update character counts
    if (titleInput) updateCharCount.call(titleInput);
    if (descriptionInput) updateCharCount.call(descriptionInput);
    
    console.log('✅ Form cleared');
}

// Show notification
function showNotification(message, type = 'info') {
    console.log(`📢 ${type}: ${message}`);
    
    // Use dashboard's showNotification function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification - create simple notification
    const notification = document.createElement('div');
    notification.className = 'offer-notification';
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not present
    addNotificationStyles();
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Add notification styles
function addNotificationStyles() {
    if (document.getElementById('offer-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'offer-notification-styles';
    style.textContent = `
        .offer-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #ff6b9d;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9999;
            max-width: 350px;
        }
        
        .offer-notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-content.success {
            border-left-color: #10b981;
        }
        
        .notification-content.error {
            border-left-color: #ef4444;
        }
        
        .notification-content.warning {
            border-left-color: #f59e0b;
        }
        
        .notification-content.info {
            border-left-color: #3b82f6;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-content.success i {
            color: #10b981;
        }
        
        .notification-content.error i {
            color: #ef4444;
        }
        
        .notification-content.warning i {
            color: #f59e0b;
        }
        
        .notification-content.info i {
            color: #3b82f6;
        }
        
        .notification-content span {
            font-size: 0.95rem;
            color: #333;
            font-weight: 500;
        }
    `;
    
    document.head.appendChild(style);
}

// Add missing styles for offer management
const offerStyles = document.createElement('style');
offerStyles.textContent = `
    .offer-display {
        transition: all 0.3s ease;
    }
    
    .offer-display:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .offer-preview-content {
        animation: offerPulse 2s infinite;
    }
    
    @keyframes offerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    .no-offer {
        text-align: center;
        color: #999;
        font-style: italic;
        padding: 2rem;
    }
    
    .custom-gradient-builder {
        display: none;
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
    }
    
    .custom-gradient-builder h5 {
        font-size: 1rem;
        color: #333;
        margin-bottom: 1rem;
    }
    
    .color-pickers {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .color-picker {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .color-picker label {
        font-size: 0.85rem;
        color: #666;
        font-weight: 500;
    }
    
    .color-picker input[type="color"] {
        width: 100%;
        height: 40px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }
    
    .color-picker input[type="color"]:hover {
        border-color: #ff6b9d;
    }
    
    .gradient-direction {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .gradient-direction label {
        font-size: 0.9rem;
        color: #333;
        font-weight: 500;
    }
    
    .gradient-direction select {
        padding: 0.5rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 0.9rem;
        color: #333;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .gradient-direction select:focus {
        outline: none;
        border-color: #ff6b9d;
    }
    
    .gradient-preview-custom {
        width: 100%;
        height: 80px;
        border-radius: 12px;
        background: linear-gradient(135deg, #ff6b9d, #ffd700, #8b5cf6);
        transition: all 0.3s ease;
    }
    
    /* Modal styles */
    .offer-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .offer-preview-modal.active {
        display: flex;
    }
    
    .offer-preview-modal .modal-content {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .offer-preview-modal .modal-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, #ff6b9d, #ffd700);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .offer-preview-modal .modal-header h3 {
        color: white;
        font-size: 1.3rem;
    }
    
    .offer-preview-modal .close-modal {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .offer-preview-modal .close-modal:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }
    
    .offer-preview-modal .modal-body {
        padding: 2rem;
    }
    
    .preview-note {
        color: #666;
        font-size: 0.9rem;
        text-align: center;
        font-style: italic;
        margin-top: 1.5rem;
    }
    
    .offer-preview-modal .modal-footer {
        padding: 1.5rem;
        background: #f8f9ff;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .offer-preview-modal .edit-offer-btn,
    .offer-preview-modal .confirm-publish-btn {
        flex: 1;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .offer-preview-modal .edit-offer-btn {
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        color: #333;
    }
    
    .offer-preview-modal .edit-offer-btn:hover {
        background: linear-gradient(135deg, #e5e7eb, #d1d5db);
    }
    
    .offer-preview-modal .confirm-publish-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
    }
    
    .offer-preview-modal .confirm-publish-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes modalIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @media (max-width: 768px) {
        .color-pickers {
            grid-template-columns: 1fr;
        }
        
        .offer-preview-modal .modal-footer {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(offerStyles);