// Product View JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    // Product data (in a real app, this would come from an API)
    const productData = {
        id: 1,
        name: "Beautyrest 100% Cotton Blanket",
        category: "Bedding",
        currentPrice: 26400,
        originalPrice: 30100,
        images: [
            "Product1.jpg",
            "Product2.jpg", 
            "Product3.jpg",
            "Product4.jpg"
        ],
        rating: 4.5,
        reviews: 124,
        description: "Experience ultimate comfort with our premium 100% cotton blanket. Crafted with the finest materials, this blanket offers exceptional softness and durability.",
        features: [
            "100% Premium Cotton",
            "Machine Washable", 
            "Hypoallergenic",
            "Fade Resistant",
            "2-Year Warranty"
        ],
        sizes: ["single", "double", "queen", "king"],
        colors: ["white", "cream", "gray", "navy"],
        inStock: true
    };
    
    // Initialize loading screen
    function initializePage() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Hide loading screen after a short delay
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Trigger entrance animations
            triggerEntranceAnimations();
        }, 1200);
    }
    
    // Trigger entrance animations
    function triggerEntranceAnimations() {
        const animatedElements = document.querySelectorAll('.product-container, .product-tabs, .related-products');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
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
    }, { passive: true });
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = mobileMenuBtn.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? '' : 'hidden';
    });
    
    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });
    
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Enhanced search functionality
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    // Sample search data
    const searchData = [
        "Beautyrest Cotton Blanket",
        "Memory Foam Pillow",
        "Silk Bedsheets",
        "Comforter Set",
        "Mattress Protector",
        "Throw Pillows",
        "Bed Frame",
        "Duvet Cover"
    ];
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        searchTimeout = setTimeout(() => {
            if (query.length > 0) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        }, 300);
    });
    
    function showSearchSuggestions(query) {
        const filteredData = searchData.filter(item => 
            item.toLowerCase().includes(query)
        );
        
        if (filteredData.length > 0) {
            const suggestionsHTML = filteredData.map(item => 
                `<div class="suggestion-item" onclick="selectSuggestion('${item}')">${item}</div>`
            ).join('');
            
            searchSuggestions.innerHTML = suggestionsHTML;
            searchSuggestions.classList.add('active');
        } else {
            hideSearchSuggestions();
        }
    }
    
    function hideSearchSuggestions() {
        searchSuggestions.classList.remove('active');
    }
    
    // Global function for suggestion selection
    window.selectSuggestion = function(suggestion) {
        searchInput.value = suggestion;
        hideSearchSuggestions();
        performSearch(suggestion);
    };
    
    function performSearch(query) {
        showToast(`Searching for "${query}"...`, 'info');
        // In a real app, this would trigger a search API call
        console.log('Searching for:', query);
    }
    
    // Search button functionality
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });
    
    // Image gallery functionality
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image with smooth transition
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = thumbnail.dataset.image;
                mainImage.alt = thumbnail.alt;
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
    
    // Favorite button functionality
    const favoriteBtn = document.getElementById('favorite-btn');
    let isFavorite = false;
    
    favoriteBtn.addEventListener('click', () => {
        isFavorite = !isFavorite;
        
        if (isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            showToast('Added to favorites!', 'success');
            
            // Save to localStorage
            saveFavorite(productData.id);
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            showToast('Removed from favorites', 'info');
            
            // Remove from localStorage
            removeFavorite(productData.id);
        }
        
        // Update wishlist count
        updateWishlistCount();
    });
    
    // Check if product is already in favorites
    function checkFavoriteStatus() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.includes(productData.id)) {
            isFavorite = true;
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        updateWishlistCount();
    }
    
    function saveFavorite(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    
    function removeFavorite(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    
    function updateWishlistCount() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const wishlistCount = document.getElementById('wishlist-count');
        wishlistCount.textContent = favorites.length;
        wishlistCount.style.display = favorites.length > 0 ? 'block' : 'none';
    }
    
    // Product options functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    let selectedSize = 'single';
    let selectedColor = 'white';
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            updatePrice();
        });
    });
    
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
        });
    });
    
    // Quantity selector functionality
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        if (value < 1) quantityInput.value = 1;
        if (value > 10) quantityInput.value = 10;
    });
    
    // Price update based on size
    function updatePrice() {
        const sizeMultipliers = {
            single: 1,
            double: 1.2,
            queen: 1.4,
            king: 1.6
        };
        
        const multiplier = sizeMultipliers[selectedSize];
        const newPrice = Math.round(productData.currentPrice * multiplier);
        const newOriginalPrice = Math.round(productData.originalPrice * multiplier);
        
        document.getElementById('current-price').textContent = formatCurrency(newPrice);
        document.getElementById('original-price').textContent = formatCurrency(newOriginalPrice);
        
        // Update savings
        const savings = newOriginalPrice - newPrice;
        document.querySelector('.savings-info span').textContent = `You save ${formatCurrency(savings)}`;
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Buy Now functionality
    const buyNowBtn = document.getElementById('buy-now-btn');
    buyNowBtn.addEventListener('click', () => {
        // Add loading state
        const originalHTML = buyNowBtn.innerHTML;
        buyNowBtn.disabled = true;
        buyNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate processing
        setTimeout(() => {
            showToast('Redirecting to checkout...', 'success');
            
            // In a real app, this would redirect to checkout
            console.log('Buy Now clicked:', {
                product: productData.name,
                size: selectedSize,
                color: selectedColor,
                quantity: quantityInput.value
            });
            
            // Simulate redirect (in real app, use window.location.href)
            setTimeout(() => {
                showToast('Checkout page would open here', 'info');
            }, 1500);
            
            // Reset button
            buyNowBtn.disabled = false;
            buyNowBtn.innerHTML = originalHTML;
        }, 2000);
    });
    
    // Add to Cart functionality
    const addCartBtn = document.getElementById('add-cart-btn');
    addCartBtn.addEventListener('click', () => {
        const cartItem = {
            id: productData.id,
            name: productData.name,
            price: getCurrentPrice(),
            size: selectedSize,
            color: selectedColor,
            quantity: parseInt(quantityInput.value),
            image: productData.images[0]
        };
        
        // Add to cart with animation
        addToCartWithAnimation(cartItem);
    });
    
    function getCurrentPrice() {
        const sizeMultipliers = {
            single: 1,
            double: 1.2,
            queen: 1.4,
            king: 1.6
        };
        return Math.round(productData.currentPrice * sizeMultipliers[selectedSize]);
    }
    
    function addToCartWithAnimation(item) {
        // Add loading state
        const originalHTML = addCartBtn.innerHTML;
        addCartBtn.disabled = true;
        addCartBtn.style.transform = 'scale(0.95)';
        addCartBtn.style.background = 'var(--success-color)';
        addCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        // Save to localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(cartItem => 
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showToast(`${item.name} added to cart!`, 'success');
        
        // Flying cart animation
        createFlyingCartAnimation();
        
        // Reset button after delay
        setTimeout(() => {
            addCartBtn.style.transform = '';
            addCartBtn.style.background = '';
            addCartBtn.innerHTML = originalHTML;
            addCartBtn.disabled = false;
        }, 1500);
    }
    
    function createFlyingCartAnimation() {
        const cartBtn = document.getElementById('cart-btn');
        const addBtn = addCartBtn;
        
        const addBtnRect = addBtn.getBoundingClientRect();
        const cartBtnRect = cartBtn.getBoundingClientRect();
        
        const flyingElement = document.createElement('div');
        flyingElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        flyingElement.style.cssText = `
            position: fixed;
            top: ${addBtnRect.top + addBtnRect.height / 2}px;
            left: ${addBtnRect.left + addBtnRect.width / 2}px;
            width: 30px;
            height: 30px;
            background: var(--secondary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            pointer-events: none;
            font-size: 14px;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(flyingElement);
        
        // Animate to cart
        setTimeout(() => {
            flyingElement.style.top = `${cartBtnRect.top + cartBtnRect.height / 2}px`;
            flyingElement.style.left = `${cartBtnRect.left + cartBtnRect.width / 2}px`;
            flyingElement.style.transform = 'scale(0.5)';
            flyingElement.style.opacity = '0';
        }, 50);
        
        // Remove element and animate cart button
        setTimeout(() => {
            document.body.removeChild(flyingElement);
            cartBtn.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                cartBtn.style.animation = '';
            }, 500);
        }, 850);
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            btn.classList.add('active');
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
    
    // Review helpful button functionality
    document.querySelectorAll('.helpful-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentText = btn.textContent;
            const match = currentText.match(/\((\d+)\)/);
            if (match) {
                const currentCount = parseInt(match[1]);
                const newCount = currentCount + 1;
                btn.innerHTML = btn.innerHTML.replace(/\(\d+\)/, `(${newCount})`);
                btn.style.background = 'var(--success-color)';
                btn.style.color = 'white';
                btn.disabled = true;
                
                showToast('Thank you for your feedback!', 'success');
            }
        });
    });
    
    // Load more reviews functionality
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading more reviews
            setTimeout(() => {
                showToast('More reviews loaded!', 'success');
                loadMoreBtn.innerHTML = 'Load More Reviews';
                loadMoreBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastMessage.textContent = message;
        
        // Remove existing type classes and add new one
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            hideToast();
        }, 4000);
    }
    
    // Global function for hiding toast
    window.hideToast = function() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
    };
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Ctrl/Cmd + Enter triggers Buy Now
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            buyNowBtn.click();
        }
        
        // Alt + A triggers Add to Cart
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            addCartBtn.click();
        }
    });
    
    // Initialize page state
    checkFavoriteStatus();
    updateCartCount();
    updateWishlistCount();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Image lazy loading
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
    
    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                }
            }
        });
        observer.observe({ entryTypes: ['navigation'] });
    }
    
    console.log('Product view page initialized successfully!');
});