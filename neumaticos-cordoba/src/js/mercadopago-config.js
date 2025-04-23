// Configuración de Mercado Pago
const mercadoPagoConfig = {
    // La Public Key se obtendrá del servidor
    publicKey: '',
};

// Función para obtener la Public Key del servidor
async function getPublicKey() {
    try {
        const response = await fetch('/config');
        const config = await response.json();
        return config.publicKey;
    } catch (error) {
        console.error('Error al obtener la Public Key:', error);
        throw error;
    }
}

// Función para inicializar Mercado Pago
async function initMercadoPago() {
    try {
        // Obtener la Public Key del servidor
        mercadoPagoConfig.publicKey = await getPublicKey();

        const script = document.createElement('script');
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.type = "text/javascript";
        document.body.appendChild(script);

        script.onload = () => {
            window.mp = new MercadoPago(mercadoPagoConfig.publicKey);
        };
    } catch (error) {
        console.error('Error al inicializar Mercado Pago:', error);
        alert('Error al inicializar el sistema de pagos. Por favor, recarga la página.');
    }
}

// Función para limpiar el precio
function cleanPrice(price) {
    if (typeof price === 'string') {
        // Remover símbolos de moneda, puntos y espacios
        return Number(price.replace(/[^\d,]/g, '').replace(',', '.'));
    }
    return Number(price);
}

// Función para procesar el pago
async function processPayment(cart) {
    try {
        // Formatear items para Mercado Pago
        const items = cart.map(item => ({
            title: item.brand ? `${item.brand} ${item.name}` : item.name,
            unit_price: Number(item.price.toString().replace(/[^\d]/g, '')),
            quantity: Number(item.quantity) || 1,
            currency_id: "ARS"
        }));

        console.log('Items formateados:', items);

        // Crear preferencia de pago
        const response = await fetch('/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items })
        });

        if (!response.ok) {
            throw new Error('Error al crear la preferencia de pago');
        }

        const preference = await response.json();
        console.log('Preferencia creada:', preference);

        // Limpiar contenedor anterior si existe
        const container = document.getElementById('mercadopago-wallet');
        container.innerHTML = '';

        // Crear botón de pago
        const bricksBuilder = window.mp.bricks();
        
        await bricksBuilder.create("wallet", "mercadopago-wallet", {
            initialization: {
                preferenceId: preference.id
            }
        });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
    }
}

// Exportar funciones
window.mercadoPagoHandler = {
    initMercadoPago,
    processPayment
}; 