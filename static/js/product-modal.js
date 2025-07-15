// ========== SISTEMA DE MODAL DETALLADO DE PRODUCTOS ==========

class ProductModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.createModalStructure();
        this.attachEventListeners();
        this.addViewMoreButtons();
    }

    // Crear la estructura HTML del modal
    createModalStructure() {
        const modalHTML = `
            <div class="product-modal-overlay" id="productModalOverlay">
                <div class="product-modal" id="productModal">
                    <div class="modal-header">
                        <div class="modal-image-container">
                            <img id="modalProductImage" class="modal-product-image" src="" alt="">
                            <div class="availability-indicator" id="modalAvailabilityIndicator"></div>
                            <button class="modal-close-btn" id="modalCloseBtn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <h2 class="modal-product-title" id="modalProductTitle"></h2>
                        <span class="modal-product-category" id="modalProductCategory"></span>
                        <p class="modal-product-description" id="modalProductDescription"></p>
                        
                        <div class="modal-product-details">
                            <div class="detail-item">
                                <div class="detail-label">Precio</div>
                                <div class="detail-value price" id="modalProductPrice">$0.00</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Disponibilidad</div>
                                <div class="detail-value stock" id="modalProductStock">0 disponibles</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Categoría</div>
                                <div class="detail-value" id="modalProductCategoryDetail">-</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Estado</div>
                                <div class="detail-value" id="modalProductStatus">Disponible</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn btn-add-cart" id="modalAddToCart">
                            <i class="fas fa-shopping-cart"></i>
                            Agregar al Carrito
                        </button>
                        <button class="modal-btn btn-whatsapp" id="modalWhatsAppOrder">
                            <i class="fab fa-whatsapp"></i>
                            Pedir por WhatsApp
                        </button>
                        <button class="modal-btn btn-secondary" id="modalShare">
                            <i class="fas fa-share-alt"></i>
                            Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insertar en el DOM si no existe
        if (!document.getElementById('productModalOverlay')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        this.modal = document.getElementById('productModalOverlay');
    }

    // Agregar botones "Ver más" a todas las tarjetas de producto
    addViewMoreButtons() {
        const dishCards = document.querySelectorAll('.dish-card');
        
        dishCards.forEach(card => {
            // Evitar duplicar botones
            if (card.querySelector('.view-more-btn')) return;

            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.className = 'view-more-btn';
            viewMoreBtn.innerHTML = '<i class="fas fa-eye"></i> Ver más';
            viewMoreBtn.onclick = (e) => {
                e.stopPropagation();
                this.openModal(this.extractProductData(card));
            };

            card.appendChild(viewMoreBtn);
        });
    }

    // Extraer datos del producto desde la tarjeta
    extractProductData(card) {
        const name = card.querySelector('h3')?.textContent || 'Producto sin nombre';
        const description = card.querySelector('.description')?.textContent || 'Sin descripción disponible';
        const price = card.querySelector('.price')?.textContent || '$0.00';
        const availability = card.querySelector('.availability')?.textContent || '0 disponibles';
        const image = card.querySelector('img')?.src || 'https://via.placeholder.com/300x300/f0f0f0/999?text=No+Image';
        const category = card.dataset.category || 'Sin categoría';

        // Extraer número de stock
        const stockMatch = availability.match(/(\d+)/);
        const stock = stockMatch ? parseInt(stockMatch[1]) : 0;

        return {
            id: Date.now(), // ID temporal
            name,
            description: this.enhanceDescription(description, name),
            price: this.parsePrice(price),
            priceText: price,
            category,
            image,
            stock,
            availability,
            available: stock > 0
        };
    }

    // Mejorar la descripción del producto
    enhanceDescription(originalDescription, productName) {
        if (originalDescription && originalDescription.length > 20) {
            return originalDescription;
        }

        // Descripciones mejoradas basadas en el nombre del producto
        const descriptions = {
            'bandeja de churitos': 'Deliciosos churitos caseros crujientes por fuera y suaves por dentro. Preparados con ingredientes frescos y servidos en una práctica bandeja. Perfectos para compartir en familia o disfrutar como snack.',
            'bandeja de empanada': 'Empanadas tradicionales horneadas con masa dorada y relleno sabroso. Cada empanada está cuidadosamente preparada con ingredientes de primera calidad. Ideales para cualquier momento del día.',
            'bandeja de muffins': 'Muffins esponjosos y húmedos disponibles en diferentes sabores. Horneados frescos diariamente con los mejores ingredientes. Una opción perfecta para el desayuno o la merienda.',
            'pollo relleno en salsa ciruela': 'Exquisito pollo relleno bañado en una deliciosa salsa de ciruela agridulce. Preparado con técnicas culinarias tradicionales que realzan todos los sabores. Un plato gourmet que deleitará tu paladar.'
        };

        const key = productName.toLowerCase();
        return descriptions[key] || `Delicioso ${productName.toLowerCase()} preparado con ingredientes frescos y de la más alta calidad. Una opción perfecta para satisfacer tu apetito con sabores auténticos y tradicionales.`;
    }

    // Parsear precio del texto
    parsePrice(priceText) {
        const match = priceText.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    // Adjuntar event listeners
    attachEventListeners() {
        // Cerrar modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modalCloseBtn' || e.target.closest('#modalCloseBtn')) {
                this.closeModal();
            }
            if (e.target.id === 'productModalOverlay') {
                this.closeModal();
            }
        });

        // Tecla ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                this.closeModal();
            }
        });

        // Prevenir cierre al hacer clic dentro del modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-modal') && !e.target.closest('#modalCloseBtn')) {
                e.stopPropagation();
            }
        });
    }

    // Abrir modal con datos del producto
    openModal(productData) {
        if (!this.modal) return;

        this.currentProduct = productData;
        this.populateModal(productData);
        this.attachModalButtonEvents();
        
        // Mostrar modal con animación
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Analytics/tracking
        this.trackModalOpen(productData);
    }

    // Poblar modal con datos del producto
    populateModal(product) {
        // Imagen
        const modalImage = document.getElementById('modalProductImage');
        modalImage.src = product.image;
        modalImage.alt = product.name;

        // Título
        document.getElementById('modalProductTitle').textContent = product.name;

        // Categoría
        const categoryElement = document.getElementById('modalProductCategory');
        categoryElement.textContent = product.category;

        // Descripción
        document.getElementById('modalProductDescription').textContent = product.description;

        // Precio
        document.getElementById('modalProductPrice').textContent = product.priceText;

        // Stock y disponibilidad
        const stockElement = document.getElementById('modalProductStock');
        stockElement.textContent = product.availability;
        
        // Aplicar clases de estado según stock
        stockElement.className = 'detail-value stock';
        if (product.stock === 0) {
            stockElement.classList.add('out');
        } else if (product.stock <= 5) {
            stockElement.classList.add('low');
        }

        // Categoría en detalles
        document.getElementById('modalProductCategoryDetail').textContent = product.category;

        // Estado
        const statusElement = document.getElementById('modalProductStatus');
        statusElement.textContent = product.available ? 'Disponible' : 'Agotado';
        statusElement.style.color = product.available ? '#22c55e' : '#ef4444';

        // Indicador de disponibilidad
        const indicator = document.getElementById('modalAvailabilityIndicator');
        indicator.className = 'availability-indicator';
        if (product.stock === 0) {
            indicator.classList.add('out-of-stock');
        } else if (product.stock <= 5) {
            indicator.classList.add('low-stock');
        }
    }

    // Adjuntar eventos a los botones del modal
    attachModalButtonEvents() {
        const addToCartBtn = document.getElementById('modalAddToCart');
        const whatsappBtn = document.getElementById('modalWhatsAppOrder');
        const shareBtn = document.getElementById('modalShare');

        // Limpiar eventos anteriores
        addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
        whatsappBtn.replaceWith(whatsappBtn.cloneNode(true));
        shareBtn.replaceWith(shareBtn.cloneNode(true));

        // Nuevas referencias
        const newAddToCartBtn = document.getElementById('modalAddToCart');
        const newWhatsappBtn = document.getElementById('modalWhatsAppOrder');
        const newShareBtn = document.getElementById('modalShare');

        // Agregar al carrito
        newAddToCartBtn.addEventListener('click', () => {
            this.addToCart();
        });

        // Pedir por WhatsApp
        newWhatsappBtn.addEventListener('click', () => {
            this.orderViaWhatsApp();
        });

        // Compartir producto
        newShareBtn.addEventListener('click', () => {
            this.shareProduct();
        });

        // Deshabilitar botones si está agotado
        if (!this.currentProduct.available) {
            newAddToCartBtn.disabled = true;
            newAddToCartBtn.style.opacity = '0.5';
            newAddToCartBtn.style.cursor = 'not-allowed';
            newAddToCartBtn.innerHTML = '<i class="fas fa-times"></i> Agotado';
        }
    }

    // Agregar producto al carrito
    addToCart() {
        if (!this.currentProduct.available) {
            this.showNotification('Este producto está agotado', 'warning');
            return;
        }

        // Integración con el sistema de carrito existente
        if (window.cartManager) {
            cartManager.addToCart({
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                image: this.currentProduct.image,
                category: this.currentProduct.category
            });
        } else {
            this.showNotification(`${this.currentProduct.name} agregado al carrito`, 'success');
        }

        this.closeModal();
    }

    // Pedir por WhatsApp
    orderViaWhatsApp() {
        if (window.whatsappIntegration) {
            whatsappIntegration.quickOrder({
                name: this.currentProduct.name,
                price: this.currentProduct.priceText,
                category: this.currentProduct.category
            });
        } else {
            // Fallback directo
            const message = `🍽️ Pedido - ${this.currentProduct.name}\nPrecio: ${this.currentProduct.priceText}\nCategoría: ${this.currentProduct.category}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/593983381474?text=${encodedMessage}`, '_blank');
        }
        
        this.closeModal();
    }

    // Compartir producto
    shareProduct() {
        if (navigator.share) {
            navigator.share({
                title: this.currentProduct.name,
                text: this.currentProduct.description,
                url: window.location.href
            });
        } else {
            // Fallback: copiar al portapapeles
            const shareText = `${this.currentProduct.name} - ${this.currentProduct.priceText}\n${this.currentProduct.description}\n${window.location.href}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => {
                    this.showNotification('Información copiada al portapapeles', 'success');
                });
            } else {
                this.showNotification('Función de compartir no disponible', 'info');
            }
        }
    }

    // Cerrar modal
    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.currentProduct = null;
    }

    // Tracking de apertura de modal
    trackModalOpen(product) {
        console.log('Modal abierto para producto:', product.name);
        // Aquí puedes agregar analytics como Google Analytics, etc.
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones del carrito si está disponible
        if (window.cartManager && cartManager.showNotification) {
            cartManager.showNotification(message, type);
            return;
        }

        // Fallback a notificación básica
        const notification = document.createElement('div');
        notification.className = `modal-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 2001;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
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

    // Actualizar botones cuando cambie el contenido
    refreshViewMoreButtons() {
        this.addViewMoreButtons();
    }

    // Obtener producto actual
    getCurrentProduct() {
        return this.currentProduct;
    }
}

// Inicializar sistema de modal
let productModal;
document.addEventListener('DOMContentLoaded', function() {
    productModal = new ProductModal();
    console.log('✅ Sistema de modal de productos iniciado');

    // Exponer globalmente para debugging
    window.productModal = productModal;
});

// Reinicializar botones cuando se actualice el contenido dinámico
const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('dish-card')) {
                    setTimeout(() => {
                        if (productModal) {
                            productModal.refreshViewMoreButtons();
                        }
                    }, 100);
                }
            });
        }
    });
});

const dishesContainer = document.querySelector('.dishes-grid');
if (dishesContainer) {
    modalObserver.observe(dishesContainer, { childList: true, subtree: true });
}
