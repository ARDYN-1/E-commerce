// UI Update Functions
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count badge
    if (cartCount) {
        const count = ProductData.getCartCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
    
    // Update cart sidebar
    if (cartItems) {
        if (ProductData.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = ProductData.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${ProductData.formatCurrency(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button class="quantity-btn" onclick="removeFromCart('${item.id}')" style="margin-left: auto; background: var(--error-color); color: white;">×</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update cart total
    if (cartTotal) {
        cartTotal.textContent = ProductData.formatCurrency(ProductData.getCartTotal());
    }
}

function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlist-count');
    
    if (wishlistCount) {
        const count = ProductData.getWishlistCount();
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'block' : 'none';
    }
    
    // Update wishlist button states
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (ProductData.isInWishlist(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Product Card Component
function createProductCard(product) {
    const isInWishlist = ProductData.isInWishlist(product.id);
    
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}')">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" 
                            data-product-id="${product.id}" 
                            onclick="toggleWishlist('${product.id}')">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="product-action-btn" onclick="quickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${ProductData.generateStars(product.rating)}</div>
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="old-price">${ProductData.formatCurrency(product.originalPrice)}</span>` : ''}
                    <span class="new-price">${ProductData.formatCurrency(product.price)}</span>
                </div>
                <button class="product-cart-btn add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Load Products
function loadProducts(productsToShow = ProductData.products, append = false) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const productsHTML = productsToShow.map(product => createProductCard(product)).join('');
    
    if (append) {
        productsGrid.innerHTML += productsHTML;
    } else {
        productsGrid.innerHTML = productsHTML;
    }
    
    // Add animation to new products
    const newCards = productsGrid.querySelectorAll('.product-card');
    newCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Filter Products
function filterProductsUI(category) {
    const filteredProducts = ProductData.filterProducts(category);
    loadProducts(filteredProducts);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
}

// Search Products
function searchProductsUI(query) {
    const searchResults = ProductData.searchProducts(query);
    loadProducts(searchResults);
    
    // Show search results message
    const productsGrid = document.getElementById('products-grid');
    if (searchResults.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    }
}

// Toggle Wishlist
function toggleWishlist(productId) {
    if (ProductData.isInWishlist(productId)) {
        ProductData.removeFromWishlist(productId);
        showNotification('Removed from wishlist', 'info');
    } else {
        if (ProductData.addToWishlist(productId)) {
            showNotification('Added to wishlist', 'success');
        }
    }
    updateWishlistUI();
}

// Add to Cart with Animation
function addToCartWithAnimation(productId) {
    if (ProductData.addToCart(productId)) {
        showNotification('Added to cart', 'success');
        
        // Find the button that was clicked
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
            // Add animation class
            button.style.transform = 'scale(0.95)';
            button.style.background = 'var(--success-color)';
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            
            setTimeout(() => {
                button.style.transform = '';
                button.style.background = '';
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }, 1000);
        }
    }
}

// Update Cart Quantity
function updateQuantity(productId, quantity) {
    ProductData.updateCartQuantity(productId, quantity);
}

// Remove from Cart
function removeFromCart(productId) {
    ProductData.removeFromCart(productId);
    showNotification('Removed from cart', 'info');
}

// Quick View Modal
function quickView(productId) {
    const product = ProductData.getProductById(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px;">
                </div>
                <div>
                    <h2>${product.name}</h2>
                    <div class="product-rating" style="margin: 1rem 0;">
                        <div class="stars">${ProductData.generateStars(product.rating)}</div>
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price" style="margin: 1rem 0;">
                        ${product.originalPrice ? `<span class="old-price">${ProductData.formatCurrency(product.originalPrice)}</span>` : ''}
                        <span class="new-price">${ProductData.formatCurrency(product.price)}</span>
                    </div>
                    <p style="margin: 1rem 0; color: var(--gray-600);">${product.description}</p>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="addToCartWithAnimation('${product.id}'); this.closest('.modal').remove();">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="toggleWishlist('${product.id}')">
                            ${ProductData.isInWishlist(product.id) ? 'Remove from' : 'Add to'} Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Newsletter Subscription
function subscribeNewsletter(email) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Newsletter subscription:', email);
            resolve(true);
        }, 1000);
    });
}

// Initialize Components
function initializeComponents() {
    // Load initial products
    loadProducts();
    
    // Update UI counters
    updateCartUI();
    updateWishlistUI();
    
    // Add event listeners for add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const productId = e.target.closest('.add-to-cart').dataset.productId;
            addToCartWithAnimation(productId);
        }
    });
    
    // Add event listeners for filter buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const category = e.target.dataset.filter;
            filterProductsUI(category);
        }
    });
}

// Export functions for global use
window.updateCartUI = updateCartUI;
window.updateWishlistUI = updateWishlistUI;
window.toggleWishlist = toggleWishlist;
window.addToCartWithAnimation = addToCartWithAnimation;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.quickView = quickView;
window.filterProductsUI = filterProductsUI;
window.searchProductsUI = searchProductsUI;
window.initializeComponents = initializeComponents;