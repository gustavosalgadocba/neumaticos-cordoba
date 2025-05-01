require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago con el Access Token desde .env
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Servir archivos estáticos
app.use(express.static('src'));

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
            return res.status(400).json({ error: 'Items inválidos' });
        }

        console.log('Creando preferencia para items:', items);
        
        const baseURL = process.env.NODE_ENV === 'production' 
            ? 'https://tu-dominio.com'
            : `http://localhost:${process.env.PORT || 3000}`;

        const preference = {
            items: items,
            back_urls: {
                success: `${baseURL}/pages/success.html`,
                failure: `${baseURL}/pages/failure.html`,
                pending: `${baseURL}/pages/pending.html`
            },
            notification_url: `${baseURL}/webhook`,
            binary_mode: true,
        };

        console.log('Preferencia a crear:', preference);

        const response = await mercadopago.preferences.create(preference);
        console.log('Preferencia creada:', response.body);
        
        res.json({
            id: response.body.id,
            init_point: response.body.init_point
        });
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        res.status(500).json({ 
            error: 'Error al crear la preferencia de pago',
            details: error.message 
        });
    }
});

// Webhook para notificaciones de Mercado Pago
app.post('/webhook', async (req, res) => {
    try {
        const payment = req.query;
        console.log('Notificación de pago recibida:', payment);
        
        if (payment.type === 'payment') {
            const paymentInfo = await mercadopago.payment.findById(payment['data.id']);
            console.log('Información del pago:', paymentInfo);
        }
        
        res.sendStatus(200);
    } catch (error) {
        console.error('Error en webhook:', error);
        res.sendStatus(500);
    }
});

// Rutas para manejar los diferentes estados del pago
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'success.html'));
});

app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'failure.html'));
});

app.get('/pending', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'pending.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    console.log(`URL base: http://localhost:${PORT}`);
}); 