// Enhanced UI Update Functions with Performance Optimizations
let updateCartUITimeout;
let updateWishlistUITimeout;

function updateCartUI() {
    // Debounce rapid updates
    clearTimeout(updateCartUITimeout);
    updateCartUITimeout = setTimeout(() => {
        performCartUIUpdate();
    }, 100);
}

function performCartUIUpdate() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count badge with animation
    if (cartCount) {
        const count = ProductData.getCartCount();
        const previousCount = parseInt(cartCount.textContent) || 0;
        
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
        
        // Animate count change
        if (count !== previousCount && count > 0) {
            cartCount.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
    }
    
    // Update cart sidebar with enhanced UI
    if (cartItems) {
        if (ProductData.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Discover our amazing products and start shopping!</p>
                    <button class="btn btn-primary" onclick="closeModal(document.getElementById('cart-sidebar'), 'sidebar'); document.getElementById('products').scrollIntoView({ behavior: 'smooth' });">
                        Start Shopping
                    </button>
                </div>
            `;
        } else {
            cartItems.innerHTML = ProductData.cart.map((item, index) => `
                <div class="cart-item" style="animation: slideInRight 0.3s ease-out ${index * 0.1}s both;">
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${ProductData.formatCurrency(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                    ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="quantity-btn remove-btn" onclick="removeFromCart('${item.id}')" 
                                    title="Remove item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update cart total with currency formatting
    if (cartTotal) {
        const total = ProductData.getCartTotal();
        cartTotal.textContent = ProductData.formatCurrency(total);
        
        // Add savings calculation if applicable
        const originalTotal = ProductData.cart.reduce((sum, item) => {
            const product = ProductData.getProductById(item.id);
            const originalPrice = product?.originalPrice || product?.price || 0;
            return sum + (originalPrice * item.quantity);
        }, 0);
        
        const savings = originalTotal - total;
        if (savings > 0) {
            const savingsElement = document.querySelector('.cart-savings');
            if (savingsElement) {
                savingsElement.textContent = `You save ${ProductData.formatCurrency(savings)}!`;
            } else {
                const savingsDiv = document.createElement('div');
                savingsDiv.className = 'cart-savings';
                savingsDiv.style.cssText = `
                    color: var(--success-color);
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: var(--space-2);
                `;
                savingsDiv.textContent = `You save ${ProductData.formatCurrency(savings)}!`;
                cartTotal.parentNode.insertBefore(savingsDiv, cartTotal);
            }
        }
    }
}

function updateWishlistUI() {
    clearTimeout(updateWishlistUITimeout);
    updateWishlistUITimeout = setTimeout(() => {
        performWishlistUIUpdate();
    }, 100);
}

function performWishlistUIUpdate() {
    const wishlistCount = document.getElementById('wishlist-count');
    
    if (wishlistCount) {
        const count = ProductData.getWishlistCount();
        const previousCount = parseInt(wishlistCount.textContent) || 0;
        
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'block' : 'none';
        
        // Animate count change
        if (count !== previousCount && count > 0) {
            wishlistCount.style.animation = 'heartBeat 0.5s ease-in-out';
            setTimeout(() => {
                wishlistCount.style.animation = '';
            }, 500);
        }
    }
    
    // Update wishlist button states across the page
    document.querySelectorAll('[data-product-id]').forEach(btn => {
        if (btn.classList.contains('wishlist-btn') || btn.closest('.product-action-btn')) {
            const productId = btn.dataset.productId;
            const isInWishlist = ProductData.isInWishlist(productId);
            
            if (isInWishlist) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-heart';
                }
            } else {
                btn.classList.remove('active');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'far fa-heart';
                }
            }
        }
    });
}

// Enhanced Product Card Component with better accessibility
function createProductCard(product) {
    const isInWishlist = ProductData.isInWishlist(product.id);
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-category="${product.category}" data-product-id="${product.id}" 
             role="article" aria-label="Product: ${product.name}">
            <div class="product-image" style="background-image: url('${product.image}')" 
                 role="img" aria-label="${product.name} product image">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                ${discountPercentage > 0 ? `<div class="product-discount">-${discountPercentage}%</div>` : ''}
                <div class="product-actions" role="group" aria-label="Product actions">
                    <button class="product-action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" 
                            data-product-id="${product.id}" 
                            onclick="toggleWishlist('${product.id}')"
                            aria-label="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}"
                            title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="product-action-btn" onclick="quickView('${product.id}')"
                            aria-label="Quick view ${product.name}"
                            title="Quick view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="product-action-btn" onclick="shareProduct('${product.id}')"
                            aria-label="Share ${product.name}"
                            title="Share product">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating" role="group" aria-label="Rating: ${product.rating} out of 5 stars">
                    <div class="stars" aria-hidden="true">${ProductData.generateStars(product.rating)}</div>
                    <span class="rating-text">${product.rating}/5 (${product.reviews} reviews)</span>
                </div>
                <div class="product-price" role="group" aria-label="Price information">
                    ${product.originalPrice ? `<span class="old-price" aria-label="Original price">${ProductData.formatCurrency(product.originalPrice)}</span>` : ''}
                    <span class="new-price" aria-label="Current price">${ProductData.formatCurrency(product.price)}</span>
                </div>
                <button class="product-cart-btn add-to-cart" data-product-id="${product.id}"
                        aria-label="Add ${product.name} to cart">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Enhanced Load Products with better performance
function loadProducts(productsToShow = ProductData.products, append = false) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    
    const productsHTML = productsToShow.map(product => createProductCard(product)).join('');
    tempDiv.innerHTML = productsHTML;
    
    // Move elements to fragment
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }
    
    if (append) {
        productsGrid.appendChild(fragment);
    } else {
        productsGrid.innerHTML = '';
        productsGrid.appendChild(fragment);
    }
    
    // Add staggered animation to new products
    const newCards = productsGrid.querySelectorAll('.product-card');
    newCards.forEach((card, index) => {
        if (append && index >= newCards.length - productsToShow.length) {
            // Only animate newly added cards
            const animationIndex = index - (newCards.length - productsToShow.length);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, animationIndex * 100);
        } else if (!append) {
            // Animate all cards on initial load
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
    
    // Update accessibility
    productsGrid.setAttribute('aria-live', 'polite');
    productsGrid.setAttribute('aria-label', `${newCards.length} products displayed`);
}

// Enhanced Filter Products with smooth transitions
function filterProductsUI(category) {
    const filteredProducts = ProductData.filterProducts(category);
    const productsGrid = document.getElementById('products-grid');
    
    // Add fade out animation
    productsGrid.style.opacity = '0.5';
    productsGrid.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        loadProducts(filteredProducts);
        
        // Fade back in
        productsGrid.style.opacity = '1';
        productsGrid.style.transform = 'scale(1)';
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
        
        // Announce filter change to screen readers
        announceToScreenReader(`Showing ${filteredProducts.length} products in ${category === 'all' ? 'all categories' : category}`);
        
        // Track filter usage
        if (window.trackEvent) {
            window.trackEvent('product_filter', { category, count: filteredProducts.length });
        }
        
    }, 200);
}

