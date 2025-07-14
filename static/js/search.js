// ========== VARIABLES GLOBALES ==========
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('#search-input');
const filterDropdown = document.querySelector('.filter-dropdown');

// ========== FUNCIONES DE MENÚ MÓVIL ==========
function toggleMobileMenu() {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    hamburgerMenu.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== INICIALIZACIÓN DE MENÚ MÓVIL ==========
if (hamburgerMenu && sidebar && overlay) {
    // Toggle menú con hamburger
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    
    // Cerrar menú con overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Cerrar menú al hacer clic en nav items en móvil
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                setTimeout(closeMobileMenu, 200); // Pequeño delay para mejor UX
            }
        });
    });
    
    // Cerrar menú al redimensionar ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

// ========== NAVEGACIÓN SIDEBAR ==========
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Solo prevenir default si no es logout
        if (!item.querySelector('.fa-sign-out-alt')) {
            e.preventDefault();
        }
        
        // Remover clase active de todos los items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Agregar clase active al item clickeado
        item.classList.add('active');
    });
});

// ========== FUNCIONES DE FECHA ==========
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('es-ES', options);
    }
}

// ========== FUNCIONES DE CATEGORÍAS ==========
function updateCategoryCount() {
    const tabs = document.querySelectorAll('.tab[data-category]');
    const dishes = document.querySelectorAll('.dish-card');
    
    tabs.forEach(tab => {
        const category = tab.dataset.category;
        let count = 0;
        
        if (category === 'all') {
            count = dishes.length;
        } else {
            dishes.forEach(dish => {
                if (dish.dataset.category === category) {
                    count++;
                }
            });
        }
        
        // Actualizar texto del tab con contador
        const tabText = tab.textContent.replace(/\s*\(\d+\)$/, '');
        tab.textContent = `${tabText} (${count})`;
    });
}

function filterByCategory(category) {
    const dishes = document.querySelectorAll('.dish-card');
    const loading = document.getElementById('loading');
    
    // Mostrar loading
    if (loading) {
        loading.style.display = 'block';
    }
    
    setTimeout(() => {
        dishes.forEach(dish => {
            if (category === 'all' || dish.dataset.category === category) {
                dish.style.display = 'block';
                dish.style.animation = 'fadeIn 0.3s ease';
            } else {
                dish.style.display = 'none';
            }
        });
        
        // Ocultar loading
        if (loading) {
            loading.style.display = 'none';
        }
    }, 300);
}

// ========== FUNCIONES DE BÚSQUEDA ==========
function searchProducts(query) {
    const dishes = document.querySelectorAll('.dish-card');
    const searchTerm = query.toLowerCase().trim();
    
    dishes.forEach(dish => {
        const dishName = dish.dataset.name || '';
        if (searchTerm === '' || dishName.includes(searchTerm)) {
            dish.style.display = 'block';
            dish.style.animation = 'fadeIn 0.3s ease';
        } else {
            dish.style.display = 'none';
        }
    });
}

// ========== SISTEMA DE NOTIFICACIONES MEJORADO ==========
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.search-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `search-notification ${type}`;
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

// ========== EVENT LISTENERS ==========

// Tabs de categorías
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover active de todos los tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Agregar active al tab clickeado
        tab.classList.add('active');
        
        // Filtrar por categoría
        const category = tab.dataset.category;
        if (category) {
            filterByCategory(category);
        }
    });
});

// REMOVER: Las interacciones anteriores con cards de platos
// Ya no necesitamos esto porque el carrito maneja todo

// Funcionalidad de búsqueda
if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts(e.target.value);
        }, 300);
    });
}

// Dropdown de filtros
if (filterDropdown) {
    filterDropdown.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        showNotification(`Filtro cambiado a: ${filterValue}`, 'info');
    });
}

