const products = [
    {
        id: 1,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228900, // Asegurar que sea número entero sin puntos decimales
        size: "205/55R16",
        image: "images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 2,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205150, // Removido el punto decimal
        size: "185/65R15",
        image: "images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 3,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243001, // Removido el punto decimal
        size: "195/55R16",
        image: "images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },
    {
        id: 4,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228940, // Removido el punto decimal
        size: "205/55R16",
        image: "images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 5,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205151, // Removido el punto decimal
        size: "185/65R15",
        image: "images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 6,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243002, // Removido el punto decimal
        size: "195/55R16",
        image: "images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },
    {
        id: 7,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228950, // Removido el punto decimal
        size: "205/55R16",
        image: "images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 8,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205151, // Removido el punto decimal
        size: "185/65R15",
        image: "images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 9,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243003, // Removido el punto decimal
        size: "195/55R16",
        image: "images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },

    // ...otros productos
];

function initializeFilters() {
    const brands = [...new Set(products.map(p => p.brand))];
    const sizes = [...new Set(products.map(p => p.size))];
    
    const brandFilter = document.getElementById('brand-filter');
    const sizeFilter = document.getElementById('size-filter');
    
    brands.forEach(brand => {
        brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
    
    sizes.forEach(size => {
        sizeFilter.innerHTML += `<option value="${size}">${size}</option>`;
    });
}

function filterProducts() {
    const brandFilter = document.getElementById('brand-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    let filteredProducts = [...products];
    
    if (brandFilter) {
        filteredProducts = filteredProducts.filter(p => p.brand === brandFilter);
    }
    
    if (sizeFilter) {
        filteredProducts = filteredProducts.filter(p => p.size === sizeFilter);
    }
    
    if (priceFilter === 'low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        container.innerHTML += createProductCard(product);
    });

    // Agregar event listeners para los botones + y -
    addQuantityControlListeners();
}

function createProductCard(product) {
    const imagePath = window.location.pathname.includes('/pages/') ? 
        `../${product.image}` : 
        `src/${product.image}`;

    return `
        <div class="product-card">
            <img src="${imagePath}" alt="${product.brand} ${product.name}">
            <div class="product-info">
                <h3>${product.brand}</h3>
                <p class="product-model">${product.name}</p>
                <p class="product-size">${product.size}</p>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <button class="details-button" onclick="showProductDetails('${product.id}')">Ver Detalles</button>
            </div>
        </div>
    `;
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        console.error('Producto no encontrado');
        return;
    }

    const modal = document.getElementById('product-modal');
    
    // Ajustar la ruta de la imagen según la ubicación
    const imagePath = window.location.pathname.includes('/pages/') ? 
        `../${product.image}` : 
        `src/${product.image}`;
    
    // Actualizar contenido del modal
    document.getElementById('modal-image').src = imagePath;
    document.getElementById('modal-title').textContent = product.brand + ' ' + product.name;
    document.getElementById('modal-brand').textContent = product.brand;
    document.getElementById('modal-model').textContent = product.name;
    document.getElementById('modal-size').textContent = product.size;
    document.getElementById('modal-category').textContent = "neumáticos";
    document.getElementById('modal-price').textContent = `$${product.price.toLocaleString()}`;
    document.getElementById('modal-stock').textContent = `${product.stock} unidades disponibles`;
    document.getElementById('modal-description').textContent = product.description;
    
    // Establecer el máximo del input de cantidad según el stock disponible
    const quantityInput = document.getElementById('quantity');
    quantityInput.max = product.stock;
    quantityInput.value = 1;
    document.getElementById('stock-available').textContent = `Máximo: ${product.stock} unidades`;

    // Configurar el botón de agregar al carrito
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(product, quantity);
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

// Función para agregar al carrito
function addToCart(product, quantity = 1) {
    // Verificar que quantity sea un número válido
    quantity = parseInt(quantity) || 1;
    
    // Obtener el producto original para verificar el stock disponible
    const originalProduct = products.find(p => p.id === product.id);
    if (!originalProduct) {
        showNotification('Producto no encontrado');
        return;
    }
    
    // Verificar el stock disponible
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    
    // Calcular la cantidad total que tendría el producto en el carrito
    const currentQuantity = existingProduct ? existingProduct.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    // Verificar si hay suficiente stock
    if (newTotalQuantity > originalProduct.stock) {
        showNotification(`Solo hay ${originalProduct.stock} unidades disponibles`);
        return;
    }
    
    // Actualizar el carrito
    if (existingProduct) {
        existingProduct.quantity = newTotalQuantity;
    } else {
        // Asegurarse de que el precio se guarde como string con el formato correcto
        const formattedPrice = String(product.price).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: formattedPrice,
            image: product.image, // Guardar la ruta relativa base
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartWidget();
    showNotification(`${quantity} ${product.name} agregado(s) al carrito`);
}

function updateCartWidget() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calcular total asegurando que todos los números sean enteros
    const total = cart.reduce((sum, item) => {
        const itemPrice = parseInt(item.price.replace(/\./g, ''));
        const itemQuantity = parseInt(item.quantity);
        return sum + (itemPrice * itemQuantity);
    }, 0);

    // Actualizar el total en el widget
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    
    // Actualizar contador de items
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function getCurrentQuantityInCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}

function updateProductQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    
    // Obtener cantidad actual
    const currentQuantity = cartItemIndex >= 0 ? cart[cartItemIndex].quantity : 0;
    const newQuantity = currentQuantity + change;
    
    // Validar límites
    if (newQuantity < 0) return;
    if (newQuantity > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles`);
        return;
    }
    
    // Actualizar carrito
    if (newQuantity === 0 && cartItemIndex >= 0) {
        cart.splice(cartItemIndex, 1);
    } else if (cartItemIndex >= 0) {
        cart[cartItemIndex].quantity = newQuantity;
    } else if (newQuantity > 0) {
        cart.push({...product, quantity: newQuantity});
    }
    
    // Guardar cambios
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar display
    updateQuantityDisplay(productId, newQuantity);
    
    // Disparar evento para actualizar widget del carrito
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function updateQuantityDisplay(productId, quantity) {
    const quantitySpan = document.querySelector(`.quantity[data-product-id="${productId}"]`);
    if (quantitySpan) {
        quantitySpan.textContent = quantity;
    }
}

function addQuantityControlListeners() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const change = this.classList.contains('minus') ? -1 : 1;
            updateProductQuantity(productId, change);
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cerrar modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (event) => {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Manejo de cantidad
document.getElementById('increase').addEventListener('click', () => {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    } else {
        showNotification(`Solo hay ${maxValue} unidades disponibles`);
    }
});

document.getElementById('decrease').addEventListener('click', () => {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
});

// Validar el input de cantidad cuando el usuario escribe directamente
document.getElementById('quantity').addEventListener('change', (e) => {
    const input = e.target;
    let value = parseInt(input.value);
    const max = parseInt(input.max);
    
    // Asegurarse de que el valor sea un número válido
    if (isNaN(value) || value < 1) {
        value = 1;
    } 
    // Asegurarse de que no exceda el stock disponible
    else if (value > max) {
        value = max;
        showNotification(`Solo hay ${max} unidades disponibles`);
    }
    
    input.value = value;
});

// Asegurarse de que el carrito esté visible
document.addEventListener('DOMContentLoaded', () => {
    // Agregar el widget del carrito si no existe
    if (!document.getElementById('cart-widget')) {
        const cartWidget = `
            <div id="cart-widget" class="cart-widget">
                <div class="cart-icon">
                    🛒 <span id="cart-count">0</span>
                </div>
                <div class="cart-content">
                    <h3>Carrito de Compras</h3>
                    <div id="cart-items-widget"></div>
                    <div class="cart-total">
                        Total: <span id="cart-total">$0</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartWidget);
    }
    
    // Inicializar filtros y mostrar productos
    initializeFilters();
    displayProducts(products);
    updateCartWidget();
});

['brand-filter', 'size-filter', 'price-filter'].forEach(id => {
    document.getElementById(id).addEventListener('change', filterProducts);
});