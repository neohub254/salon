// ====== WEBSITE INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHairStrands();
    initializeMusicPlayer();
    initializeServices();
    initializeGallery();
    initializePricing();
    initializeSpecialOffer();
    initializeBookingForm();
    initializeNavigation();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Show special offer after 1 minute
    setTimeout(showSpecialOffer, 60000);
    
    // Initialize animations
    initializeAnimations();
});

// ====== INTERACTIVE HAIR STRANDS ======
function initializeHairStrands() {
    const container = document.getElementById('hairCanvas');
    const strandCount = 50;
    
    for (let i = 0; i < strandCount; i++) {
        const strand = document.createElement('div');
        strand.classList.add('strand');
        
        // Random position
        const left = Math.random() * 100;
        const height = 80 + Math.random() * 120;
        const rotation = -10 + Math.random() * 20;
        
        strand.style.left = `${left}%`;
        strand.style.height = `${height}px`;
        strand.style.transform = `rotate(${rotation}deg)`;
        
        // Random animation delay
        const delay = Math.random() * 5;
        strand.style.animationDelay = `${delay}s`;
        
        // Interactive effect
        strand.addEventListener('mouseenter', function() {
            this.style.transform = `rotate(${rotation + 15}deg) translateX(15px)`;
            this.style.opacity = '0.8';
        });
        
        strand.addEventListener('mouseleave', function() {
            this.style.transform = `rotate(${rotation}deg)`;
            this.style.opacity = '0.3';
        });
        
        // Touch support for mobile
        strand.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = `rotate(${rotation + 15}deg) translateX(15px)`;
            this.style.opacity = '0.8';
            
            setTimeout(() => {
                this.style.transform = `rotate(${rotation}deg)`;
                this.style.opacity = '0.3';
            }, 500);
        });
        
        container.appendChild(strand);
    }
}

// ====== MUSIC PLAYER ======
function initializeMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    const musicToggle = document.getElementById('musicToggle');
    const calmMusic = document.getElementById('calmMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // Toggle music player
    musicToggle.addEventListener('click', function() {
        musicPlayer.classList.toggle('expanded');
        
        if (calmMusic.paused) {
            calmMusic.play();
            musicToggle.classList.add('active');
        } else {
            calmMusic.pause();
            musicToggle.classList.remove('active');
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        calmMusic.volume = this.value;
    });
    
    // Auto-pause when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            calmMusic.pause();
            musicToggle.classList.remove('active');
        }
    });
}