// Enhanced Search Products with better UX
function searchProductsUI(query) {
    const searchResults = ProductData.searchProducts(query);
    const productsGrid = document.getElementById('products-grid');
    
    // Show loading state
    productsGrid.innerHTML = `
        <div class="search-loading" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
            <p>Searching for "${query}"...</p>
        </div>
    `;
    
    setTimeout(() => {
        if (searchResults.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <div class="no-results-icon" style="font-size: 4rem; color: var(--gray-300); margin-bottom: 1.5rem;">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 style="color: var(--gray-600); margin-bottom: 1rem; font-size: 1.5rem;">No products found for "${query}"</h3>
                    <p style="color: var(--gray-500); margin-bottom: 2rem; max-width: 400px; margin-left: auto; margin-right: auto;">
                        Try searching with different keywords, check your spelling, or browse our categories below.
                    </p>
                    <div class="suggested-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="filterProductsUI('all')">
                            View All Products
                        </button>
                        <button class="btn btn-outline" onclick="document.getElementById('search-btn').click()">
                            Search Again
                        </button>
                    </div>
                    <div class="popular-searches" style="margin-top: 2rem;">
                        <h4 style="color: var(--gray-600); margin-bottom: 1rem;">Popular searches:</h4>
                        <div class="suggestion-tags" style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                            <span class="tag" onclick="searchProductsUI('bedding')">Bedding</span>
                            <span class="tag" onclick="searchProductsUI('pillows')">Pillows</span>
                            <span class="tag" onclick="searchProductsUI('mattresses')">Mattresses</span>
                            <span class="tag" onclick="searchProductsUI('comforters')">Comforters</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            loadProducts(searchResults);
            
            // Add search results header
            const resultsHeader = document.createElement('div');
            resultsHeader.className = 'search-results-header';
            resultsHeader.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 1rem;
                background: var(--gray-50);
                border-radius: var(--radius-lg);
                margin-bottom: 2rem;
            `;
            resultsHeader.innerHTML = `
                <h3 style="color: var(--gray-800); margin-bottom: 0.5rem;">
                    Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${query}"
                </h3>
                <button class="btn btn-sm btn-outline" onclick="filterProductsUI('all')" style="margin-top: 0.5rem;">
                    Clear Search
                </button>
            `;
            
            productsGrid.insertBefore(resultsHeader, productsGrid.firstChild);
        }
        
        // Announce search results to screen readers
        announceToScreenReader(`Search completed. ${searchResults.length} products found for ${query}`);
        
    }, 500);
    
    return searchResults;
}

// Enhanced Toggle Wishlist with better feedback
function toggleWishlist(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    const isCurrentlyInWishlist = ProductData.isInWishlist(productId);
    const button = document.querySelector(`[data-product-id="${productId}"].wishlist-btn`);
    
    if (isCurrentlyInWishlist) {
        ProductData.removeFromWishlist(productId);
        showNotification(`${product.name} removed from wishlist`, 'info');
        
        if (button) {
            button.style.animation = 'heartBreak 0.5s ease-in-out';
        }
    } else {
        if (ProductData.addToWishlist(productId)) {
            showNotification(`${product.name} added to wishlist`, 'success');
            
            if (button) {
                button.style.animation = 'heartBeat 0.5s ease-in-out';
            }
        }
    }
    
    updateWishlistUI();
    
    // Track wishlist action
    if (window.trackEvent) {
        window.trackEvent('wishlist_toggle', {
            productId,
            productName: product.name,
            action: isCurrentlyInWishlist ? 'remove' : 'add'
        });
    }
}

// Enhanced Add to Cart with better animations and feedback
function addToCartWithAnimation(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    if (ProductData.addToCart(productId)) {
        showNotification(`${product.name} added to cart`, 'success');
        
        // Find the button that was clicked
        const button = document.querySelector(`[data-product-id="${productId}"].add-to-cart`);
        if (button) {
            const originalHTML = button.innerHTML;
            
            // Success animation
            button.style.transform = 'scale(0.95)';
            button.style.background = 'var(--success-color)';
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.disabled = true;
            
            // Flying cart animation
            createFlyingCartAnimation(button);
            
            setTimeout(() => {
                button.style.transform = '';
                button.style.background = '';
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 1500);
        }
        
        // Track add to cart
        if (window.trackEvent) {
            window.trackEvent('add_to_cart', {
                productId,
                productName: product.name,
                price: product.price
            });
        }
    }
}

// Flying cart animation
function createFlyingCartAnimation(sourceElement) {
    const cartButton = document.getElementById('cart-btn');
    if (!cartButton || !sourceElement) return;
    
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartRect = cartButton.getBoundingClientRect();
    
    const flyingElement = document.createElement('div');
    flyingElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    flyingElement.style.cssText = `
        position: fixed;
        top: ${sourceRect.top + sourceRect.height / 2}px;
        left: ${sourceRect.left + sourceRect.width / 2}px;
        width: 30px;
        height: 30px;
        background: var(--primary-color);
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
        flyingElement.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingElement.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingElement.style.transform = 'scale(0.5)';
        flyingElement.style.opacity = '0';
    }, 50);
    
    // Remove element after animation
    setTimeout(() => {
        if (flyingElement.parentNode) {
            flyingElement.parentNode.removeChild(flyingElement);
        }
        
        // Animate cart button
        cartButton.style.animation = 'bounce 0.5s ease-in-out';
        setTimeout(() => {
            cartButton.style.animation = '';
        }, 500);
        
    }, 850);
}

// Enhanced Update Cart Quantity with validation
function updateQuantity(productId, quantity) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    if (quantity < 0) {
        showNotification('Quantity cannot be negative', 'error');
        return;
    }
    
    if (quantity > 99) {
        showNotification('Maximum quantity is 99', 'warning');
        return;
    }
    
    const previousQuantity = ProductData.cart.find(item => item.id === productId)?.quantity || 0;
    
    ProductData.updateCartQuantity(productId, quantity);
    
    if (quantity === 0) {
        showNotification(`${product.name} removed from cart`, 'info');
    } else if (quantity > previousQuantity) {
        showNotification(`${product.name} quantity increased`, 'success');
    } else {
        showNotification(`${product.name} quantity decreased`, 'info');
    }
    
    // Track quantity change
    if (window.trackEvent) {
        window.trackEvent('cart_quantity_change', {
            productId,
            productName: product.name,
            previousQuantity,
            newQuantity: quantity
        });
    }
}

