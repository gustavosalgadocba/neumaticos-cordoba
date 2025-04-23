const accessories = [
    {
        id: 1001,
        name: "Estéreo Pioneer MVH-S215BT",
        category: "audio",
        price: 45000,
        image: "../images/accessories/stereo-pioneer.jpg",
        description: "Estéreo con Bluetooth, USB y control remoto",
        stock: 5
    },
    {
        id: 1002,
        name: "Kit LED Philips H4",
        category: "iluminacion",
        price: 28012,
        image: "../images/accessories/led-philips.jpg",
        description: "Kit de luces LED 6000K para faros principales",
        stock: 8
    },
    {
        id: 1003,
        name: "Alarma X-28 Z20",
        category: "seguridad",
        price: 35000,
        image: "../images/accessories/alarma-x28.jpg",
        description: "Alarma volumétrica con sensor de movimiento",
        stock: 6
    },
    {
        id: 1004,
        name: "Kit Limpieza 3M",
        category: "limpieza",
        price: 12000,
        image: "../images/accessories/kit-3m.jpg",
        description: "Kit completo de limpieza interior y exterior",
        stock: 10
    },
    {
        id: 1005,
        name: "Parlantes 6x9 Sony",
        category: "audio",
        price: 32000,
        image: "../images/accessories/parlantes-sony.jpg",
        description: "Parlantes coaxiales de 400W",
        stock: 4
    }
];

function displayAccessories(filtered = accessories) {
    const container = document.getElementById('accessories-container');
    container.innerHTML = '';

    filtered.forEach(item => {
        // Verificar si hay stock disponible
        const isOutOfStock = item.stock <= 0;
        
        container.innerHTML += `
            <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}">
                <img src="${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <p class="stock-info ${isOutOfStock ? 'no-stock' : ''}">${isOutOfStock ? 'AGOTADO' : `Stock disponible: ${item.stock}`}</p>
                    <span class="product-price">$${parseInt(item.price).toLocaleString('es-AR')}</span>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-product-id="${item.id}" ${isOutOfStock ? 'disabled' : ''}>-</button>
                        <span class="selected-quantity" id="quantity-${item.id}" data-product-id="${item.id}">0</span>
                        <button class="quantity-btn plus" data-product-id="${item.id}" ${isOutOfStock ? 'disabled' : ''}>+</button>
                    </div>
                    <button class="cta-button add-to-cart" 
                            data-product-id="${item.id}"
                            ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        `;
    });

    // Manejador para botones + y -
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            const product = accessories.find(p => p.id === productId);
            const quantityDisplay = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityDisplay.textContent);

            // Obtener la cantidad actual en el carrito para este producto
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === productId);
            const cartQuantity = cartItem ? cartItem.quantity : 0;

            if (this.classList.contains('plus')) {
                // Verificar que la suma de la cantidad actual y la del carrito no exceda el stock
                if (currentQuantity + cartQuantity < product.stock) {
                    currentQuantity++;
                } else {
                    alert(`No se pueden agregar más unidades. Stock disponible: ${product.stock - cartQuantity}`);
                }
            } else if (this.classList.contains('minus')) {
                if (currentQuantity > 0) {
                    currentQuantity--;
                }
            }

            quantityDisplay.textContent = currentQuantity;
        });
    });

    // Manejador para agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            const product = accessories.find(p => p.id === productId);
            const quantityDisplay = document.getElementById(`quantity-${productId}`);
            const selectedQuantity = parseInt(quantityDisplay.textContent);

            if (selectedQuantity === 0) {
                alert('Por favor seleccione una cantidad');
                return;
            }

            // Verificar el stock considerando lo que ya está en el carrito
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === productId);
            const cartQuantity = cartItem ? cartItem.quantity : 0;

            if (selectedQuantity + cartQuantity <= product.stock) {
                addToCart(product, selectedQuantity);
                // Resetear el contador después de agregar al carrito
                quantityDisplay.textContent = '0';
            } else {
                alert(`No hay suficiente stock. Stock disponible: ${product.stock - cartQuantity}`);
            }
        });
    });
}

function filterAccessories() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;

    let filtered = [...accessories];

    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (priceFilter === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayAccessories(filtered);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayAccessories();
    
    // Agregar listeners para los filtros
    document.getElementById('category-filter').addEventListener('change', filterAccessories);
    document.getElementById('price-filter').addEventListener('change', filterAccessories);
});

function addToCart(product, quantity) {
    // Validar que la cantidad no exceda el stock disponible
    if (quantity > product.stock) {
        alert(`No hay suficiente stock. Stock disponible: ${product.stock}`);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // Verificar que la nueva cantidad total no exceda el stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
            existingItem.quantity = parseInt(newQuantity);
        } else {
            alert(`No se puede agregar más de ${product.stock} unidades de este producto. Ya tienes ${existingItem.quantity} en el carrito.`);
            return;
        }
    } else {
        cart.push({
            ...product,
            price: parseInt(product.price), // Asegurar que el precio sea un entero
            quantity: parseInt(quantity)
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    const message = `Se ${quantity === 1 ? 'agregó' : 'agregaron'} ${quantity} ${product.name} al carrito`;
    alert(message);
}