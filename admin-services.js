// ====== SERVICES MANAGEMENT LOGIC ======

let editedServices = new Set();
let currentCategory = 'makeup';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize service management
    initializeServiceCategories();
    loadServicesForCategory(currentCategory);
    
    // Set up event listeners
    setupServiceEventListeners();
});

// Initialize service categories
function initializeServiceCategories() {
    const categoriesContainer = document.querySelector('.service-categories-tabs');
    if (!categoriesContainer) return;
    
    const categories = ['makeup', 'facials', 'waxing', 'kinyozi', 'massage', 'nails'];
    
    categoriesContainer.innerHTML = categories.map(category => `
        <button class="category-tab ${category === currentCategory ? 'active' : ''}" 
                data-category="${category}">
            <i class="fas ${getCategoryIcon(category)}"></i>
            ${capitalizeFirstLetter(category)}
        </button>
    `).join('');
    
    // Add event listeners to category tabs
    const categoryTabs = categoriesContainer.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load services for selected category
            const category = this.getAttribute('data-category');
            currentCategory = category;
            loadServicesForCategory(category);
        });
    });
}

// Load services for a category
function loadServicesForCategory(category) {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    // Get services for the category
    const services = currentServices[category] || [];
    
    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="no-services">
                <i class="fas fa-spa"></i>
                <p>No services found for this category</p>
            </div>
        `;
        return;
    }
    
    // Generate services list HTML
    servicesList.innerHTML = services.map(service => `
        <div class="service-item" data-id="${service.id}">
            <div class="service-icon-small">
                <i class="fas ${getCategoryIcon(category)}"></i>
            </div>
            <div class="service-details">
                <div class="service-name">${service.name}</div>
                <div class="service-category">${capitalizeFirstLetter(category)}</div>
            </div>
            <div class="price-input-container">
                <input type="number" 
                       class="service-price-input ${editedServices.has(service.id) ? 'edited' : ''}"
                       value="${service.price}"
                       min="0"
                       step="50"
                       data-original="${service.price}"
                       data-id="${service.id}">
                <span class="currency">KSH</span>
            </div>
            <div class="service-actions">
                <button class="save-service-btn" data-id="${service.id}" ${!editedServices.has(service.id) ? 'disabled' : ''}>
                    <i class="fas fa-save"></i>
                </button>
                <button class="delete-service-btn" data-id="${service.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to price inputs
    const priceInputs = servicesList.querySelectorAll('.service-price-input');
    priceInputs.forEach(input => {
        input.addEventListener('input', handlePriceInputChange);
        input.addEventListener('focus', handlePriceInputFocus);
        input.addEventListener('blur', handlePriceInputBlur);
    });
    
    // Add event listeners to action buttons
    const saveButtons = servicesList.querySelectorAll('.save-service-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSaveService);
    });
    
    const deleteButtons = servicesList.querySelectorAll('.delete-service-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteService);
    });
}

// Handle price input changes
function handlePriceInputChange(e) {
    const input = e.target;
    const serviceId = parseInt(input.getAttribute('data-id'));
    const originalPrice = parseInt(input.getAttribute('data-original'));
    const currentPrice = parseInt(input.value) || 0;
    
    // Find the service
    const service = findServiceById(serviceId);
    if (!service) return;
    
    // Check if price has changed
    const hasChanged = currentPrice !== originalPrice;
    const saveButton = input.closest('.service-item').querySelector('.save-service-btn');
    
    if (hasChanged) {
        input.classList.add('edited');
        editedServices.add(serviceId);
        saveButton.disabled = false;
        
        // Update service price in memory
        service.price = currentPrice;
    } else {
        input.classList.remove('edited');
        editedServices.delete(serviceId);
        saveButton.disabled = true;
        
        // Restore original price
        service.price = originalPrice;
    }
}

// Handle price input focus
function handlePriceInputFocus(e) {
    const input = e.target;
    input.select();
    
    // Add focus effect
    input.style.borderColor = '#ff6b9d';
    input.style.boxShadow = '0 0 0 3px rgba(255, 107, 157, 0.1)';
}

// Handle price input blur
function handlePriceInputBlur(e) {
    const input = e.target;
    
    // Remove focus effect
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    // Validate price
    const price = parseInt(input.value);
    if (isNaN(price) || price < 0) {
        input.value = input.getAttribute('data-original');
        input.classList.remove('edited');
        
        const serviceId = parseInt(input.getAttribute('data-id'));
        editedServices.delete(serviceId);
        
        const saveButton = input.closest('.service-item').querySelector('.save-service-btn');
        saveButton.disabled = true;
    }
}

