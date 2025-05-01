document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    setupEventListeners();
});

function formatPrice(price) {
    const numPrice = typeof price === 'string' ? 
        parseFloat(price.replace(/\./g, '').replace(',', '.')) : 
        parseFloat(price);
    
    if (isNaN(numPrice)) return '0,00';
    
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(numPrice);
}

function getImagePath(imagePath) {
    if (!imagePath) return '../images/default-product.jpg';
    
    // Normalizar la ruta de la imagen
    if (imagePath.startsWith('src/')) {
        return `../../${imagePath}`;
    } else if (imagePath.startsWith('../')) {
        return `../${imagePath}`;
    } else if (imagePath.startsWith('./')) {
        return `../../src/${imagePath.substring(2)}`;
    } else {
        return `../../src/${imagePath}`;
    }
}

function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        updateCartTotal(0);
        return;
    }

    cartContainer.innerHTML = cart.map(item => {
        const itemPrice = parseFloat(String(item.price).replace(/\./g, '').replace(',', '.'));
        const itemTotal = itemPrice * item.quantity;
        const imagePath = getImagePath(item.image);
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${imagePath}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.brand ? `${item.brand} ${item.name}` : item.name}</h3>
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
    
    cartContainer.addEventListener('click', async (e) => {
        const button = e.target;
        if (!button.classList.contains('quantity-btn') && !button.classList.contains('remove-item')) return;
        
        const cartItem = button.closest('.cart-item');
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        const action = button.dataset.action;

        switch (action) {
            case 'increase':
                await updateQuantity(itemId, 1);
                break;
            case 'decrease':
                await updateQuantity(itemId, -1);
                break;
            case 'remove':
                await removeItem(itemId);
                break;
        }
    });

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

async function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id.toString() === itemId.toString());
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        
        // Limpiar el contenedor de Mercado Pago
        const mpContainer = document.getElementById('mercadopago-wallet');
        if (mpContainer) {
            mpContainer.innerHTML = '';
        }
        
        // Mostrar el botón de pago nuevamente
        const paymentButton = document.getElementById('proceed-to-payment');
        if (paymentButton) {
            paymentButton.style.display = 'block';
            paymentButton.disabled = false;
            paymentButton.textContent = 'Proceder al Pago';
        }
    }
}

async function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id.toString() !== itemId.toString());
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    
    // Limpiar el contenedor de Mercado Pago
    const mpContainer = document.getElementById('mercadopago-wallet');
    if (mpContainer) {
        mpContainer.innerHTML = '';
    }
    
    // Mostrar el botón de pago nuevamente si hay items en el carrito
    const paymentButton = document.getElementById('proceed-to-payment');
    if (paymentButton) {
        if (cart.length > 0) {
            paymentButton.style.display = 'block';
            paymentButton.disabled = false;
            paymentButton.textContent = 'Proceder al Pago';
        } else {
            paymentButton.style.display = 'none';
        }
    }
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

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">No hay productos en el carrito</div>';
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