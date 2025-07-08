// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });
    
    // Initialize components
    initializeComponents();
    
    // Header scroll effect
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    // Close mobile menu when clicking overlay
    overlay.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        closeAllModals();
    });
    
    // Search modal
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        overlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });
    
    searchClose.addEventListener('click', () => {
        searchModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                searchProductsUI(query);
                searchModal.classList.remove('active');
                overlay.classList.remove('active');
                
                // Scroll to products section
                document.getElementById('products').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        }, 300);
    });
    
    // Search suggestions
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.textContent;
            searchInput.value = query;
            searchProductsUI(query);
            searchModal.classList.remove('active');
            overlay.classList.remove('active');
            document.getElementById('products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    // User modal
    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const userClose = document.getElementById('user-close');
    
    userBtn.addEventListener('click', () => {
        userModal.classList.add('active');
        overlay.classList.add('active');
    });
    
    userClose.addEventListener('click', () => {
        userModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            document.querySelectorAll('.auth-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
    
    // Auth forms
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target[0].value;
        const password = formData.get('password') || e.target[1].value;
        
        // Simulate login
        console.log('Login attempt:', { email, password });
        showNotification('Login successful!', 'success');
        userModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target[0].value;
        const email = formData.get('email') || e.target[1].value;
        const password = formData.get('password') || e.target[2].value;
        const confirmPassword = formData.get('confirmPassword') || e.target[3].value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // Simulate registration
        console.log('Registration attempt:', { name, email, password });
        showNotification('Account created successfully!', 'success');
        userModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Google login
    document.getElementById('google-login').addEventListener('click', () => {
        // Simulate Google login
        console.log('Google login attempt');
        showNotification('Google login successful!', 'success');
        userModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Cart sidebar
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    cartClose.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Hero slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.indicator');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        heroIndicators[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prev);
    }
    
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Hero navigation
    heroNext.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });
    
    heroPrev.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });
    
    // Hero indicators
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });
    
    // Start slideshow
    startSlideshow();
    
    // Pause slideshow on hover
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
    
    // Newsletter form
    document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        
        if (!email) {
            showNotification('Please enter your email', 'error');
            return;
        }
        
        try {
            await subscribeNewsletter(email);
            showNotification('Successfully subscribed to newsletter!', 'success');
            e.target.reset();
        } catch (error) {
            showNotification('Failed to subscribe. Please try again.', 'error');
        }
    });
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Load more products
    let productsLoaded = 12;
    const loadMoreBtn = document.getElementById('load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const remainingProducts = ProductData.products.slice(productsLoaded, productsLoaded + 8);
            if (remainingProducts.length > 0) {
                loadProducts(remainingProducts, true);
                productsLoaded += remainingProducts.length;
                
                if (productsLoaded >= ProductData.products.length) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .premium-card, .bestseller-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Close all modals function
    function closeAllModals() {
        searchModal.classList.remove('active');
        userModal.classList.remove('active');
        cartSidebar.classList.remove('active');
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape') {
            closeAllModals();
            overlay.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchBtn.click();
        }
    });
    
    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});