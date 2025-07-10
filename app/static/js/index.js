// DOM Elements
const tabs = document.querySelectorAll('.tab');
const addressInput = document.getElementById('addressInput');
const findFoodBtn = document.querySelector('.find-food-btn');
const searchBtn = document.querySelector('.search-btn');
const loginBtn = document.querySelector('.login-btn');
const foodCards = document.querySelectorAll('.food-card');

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Update placeholder based on selected tab
        if (tab.dataset.tab === 'delivery') {
            addressInput.placeholder = 'Enter Your Address';
        } else {
            addressInput.placeholder = 'Search for restaurants nearby';
        }
    });
});

// Find Food Button
findFoodBtn.addEventListener('click', () => {
    const address = addressInput.value.trim();
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    
    if (address === '') {
        showNotification('Please enter your address', 'error');
        addressInput.focus();
        return;
    }
    
    // Simulate search
    showNotification(`Searching for ${activeTab} options near: ${address}`, 'success');
    
    // Add loading animation
    findFoodBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    findFoodBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        findFoodBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
        findFoodBtn.disabled = false;
        
        // Scroll to food gallery
        document.querySelector('.food-gallery').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 2000);
});

// Enter key support for address input
addressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        findFoodBtn.click();
    }
});

// Search button in header
searchBtn.addEventListener('click', () => {
    showModal('search');
});

// Login button
loginBtn.addEventListener('click', () => {
    showModal('login');
});

// Food card interactions
foodCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const foodName = card.querySelector('h3').textContent;
        const price = card.querySelector('p').textContent;
        
        showNotification(`Added ${foodName} to cart - ${price}`, 'success');
        
        // Add to cart animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// Modal System
function showModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let modalContent = '';
    
    if (type === 'search') {
        modalContent = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Search for Food</h2>
                <input type="text" placeholder="Search for dishes, restaurants..." class="modal-search-input">
                <div class="search-suggestions">
                    <p>Popular searches:</p>
                    <div class="suggestion-tags">
                        <span class="tag">Pizza</span>
                        <span class="tag">Burger</span>
                        <span class="tag">Sushi</span>
                        <span class="tag">Pasta</span>
                        <span class="tag">Salad</span>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'login') {
        modalContent = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Login to FoodWagon</h2>
                <form class="login-form">
                    <input type="email" placeholder="Email address" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </form>
            </div>
        `;
    }
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Handle form submission
    if (type === 'login') {
        const form = modal.querySelector('.login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Login successful!', 'success');
            closeModal();
        });
    }
    
    // Handle search suggestions
    if (type === 'search') {
        const tags = modal.querySelectorAll('.tag');
        const searchInput = modal.querySelector('.modal-search-input');
        
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                searchInput.focus();
            });
        });
    }
}

// Add necessary CSS for notifications and modals
const style = document.createElement('style');
style.textContent = `
    /* Notifications */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 2000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #2ecc71;
    }
    
    .notification.success i {
        color: #2ecc71;
    }
    
    .notification.error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification.error i {
        color: #e74c3c;
    }
    
    .notification.info {
        border-left: 4px solid #3498db;
    }
    
    .notification.info i {
        color: #3498db;
    }
    
    /* Modals */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1500;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.show {
        opacity: 1;
    }
    
    .modal-content {
        background: white;
        padding: 40px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        position: relative;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }
    
    .modal.show .modal-content {
        transform: scale(1);
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    }
    
    .close-modal:hover {
        color: #333;
    }
    
    .modal h2 {
        margin-bottom: 20px;
        color: #333;
    }
    
    .modal-search-input,
    .login-form input {
        width: 100%;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        margin-bottom: 15px;
        transition: border-color 0.3s ease;
    }
    
    .modal-search-input:focus,
    .login-form input:focus {
        outline: none;
        border-color: #A55F16;
    }
    
    .search-suggestions {
        margin-top: 20px;
    }
    
    .search-suggestions p {
        color: #666;
        margin-bottom: 10px;
    }
    
    .suggestion-tags {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .tag {
        background: #f0f0f0;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .tag:hover {
        background: #A55F16;
        color: white;
    }
    
    .login-form button {
        width: 100%;
        padding: 15px;
        background: #A55F16;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .login-form button:hover {
        background: #BD7F14;
    }
    
    .login-form p {
        text-align: center;
        margin-top: 20px;
        color: #666;
    }
    
    .login-form a {
        color: #A55F16;
        text-decoration: none;
        font-weight: 600;
    }
    
    .login-form a:hover {
        text-decoration: underline;
    }
`;

document.head.appendChild(style);

// Initialize
console.log('FoodWagon initialized successfully!');

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});