// ========== SISTEMA DE CARRITO DE COMPRAS ==========

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('gablou_cart')) || [];
        this.whatsappNumber = '593983381474'; // Número de WhatsApp (formato internacional)
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.createCartWidget();
        this.attachEventListeners();
    }

    // Crear widget flotante del carrito
    createCartWidget() {
        // Remover widget existente si hay
        const existingWidget = document.getElementById('cart-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        const cartWidget = document.createElement('div');
        cartWidget.id = 'cart-widget';
        cartWidget.className = 'cart-widget';
        cartWidget.innerHTML = `
            <div class="cart-header" onclick="cartManager.toggleCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
                <span class="cart-text">Carrito</span>
            </div>
            <div class="cart-dropdown" id="cart-dropdown">
                <div class="cart-items" id="cart-items">
                    <p class="empty-cart">Tu carrito está vacío</p>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: $<span id="cart-total">0.00</span></strong>
                    </div>
                    <button class="btn-whatsapp" onclick="cartManager.sendToWhatsApp()">
                        <i class="fab fa-whatsapp"></i>
                        Enviar por WhatsApp
                    </button>
                    <button class="btn-clear-cart" onclick="cartManager.clearCart()">
                        <i class="fas fa-trash"></i>
                        Vaciar Carrito
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(cartWidget);
    }

    // Agregar eventos a los botones de productos
    attachEventListeners() {
        // Agregar botones de "Agregar al carrito" a cada producto
        const dishCards = document.querySelectorAll('.dish-card');
        dishCards.forEach(card => {
            // Verificar si ya tiene botón
            if (card.querySelector('.add-to-cart-btn')) return;

            const addButton = document.createElement('button');
            addButton.className = 'add-to-cart-btn';
            addButton.innerHTML = '<i class="fas fa-plus"></i>';
            addButton.title = 'Agregar al carrito';
            
            // Obtener datos del producto
            const productName = card.querySelector('h3').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            const productImage = card.querySelector('img').src;
            const productCategory = card.dataset.category || 'Sin categoría';

            addButton.onclick = (e) => {
                e.stopPropagation();
                this.addToCart({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    category: productCategory
                });
            };

            card.appendChild(addButton);
        });

        // Cerrar carrito al hacer click fuera
        document.addEventListener('click', (e) => {
            const cartWidget = document.getElementById('cart-widget');
            const cartDropdown = document.getElementById('cart-dropdown');
            
            if (cartWidget && !cartWidget.contains(e.target)) {
                cartDropdown.classList.remove('show');
            }
        });
    }

    // Agregar producto al carrito
    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                id: Date.now() // ID único simple
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} agregado al carrito`, 'success');
        
        // Animar el botón
        event.target.classList.add('added');
        setTimeout(() => {
            event.target.classList.remove('added');
        }, 1000);
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Actualizar cantidad de producto
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    // Vaciar carrito
    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('El carrito ya está vacío', 'info');
            return;
        }

        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Carrito vaciado', 'info');
        }
    }

    // Mostrar/ocultar carrito
    toggleCart() {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.classList.toggle('show');
    }

    // Actualizar display del carrito
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (!cartCount || !cartItems || !cartTotal) return;

        // Actualizar contador
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        // Actualizar total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);

        // Actualizar items
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="cartManager.removeFromCart(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Enviar pedido por WhatsApp
    sendToWhatsApp() {
        if (this.cart.length === 0) {
            this.showNotification('El carrito está vacío', 'warning');
            return;
        }

        // Generar mensaje
        let message = '🍽️ *Nuevo Pedido - Gablou*\n\n';
        message += '📋 *Productos:*\n';
        
        this.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   • Cantidad: ${item.quantity}\n`;
            message += `   • Precio unitario: $${item.price.toFixed(2)}\n`;
            message += `   • Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `💰 *Total: $${total.toFixed(2)}*\n\n`;
        message += '📍 *Información de entrega:*\n';
        message += 'Por favor, proporciona tu dirección de entrega.\n\n';
        message += '⏰ *Hora del pedido:* ' + new Date().toLocaleString('es-ES');

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Mostrar confirmación
        this.showNotification('Redirigiendo a WhatsApp...', 'success');
        
        // Opcional: Limpiar carrito después de enviar
        setTimeout(() => {
            if (confirm('¿Deseas vaciar el carrito después de enviar el pedido?')) {
                this.clearCart();
            }
        }, 2000);
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('gablou_cart', JSON.stringify(this.cart));
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Mostrar animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Obtener información del carrito
    getCartInfo() {
        return {
            items: this.cart,
            totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    }
}

// Inicializar el sistema de carrito cuando se carga la página
let cartManager;
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    
    // Reinicializar después de cambios dinámicos de contenido
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Verificar si se agregaron nuevos productos
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('dish-card')) {
                        setTimeout(() => cartManager.attachEventListeners(), 100);
                    }
                });
            }
        });
    });

    const dishesContainer = document.querySelector('.dishes-grid');
    if (dishesContainer) {
        observer.observe(dishesContainer, { childList: true, subtree: true });
    }
});

// Exponer cartManager globalmente para debugging
window.cartManager = cartManager;