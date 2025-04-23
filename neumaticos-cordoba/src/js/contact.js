document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    // Aquí normalmente enviarías los datos al servidor
    // Por ahora solo mostraremos un mensaje de éxito
    alert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
    
    // Limpiar el formulario
    this.reset();
});

// Validación básica del formulario
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (nameInput.value.length < 3) {
        alert('Por favor ingrese un nombre válido');
        return false;
    }
    
    if (!emailRegex.test(emailInput.value)) {
        alert('Por favor ingrese un email válido');
        return false;
    }
    
    if (messageInput.value.length < 10) {
        alert('Por favor ingrese un mensaje más detallado');
        return false;
    }
    
    return true;
}

// Event Listener para validación
document.getElementById('contact-form').addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
    }
});