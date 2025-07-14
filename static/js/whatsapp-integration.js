// ========== INTEGRACIÓN AVANZADA DE WHATSAPP ==========

class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '593983381474'; // Número de WhatsApp Ecuador
        this.businessName = 'Gablou Alimentos';
        this.init();
    }

    init() {
        this.createFloatingButtons();
        this.setupQuickOrderButtons();
    }

    // Crear botones flotantes adicionales
    createFloatingButtons() {
        // Botón de contacto directo
        const contactButton = document.createElement('button');
        contactButton.className = 'whatsapp-contact-btn';
        contactButton.innerHTML = '<i class="fas fa-headset"></i>';
        contactButton.title = 'Contactar por WhatsApp';
        contactButton.onclick = () => this.openDirectContact();

        // Posicionar el botón
        contactButton.style.cssText = `
            position: fixed;
            bottom: 160px;
            right: 20px;
            width: 48px;
            height: 48px;
            background: #128C7E;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(18, 140, 126, 0.3);
            transition: all 0.3s ease;
            z-index: 998;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(contactButton);

        // Animación hover
        contactButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(18, 140, 126, 0.4)';
        });

        contactButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(18, 140, 126, 0.3)';
        });
    }

    // Configurar botones de pedido rápido en productos
    setupQuickOrderButtons() {
        const dishCards = document.querySelectorAll('.dish-card');
        
        dishCards.forEach(card => {
            // Evitar duplicar botones
            if (card.querySelector('.quick-order-btn')) return;

            const quickOrderBtn = document.createElement('button');
            quickOrderBtn.className = 'quick-order-btn';
            quickOrderBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
            quickOrderBtn.title = 'Pedir directamente por WhatsApp';

            // Obtener datos del producto
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productCategory = card.dataset.category || 'Sin categoría';

            quickOrderBtn.onclick = (e) => {
                e.stopPropagation();
                this.quickOrder({
                    name: productName,
                    price: productPrice,
                    category: productCategory
                });
            };

            // Estilo del botón
            quickOrderBtn.style.cssText = `
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 36px;
                height: 36px;
                background: #25D366;
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
                transition: all 0.3s ease;
                opacity: 0;
                transform: scale(0.8);
                z-index: 5;
            `;

            card.appendChild(quickOrderBtn);

            // Mostrar en hover
            card.addEventListener('mouseenter', () => {
                quickOrderBtn.style.opacity = '1';
                quickOrderBtn.style.transform = 'scale(1)';
            });

            card.addEventListener('mouseleave', () => {
                quickOrderBtn.style.opacity = '0';
                quickOrderBtn.style.transform = 'scale(0.8)';
            });

            // En móvil, mostrar siempre
            if (window.innerWidth <= 768) {
                quickOrderBtn.style.opacity = '1';
                quickOrderBtn.style.transform = 'scale(1)';
            }
        });
    }

    // Pedido rápido de un solo producto
    quickOrder(product) {
        const message = this.generateQuickOrderMessage(product);
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        this.showNotification(`Pedido rápido de ${product.name} enviado a WhatsApp`, 'success');
    }

    // Generar mensaje de pedido rápido
    generateQuickOrderMessage(product) {
        let message = `🍽️ *Pedido Rápido - ${this.businessName}*\n\n`;
        message += `📦 *Producto:* ${product.name}\n`;
        message += `💰 *Precio:* ${product.price}\n`;
        message += `📂 *Categoría:* ${product.category}\n\n`;
        message += `📍 *Información de entrega:*\n`;
        message += `Por favor, proporciona tu dirección de entrega.\n\n`;
        message += `⏰ *Hora del pedido:* ${new Date().toLocaleString('es-ES')}\n\n`;
        message += `¡Hola! Me interesa este producto. ¿Podrías confirmar disponibilidad y tiempo de entrega?`;

        return message;
    }

    // Contacto directo sin productos
    openDirectContact() {
        const message = this.generateContactMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        this.showNotification('Abriendo chat de WhatsApp...', 'info');
    }

    // Generar mensaje de contacto directo
    generateContactMessage() {
        let message = `👋 *Hola ${this.businessName}!*\n\n`;
        message += `Me gustaría obtener más información sobre sus productos y servicios.\n\n`;
        message += `⏰ *Contacto desde:* ${new Date().toLocaleString('es-ES')}\n\n`;
        message += `¿Podrían ayudarme con:\n`;
        message += `• Información del menú\n`;
        message += `• Precios y promociones\n`;
        message += `• Tiempos de entrega\n`;
        message += `• Zonas de cobertura\n\n`;
        message += `¡Gracias!`;

        return message;
    }

    // Función para compartir el menú completo
    shareFullMenu() {
        if (!cartManager) {
            this.showNotification('Sistema de carrito no disponible', 'warning');
            return;
        }

        const cartInfo = cartManager.getCartInfo();
        let message = `📋 *Menú ${this.businessName}*\n\n`;
        
        if (cartInfo.items.length > 0) {
            message += `🛒 *Productos en mi carrito:*\n`;
            cartInfo.items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.price.toFixed(2)} (x${item.quantity})\n`;
            });
            message += `\n💰 *Total: $${cartInfo.totalPrice.toFixed(2)}*\n\n`;
        }

        message += `📞 *Solicitar información completa del menú*\n`;
        message += `⏰ ${new Date().toLocaleString('es-ES')}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    }

    // Función para solicitar delivery
    requestDelivery(address = '') {
        let message = `🚚 *Solicitud de Delivery - ${this.businessName}*\n\n`;
        
        if (cartManager && cartManager.cart.length > 0) {
            const cartInfo = cartManager.getCartInfo();
            message += `🛒 *Productos:*\n`;
            cartInfo.items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} (x${item.quantity})\n`;
            });
            message += `\n💰 *Total: $${cartInfo.totalPrice.toFixed(2)}*\n\n`;
        }
        
        message += `📍 *Dirección de entrega:*\n`;
        message += address || 'Por favor, proporciona tu dirección completa\n\n';
        message += `📞 *Información adicional:*\n`;
        message += `• Número de contacto:\n`;
        message += `• Referencia de ubicación:\n`;
        message += `• Comentarios especiales:\n\n`;
        message += `⏰ *Hora de solicitud:* ${new Date().toLocaleString('es-ES')}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        this.showNotification('Solicitud de delivery enviada', 'success');
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones del carrito si está disponible
        if (cartManager && cartManager.showNotification) {
            cartManager.showNotification(message, type);
            return;
        }

        // Fallback a notificación mejorada
        const notification = document.createElement('div');
        
        // Colores mejorados según el tipo
        let backgroundColor, textColor, iconColor, borderColor;
        
        switch(type) {
            case 'success':
                backgroundColor = '#f0fdf4';
                textColor = '#15803d';
                iconColor = '#22c55e';
                borderColor = '#22c55e';
                break;
            case 'warning':
                backgroundColor = '#fffbeb';
                textColor = '#d97706';
                iconColor = '#f59e0b';
                borderColor = '#f59e0b';
                break;
            case 'error':
                backgroundColor = '#fef2f2';
                textColor = '#dc2626';
                iconColor = '#ef4444';
                borderColor = '#ef4444';
                break;
            default: // info
                backgroundColor = '#eff6ff';
                textColor = '#1d4ed8';
                iconColor = '#3b82f6';
                borderColor = '#3b82f6';
                break;
        }
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}" style="color: ${iconColor}"></i>
            <span style="color: ${textColor}; font-weight: 500;">${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1002;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid ${borderColor};
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Actualizar número de teléfono dinámicamente
    updatePhoneNumber(newNumber) {
        this.phoneNumber = newNumber;
        console.log(`📞 Número de WhatsApp actualizado: ${newNumber}`);
    }

    // Obtener estadísticas de uso
    getUsageStats() {
        return {
            phoneNumber: this.phoneNumber,
            businessName: this.businessName,
            cartItems: cartManager ? cartManager.cart.length : 0,
            lastUpdate: new Date().toISOString()
        };
    }
}

// Estilos CSS para las animaciones
const whatsappStyles = document.createElement('style');
whatsappStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .quick-order-btn:hover {
        background: #22c55e !important;
        transform: scale(1.1) !important;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.5) !important;
    }

    /* Responsive para botones en móvil */
    @media (max-width: 768px) {
        .whatsapp-contact-btn {
            bottom: 140px !important;
            right: 15px !important;
            width: 44px !important;
            height: 44px !important;
            font-size: 16px !important;
        }
        
        .quick-order-btn {
            opacity: 1 !important;
            transform: scale(1) !important;
        }
    }
`;
document.head.appendChild(whatsappStyles);

// Inicializar integración de WhatsApp
let whatsappIntegration;
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que otros sistemas estén listos
    setTimeout(() => {
        whatsappIntegration = new WhatsAppIntegration();
        console.log('📱 Integración de WhatsApp iniciada');
        
        // Exponer funciones globalmente para fácil acceso
        window.whatsappIntegration = whatsappIntegration;
        window.quickWhatsAppOrder = (product) => whatsappIntegration.quickOrder(product);
        window.requestDelivery = (address) => whatsappIntegration.requestDelivery(address);
        window.shareMenu = () => whatsappIntegration.shareFullMenu();
        
    }, 1000);
});

// Reinicializar botones cuando se actualice el contenido
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('dish-card')) {
                    setTimeout(() => {
                        if (whatsappIntegration) {
                            whatsappIntegration.setupQuickOrderButtons();
                        }
                    }, 100);
                }
            });
        }
    });
});

const dishesContainer = document.querySelector('.dishes-grid');
if (dishesContainer) {
    observer.observe(dishesContainer, { childList: true, subtree: true });
}