// Handle save service
function handleSaveService(e) {
    const button = e.target.closest('.save-service-btn');
    const serviceId = parseInt(button.getAttribute('data-id'));
    const serviceItem = button.closest('.service-item');
    const priceInput = serviceItem.querySelector('.service-price-input');
    
    // Get updated price
    const newPrice = parseInt(priceInput.value);
    
    // Find and update service
    const service = findServiceById(serviceId);
    if (!service) {
        showNotification('Service not found!', 'error');
        return;
    }
    
    // Update service price
    service.price = newPrice;
    
    // Update original price attribute
    priceInput.setAttribute('data-original', newPrice);
    
    // Remove edited state
    priceInput.classList.remove('edited');
    editedServices.delete(serviceId);
    button.disabled = true;
    
    // Save to localStorage
    if (saveServicesToLocalStorage()) {
        showNotification(`Price updated for ${service.name}`, 'success');
        
        // Add success animation
        serviceItem.classList.add('saved');
        setTimeout(() => {
            serviceItem.classList.remove('saved');
        }, 1000);
    }
}

// Handle delete service
function handleDeleteService(e) {
    const button = e.target.closest('.delete-service-btn');
    const serviceId = parseInt(button.getAttribute('data-id'));
    const serviceItem = button.closest('.service-item');
    const serviceName = serviceItem.querySelector('.service-name').textContent;
    
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${serviceName}"?`)) {
        // Find service category
        const category = findServiceCategoryById(serviceId);
        if (!category) return;
        
        // Remove service from array
        currentServices[category] = currentServices[category].filter(s => s.id !== serviceId);
        
        // Save to localStorage
        if (saveServicesToLocalStorage()) {
            // Remove from UI with animation
            serviceItem.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                serviceItem.remove();
                showNotification(`Service "${serviceName}" deleted`, 'success');
                
                // Reload services if empty
                if (currentServices[category].length === 0) {
                    loadServicesForCategory(category);
                }
            }, 300);
        }
    }
}

// Set up service event listeners
function setupServiceEventListeners() {
    const saveAllBtn = document.getElementById('saveAllPrices');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const resetPricesBtn = document.getElementById('resetPricesBtn');
    
    // Save all changes
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllServiceChanges);
    }
    
    // Add new service
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', showAddServiceModal);
    }
    
    // Reset to default prices
    if (resetPricesBtn) {
        resetPricesBtn.addEventListener('click', resetServicePrices);
    }
}

// Save all service changes
function saveAllServiceChanges() {
    if (editedServices.size === 0) {
        showNotification('No changes to save!', 'warning');
        return;
    }
    
    // Update all edited services
    const serviceItems = document.querySelectorAll('.service-item');
    let savedCount = 0;
    
    serviceItems.forEach(item => {
        const serviceId = parseInt(item.getAttribute('data-id'));
        if (editedServices.has(serviceId)) {
            const priceInput = item.querySelector('.service-price-input');
            const newPrice = parseInt(priceInput.value);
            
            // Find and update service
            const service = findServiceById(serviceId);
            if (service) {
                service.price = newPrice;
                priceInput.setAttribute('data-original', newPrice);
                priceInput.classList.remove('edited');
                savedCount++;
            }
        }
    });
    
    // Clear edited services set
    editedServices.clear();
    
    // Disable all save buttons
    const saveButtons = document.querySelectorAll('.save-service-btn');
    saveButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Save to localStorage
    if (saveServicesToLocalStorage()) {
        showNotification(`${savedCount} service prices saved successfully!`, 'success');
    }
}

