// Formatear precio a moneda local
export function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
}

// Guardar en localStorage
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Obtener de localStorage
export function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Validar stock
export function checkStock(productId, quantity) {
    const product = getProductById(productId);
    return product && product.stock >= quantity;
}

// Mostrar mensaje de notificación
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Validar número de teléfono argentino
export function validarTelefono(telefono) {
    const regexTelefono = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
    return regexTelefono.test(telefono);
}

// Calcular cuotas
export function calcularCuotas(precio, numeroCuotas) {
    const interes = {
        3: 1.15,  // 15% de interés
        6: 1.25,  // 25% de interés
        12: 1.40  // 40% de interés
    };
    
    const precioFinal = precio * (interes[numeroCuotas] || 1);
    return precioFinal / numeroCuotas;
}

// Validar código postal de Córdoba
export function validarCodigoPostalCordoba(cp) {
    // Códigos postales de Córdoba: 5000-5999
    return /^5[0-9]{3}$/.test(cp);
}