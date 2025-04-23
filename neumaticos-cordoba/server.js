require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

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
        
        const preference = {
            items: items,
            back_urls: {
                success: `${process.env.NODE_ENV === 'production' ? 'https://tu-dominio.com' : 'http://localhost:' + process.env.PORT}/success`,
                failure: `${process.env.NODE_ENV === 'production' ? 'https://tu-dominio.com' : 'http://localhost:' + process.env.PORT}/failure`,
                pending: `${process.env.NODE_ENV === 'production' ? 'https://tu-dominio.com' : 'http://localhost:' + process.env.PORT}/pending`
            },
            auto_return: "approved",
            binary_mode: true,
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago' });
    }
});

// Rutas para manejar los diferentes estados del pago
app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/src/pages/success.html');
});

app.get('/failure', (req, res) => {
    res.sendFile(__dirname + '/src/pages/failure.html');
});

app.get('/pending', (req, res) => {
    res.sendFile(__dirname + '/src/pages/pending.html');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
}); 