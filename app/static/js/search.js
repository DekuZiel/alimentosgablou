// DOM Elements
const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const dishCards = document.querySelectorAll('.dish-card');
const searchInput = document.querySelector('.search-bar input');
const filterDropdown = document.querySelector('.filter-dropdown');

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Filter dishes based on selected tab
        const category = tab.textContent.toLowerCase();
        filterDishes(category);
    });
});

// Sidebar Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Don't prevent default for logout
        if (!item.querySelector('.fa-sign-out-alt')) {
            e.preventDefault();
        }
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// Dish Card Interactions
dishCards.forEach(card => {
    card.addEventListener('click', () => {
        const dishName = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        
        // Add to order animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
        
        // Show notification
        showNotification(`${dishName} added to order`, 'success');
    });
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    dishCards.forEach(card => {
        const dishName = card.querySelector('h3').textContent.toLowerCase();
        
        if (dishName.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
});

// Filter Dropdown
filterDropdown.addEventListener('change', (e) => {
    const filterValue = e.target.value;
    showNotification(`Filter changed to: ${filterValue}`, 'info');
});

// Filter dishes by category
function filterDishes(category) {
    // This is a simulation - in real app, you'd filter based on actual dish categories
    dishCards.forEach((card, index) => {
        card.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            // Simulate filtering logic
            if (category === 'hot dishes' || Math.random() > 0.3) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        }, 300);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add necessary styles for notifications and animations
const style = document.createElement('style');
style.textContent = `
    /* Animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    /* Notifications */
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1F1D2B;
        border: 1px solid #393C49;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateY(100px);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateY(0);
    }
    
    .notification.success {
        border-color: #50D1AA;
    }
    
    .notification.success i {
        color: #50D1AA;
    }
    
    .notification.info {
        border-color: #5B6DED;
    }
    
    .notification.info i {
        color: #5B6DED;
    }
    
    /* Loading State */
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #393C49;
        border-radius: 50%;
        border-top-color: #EA7C69;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);

// Initialize with current date
function updateDate() {
    const dateElement = document.querySelector('.date');
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Simulate real-time updates
function updateAvailability() {
    const availabilities = document.querySelectorAll('.availability');
    
    availabilities.forEach(availability => {
        const currentValue = parseInt(availability.textContent);
        const change = Math.random() > 0.5 ? -1 : 0;
        const newValue = Math.max(0, currentValue + change);
        
        if (change !== 0 && newValue !== currentValue) {
            availability.textContent = `${newValue} Bowls available`;
            availability.style.animation = 'fadeIn 0.5s ease';
        }
    });
}

// Update availability every 30 seconds (simulation)
setInterval(updateAvailability, 30000);

// Initialize
updateDate();
console.log('Jaegar Resto Dashboard initialized!');