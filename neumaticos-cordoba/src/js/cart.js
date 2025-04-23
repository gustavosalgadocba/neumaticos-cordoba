document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    setupEventListeners();
});

function formatPrice(price) {
    // Convert price to number and ensure it's valid
    const numPrice = typeof price === 'string' ? 
        parseFloat(price.replace(/\./g, '').replace(',', '.')) : 
        parseFloat(price);
    
    if (isNaN(numPrice)) return '0,00';
    
    // Format with Argentine format (dot for thousands, comma for decimals)
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(numPrice);
}

function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        updateCartTotal(0);
        return;
    }

    cartContainer.innerHTML = cart.map(item => {
        const itemPrice = parseFloat(String(item.price).replace(/\./g, '').replace(',', '.'));
        const itemTotal = itemPrice * item.quantity;
        
        // Ajustar la ruta de la imagen para la página del carrito
        const imagePath = getImagePath(item.image);
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${imagePath}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">Precio: $${formatPrice(itemPrice)}</p>
                    <p class="item-subtotal">Subtotal: $${formatPrice(itemTotal)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-action="increase">+</button>
                </div>
                <button class="remove-item" data-action="remove">&times;</button>
            </div>
        `;
    }).join('');

    updateCartTotal(calculateTotal(cart));
}

function setupEventListeners() {
    const cartContainer = document.getElementById('cart-items');
    
    cartContainer.addEventListener('click', (e) => {
        const button = e.target;
        if (!button.classList.contains('quantity-btn') && !button.classList.contains('remove-item')) return;
        
        const cartItem = button.closest('.cart-item');
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        const action = button.dataset.action;

        switch (action) {
            case 'increase':
                updateQuantity(itemId, 1);
                break;
            case 'decrease':
                updateQuantity(itemId, -1);
                break;
            case 'remove':
                removeItem(itemId);
                break;
        }
    });

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id.toString() === itemId.toString());
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart = cart.filter(item => item.id.toString() !== itemId.toString());
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartWidget(); // Si tienes una función que actualiza el widget del carrito
    }
}

function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id.toString() !== itemId.toString());
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartWidget(); // Si tienes una función que actualiza el widget del carrito
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => {
        const price = parseFloat(String(item.price).replace(/\./g, '').replace(',', '.'));
        return total + (price * item.quantity);
    }, 0);
}

function updateCartTotal(total) {
    const subtotalElement = document.getElementById('subtotal-amount');
    const totalElement = document.getElementById('total-amount');
    
    if (subtotalElement && totalElement) {
        const formattedTotal = formatPrice(total);
        subtotalElement.textContent = `$${formattedTotal}`;
        totalElement.textContent = `$${formattedTotal}`;
    }
}

function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí puedes agregar la lógica de checkout
    alert('¡Gracias por tu compra!');
    localStorage.removeItem('cart');
    displayCartItems();
    updateCartWidget();
}

// Función auxiliar para actualizar el widget del carrito
function updateCartWidget() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.getElementById('cart-items-widget');
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Calcular total correctamente
    const total = cart.reduce((sum, item) => {
        // Asegurarnos de que price y quantity sean números enteros
        const itemPrice = parseInt(item.price);
        const itemQuantity = parseInt(item.quantity);
        return sum + (itemPrice * itemQuantity);
    }, 0);

    // Formatear el total
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    
    // Actualizar items del carrito
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = parseInt(item.price) * parseInt(item.quantity);
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.brand} ${item.model}">
                <div class="cart-item-info">
                    <p>${item.brand} ${item.model}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>$${itemTotal.toLocaleString('es-AR')}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Función para obtener la ruta correcta de la imagen
function getImagePath(imagePath) {
    // Si la ruta ya comienza con /src/, la dejamos como está
    if (imagePath.startsWith('/src/')) {
        return imagePath;
    }
    // Si no, agregamos el prefijo /src/
    return `/src/${imagePath}`;
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">No hay productos en el carrito</p>';
        updateTotals();
        return;
    }

    const cartHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${getImagePath(item.image)}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.brand ? `${item.brand} ${item.name}` : item.name}</h3>
                <p class="cart-item-price">Precio: $${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
                <p class="subtotal">Subtotal: $${formatPrice(item.price * item.quantity)}</p>
            </div>
        </div>
    `).join('');

    cartContainer.innerHTML = cartHTML;
    updateTotals();
    attachCartEventListeners();
}