// Show add service modal
function showAddServiceModal() {
    const modalHTML = `
        <div class="add-service-modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> Add New Service</h3>
                    <button class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addServiceForm">
                        <div class="form-group">
                            <label for="serviceName">
                                <i class="fas fa-tag"></i>
                                Service Name
                            </label>
                            <input type="text" id="serviceName" placeholder="e.g., Premium Facial Treatment" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="serviceCategory">
                                <i class="fas fa-filter"></i>
                                Category
                            </label>
                            <select id="serviceCategory" required>
                                <option value="">Select Category</option>
                                <option value="makeup">Makeup</option>
                                <option value="facials">Facials</option>
                                <option value="waxing">Waxing</option>
                                <option value="kinyozi">Kinyozi</option>
                                <option value="massage">Massage</option>
                                <option value="nails">Nails</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="servicePrice">
                                <i class="fas fa-money-bill-wave"></i>
                                Price (KSH)
                            </label>
                            <input type="number" id="servicePrice" placeholder="e.g., 1500" min="0" step="50" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="serviceDescription">
                                <i class="fas fa-align-left"></i>
                                Description (Optional)
                            </label>
                            <textarea id="serviceDescription" placeholder="Brief description of the service..." rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                    <button class="add-btn" type="submit" form="addServiceForm">
                        <i class="fas fa-plus"></i>
                        Add Service
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.querySelector('.add-service-modal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.querySelector('.add-service-modal');
    const closeButtons = modal.querySelectorAll('.close-modal, .cancel-btn');
    const form = document.getElementById('addServiceForm');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewService();
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            setTimeout(() => {
                this.remove();
            }, 300);
        }
    });
    
    // Add modal styles if not present
    addServiceModalStyles();
}

// Add new service
function addNewService() {
    const name = document.getElementById('serviceName').value.trim();
    const category = document.getElementById('serviceCategory').value;
    const price = parseInt(document.getElementById('servicePrice').value);
    const description = document.getElementById('serviceDescription').value.trim();
    
    // Validation
    if (!name || !category || isNaN(price) || price < 0) {
        showNotification('Please fill all required fields correctly!', 'error');
        return;
    }
    
    // Generate new service ID
    const newId = generateServiceId();
    
    // Create new service object
    const newService = {
        id: newId,
        name: name,
        price: price,
        description: description || '',
        editable: true
    };
    
    // Add to current services
    if (!currentServices[category]) {
        currentServices[category] = [];
    }
    currentServices[category].push(newService);
    
    // Save to localStorage
    if (saveServicesToLocalStorage()) {
        // Close modal
        const modal = document.querySelector('.add-service-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
        
        // Switch to the category and reload
        if (category !== currentCategory) {
            currentCategory = category;
            updateCategoryTab(category);
        }
        
        loadServicesForCategory(category);
        
        showNotification(`Service "${name}" added successfully!`, 'success');
    }
}

// Reset service prices to default
function resetServicePrices() {
    if (!confirm('Are you sure you want to reset all prices to default? This cannot be undone.')) {
        return;
    }
    
    // Load default services
    const defaultServices = getDefaultServices();
    
    // Update current services with default prices
    Object.keys(defaultServices).forEach(category => {
        if (currentServices[category]) {
            defaultServices[category].forEach(defaultService => {
                const currentService = currentServices[category].find(s => s.name === defaultService.name);
                if (currentService) {
                    currentService.price = defaultService.price;
                }
            });
        }
    });
    
    // Save to localStorage
    if (saveServicesToLocalStorage()) {
        // Reload current category
        loadServicesForCategory(currentCategory);
        
        // Clear edited services
        editedServices.clear();
        
        showNotification('All prices reset to default!', 'success');
    }
}

// Helper functions
function getCategoryIcon(category) {
    const icons = {
        makeup: 'fa-paint-brush',
        facials: 'fa-spa',
        waxing: 'fa-cut',
        kinyozi: 'fa-cut',
        massage: 'fa-hands',
        nails: 'fa-hand-sparkles'
    };
    return icons[category] || 'fa-star';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function findServiceById(id) {
    for (const category in currentServices) {
        const service = currentServices[category].find(s => s.id === id);
        if (service) return service;
    }
    return null;
}

function findServiceCategoryById(id) {
    for (const category in currentServices) {
        const service = currentServices[category].find(s => s.id === id);
        if (service) return category;
    }
    return null;
}

function generateServiceId() {
    let maxId = 0;
    for (const category in currentServices) {
        currentServices[category].forEach(service => {
            if (service.id > maxId) {
                maxId = service.id;
            }
        });
    }
    return maxId + 1;
}

function updateCategoryTab(category) {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Add service modal styles
function addServiceModalStyles() {
    if (document.getElementById('add-service-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'add-service-modal-styles';
    style.textContent = `
        .add-service-modal {
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
        }
        
        .add-service-modal.active {
            display: flex;
        }
        
        .add-service-modal .modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .add-service-modal .modal-header {
            padding: 1.5rem;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .add-service-modal .modal-header h3 {
            color: white;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .add-service-modal .close-modal {
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
        
        .add-service-modal .close-modal:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .add-service-modal .modal-body {
            padding: 2rem;
        }
        
        .add-service-modal .form-group {
            margin-bottom: 1.5rem;
        }
        
        .add-service-modal .form-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            color: #333;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        .add-service-modal .form-group label i {
            color: #3b82f6;
        }
        
        .add-service-modal .form-group input,
        .add-service-modal .form-group select,
        .add-service-modal .form-group textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 0.95rem;
            color: #333;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }
        
        .add-service-modal .form-group input:focus,
        .add-service-modal .form-group select:focus,
        .add-service-modal .form-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .add-service-modal .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .add-service-modal .modal-footer {
            padding: 1.5rem;
            background: #f8f9ff;
            display: flex;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .add-service-modal .cancel-btn,
        .add-service-modal .add-btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .add-service-modal .cancel-btn {
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            color: #333;
        }
        
        .add-service-modal .cancel-btn:hover {
            background: linear-gradient(135deg, #e5e7eb, #d1d5db);
        }
        
        .add-service-modal .add-btn {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        
        .add-service-modal .add-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-100%);
            }
        }
        
        .service-item.saved {
            animation: savedPulse 1s ease;
        }
        
        @keyframes savedPulse {
            0% { background: white; }
            50% { background: rgba(16, 185, 129, 0.1); }
            100% { background: white; }
        }
        
        .price-input-container {
            position: relative;
            display: inline-block;
        }
        
        .price-input-container .currency {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .service-price-input {
            padding-right: 40px !important;
        }
        
        .no-services {
            text-align: center;
            padding: 3rem;
            color: #999;
        }
        
        .no-services i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #e0e0e0;
        }
    `;
    
    document.head.appendChild(style);
}