document.addEventListener('DOMContentLoaded', function () {
    function addToCart(productId, productName, productPrice) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const product = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice)
        };
        cart.push(product);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        showFloatingAlert('Producto añadido al carrito');
    }

    function showFloatingAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.bottom = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.padding = '10px 20px';
        alertDiv.style.backgroundColor = '#904997';
        alertDiv.style.color = '#fff';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.opacity = '1';
        alertDiv.style.transition = 'opacity 0.5s ease-out';

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 500);
        }, 2000);
    }

    // Adaptar para extraer el nombre y el precio desde las etiquetas <h5> y <h6>
    document.querySelectorAll('.option1').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const productBox = this.closest('.box'); // Encuentra el contenedor del producto

            const productId = Date.now(); // Generar un ID único basado en el timestamp
            const productName = productBox.querySelector('h5').textContent; // Obtener el nombre del producto desde <h5>
            const productPrice = productBox.querySelector('h6.price').textContent.replace('$', ''); // Obtener el precio desde <h6> y eliminar el $

            addToCart(productId, productName, productPrice); // Llamar a la función addToCart
        });
    });
});
