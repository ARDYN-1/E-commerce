// Product Data
const products = [
    {
        id: 1,
        name: "Beautyrest 100% Cotton Blanket",
        category: "bedding",
        price: 26400,
        originalPrice: 30100,
        image: "Product1.jpg",
        rating: 4.5,
        reviews: 124,
        badge: "Sale",
        description: "Premium cotton blanket for ultimate comfort"
    },
    {
        id: 2,
        name: "Berkshire Blanket-Waffle",
        category: "bedding",
        price: 37200,
        originalPrice: null,
        image: "Product2.jpg",
        rating: 4.8,
        reviews: 89,
        badge: "New",
        description: "Luxurious waffle-textured blanket"
    },
    {
        id: 3,
        name: "Cotton Weave Diamond Blanket",
        category: "bedding",
        price: 44100,
        originalPrice: 47800,
        image: "Product3.jpg",
        rating: 4.3,
        reviews: 67,
        badge: "Sale",
        description: "Elegant diamond pattern cotton blanket"
    },
    {
        id: 4,
        name: "Gel Memory Foam Pillow",
        category: "pillows",
        price: 28300,
        originalPrice: null,
        image: "Product5.jpg",
        rating: 4.7,
        reviews: 156,
        badge: "Popular",
        description: "Cooling gel-infused memory foam pillow"
    },
    {
        id: 5,
        name: "Hotel Linen Klub Standard Pillowcase",
        category: "pillows",
        price: 2400,
        originalPrice: 2600,
        image: "Product6.jpg",
        rating: 4.2,
        reviews: 203,
        badge: "Sale",
        description: "Hotel-quality linen pillowcase"
    },
    {
        id: 6,
        name: "Mellow Naturalista Classic 12 Inch",
        category: "mattresses",
        price: 8200,
        originalPrice: null,
        image: "Product7.jpg",
        rating: 4.6,
        reviews: 78,
        badge: "New",
        description: "Natural latex mattress for better sleep"
    },
    {
        id: 7,
        name: "Sage Blue Throw Blanket",
        category: "bedding",
        price: 10700,
        originalPrice: null,
        image: "Product8.jpg",
        rating: 4.4,
        reviews: 92,
        badge: null,
        description: "Soft sage blue decorative throw"
    },
    {
        id: 8,
        name: "Fluffy Comforter Set Bedding",
        category: "bedding",
        price: 38300,
        originalPrice: null,
        image: "Product9.jpg",
        rating: 4.9,
        reviews: 145,
        badge: "Bestseller",
        description: "Ultra-soft comforter set with pillowcases"
    },
    {
        id: 9,
        name: "Microfibre Reversible Comforter",
        category: "bedding",
        price: 18499,
        originalPrice: 26000,
        image: "Product10.jpg",
        rating: 4.1,
        reviews: 167,
        badge: "Sale",
        description: "Reversible microfiber comforter"
    },
    {
        id: 10,
        name: "Unisex Blue 150 GSM Microfiber",
        category: "bedding",
        price: 900,
        originalPrice: null,
        image: "Product11.jpg",
        rating: 4.0,
        reviews: 234,
        badge: null,
        description: "Lightweight microfiber bedding"
    },
    {
        id: 11,
        name: "Arabica Comforter",
        category: "bedding",
        price: 11700,
        originalPrice: null,
        image: "Product12.jpg",
        rating: 4.5,
        reviews: 98,
        badge: null,
        description: "Premium arabica-inspired comforter"
    },
    {
        id: 12,
        name: "Cotton Weave Diamond Blanket",
        category: "furniture",
        price: 26400,
        originalPrice: 30100,
        image: "Product4.jpg",
        rating: 4.3,
        reviews: 76,
        badge: "Sale",
        description: "Stylish diamond weave pattern blanket"
    }
];

// Bestseller Products
const bestsellers = [
    {
        id: 'best-1',
        name: "Soft Velvet Quilted Bed Cover",
        price: 7300,
        originalPrice: 12600,
        image: "best-product1.jpg",
        rating: 4.5,
        reviews: 124
    },
    {
        id: 'best-2',
        name: "Royal Orchid Bedsheet Set",
        price: 6999,
        originalPrice: 9999,
        image: "best-product2.jpg",
        rating: 5.0,
        reviews: 89
    },
    {
        id: 'best-3',
        name: "Hybrid Wood & Metal Bed Frame",
        price: 7499,
        originalPrice: 8999,
        image: "best-product3.jpg",
        rating: 4.0,
        reviews: 67
    },
    {
        id: 'best-4',
        name: "Anti-Gravity Latex Mattress",
        price: 6999,
        originalPrice: 9999,
        image: "best-product4.jpg",
        rating: 5.0,
        reviews: 156
    }
];

// Cart and Wishlist Storage
let cart = JSON.parse(localStorage.getItem('bedly-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('bedly-wishlist')) || [];

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('bedly-cart', JSON.stringify(cart));
    localStorage.setItem('bedly-wishlist', JSON.stringify(wishlist));
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Search functionality
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return products;
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id)) || 
           bestsellers.find(product => product.id === id);
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveToStorage();
    updateCartUI();
    return true;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToStorage();
    updateCartUI();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveToStorage();
            updateCartUI();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Wishlist functions
function addToWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const existingItem = wishlist.find(item => item.id === productId);
    if (existingItem) return false;
    
    wishlist.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image
    });
    
    saveToStorage();
    updateWishlistUI();
    return true;
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveToStorage();
    updateWishlistUI();
}

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

function getWishlistCount() {
    return wishlist.length;
}

// Export for use in other files
window.ProductData = {
    products,
    bestsellers,
    cart,
    wishlist,
    formatCurrency,
    generateStars,
    searchProducts,
    filterProducts,
    getProductById,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    saveToStorage
};