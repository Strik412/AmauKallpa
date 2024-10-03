document.addEventListener('DOMContentLoaded', function () {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    function showAlert(message) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertElement = document.createElement('div');
        alertElement.className = 'alert alert-danger';
        alertElement.textContent = message;
        document.body.insertBefore(alertElement, document.body.firstChild);

        setTimeout(() => {
            alertElement.remove();
        }, 3000);
    }

    function updateCart() {
        cartTableBody.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const row = document.createElement('tr');
            const subtotal = item.price * item.quantity;
            row.innerHTML = `
                <td>${item.name}</td>
                <td><input type="number" class="quantity-input" data-product-id="${item.id}" value="${item.quantity}" min="1"></td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="remove-item" data-product-id="${item.id}">Eliminar</button></td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += subtotal;
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    function addToCart(event) {
        const button = event.target;
        const productId = button.getAttribute('data-product-id');
        const productContainer = button.closest('.box');
        const productName = productContainer.querySelector('.detail-box h5').textContent;
        const productPrice = parseFloat(productContainer.querySelector('.detail-box h6').textContent.replace('$', ''));

        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function removeFromCart(event) {
        const productId = event.target.getAttribute('data-product-id');
        cart = cart.filter(item => item.id !== productId);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function clearCart() {
        sessionStorage.removeItem('cart');
        cart = []; // Actualizar la variable cart
        updateCart(); // Actualizar la interfaz después de vaciar el carrito
    }

    function checkout() {
        if (cart.length === 0) {
            showAlert('Tu carrito está vacío. No puedes proceder al pago.');
            return;
        }

        window.location.href = 'pago.html';
    }

    function updateQuantity(event) {
        if (event.target.classList.contains('quantity-input')) {
            const productId = event.target.getAttribute('data-product-id');
            const newQuantity = parseInt(event.target.value);

            if (newQuantity < 1) {
                event.target.value = 1;
                showAlert('La cantidad mínima es 1.');
                return;
            }

            const productIndex = cart.findIndex(item => item.id === productId);

            if (productIndex !== -1) {
                cart[productIndex].quantity = newQuantity;
                sessionStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }
    }

    document.querySelectorAll('.option1').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    document.getElementById('clear-cart').addEventListener('click', clearCart);

    cartTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-item')) {
            removeFromCart(event);
        } else if (event.target.classList.contains('quantity-input')) {
            updateQuantity(event);
        }
    });

    checkoutButton.addEventListener('click', checkout);

    updateCart(); // Cargar el carrito al cargar la página
});
