// App Data
const products = {
    freefire: [
        { id: 1, name: "5 Diamond", price: 1500 },
        { id: 2, name: "12 Diamond", price: 2500 },
        { id: 3, name: "20 Diamond", price: 4000 },
        { id: 4, name: "50 Diamond", price: 8000 },
        { id: 5, name: "70 Diamond", price: 10000 },
        { id: 6, name: "100 Diamond", price: 14500 },
        { id: 7, name: "140 Diamond", price: 20000 },
        { id: 8, name: "210 Diamond", price: 28000 },
        { id: 9, name: "355 Diamond", price: 48000 },
        { id: 10, name: "500 Diamond", price: 65000 },
        { id: 11, name: "720 Diamond", price: 91000 },
        { id: 12, name: "1000 Diamond", price: 126000 }
    ],
    mobilelegends: [
        { id: 1, name: "5 Diamond", price: 1000 },
        { id: 2, name: "12 Diamond", price: 2500 },
        { id: 3, name: "20 Diamond", price: 4000 },
        { id: 4, name: "50 Diamond", price: 8000 },
        { id: 5, name: "70 Diamond", price: 10000 },
        { id: 6, name: "100 Diamond", price: 14500 },
        { id: 7, name: "140 Diamond", price: 20000 },
        { id: 8, name: "210 Diamond", price: 28000 },
        { id: 9, name: "355 Diamond", price: 48000 },
        { id: 10, name: "500 Diamond", price: 65000 },
        { id: 11, name: "720 Diamond", price: 91000 },
        { id: 12, name: "1000 Diamond", price: 126000 }
    ]
};

const gameLogos = {
    freefire: "https://www.apkmirror.com/wp-content/themes/APKMirror/ap_resize/ap_resize.php?src=https%3A%2F%2Fdownloadr2.apkmirror.com%2Fwp-content%2Fuploads%2F2019%2F01%2F5c46e8d4bffce.png&w=384&h=384&q=100",
    mobilelegends: "https://img.utdstc.com/icon/78d/66f/78d66ff1ab1bd23f7fd6d9cdb93854881cb8f0b69e8a301faaf4f4eab058d19e:200"
};

const gameNames = {
    freefire: "Free Fire",
    mobilelegends: "Mobile Legends"
};

// App State
let selectedProduct = null;
let selectedGame = null;
let orderData = {
    game: null,
    product: null,
    playerId: "",
    nickname: ""
};

// DOM Elements
const playerIdInput = document.getElementById('playerId');
const nicknameInput = document.getElementById('nickname');
const gameHeader = document.getElementById('gameHeader');
const proceedBtn = document.getElementById('proceedBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const successMessage = document.getElementById('successMessage');
const playerIdError = document.getElementById('playerIdError');
const nicknameError = document.getElementById('nicknameError');
const productError = document.getElementById('productError');
const notificationContainer = document.getElementById('notificationContainer');
const bgElements = document.getElementById('bgElements');
const alertModal = document.getElementById('alertModal');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkThemePreference();
    setupEventListeners();
    createBackgroundElements();
    
    // Hide error messages initially
    playerIdError.style.display = 'none';
    nicknameError.style.display = 'none';
    productError.style.display = 'none';
});

// Create background elements based on theme
function createBackgroundElements() {
    bgElements.innerHTML = '';
    
    if (document.body.classList.contains('light-mode')) {
        // Day mode with clouds
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'pixel-cloud';
            cloud.style.top = `${Math.random() * 50}%`;
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.animation = `moveCloud ${20 + Math.random() * 20}s linear infinite`;
            cloud.style.animationDelay = `-${Math.random() * 20}s`;
            bgElements.appendChild(cloud);
        }
    } else {
        // Night mode with stars and moon
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'pixel-star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            bgElements.appendChild(star);
        }
        
        // Add moon
        const moon = document.createElement('div');
        moon.className = 'pixel-moon';
        moon.style.top = '10%';
        moon.style.right = '15%';
        bgElements.appendChild(moon);
    }
}