// Enhanced Remove from Cart with confirmation
function removeFromCart(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    // Show confirmation for expensive items
    if (product.price > 10000) {
        if (!confirm(`Are you sure you want to remove ${product.name} from your cart?`)) {
            return;
        }
    }
    
    ProductData.removeFromCart(productId);
    showNotification(`${product.name} removed from cart`, 'info');
    
    // Track removal
    if (window.trackEvent) {
        window.trackEvent('remove_from_cart', {
            productId,
            productName: product.name,
            price: product.price
        });
    }
}

// Enhanced Quick View Modal with better content
function quickView(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'quick-view-title');
    modal.setAttribute('aria-modal', 'true');
    
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    modal.innerHTML = `
        <div class="modal-content quick-view-content" style="max-width: 900px;">
            <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Close quick view">
                <i class="fas fa-times"></i>
            </button>
            <div class="quick-view-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-lg);">
                    ${product.badge ? `<div class="product-badge" style="position: absolute; top: 1rem; left: 1rem;">${product.badge}</div>` : ''}
                    ${discountPercentage > 0 ? `<div class="product-discount" style="position: absolute; top: 1rem; right: 1rem; background: var(--secondary-color); color: white; padding: 0.5rem; border-radius: 50%; font-weight: bold;">-${discountPercentage}%</div>` : ''}
                </div>
                <div class="quick-view-details">
                    <div class="product-category" style="color: var(--gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">${product.category}</div>
                    <h2 id="quick-view-title" style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: var(--gray-900);">${product.name}</h2>
                    <div class="product-rating" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="stars" style="color: var(--accent-color);">${ProductData.generateStars(product.rating)}</div>
                        <span style="color: var(--gray-500);">${product.rating}/5 (${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                        ${product.originalPrice ? `<span class="old-price" style="color: var(--gray-400); text-decoration: line-through; font-size: 1.25rem;">${ProductData.formatCurrency(product.originalPrice)}</span>` : ''}
                        <span class="new-price" style="color: var(--secondary-color); font-size: 2rem; font-weight: 700;">${ProductData.formatCurrency(product.price)}</span>
                    </div>
                    <p style="color: var(--gray-600); line-height: 1.7; margin-bottom: 2rem; font-size: 1.125rem;">${product.description || 'Experience premium quality and comfort with this carefully crafted product designed to enhance your bedroom sanctuary.'}</p>
                    
                    <div class="product-features" style="margin-bottom: 2rem;">
                        <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-weight: 600;">Key Features:</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="display: flex; align-items: center; margin-bottom: 0.5rem; color: var(--gray-600);">
                                <i class="fas fa-check" style="color: var(--success-color); margin-right: 0.75rem;"></i>
                                Premium quality materials
                            </li>
                            <li style="display: flex; align-items: center; margin-bottom: 0.5rem; color: var(--gray-600);">
                                <i class="fas fa-check" style="color: var(--success-color); margin-right: 0.75rem;"></i>
                                Easy care and maintenance
                            </li>
                            <li style="display: flex; align-items: center; margin-bottom: 0.5rem; color: var(--gray-600);">
                                <i class="fas fa-check" style="color: var(--success-color); margin-right: 0.75rem;"></i>
                                30-day return guarantee
                            </li>
                        </ul>
                    </div>
                    
                    <div class="quick-view-actions" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-lg" onclick="addToCartWithAnimation('${product.id}'); this.closest('.modal').remove();" style="flex: 1; min-width: 200px;">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="toggleWishlist('${product.id}'); updateQuickViewWishlistBtn(this, '${product.id}')" style="padding: 1rem;">
                            <i class="${ProductData.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="btn btn-outline" onclick="shareProduct('${product.id}')" style="padding: 1rem;">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus management
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Track quick view
    if (window.trackEvent) {
        window.trackEvent('product_quick_view', {
            productId,
            productName: product.name
        });
    }
}

// Update wishlist button in quick view
function updateQuickViewWishlistBtn(button, productId) {
    const isInWishlist = ProductData.isInWishlist(productId);
    const icon = button.querySelector('i');
    
    if (isInWishlist) {
        icon.className = 'fas fa-heart';
        button.style.color = 'var(--secondary-color)';
    } else {
        icon.className = 'far fa-heart';
        button.style.color = '';
    }
}

// Share Product functionality
function shareProduct(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    const shareData = {
        title: product.name,
        text: `Check out this amazing ${product.name} from Bedly!`,
        url: `${window.location.origin}${window.location.pathname}#product-${productId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData).then(() => {
            showNotification('Product shared successfully!', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(shareData);
        });
    } else {
        fallbackShare(shareData);
    }
    
    // Track share
    if (window.trackEvent) {
        window.trackEvent('product_share', {
            productId,
            productName: product.name
        });
    }
}

