document.addEventListener('DOMContentLoaded', function () {
    const orderSummaryElement = document.getElementById('order-summary');
    const sendWhatsAppButton = document.getElementById('send-whatsapp');

    // Cargar el resumen del pedido
    function loadOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let summaryHtml = '<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th></tr></thead><tbody>';

        let totalPrice = 0;

        cart.forEach(item => {

            if (!item.quantity || item.quantity < 1) {
                item.quantity = 1;
            }

            const subtotal = item.price * item.quantity;
            summaryHtml += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
            `;
            totalPrice += subtotal;
        });

        summaryHtml += `</tbody></table><div class="total">Precio Total: $${totalPrice.toFixed(2)}</div>`;
        orderSummaryElement.innerHTML = summaryHtml;

        window.totalPrice = totalPrice;
    }

    // Enviar el resumen del carrito y los datos de envío por WhatsApp
    function sendCartByWhatsApp() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Obtener los datos del formulario de envío
        const name = document.getElementById('nombre').value;
        const phone = document.getElementById('telefono').value;
        const email = document.getElementById('correo').value;
        const city = document.getElementById('ciudad').value;
        const street1 = document.getElementById('calle1').value;
        const street2 = document.getElementById('calle2').value;
        const houseNumber = document.getElementById('ncasa').value;

        // Validar que los campos obligatorios no estén vacíos
        if (!name || !phone || !email || !city || !street2 || !houseNumber) {
            alert('Por favor, complete todos los campos obligatorios del formulario de envío.');
            return;  // Detener la ejecución si los campos están vacíos
        }

        // Crear el mensaje del pedido
        let message = 'Resumen del Pedido:\n\n';

        cart.forEach(item => {

            if (!item.quantity || item.quantity < 1) {
                item.quantity = 1;
            }

            const subtotal = item.price * item.quantity;
            message += `${item.name}: ${item.quantity} x $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;
        });

        message += `\nPrecio Total: $${window.totalPrice.toFixed(2)}\n\n`;

        // Agregar los datos de envío al mensaje
        message += 'Datos de Envío:\n';
        message += `Nombre: ${name}\n`;
        message += `Teléfono: ${phone}\n`;
        message += `Correo: ${email}\n`;
        message += `Ciudad: ${city}\n`;
        message += `Calle Principal: ${street1}\n`;
        message += `Calle Secundaria: ${street2}\n`;
        message += `Número de casa: ${houseNumber}\n`;

        // Número de WhatsApp
        const phoneNumber = '593999396274';  // Número de teléfono en formato internacional
        const whatsappMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;

        // Abrir WhatsApp con el mensaje predefinido
        window.open(whatsappUrl, '_blank');
    }

    loadOrderSummary();

    // Añadir el evento al botón de enviar por WhatsApp
    sendWhatsAppButton.addEventListener('click', sendCartByWhatsApp);
});
