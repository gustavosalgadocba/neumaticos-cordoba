// Configuración de Mercado Pago
const mercadoPagoConfig = {
    publicKey: null,
    mp: null
};

// Función para obtener la Public Key del servidor
async function getPublicKey() {
    try {
        const response = await fetch('http://localhost:3000/config');
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

        console.log('Items a procesar:', items);

        // Crear preferencia de pago
        const response = await fetch('http://localhost:3000/create-preference', {
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
        console.log('Preferencia recibida:', preference);

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
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.innerHTML = `
                        <p>Hubo un error al procesar el pago. Por favor, intente nuevamente.</p>
                        <button onclick="location.reload()">Reintentar</button>
                    `;
                    container.appendChild(errorDiv);
                },
                onReady: () => {
                    console.log('Botón de pago listo');
                    // Ocultar el botón de "Proceder al Pago"
                    const paymentButton = document.getElementById('proceed-to-payment');
                    if (paymentButton) {
                        paymentButton.style.display = 'none';
                    }
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
                    <p>Hubo un error al cargar el método de pago: ${error.message}</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
        // Mostrar el botón de pago nuevamente en caso de error
        const paymentButton = document.getElementById('proceed-to-payment');
        if (paymentButton) {
            paymentButton.style.display = 'block';
            paymentButton.disabled = false;
        }
        throw error;
    }
}

// Exportar funciones
window.mercadoPagoHandler = {
    initMercadoPago,
    processPayment
}; 