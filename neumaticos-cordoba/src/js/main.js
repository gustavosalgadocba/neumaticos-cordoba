// main.js
// Este archivo contiene la lógica principal de la aplicación
// y la interacción con el DOM para mostrar los productos destacados
// y gestionar el carrito de compras.
const featuredProducts = [
    {
        id: 1,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228940,
        size: "205/55R16",
        image: "images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 2,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205151,
        size: "185/65R15",
        image: "images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 3,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243301,
        size: "195/55R16",
        image: "images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    }
];

const featuredAccessories = [
    {
        id: 1001,
        name: "Estéreo Pioneer MVH-S215BT",
        price: 45000,
        image: "images/accessories/stereo-pioneer.jpg",
        description: "Estéreo con Bluetooth, USB y control remoto",
        stock: 5
    },
    {
        id: 1002,
        name: "Kit LED Philips H4",
        price: 28000,
        image: "images/accessories/led-philips.jpg",
        description: "Kit de luces LED 6000K para faros principales",
        stock: 8
    },
    {
        id: 1003,
        name: "Alarma X-28 Z20",
        price: 35000,
        image: "images/accessories/alarma-x28.jpg",
        description: "Alarma volumétrica con sensor de movimiento",
        stock: 6
    }
];

function displayFeaturedItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const isOutOfStock = item.stock <= 0;
        
        container.innerHTML += `
            <div class="product-card" data-product-id="${item.id}">
                <img src="src/${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h4>${item.brand ? `${item.brand} ${item.name}` : item.name}</h4>
                    <p>${item.description}</p>
                    <p class="stock-info ${isOutOfStock ? 'no-stock' : ''}">${isOutOfStock ? 'AGOTADO' : `Stock disponible: ${item.stock}`}</p>
                    <span class="product-price">$${item.price.toLocaleString()}</span>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-product-id="${item.id}" ${isOutOfStock ? 'disabled' : ''}>-</button>
                        <span class="selected-quantity" id="quantity-${item.id}">1</span>
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

    // Agregar event listeners para los botones de cantidad
    container.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            const quantityDisplay = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityDisplay.textContent);
            
            // Encontrar el producto correcto basado en el ID
            const product = [...featuredProducts, ...featuredAccessories].find(p => p.id === productId);
            if (!product) return;

            if (this.classList.contains('plus')) {
                if (currentQuantity < product.stock) {
                    currentQuantity++;
                } else {
                    alert(`Stock máximo disponible: ${product.stock}`);
                }
            } else if (this.classList.contains('minus')) {
                if (currentQuantity > 1) {
                    currentQuantity--;
                }
            }

            quantityDisplay.textContent = currentQuantity;
        });
    });

    // Agregar event listeners para los botones de agregar al carrito
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            const product = [...featuredProducts, ...featuredAccessories].find(p => p.id === productId);
            const quantityDisplay = document.getElementById(`quantity-${productId}`);
            const quantity = parseInt(quantityDisplay.textContent);

            if (product && quantity > 0 && quantity <= product.stock) {
                addToCart(product, quantity);
                // Resetear la cantidad a 1
                quantityDisplay.textContent = '1';
            }
        });
    });
}

function addToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedItems(featuredProducts, 'featured-tires');
    displayFeaturedItems(featuredAccessories, 'featured-accessories');
});