// Fallback share functionality
function fallbackShare(shareData) {
    const shareModal = document.createElement('div');
    shareModal.className = 'modal active';
    shareModal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <h3 style="margin-bottom: 1.5rem; text-align: center;">Share Product</h3>
            <div class="share-options" style="display: grid; gap: 1rem;">
                <button class="btn btn-outline" onclick="copyToClipboard('${shareData.url}'); this.closest('.modal').remove();">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
                <button class="btn btn-outline" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}', '_blank'); this.closest('.modal').remove();">
                    <i class="fab fa-twitter"></i> Share on Twitter
                </button>
                <button class="btn btn-outline" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}', '_blank'); this.closest('.modal').remove();">
                    <i class="fab fa-facebook"></i> Share on Facebook
                </button>
                <button class="btn btn-outline" onclick="window.open('https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}', '_blank'); this.closest('.modal').remove();">
                    <i class="fab fa-whatsapp"></i> Share on WhatsApp
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.remove();
        }
    });
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Enhanced Notification System with better positioning and stacking
let notificationCount = 0;
const maxNotifications = 3;

function showNotification(message, type = 'info') {
    // Remove oldest notification if we have too many
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length >= maxNotifications) {
        existingNotifications[0].remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="${icons[type]}" style="font-size: 1.25rem;"></i>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0.25rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: ${100 + (existingNotifications.length * 80)}px;
        right: 1.5rem;
        background: var(--white);
        color: var(--gray-800);
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'}-color);
        min-width: 300px;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after delay
    const autoRemoveDelay = type === 'error' ? 6000 : 4000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, autoRemoveDelay);
    
    // Reposition remaining notifications
    setTimeout(() => {
        const allNotifications = document.querySelectorAll('.notification');
        allNotifications.forEach((notif, index) => {
            notif.style.top = `${100 + (index * 80)}px`;
        });
    }, 100);
}

