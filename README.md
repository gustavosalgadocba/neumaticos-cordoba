# Neumáticos Córdoba

Tienda online de neumáticos con integración de Mercado Pago.

## Requisitos

- Node.js >= 14.0.0
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env con las siguientes variables:
```
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key
PORT=3000
```

4. Iniciar el servidor:
```bash
npm start
```

## Despliegue

### Render
1. Crear cuenta en [Render](https://render.com)
2. Conectar con GitHub
3. Crear nuevo Web Service
4. Seleccionar el repositorio
5. Configurar:
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Agregar variables de entorno:
   - MERCADOPAGO_ACCESS_TOKEN
   - MERCADOPAGO_PUBLIC_KEY

### Railway
1. Crear cuenta en [Railway](https://railway.app)
2. Conectar con GitHub
3. Seleccionar el repositorio
4. Agregar variables de entorno
5. Deploy automático

## Tecnologías utilizadas

- Node.js
- Express
- Mercado Pago API
- HTML/CSS
- JavaScript 