require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago con el Access Token desde .env
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// Servir archivos estáticos desde la carpeta neumaticos-cordoba/src
app.use('/src', express.static(path.join(__dirname, 'neumaticos-cordoba/src')));
app.use(express.static(path.join(__dirname, 'neumaticos-cordoba')));

// Endpoint para obtener la configuración pública
app.get('/config', (req, res) => {
    res.json({
        publicKey: process.env.MERCADOPAGO_PUBLIC_KEY
    });
});

// Endpoint para crear preferencia de pago
app.post('/create-preference', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Se requiere un array de items válido' 
            });
        }

        // Formatear items según la documentación de Mercado Pago
        const formattedItems = items.map(item => ({
            title: String(item.title),
            quantity: parseInt(item.quantity),
            unit_price: parseFloat(item.unit_price),
            currency_id: "ARS"
        }));

        const preferenceData = {
            items: formattedItems,
            payment_methods: {
                excluded_payment_types: [
                    { id: "ticket" }
                ],
                installments: 12
            },
            back_urls: {
                success: "https://neumaticos-cordoba.onrender.com/success.html",
                failure: "https://neumaticos-cordoba.onrender.com/failure.html",
                pending: "https://neumaticos-cordoba.onrender.com/pending.html"
            },
            notification_url: "https://neumaticos-cordoba.onrender.com/webhook"
        };

        console.log('Preferencia a enviar:', JSON.stringify(preferenceData, null, 2));

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceData });
        
        console.log('Respuesta de MP:', JSON.stringify(result, null, 2));
        
        res.json({ id: result.id });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            error: 'Error al crear la preferencia de pago',
            details: error.message,
            cause: error.cause
        });
    }
});

// Webhook para notificaciones de Mercado Pago
app.post('/webhook', async (req, res) => {
    console.log('Webhook recibido:', req.body);
    res.status(200).send('OK');
});

// Rutas para manejar los diferentes estados del pago
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'neumaticos-cordoba/src/pages/success.html'));
});

app.get('/failure.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'neumaticos-cordoba/src/pages/failure.html'));
});

app.get('/pending.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'neumaticos-cordoba/src/pages/pending.html'));
});

// Ruta para el index y otras páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'neumaticos-cordoba/index.html'));
});

app.get('/pages/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'neumaticos-cordoba/src', req.path));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
}); 