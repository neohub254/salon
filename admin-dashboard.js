// ====== ADMIN DASHBOARD MAIN LOGIC ======

// Dashboard initialization
let currentServices = [];
let weeklyChart = null;
// Note: currentOffer is now handled in admin-offers.js

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize all dashboard components
    initializeDashboard();
    initializeSidebar();
    initializeNotifications();
    initializeStats();
    initializeDate();
    initializeThemeToggle();
    initializeCharts();
    initializeServiceManagement();
    initializeOfferManagement();
    
    // Load data
    loadServicesData();
    loadCurrentOffer();
    loadTopServices();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update dashboard periodically
    setInterval(updateDashboardStats, 30000); // Every 30 seconds
});

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true' || 
                      sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = 'admin.html';
        return false;
    }
    
    // Update last activity
    localStorage.setItem('adminLastActivity', new Date().toISOString());
    return true;
}

// Initialize dashboard
function initializeDashboard() {
    console.log('✨ Admin Dashboard Initialized');
    
    // Add welcome animation
    const welcomeTitle = document.querySelector('.page-title');
    if (welcomeTitle) {
        welcomeTitle.style.animation = 'fadeInUp 0.8s ease';
    }
    
    // Initialize tooltips
    initializeTooltips();
}

// Initialize sidebar
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.innerHTML = sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all items
                menuItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Scroll to section
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
                
                // Close sidebar on mobile after click
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Show confirmation
            if (confirm('Are you sure you want to logout?')) {
                // Clear login state
                localStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminLastActivity');
                
                // Redirect to login page
                window.location.href = 'admin.html';
            }
        });
    }
}

// Initialize notifications
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item.new');
    const notificationCount = document.querySelector('.notification-count');
    
    if (!notificationBtn) return;
    
    // Mark all as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notificationItems.forEach(item => {
                item.classList.remove('new');
            });
            
            // Update notification count
            if (notificationCount) {
                notificationCount.textContent = '0';
                notificationCount.style.display = 'none';
            }
            
            // Add success feedback
            this.innerHTML = '<i class="fas fa-check"></i> Marked all read';
            setTimeout(() => {
                this.innerHTML = 'Mark all read';
            }, 2000);
        });
    }
    
    // Toggle notification dropdown
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = document.querySelector('.notification-dropdown');
        dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.admin-notifications')) {
            const dropdown = document.querySelector('.notification-dropdown');
            dropdown.classList.remove('active');
        }
    });
}

// Initialize stats cards
function initializeStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.08)';
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.animation = 'statClick 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// Initialize current date
function initializeDate() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;
    
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    
    // Update time every minute
    setInterval(() => {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }, 60000);
}

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        const isLightTheme = document.body.classList.contains('light-theme');
        const icon = this.querySelector('i');
        
        if (isLightTheme) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('adminTheme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('adminTheme', 'dark');
        }
        
        // Add theme change animation
        document.body.style.animation = 'themeChange 0.5s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    });
}