// Show notification
function showNotification(message, type = 'error') {
    // Remove existing notifications
    while (notificationContainer.firstChild) {
        notificationContainer.removeChild(notificationContainer.firstChild);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Show alert modal
function showAlert(title, message) {
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertModal.classList.add('active');
}

// Close alert modal
function closeAlert() {
    alertModal.classList.remove('active');
}

// Select game
function selectGame(game) {
    selectedGame = game;
    orderData.game = game;
    
    // Load products for selected game
    loadProducts(game);
    
    // Navigate to products page
    navigateTo(2);
}

// Load products into the grid
function loadProducts(game) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    // Set game header
    gameHeader.innerHTML = `
        <img src="${gameLogos[game]}" alt="${gameNames[game]}">
        <div class="game-header-text">${gameNames[game]}</div>
    `;
    
    products[game].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card pixel-box';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <i class="fas fa-gem diamond-icon"></i>
            <div class="product-diamond">${product.name}</div>
            <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
        `;
        
        productCard.addEventListener('click', () => selectProduct(product));
        productsGrid.appendChild(productCard);
    });
}

// Select a product
function selectProduct(product) {
    // Deselect all products
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select the clicked product
    const selectedCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    selectedProduct = product;
    orderData.product = product;
    productError.style.display = 'none';
    
    // Enable proceed button if player ID and nickname are filled
    checkProceedButton();
}

// Validate and proceed to confirmation
function validateAndProceed() {
    const playerId = playerIdInput.value.trim();
    const nickname = nicknameInput.value.trim();
    let isValid = true;
    let errorMessage = "";
    
    // Reset error messages
    playerIdError.style.display = 'none';
    nicknameError.style.display = 'none';
    productError.style.display = 'none';
    
    // Validate player ID
    if (!playerId) {
        playerIdError.style.display = 'block';
        isValid = false;
        errorMessage += "• Harap isi ID Game Anda\n";
    }
    
    // Validate nickname
    if (!nickname) {
        nicknameError.style.display = 'block';
        isValid = false;
        errorMessage += "• Harap isi Nickname Anda\n";
    }
    
    // Validate product selection
    if (!selectedProduct) {
        productError.style.display = 'block';
        isValid = false;
        errorMessage += "• Harap pilih jumlah diamond\n";
    }
    
    if (!isValid) {
        // Show alert modal with error details
        showAlert("DATA BELUM LENGKAP", "Silakan lengkapi data berikut sebelum melanjutkan:\n" + errorMessage);
        
        // Also show notification
        showNotification("Silakan lengkapi data berikut:\n" + errorMessage);
        
        // Scroll to the first error
        const firstError = document.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Save order data
    orderData = {
        ...orderData,
        playerId,
        nickname
    };
    
    navigateTo(3);
    updateOrderSummary();
}

// Check if proceed button should be enabled
function checkProceedButton() {
    const playerId = playerIdInput.value.trim();
    const nickname = nicknameInput.value.trim();
    
    proceedBtn.disabled = !(playerId && nickname && selectedProduct);
}

// Update order summary
function updateOrderSummary() {
    if (!orderData.product || !orderData.game) return;
    
    document.getElementById('summaryGame').textContent = gameNames[orderData.game];
    document.getElementById('summaryProduct').textContent = orderData.product.name;
    document.getElementById('summaryPrice').textContent = `Rp ${orderData.product.price.toLocaleString('id-ID')}`;
    document.getElementById('summaryId').textContent = orderData.playerId;
    document.getElementById('summaryNickname').textContent = orderData.nickname;
    document.getElementById('summaryTotal').textContent = `Rp ${orderData.product.price.toLocaleString('id-ID')}`;
}

// Send order to WhatsApp
function sendOrderToWhatsApp() {
    if (!orderData.product || !orderData.playerId || !orderData.nickname || !orderData.game) {
        showAlert("ERROR", "Terjadi kesalahan data. Silakan ulangi proses order.");
        showNotification('Silakan lengkapi data order terlebih dahulu!');
        return;
    }
    
    // Show loading state
    whatsappBtn.innerHTML = '<span class="spinner"></span> Membuka WhatsApp...';
    whatsappBtn.disabled = true;
    
    // Format WhatsApp message
    const message = `
🛒 *ORDER DIAMOND ${gameNames[orderData.game].toUpperCase()}* 🛒

📋 *DATA PEMESANAN:*
• Game: ${gameNames[orderData.game]}
• ID Game: ${orderData.playerId}
• Nickname: ${orderData.nickname}

💎 *DETAIL ORDER:*
• Paket Diamond: ${orderData.product.name}
• Harga: Rp ${orderData.product.price.toLocaleString('id-ID')}

💰 *TOTAL: Rp ${orderData.product.price.toLocaleString('id-ID')}*
⏰ *Waktu Order:* ${new Date().toLocaleString('id-ID')}

📞 *Silakan konfirmasi ketersediaan dan instruksi pembayaran*

_Order ini dikirim otomatis dari website CullStore_
    `.trim().replace(/^ +/gm, '');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6283843028605?text=${encodedMessage}`;
    
    // Open WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        successMessage.style.display = 'block';
        
        showNotification('Order berhasil dikirim ke WhatsApp!', 'success');
        
        // Reset button state
        setTimeout(() => {
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Order via WhatsApp';
            whatsappBtn.disabled = false;
        }, 2000);
        
    }, 1000);
}

// Toggle mobile menu
function toggleMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Toggle body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Toggle theme
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
    
    // Recreate background elements
    createBackgroundElements();
}

// Check saved theme preference
function checkThemePreference() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeIcon').classList.replace('fa-moon', 'fa-sun');
    }
}

// Navigate between pages
function navigateTo(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Hide success message if shown
    successMessage.style.display = 'none';
    
    // Show the selected page
    document.getElementById(`page${pageNumber}`).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Setup event listeners
function setupEventListeners() {
    // Input validation for proceed button
    playerIdInput.addEventListener('input', checkProceedButton);
    nicknameInput.addEventListener('input', checkProceedButton);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!e.target.closest('.menu-toggle') && !e.target.closest('.mobile-menu')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
         }
