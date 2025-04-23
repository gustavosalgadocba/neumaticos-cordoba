// Configuración de Mercado Pago
const mercadoPagoConfig = {
    publicKey: null,
    mp: null
};

// Función para obtener la Public Key del servidor
async function getPublicKey() {
    try {
        const response = await fetch('/config');
        if (!response.ok) {
            throw new Error('Error al obtener la configuración');
        }
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
        if (!mercadoPagoConfig.publicKey) {
            mercadoPagoConfig.publicKey = await getPublicKey();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.type = "text/javascript";
            
            script.onload = () => {
                try {
                    mercadoPagoConfig.mp = new MercadoPago(mercadoPagoConfig.publicKey, {
                        locale: 'es-AR'
                    });
                    resolve(mercadoPagoConfig.mp);
                } catch (error) {
                    console.error('Error al inicializar MercadoPago:', error);
                    reject(error);
                }
            };

            script.onerror = (error) => {
                console.error('Error al cargar el script de MercadoPago:', error);
                reject(error);
            };

            document.body.appendChild(script);
        });
    } catch (error) {
        console.error('Error en initMercadoPago:', error);
        throw error;
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
        if (!mercadoPagoConfig.mp) {
            await initMercadoPago();
        }

        // Formatear items para Mercado Pago
        const items = cart.map(item => ({
            title: item.brand ? `${item.brand} ${item.name}` : item.name,
            unit_price: cleanPrice(item.price),
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la preferencia de pago');
        }

        const preference = await response.json();
        console.log('Preferencia creada:', preference);

        // Limpiar contenedor anterior si existe
        const container = document.getElementById('mercadopago-wallet');
        if (!container) {
            throw new Error('No se encontró el contenedor para el botón de pago');
        }
        container.innerHTML = '';

        // Crear botón de pago
        const bricksBuilder = mercadoPagoConfig.mp.bricks();
        
        const renderComponent = await bricksBuilder.create("wallet", "mercadopago-wallet", {
            initialization: {
                preferenceId: preference.id
            },
            callbacks: {
                onError: (error) => {
                    console.error('Error en el componente de Mercado Pago:', error);
                    alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
                },
                onReady: () => {
                    console.log('Botón de pago listo');
                }
            }
        });

        return renderComponent;
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        const container = document.getElementById('mercadopago-wallet');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Hubo un error al cargar el método de pago.</p>
                    <button onclick="window.mercadoPagoHandler.processPayment(${JSON.stringify(cart)})">
                        Reintentar
                    </button>
                </div>
            `;
        }
        throw error;
    }
}

// Exportar funciones
window.mercadoPagoHandler = {
    initMercadoPago,
    processPayment
}; 