// Initialize charts
function initializeCharts() {
    const weeklyChartCanvas = document.getElementById('weeklyChart');
    if (!weeklyChartCanvas) return;
    
    const ctx = weeklyChartCanvas.getContext('2d');
    
    // Sample data - in real app, this would come from an API
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Earnings (KSH)',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
            borderColor: '#ff6b9d',
            backgroundColor: 'rgba(255, 107, 157, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ff6b9d',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: weeklyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ff6b9d',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `KSH ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `KSH ${value.toLocaleString()}`;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize service management (will be extended in admin-services.js)
function initializeServiceManagement() {
    console.log('Service management initialized');
    // Detailed implementation in admin-services.js
}

// Initialize offer management (will be extended in admin-offers.js)
function initializeOfferManagement() {
    console.log('Offer management initialized');
    // Detailed implementation in admin-offers.js
}

// Load services data
function loadServicesData() {
    try {
        const savedServices = localStorage.getItem('healingHandsServices');
        if (savedServices) {
            currentServices = JSON.parse(savedServices);
        } else {
            // Use default services from the HTML file
            currentServices = window.defaultServices || getDefaultServices();
            saveServicesToLocalStorage();
        }
        
        // Update services badge
        const servicesBadge = document.getElementById('servicesBadge');
        if (servicesBadge) {
            const totalServices = Object.values(currentServices).flat().length;
            servicesBadge.textContent = totalServices;
        }
        
    } catch (error) {
        console.error('Error loading services:', error);
        currentServices = getDefaultServices();
    }
}

// Load current offer
function loadCurrentOffer() {
    try {
        const savedOffer = localStorage.getItem('healingHandsSpecialOffer');
        if (savedOffer) {
            currentOffer = JSON.parse(savedOffer);
            displayCurrentOffer(currentOffer);
        }
    } catch (error) {
        console.error('Error loading offer:', error);
    }
}

// Load top services
function loadTopServices() {
    const topServicesList = document.getElementById('topServicesList');
    if (!topServicesList) return;
    
    // Sample top services - in real app, this would come from analytics
    const topServices = [
        { name: 'Bridal Makeup', count: 12 },
        { name: 'Spa Massage', count: 8 },
        { name: 'Full Facial', count: 7 },
        { name: 'Nail Art', count: 6 }
    ];
    
    topServicesList.innerHTML = topServices.map(service => `
        <div class="top-service">
            <span class="service-name">${service.name}</span>
            <span class="service-count">${service.count} bookings</span>
        </div>
    `).join('');
}

// Display current offer in preview
function displayCurrentOffer(offer) {
    const offerPreview = document.getElementById('currentOfferPreview');
    const deleteBtn = document.getElementById('deleteOfferBtn');
    
    if (!offerPreview) return;
    
    offerPreview.innerHTML = `
        <div class="offer-display" style="background: ${offer.gradient}; padding: 2rem; border-radius: 12px; text-align: center; color: white;">
            <h4 style="font-size: 1.5rem; margin-bottom: 1rem;">${offer.title}</h4>
            <p style="font-size: 1rem; margin-bottom: 1.5rem;">${offer.body}</p>
            <small style="opacity: 0.8;">Shows after ${offer.duration || 1} minute</small>
        </div>
    `;
    
    if (deleteBtn) {
        deleteBtn.disabled = false;
    }
}

// Update dashboard stats
function updateDashboardStats() {
    // Update today's earnings with random variation
    const earningsElement = document.getElementById('todayEarnings');
    if (earningsElement) {
        const current = parseInt(earningsElement.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 2000) - 1000;
        const newEarnings = Math.max(0, current + change);
        earningsElement.textContent = newEarnings.toLocaleString();
    }
    
    // Update appointments
    const appointmentsElement = document.getElementById('todayAppointments');
    if (appointmentsElement) {
        const current = parseInt(appointmentsElement.textContent);
        const change = Math.floor(Math.random() * 3) - 1;
        const newAppointments = Math.max(0, current + change);
        appointmentsElement.textContent = newAppointments;
    }
    
    // Update chart with new data
    if (weeklyChart) {
        const newData = weeklyChart.data.datasets[0].data.map(value => {
            const change = Math.floor(Math.random() * 2000) - 1000;
            return Math.max(0, value + change);
        });
        weeklyChart.data.datasets[0].data = newData;
        weeklyChart.update('none');
    }
}

// Setup event listeners
function setupEventListeners() {
    const refreshBtn = document.getElementById('refreshBtn');
    const helpBtn = document.getElementById('helpBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            updateDashboardStats();
            
            setTimeout(() => {
                this.classList.remove('refreshing');
                this.innerHTML = '<i class="fas fa-sync-alt"></i>';
                
                // Show success message
                showNotification('Dashboard refreshed successfully!', 'success');
            }, 1000);
        });
    }
    
    // Help button
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            showHelpModal();
        });
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportDashboardData();
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + R to refresh
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (refreshBtn) refreshBtn.click();
        }
        
        // Ctrl + H for help
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            if (helpBtn) helpBtn.click();
        }
        
        // Ctrl + E to export
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            if (exportBtn) exportBtn.click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.floating-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `floating-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
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
            notification.remove();
        }, 300);
    }, 3000);
    
    // Add notification styles if not already present
    addNotificationStyles();
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .floating-notification {
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
        
        .floating-notification.show {
            transform: translateX(0);
        }
        
        .floating-notification.success {
            border-left-color: #10b981;
        }
        
        .floating-notification.error {
            border-left-color: #ef4444;
        }
        
        .floating-notification.warning {
            border-left-color: #f59e0b;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-content i.fa-check-circle {
            color: #10b981;
        }
        
        .notification-content i.fa-exclamation-circle {
            color: #ef4444;
        }
        
        .notification-content i.fa-exclamation-triangle {
            color: #f59e0b;
        }
        
        .notification-content i.fa-info-circle {
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

// Show help modal
function showHelpModal() {
    const modalHTML = `
        <div class="help-modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-question-circle"></i> Help & Support</h3>
                    <button class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="help-section">
                        <h4><i class="fas fa-crown"></i> Quick Tips</h4>
                        <ul>
                            <li><strong>Ctrl + R:</strong> Refresh dashboard</li>
                            <li><strong>Ctrl + H:</strong> Open this help</li>
                            <li><strong>Ctrl + E:</strong> Export data</li>
                            <li><strong>Esc:</strong> Close any modal</li>
                        </ul>
                    </div>
                    
                    <div class="help-section">
                        <h4><i class="fas fa-phone-alt"></i> Support Contact</h4>
                        <p>For technical support or questions:</p>
                        <p><i class="fas fa-envelope"></i> support@healinghands.com</p>
                        <p><i class="fas fa-phone"></i> +254 720 000 000</p>
                    </div>
                    
                    <div class="help-section">
                        <h4><i class="fas fa-lightbulb"></i> Best Practices</h4>
                        <ul>
                            <li>Save changes frequently</li>
                            <li>Preview offers before publishing</li>
                            <li>Regularly update service prices</li>
                            <li>Check notifications daily</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="close-help-btn">
                        <i class="fas fa-check"></i>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.querySelector('.help-modal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.querySelector('.help-modal');
    const closeButtons = modal.querySelectorAll('.close-modal, .close-help-btn');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
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
    
    // Add help modal styles
    addHelpModalStyles();
}