// ========== SIMULACIÓN DE ACTUALIZACIONES EN TIEMPO REAL ==========
function updateAvailability() {
    const availabilities = document.querySelectorAll('.availability');
    
    availabilities.forEach(availability => {
        const currentText = availability.textContent;
        const match = currentText.match(/(\d+)/);
        
        if (match) {
            const currentValue = parseInt(match[1]);
            // Simular cambios ocasionales en disponibilidad
            const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? -1 : 1) : 0;
            const newValue = Math.max(0, Math.min(50, currentValue + change));
            
            if (change !== 0 && newValue !== currentValue) {
                availability.textContent = `${newValue} disponibles`;
                availability.style.animation = 'fadeIn 0.5s ease';
                
                // Mostrar notificación si un producto se agota
                if (newValue === 0) {
                    const dishCard = availability.closest('.dish-card');
                    const dishName = dishCard?.querySelector('h3')?.textContent;
                    if (dishName) {
                        showNotification(`⚠️ ${dishName} se ha agotado`, 'warning');
                    }
                }
            }
        }
    });
}

// ========== MANEJO DE ERRORES ==========
window.addEventListener('error', function(e) {
    console.warn('Error capturado:', e.message);
    
    // No mostrar errores de extensiones del navegador al usuario
    if (e.message.includes('chrome-extension') || e.message.includes('Extension')) {
        e.preventDefault();
        return;
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.warn('Promise rejection capturada:', e.reason);
    
    // Evitar que errores de extensiones rompan la funcionalidad
    if (e.reason && e.reason.toString().includes('Extension')) {
        e.preventDefault();
    }
});

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicializar fecha
        updateDate();
        
        // Actualizar contadores de categorías
        updateCategoryCount();
        
        // Configurar actualizaciones periódicas
        setInterval(updateAvailability, 45000); // Cada 45 segundos
        
        console.log('✅ Gablou Restaurant Dashboard inicializado correctamente!');
        
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showNotification('Error al inicializar la aplicación', 'warning');
    }
});

// ========== FUNCIONES DE UTILIDAD ==========

// Función para limpiar búsqueda
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        searchProducts('');
    }
}

// Función para resetear filtros
function resetFilters() {
    // Resetear tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    const allTab = document.querySelector('.tab[data-category="all"]');
    if (allTab) {
        allTab.classList.add('active');
        filterByCategory('all');
    }
    
    // Resetear búsqueda
    clearSearch();
    
    // Resetear dropdown
    if (filterDropdown) {
        filterDropdown.selectedIndex = 0;
    }
    
    showNotification('Filtros restablecidos', 'info');
}

// Función para contar platos visibles
function getVisibleDishesCount() {
    const visibleDishes = document.querySelectorAll('.dish-card[style*="display: block"], .dish-card:not([style*="display: none"])');
    return visibleDishes.length;
}

// Exponer funciones útiles globalmente para debugging
window.GablouApp = {
    toggleMobileMenu,
    closeMobileMenu,
    searchProducts,
    filterByCategory,
    showNotification,
    resetFilters,
    clearSearch,
    getVisibleDishesCount,
    updateCategoryCount
};

// ========== ESTILOS PARA NOTIFICACIONES MEJORADAS ==========
// Agregar estilos CSS para las notificaciones con colores corregidos
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    /* Notificaciones del sistema de búsqueda con colores legibles */
    .search-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #ffffff;
        color: #333333;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1100;
        max-width: 350px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #3b82f6;
    }

    .search-notification.show {
        transform: translateX(0);
    }

    .search-notification.success {
        border-left-color: #22c55e;
        background: #f0fdf4;
        color: #15803d;
    }

    .search-notification.success i {
        color: #22c55e;
    }

    .search-notification.warning {
        border-left-color: #f59e0b;
        background: #fffbeb;
        color: #d97706;
    }

    .search-notification.warning i {
        color: #f59e0b;
    }

    .search-notification.info {
        border-left-color: #3b82f6;
        background: #eff6ff;
        color: #1d4ed8;
    }

    .search-notification.info i {
        color: #3b82f6;
    }

    /* Responsive para notificaciones */
    @media (max-width: 768px) {
        .search-notification {
            top: 90px;
            right: 15px;
            max-width: calc(100vw - 30px);
            font-size: 14px;
            padding: 12px 16px;
        }
    }
`;

document.head.appendChild(notificationStyles);