// Enhanced Newsletter Subscription with better validation
async function subscribeNewsletter(email) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    
    // Check if already subscribed
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    if (subscribers.includes(email)) {
        throw new Error('Email already subscribed');
    }
    
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate occasional failures
            if (Math.random() < 0.1) {
                reject(new Error('Network error'));
                return;
            }
            
            // Save subscription
            subscribers.push(email);
            localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
            
            console.log('Newsletter subscription:', email);
            resolve(true);
        }, 1000);
    });
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize Components with error handling
function initializeComponents() {
    try {
        // Load initial products
        loadProducts();
        
        // Update UI counters
        updateCartUI();
        updateWishlistUI();
        
        // Add event listeners for add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const productId = e.target.closest('.add-to-cart').dataset.productId;
                if (productId) {
                    addToCartWithAnimation(productId);
                }
            }
        });
        
        // Add event listeners for filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                e.preventDefault();
                const category = e.target.dataset.filter;
                if (category) {
                    filterProductsUI(category);
                }
            }
        });
        
        // Add event listeners for wishlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn')) {
                e.preventDefault();
                const productId = e.target.closest('.wishlist-btn').dataset.productId;
                if (productId) {
                    toggleWishlist(productId);
                }
            }
        });
        
        console.log('Components initialized successfully');
        
    } catch (error) {
        console.error('Error initializing components:', error);
        showNotification('Some features may not work properly', 'warning');
    }
}

