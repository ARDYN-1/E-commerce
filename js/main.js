// Enhanced Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        }
    });
    
    if ('PerformanceObserver' in window) {
        performanceObserver.observe({ entryTypes: ['navigation'] });
    }
    
    // Initialize loading screen with enhanced animation
    const loadingScreen = document.getElementById('loading-screen');
    
    // Enhanced loading screen with progress
    let loadProgress = 0;
    const loadingInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadingInterval);
        }
    }, 100);
    
    // Hide loading screen after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Trigger entrance animations
            triggerEntranceAnimations();
        }, 1200);
    });
    
    // Initialize components with error handling
    try {
        initializeComponents();
    } catch (error) {
        console.error('Error initializing components:', error);
        showNotification('Some features may not work properly', 'warning');
    }
    
    // Enhanced header scroll effect with throttling
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll with improved logic
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Enhanced mobile menu with improved animations
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('overlay');
    
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = mobileMenuBtn.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? '' : 'hidden';
        
        // Add stagger animation to menu items
        if (!isActive) {
            const menuItems = navMenu.querySelectorAll('.nav-item');
            menuItems.forEach((item, index) => {
                item.style.animation = `slideInLeft 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s both`;
            });
            
            // Handle dropdown toggles in mobile menu
            const dropdowns = navMenu.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('.nav-link');
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            });
        }
    });
    
    // Close mobile menu when clicking overlay
    overlay.addEventListener('click', () => {
        closeMobileMenu();
        closeAllModals();
    });
    
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Enhanced search modal with debounced search
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', () => {
        openModal(searchModal);
        setTimeout(() => searchInput.focus(), 150);
    });
    
    searchClose.addEventListener('click', () => {
        closeModal(searchModal);
    });
    
    // Enhanced search functionality with debouncing
    let searchTimeout;
    let searchCache = new Map();
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        searchTimeout = setTimeout(() => {
            if (query.length > 2) {
                performSearch(query);
            } else if (query.length === 0) {
                // Reset to show all products
                filterProductsUI('all');
            }
        }, 300);
    });
    
    function performSearch(query) {
        // Check cache first
        if (searchCache.has(query)) {
            displaySearchResults(searchCache.get(query));
            return;
        }
        
        const results = searchProductsUI(query);
        searchCache.set(query, results);
        displaySearchResults(results);
        
        closeModal(searchModal);
        
        // Scroll to products section with smooth animation
        document.getElementById('products').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add search analytics
        trackEvent('search', { query, results: results.length });
    }
    
    function displaySearchResults(results) {
        const productsGrid = document.getElementById('products-grid');
        if (results.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; color: var(--gray-300); margin-bottom: 1rem;">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 style="color: var(--gray-600); margin-bottom: 1rem;">No products found</h3>
                    <p style="color: var(--gray-500);">Try searching with different keywords or browse our categories</p>
                    <button class="btn btn-primary" onclick="filterProductsUI('all')" style="margin-top: 1rem;">
                        View All Products
                    </button>
                </div>
            `;
        }
    }
    
    // Enhanced search suggestions with click handlers
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.textContent;
            searchInput.value = query;
            performSearch(query);
        });
    });
    
    // Enhanced user modal with form validation
    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const userClose = document.getElementById('user-close');
    
    userBtn.addEventListener('click', () => {
        openModal(userModal);
    });
    
    userClose.addEventListener('click', () => {
        closeModal(userModal);
    });
    
    // Enhanced auth tabs with smooth transitions
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels with fade effect
            document.querySelectorAll('.auth-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            setTimeout(() => {
                document.getElementById(`${targetTab}-panel`).classList.add('active');
            }, 150);
        });
    });
    
    // Enhanced form validation
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const type = input.type;
            
            // Remove previous error styling
            input.classList.remove('error');
            
            // Validate based on input type
            if (!value) {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else if (type === 'email' && !isValidEmail(value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (type === 'password' && value.length < 6) {
                showFieldError(input, 'Password must be at least 6 characters');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showFieldError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideDown 0.3s ease-out;
        `;
        
        input.parentNode.appendChild(errorDiv);
        
        // Remove error on input
        input.addEventListener('input', () => {
            input.classList.remove('error');
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, { once: true });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Enhanced auth forms with better UX
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(e.target)) return;
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const formData = new FormData(e.target);
            const email = formData.get('email') || e.target[0].value;
            
            console.log('Login attempt:', { email });
            showNotification('Welcome back! Login successful.', 'success');
            closeModal(userModal);
            
            // Update UI for logged in state
            updateUserState(true, { email });
            
        } catch (error) {
            showNotification('Login failed. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(e.target)) return;
        
        const password = e.target.querySelector('input[type="password"]').value;
        const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const formData = new FormData(e.target);
            const name = formData.get('name') || e.target[0].value;
            const email = formData.get('email') || e.target[1].value;
            
            console.log('Registration attempt:', { name, email });
            showNotification('Account created successfully! Welcome to Bedly.', 'success');
            closeModal(userModal);
            
            updateUserState(true, { name, email });
            
        } catch (error) {
            showNotification('Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    // Enhanced Google login
    document.getElementById('google-login').addEventListener('click', async () => {
        const btn = document.getElementById('google-login');
        const originalHTML = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Google login attempt');
            showNotification('Google login successful! Welcome to Bedly.', 'success');
            closeModal(userModal);
            
            updateUserState(true, { name: 'Google User', email: 'user@gmail.com' });
            
        } catch (error) {
            showNotification('Google login failed. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
    
    function updateUserState(isLoggedIn, userData = {}) {
        const userBtn = document.getElementById('user-btn');
        
        if (isLoggedIn) {
            userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
            userBtn.title = `Logged in as ${userData.email || 'User'}`;
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            userBtn.innerHTML = '<i class="fas fa-user"></i>';
            userBtn.title = 'Login / Register';
            localStorage.removeItem('user');
        }
    }
    
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            updateUserState(true, userData);
        } catch (error) {
            localStorage.removeItem('user');
        }
    }
    
    wishlistBtn.addEventListener('click', () => {
        openWishlistModal();
    });
    
    function openWishlistModal() {
        const wishlistModal = createWishlistModal();
        document.body.appendChild(wishlistModal);
        openModal(wishlistModal);
    }
    
    function createWishlistModal() {
        const modal = document.createElement('div');
        modal.className = 'modal wishlist-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'wishlist-title');
        modal.setAttribute('aria-modal', 'true');
        
        const wishlistItems = ProductData.wishlist;
        
        modal.innerHTML = `
            <div class="modal-content wishlist-content" style="max-width: 800px;">
                <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Close wishlist">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wishlist-header">
                    <h2 id="wishlist-title">My Wishlist</h2>
                    <span class="wishlist-count">${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="wishlist-items">
                    ${wishlistItems.length === 0 ? `
                        <div class="empty-wishlist">
                            <div class="empty-wishlist-icon">
                                <i class="far fa-heart"></i>
                            </div>
                            <h3>Your wishlist is empty</h3>
                            <p>Save items you love to your wishlist and shop them later!</p>
                            <button class="btn btn-primary" onclick="this.closest('.modal').remove(); document.getElementById('products').scrollIntoView({ behavior: 'smooth' });">
                                Start Shopping
                            </button>
                        </div>
                    ` : wishlistItems.map((item, index) => `
                        <div class="wishlist-item" style="animation: slideInUp 0.3s ease-out ${index * 0.1}s both;">
                            <div class="wishlist-item-image" style="background-image: url('${item.image}')"></div>
                            <div class="wishlist-item-details">
                                <h4 class="wishlist-item-title">${item.name}</h4>
                                <div class="wishlist-item-price">${ProductData.formatCurrency(item.price)}</div>
                                <div class="wishlist-item-actions">
                                    <button class="btn btn-primary btn-sm" onclick="addToCartWithAnimation('${item.id}'); showNotification('${item.name} added to cart!', 'success');">
                                        <i class="fas fa-shopping-cart"></i> Add to Cart
                                    </button>
                                    <button class="btn btn-outline btn-sm" onclick="removeFromWishlist('${item.id}'); this.closest('.wishlist-item').remove(); updateWishlistCount();">
                                        <i class="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${wishlistItems.length > 0 ? `
                    <div class="wishlist-footer">
                        <button class="btn btn-outline" onclick="clearWishlist(); this.closest('.modal').remove();">
                            Clear All
                        </button>
                        <button class="btn btn-primary" onclick="addAllToCart(); this.closest('.modal').remove();">
                            Add All to Cart
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }
    
    function clearWishlist() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            ProductData.wishlist = [];
            ProductData.saveToStorage();
            updateWishlistUI();
            showNotification('Wishlist cleared', 'info');
        }
    }
    
    function addAllToCart() {
        let addedCount = 0;
        ProductData.wishlist.forEach(item => {
            if (ProductData.addToCart(item.id)) {
                addedCount++;
            }
        });
        
        if (addedCount > 0) {
            showNotification(`${addedCount} item${addedCount !== 1 ? 's' : ''} added to cart!`, 'success');
        }
    }
    
    // Enhanced cart sidebar
    const cartBtn = document.getElementById('cart-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    
    // Enhanced intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Add stagger effect for grid items
                if (element.parentElement.classList.contains('products-grid') ||
                    element.parentElement.classList.contains('features-grid')) {
                    const siblings = Array.from(element.parentElement.children);
                    const index = siblings.indexOf(element);
                    element.style.transitionDelay = `${index * 0.1}s`;
                }
                
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    cartBtn.addEventListener('click', () => {
        openModal(cartSidebar, 'sidebar');
    });
    
    cartClose.addEventListener('click', () => {
        closeModal(cartSidebar, 'sidebar');
    });
    
    // Enhanced hero slider with touch support
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.indicator');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    const heroSection = document.querySelector('.hero');
    
    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }
    
    function showSlide(index, direction = 'next') {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add transition classes for smoother animations
        heroSlides[currentSlide].style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        heroSlides[index].style.transform = 'translateX(0)';
        
        setTimeout(() => {
            heroSlides[currentSlide].style.transform = '';
            heroSlides[index].classList.add('active');
            heroIndicators[index].classList.add('active');
            currentSlide = index;
            isTransitioning = false;
        }, 100);
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        showSlide(next, 'next');
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prev, 'prev');
    }
    
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Hero navigation with keyboard support
    heroNext?.addEventListener('click', () => {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });
    
    heroPrev?.addEventListener('click', () => {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });
    
    // Hero indicators
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index !== currentSlide) {
                showSlide(index);
                stopSlideshow();
                startSlideshow();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
    });
    
    // Start slideshow
    startSlideshow();
    
    // Pause slideshow on hover/focus
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);
    heroSection.addEventListener('focusin', stopSlideshow);
    heroSection.addEventListener('focusout', startSlideshow);
    
    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
                
                // Update URL without triggering scroll
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Enhanced newsletter form with validation
    document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        
        try {
            await subscribeNewsletter(email);
            showNotification('Successfully subscribed! Welcome to our newsletter.', 'success');
            e.target.reset();
            
            // Track subscription
            trackEvent('newsletter_subscribe', { email });
            
        } catch (error) {
            showNotification('Subscription failed. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    // Enhanced back to top button with progress indicator
    const backToTop = document.getElementById('back-to-top');
    let scrollProgress = 0;
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = (scrollTop / docHeight) * 100;
        
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
            // Add progress ring if desired
            backToTop.style.background = `conic-gradient(var(--primary-color) ${scrollProgress * 3.6}deg, var(--gray-300) 0deg)`;
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackEvent('back_to_top_click');
    });
    
    // Enhanced load more products with infinite scroll option
    let productsLoaded = 12;
    const loadMoreBtn = document.getElementById('load-more');
    let isLoadingMore = false;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
        
        // Optional: Infinite scroll
        const enableInfiniteScroll = false; // Set to true to enable
        
        if (enableInfiniteScroll) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoadingMore) {
                    loadMoreProducts();
                }
            }, { threshold: 0.1 });
            
            observer.observe(loadMoreBtn);
        }
    }
    
    async function loadMoreProducts() {
        if (isLoadingMore) return;
        
        isLoadingMore = true;
        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const remainingProducts = ProductData.products.slice(productsLoaded, productsLoaded + 8);
            
            if (remainingProducts.length > 0) {
                loadProducts(remainingProducts, true);
                productsLoaded += remainingProducts.length;
                
                if (productsLoaded >= ProductData.products.length) {
                    loadMoreBtn.style.display = 'none';
                    showNotification('All products loaded!', 'info');
                }
            }
            
        } catch (error) {
            showNotification('Failed to load more products', 'error');
        } finally {
            isLoadingMore = false;
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;
        }
    }
    
    // Observe elements for animation
    function observeElements() {
        const elementsToObserve = document.querySelectorAll(
            '.feature-card, .product-card, .premium-card, .bestseller-card, .section-header'
        );
        
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            animationObserver.observe(el);
        });
    }
    
    // Modal management functions
    function openModal(modal, type = 'modal') {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        if (type === 'modal') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
        
        trackEvent('modal_open', { type: modal.id });
    }
    
    function closeModal(modal, type = 'modal') {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        trackEvent('modal_close', { type: modal.id });
    }
    
    function closeAllModals() {
        const modals = document.querySelectorAll('.search-modal, .user-modal, .cart-sidebar');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape') {
            closeAllModals();
            closeMobileMenu();
        }
        
        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchBtn.click();
        }
        
        // Ctrl/Cmd + B opens cart
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            cartBtn.click();
        }
    });
    
    // Enhanced performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('SW registered: ', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('New version available! Refresh to update.', 'info');
                        }
                    });
                });
                
            } catch (registrationError) {
                console.log('SW registration failed: ', registrationError);
            }
        });
    }
    
    // Analytics and tracking
    function trackEvent(eventName, properties = {}) {
        // Implement your analytics tracking here
        console.log('Event tracked:', eventName, properties);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Example: Custom analytics
        if (window.analytics) {
            window.analytics.track(eventName, properties);
        }
    }
    
    // Error handling and reporting
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        trackEvent('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
        });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        trackEvent('promise_rejection', {
            reason: e.reason.toString()
        });
    });
    
    // Entrance animations trigger
    function triggerEntranceAnimations() {
        observeElements();
        
        // Animate hero content
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.animation = 'fadeInUp 1s ease-out';
        }
        
        // Animate header
        header.style.animation = 'slideDown 0.8s ease-out';
    }
    
    // Initialize everything
    setTimeout(() => {
        observeElements();
    }, 500);
    
    // Expose functions globally for use in other scripts
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeAllModals = closeAllModals;
    window.trackEvent = trackEvent;
    window.showNotification = showNotification;
    
    console.log('Bedly e-commerce site initialized successfully!');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group input.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    img[data-src] {
        opacity: 0;
    }
`;
document.head.appendChild(style);