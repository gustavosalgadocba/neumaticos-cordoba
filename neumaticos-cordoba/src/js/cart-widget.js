// Add this function at the top of your file
function showNotification(message) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add this function to create the cart widget
function createCartWidget() {
    // Check if widget already exists
    if (document.getElementById('cart-widget')) return;

    const cartWidget = document.createElement('div');
    cartWidget.id = 'cart-widget';
    cartWidget.className = 'cart-widget';
    
    // Get current page path to adjust navigation
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    const cartPath = isInPagesDirectory ? 'cart.html' : 'src/pages/cart.html';
    
    cartWidget.innerHTML = `
        <div class="cart-icon">
            🛒 <span id="cart-count">0</span>
        </div>
        <div class="cart-content">
            <h3>Carrito de Compras</h3>
            <div id="cart-items-widget"></div>
            <div class="cart-total">
                Total: <span id="cart-total">$0,00</span>
            </div>
            <button onclick="window.location.href='${cartPath}'" class="view-cart-btn">Ver Carrito</button>
        </div>
    `;

    document.body.appendChild(cartWidget);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-widget');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update cart items display
    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">No hay productos en el carrito</p>';
        cartTotal.textContent = '$0,00';
        return;
    }

    // Generate HTML for cart items
    const itemsHtml = cart.map(item => {
        // Obtener la ruta base del sitio
        const baseUrl = window.location.pathname.includes('/src/') ? '../../' : './';
        const imagePath = `${baseUrl}src/${item.image}`;

        // Procesar el precio correctamente
        let price;
        if (typeof item.price === 'string') {
            // Remover el símbolo de peso y espacios
            const cleanPrice = item.price.replace(/[$\s]/g, '');
            // Convertir a número manteniendo los puntos como separadores de miles
            price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.'));
        } else {
            price = parseFloat(item.price);
        }

        const subtotal = price * item.quantity;

        // Formatear los precios para mostrar
        const formattedPrice = formatPrice(price);
        const formattedSubtotal = formatPrice(subtotal);

        return `
            <div class="cart-item-mini">
                <img src="${imagePath}" alt="${item.name}" class="cart-item-image-mini">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.brand ? `${item.brand} ${item.name}` : item.name}</p>
                    <p class="cart-item-price">$${formattedPrice} x ${item.quantity}</p>
                    <p class="cart-item-subtotal">Subtotal: $${formattedSubtotal}</p>
                </div>
            </div>
        `;
    }).join('');

    // Update DOM
    cartItemsContainer.innerHTML = itemsHtml;

    // Calculate and update total
    const total = cart.reduce((sum, item) => {
        let price;
        if (typeof item.price === 'string') {
            const cleanPrice = item.price.replace(/[$\s]/g, '');
            price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.'));
        } else {
            price = parseFloat(item.price);
        }
        return sum + (price * item.quantity);
    }, 0);
    
    cartTotal.textContent = `$${formatPrice(total)}`;

    // Show the cart content
    const cartContent = document.querySelector('.cart-content');
    if (cartContent && !cartContent.classList.contains('show')) {
        cartContent.classList.add('show');
        setTimeout(() => cartContent.classList.remove('show'), 3000);
    }
}

function formatPrice(price) {
    // Asegurarse de que el precio sea un número
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(numPrice);
}

// Función para depurar el precio
function cleanPrice(price) {
    if (typeof price === 'string') {
        // Eliminar el símbolo $, espacios y convertir comas en puntos
        return parseFloat(price.replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.'));
    }
    return parseFloat(price);
}

// Initialize cart widget and set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Create cart widget
    createCartWidget();
    updateCartDisplay();

    // Listen for cart icon clicks
    document.body.addEventListener('click', function(e) {
        const cartIcon = e.target.closest('.cart-icon');
        if (cartIcon) {
            e.stopPropagation();
            const cartContent = document.querySelector('.cart-content');
            if (cartContent) {
                cartContent.classList.toggle('show');
                updateCartDisplay();
            }
        }
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cart-content') && !e.target.closest('.cart-icon')) {
            const cartContent = document.querySelector('.cart-content.show');
            if (cartContent) {
                cartContent.classList.remove('show');
            }
        }
    });

    // Listen for storage changes for cross-tab updates
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartDisplay();
        }
    });

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', () => {
        updateCartDisplay();
    });
});

// Make addToCart globally available
window.addToCart = function(product, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Asegurarse de que el precio esté en el formato correcto antes de guardarlo
    const cleanedPrice = cleanPrice(product.price);
    
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            ...product,
            price: cleanedPrice, // Guardar el precio limpio
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update displays and show notification
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`);

    // Show the cart dropdown after adding
    const cartContent = document.querySelector('.cart-content');
    if (cartContent) {
        cartContent.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            cartContent.classList.remove('show');
        }, 3000);
    }
    
    // Dispatch event for cross-page updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
};