// Export functions for global use
window.updateCartUI = updateCartUI;
window.updateWishlistUI = updateWishlistUI;
window.toggleWishlist = toggleWishlist;
window.addToCartWithAnimation = addToCartWithAnimation;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.quickView = quickView;
window.shareProduct = shareProduct;
window.filterProductsUI = filterProductsUI;
window.searchProductsUI = searchProductsUI;
window.initializeComponents = initializeComponents;
window.showNotification = showNotification;
window.subscribeNewsletter = subscribeNewsletter;
window.copyToClipboard = copyToClipboard;
window.updateQuickViewWishlistBtn = updateQuickViewWishlistBtn;

// Add additional CSS for new features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes heartBreak {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(0.8) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-2deg); }
    }
    
    .product-discount {
        position: absolute;
        top: var(--space-4);
        right: var(--space-4);
        background: var(--secondary-color);
        color: var(--white);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        z-index: 2;
    }
    
    .quantity-display {
        min-width: 2rem;
        text-align: center;
        font-weight: 600;
        color: var(--gray-800);
    }
    
    .remove-btn {
        background: var(--error-color) !important;
        color: var(--white) !important;
        margin-left: auto;
    }
    
    .remove-btn:hover {
        background: #c53030 !important;
        transform: scale(1.1);
    }
    
    .quick-view-content {
        animation: slideInUp 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .empty-cart-icon {
        font-size: 4rem;
        color: var(--gray-300);
        margin-bottom: 1.5rem;
    }
    
    .empty-cart h3 {
        color: var(--gray-600);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .empty-cart p {
        color: var(--gray-500);
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    
    @media (max-width: 768px) {
        .quick-view-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
        }
        
        .quick-view-actions {
            flex-direction: column;
        }
        
        .quick-view-actions .btn {
            min-width: auto !important;
        }
        
        .notification {
            right: 1rem !important;
            left: 1rem !important;
            min-width: auto !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(additionalStyles);