// Export dashboard data
function exportDashboardData() {
    // Show loading
    showNotification('Preparing data for export...', 'info');
    
    // Gather data
    const exportData = {
        timestamp: new Date().toISOString(),
        services: currentServices,
        currentOffer: currentOffer,
        stats: {
            earnings: document.getElementById('todayEarnings')?.textContent,
            appointments: document.getElementById('todayAppointments')?.textContent,
            rating: document.getElementById('customerRating')?.textContent
        }
    };
    
    // Convert to JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create download link
    const exportFileDefaultName = `healing-hands-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Show success notification
    setTimeout(() => {
        showNotification('Data exported successfully!', 'success');
    }, 500);
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal, .offer-preview-modal, .help-modal');
    modals.forEach(modal => {
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'admin-tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
}

// Get default services (fallback)
function getDefaultServices() {
    return {
        makeup: [
            { id: 1, name: "Simple Make-up", price: 500 },
            { id: 2, name: "Full Make-up", price: 1000 },
            { id: 3, name: "Bridal Make-up", price: 2500 },
            { id: 4, name: "Photoshop Make-up", price: 800 },
            { id: 5, name: "Male Make-up", price: 500 }
        ],
        facials: [
            { id: 6, name: "Simple Product", price: 1000 },
            { id: 7, name: "Garnier Product", price: 1200 },
            { id: 8, name: "Skin Touch Project", price: 800 },
            { id: 9, name: "Half Facial", price: 600 }
        ],
        waxing: [
            { id: 10, name: "Eyebrow Waxing", price: 300 },
            { id: 11, name: "Full Body Waxing", price: 2500 },
            { id: 12, name: "Full Leg Wax", price: 900 },
            { id: 13, name: "Half Leg", price: 500 },
            { id: 14, name: "Brazilian Wax", price: 1200 }
        ],
        kinyozi: [
            { id: 15, name: "Head Shave", price: 300 },
            { id: 16, name: "Head Shave + Massage + Steam", price: 500 },
            { id: 17, name: "Face Scrub", price: 300 },
            { id: 18, name: "Nail Cutting", price: 200 },
            { id: 19, name: "Beard Trim", price: 100 }
        ],
        massage: [
            { id: 20, name: "Steam Massage", price: 4000 },
            { id: 21, name: "Sensual Massage", price: 7000 },
            { id: 22, name: "Bamboo Massage", price: 3500 },
            { id: 23, name: "Teen Massage", price: 1000 },
            { id: 24, name: "Swedish Massage", price: 2500 },
            { id: 25, name: "Deep Tissue Massage", price: 3000 },
            { id: 26, name: "Lava Stone Massage", price: 3500 },
            { id: 27, name: "Sport Massage", price: 3500 }
        ],
        nails: [
            { id: 28, name: "Gel Application", price: 400 },
            { id: 29, name: "Artificial Nail", price: 600 },
            { id: 30, name: "Acrylic", price: 1200 },
            { id: 31, name: "Manicure (full)", price: 900 },
            { id: 32, name: "Pedicure (full)", price: 900 }
        ]
    };
}

// Add help modal styles
function addHelpModalStyles() {
    if (document.getElementById('help-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'help-modal-styles';
    style.textContent = `
        .help-modal {
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
        
        .help-modal.active {
            display: flex;
        }
        
        .help-modal .modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .help-modal .modal-header {
            padding: 1.5rem;
            background: linear-gradient(135deg, #ff6b9d, #ffd700);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        
        .help-modal .modal-header h3 {
            color: white;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .help-modal .close-modal {
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
        
        .help-modal .close-modal:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .help-modal .modal-body {
            padding: 2rem;
        }
        
        .help-section {
            margin-bottom: 2rem;
        }
        
        .help-section:last-child {
            margin-bottom: 0;
        }
        
        .help-section h4 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .help-section h4 i {
            color: #ff6b9d;
        }
        
        .help-section ul {
            list-style: none;
            padding-left: 0;
        }
        
        .help-section ul li {
            padding: 0.5rem 0;
            color: #666;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .help-section ul li:last-child {
            border-bottom: none;
        }
        
        .help-section p {
            color: #666;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .help-section p i {
            color: #ff6b9d;
            width: 20px;
        }
        
        .help-modal .modal-footer {
            padding: 1.5rem;
            background: #f8f9ff;
            display: flex;
            justify-content: center;
        }
        
        .close-help-btn {
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #ff6b9d, #ffd700);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .close-help-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 107, 157, 0.2);
        }
    `;
    
    document.head.appendChild(style);
}

// Save services to localStorage
function saveServicesToLocalStorage() {
    try {
        localStorage.setItem('healingHandsServices', JSON.stringify(currentServices));
        return true;
    } catch (error) {
        console.error('Error saving services:', error);
        showNotification('Error saving services!', 'error');
        return false;
    }
}

// Add missing CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes statClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
    
    @keyframes themeChange {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }
    
    .admin-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        animation: tooltipFade 0.2s ease;
    }
    
    @keyframes tooltipFade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .refreshing {
        animation: rotate 1s linear infinite;
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(additionalStyles);