// ====== SERVICES ======
function initializeServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const servicesData = getServicesData();
    
    // Clear existing content
    servicesGrid.innerHTML = '';
    
    // Create service cards
    Object.keys(servicesData).forEach(category => {
        const services = servicesData[category];
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card fade-in';
            
            const icon = getServiceIcon(category);
            const price = formatPrice(service.price);
            
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <p>Premium ${category} service with expert care</p>
                <div class="service-price">KSH ${price}</div>
            `;
            
            servicesGrid.appendChild(serviceCard);
        });
    });
}

// ====== GALLERY FILTER ======
function initializeGallery() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ====== PRICING TAB SYSTEM ======
function initializePricing() {
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingContent = document.querySelector('.pricing-content');
    const servicesData = getServicesData();
    
    // Create pricing tables
    Object.keys(servicesData).forEach(category => {
        const table = document.createElement('div');
        table.className = `pricing-table ${category === 'makeup' ? 'active' : ''}`;
        table.id = `pricing-${category}`;
        
        let tableHTML = '';
        servicesData[category].forEach(service => {
            tableHTML += `
                <div class="price-item">
                    <span class="price-name">${service.name}</span>
                    <span class="price-value">KSH ${formatPrice(service.price)}</span>
                </div>
            `;
        });
        
        table.innerHTML = tableHTML;
        pricingContent.appendChild(table);
    });
    
    // Tab switching
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            pricingTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Hide all tables
            document.querySelectorAll('.pricing-table').forEach(table => {
                table.classList.remove('active');
            });
            
            // Show selected table
            const selectedTable = document.getElementById(`pricing-${category}`);
            if (selectedTable) {
                selectedTable.classList.add('active');
            }
        });
    });
}

// ====== SPECIAL OFFER SYSTEM ======
function initializeSpecialOffer() {
    const offerModal = document.getElementById('specialOfferModal');
    const closeOfferBtn = document.getElementById('closeOffer');
    const offerContent = document.getElementById('offerContent');
    
    // Load offer from localStorage or show default
    const savedOffer = localStorage.getItem('healingHandsSpecialOffer');
    
    if (savedOffer) {
        const offer = JSON.parse(savedOffer);
        displayOffer(offer);
    } else {
        // Create default offer
        const defaultOffer = {
            gradient: 'linear-gradient(135deg, #d4af37, #8a2d5e)',
            title: 'Grand Opening Special!',
            body: 'Get 20% off on all services for the first month. Book your appointment now!'
        };
        displayOffer(defaultOffer);
    }
    
    // Close offer button
    closeOfferBtn.addEventListener('click', function() {
        offerModal.classList.remove('active');
    });
    
    // Close on outside click
    offerModal.addEventListener('click', function(e) {
        if (e.target === offerModal) {
            offerModal.classList.remove('active');
        }
    });
}

function showSpecialOffer() {
    const offerModal = document.getElementById('specialOfferModal');
    offerModal.classList.add('active');
}

function displayOffer(offer) {
    const offerContent = document.getElementById('offerContent');
    offerContent.style.background = offer.gradient;
    offerContent.innerHTML = `
        <h3>${offer.title}</h3>
        <p>${offer.body}</p>
        <button class="cta-btn primary-btn" onclick="window.location.href='#contact'">
            <span>Book Now</span>
            <i class="fas fa-arrow-right"></i>
        </button>
    `;
}

// ====== BOOKING FORM ======
function initializeBookingForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value,
            homeService: document.getElementById('homeService').checked
        };
        
        // Validate form
        if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `New Appointment Request:
Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}
${formData.homeService ? 'Home Service Requested' : 'In-salon Service'}
${formData.message ? `Notes: ${formData.message}` : ''}`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/254110400242?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showNotification('Opening WhatsApp to confirm your booking!', 'success');
        
        // Reset form
        appointmentForm.reset();
    });
}

// ====== NAVIGATION ======
function initializeNavigation() {
    const header = document.getElementById('mainHeader');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// ====== HELPER FUNCTIONS ======
function getServicesData() {
    // Try to load from localStorage first
    const savedServices = localStorage.getItem('healingHandsServices');
    if (savedServices) {
        return JSON.parse(savedServices);
    }
    
    // Return default services
    return window.defaultServices || {
        makeup: [
            { name: "Simple Make-up", price: 500 },
            { name: "Full Make-up", price: 1000 },
            { name: "Bridal Make-up", price: 2500 },
            { name: "Photoshop Make-up", price: 800 },
            { name: "Male Make-up", price: 500 }
        ],
        facials: [
            { name: "Simple Product", price: 1000 },
            { name: "Garnier Product", price: 1200 },
            { name: "Skin Touch Project", price: 800 },
            { name: "Half Facial", price: 600 }
        ],
        waxing: [
            { name: "Eyebrow Waxing", price: 300 },
            { name: "Full Body Waxing", price: 2500 },
            { name: "Full Leg Wax", price: 900 },
            { name: "Half Leg", price: 500 },
            { name: "Brazilian Wax", price: 1200 }
        ],
        kinyozi: [
            { name: "Head Shave", price: 300 },
            { name: "Head Shave + Massage + Steam", price: 500 },
            { name: "Face Scrub", price: 300 },
            { name: "Nail Cutting", price: 200 },
            { name: "Beard Trim", price: 100 }
        ],
        massage: [
            { name: "Steam Massage", price: 4000 },
            { name: "Sensual Massage", price: 7000 },
            { name: "Bamboo Massage", price: 3500 },
            { name: "Teen Massage", price: 1000 },
            { name: "Swedish Massage", price: 2500 },
            { name: "Deep Tissue Massage", price: 3000 },
            { name: "Lava Stone Massage", price: 3500 },
            { name: "Sport Massage", price: 3500 }
        ],
        nails: [
            { name: "Gel Application", price: 400 },
            { name: "Artificial Nail", price: 600 },
            { name: "Acrylic", price: 1200 },
            { name: "Manicure (full)", price: 900 },
            { name: "Pedicure (full)", price: 900 }
        ]
    };
}

function getServiceIcon(category) {
    const icons = {
        makeup: 'fas fa-paint-brush',
        facials: 'fas fa-spa',
        waxing: 'fas fa-cut',
        kinyozi: 'fas fa-cut',
        massage: 'fas fa-hands',
        nails: 'fas fa-hand-sparkles'
    };
    return icons[category] || 'fas fa-star';
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all elements with animation classes
    document.querySelectorAll('.service-card, .gallery-item, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ====== NOTIFICATION STYLES (added dynamically) ======
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(10px);
        border-left: 4px solid #d4af37;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 2000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: #25D366;
    }
    
    .notification.error {
        border-left-color: #ff4757;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification.success i {
        color: #25D366;
    }
    
    .notification.error i {
        color: #ff4757;
    }
`;
document.head.appendChild(notificationStyles);