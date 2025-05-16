// food-order.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart data
    let cart = [];
    
    // Elements
    const cartButton = document.getElementById('cart-button');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clear-cart');
    const sizeButtons = document.querySelectorAll('.size-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    const orderTextElement = document.getElementById('order-text');
    const copyTextButton = document.getElementById('copy-text');
    const whatsappLinkElement = document.getElementById('whatsapp-link');
    const copyAlert = document.getElementById('copy-alert');
    
    // Toggle cart drawer
    cartButton.addEventListener('click', function() {
        cartDrawer.classList.add('open');
        cartOverlay.style.display = 'block';
    });
    
    closeCart.addEventListener('click', function() {
        cartDrawer.classList.remove('open');
        cartOverlay.style.display = 'none';
    });
    
    cartOverlay.addEventListener('click', function() {
        cartDrawer.classList.remove('open');
        cartOverlay.style.display = 'none';
    });
    
    // Handle size buttons
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const size = this.dataset.size;
            
            // Update active class
            document.querySelectorAll(`.size-button[data-item-id="${itemId}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update price display
            document.querySelectorAll(`.price-tag[id^="price-${itemId}-"]`).forEach(priceTag => {
                priceTag.style.display = 'none';
            });
            document.getElementById(`price-${itemId}-${size}`).style.display = '';
        });
    });
    
    // Handle quantity buttons
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const inputElement = document.getElementById(`quantity-${itemId}`);
            const currentValue = parseInt(inputElement.value);
            
            if (this.classList.contains('dec-quantity') && currentValue > 1) {
                inputElement.value = currentValue - 1;
            } else if (this.classList.contains('inc-quantity') && currentValue < 10) {
                inputElement.value = currentValue + 1;
            }
        });
    });
    
    // Add item to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            const itemName = this.dataset.itemName;
            const selectedSize = document.querySelector(`.size-button.active[data-item-id="${itemId}"]`).dataset.size;
            const quantity = parseInt(document.getElementById(`quantity-${itemId}`).value);
            
            // Find the menu item
            const menuItem = menuItems.find(item => item.id === itemId);
            const price = menuItem.price[selectedSize];
            
            // Check if item already exists in cart with same size
            const existingItemIndex = cart.findIndex(item => 
                item.id === itemId && item.size === selectedSize
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.push({
                    id: itemId,
                    name: itemName,
                    size: selectedSize,
                    price: price,
                    quantity: quantity
                });
            }
            
            updateCart();
            
            // Menampilkan notifikasi kecil
            showAddToCartNotification(itemName, quantity, selectedSize);
            
            // Tidak menampilkan keranjang secara otomatis
            // cartDrawer.classList.add('open');
            // cartOverlay.style.display = 'block';
        });
    });
    
    // Show notification when item added to cart
    function showAddToCartNotification(itemName, quantity, size) {
        // Cek apakah sudah ada notifikasi sebelumnya
        let notif = document.getElementById('cart-notification');
        if (notif) {
            notif.remove();
        }
        
        // Buat elemen notifikasi
        notif = document.createElement('div');
        notif.id = 'cart-notification';
        notif.className = 'alert alert-success position-fixed';
        notif.style.bottom = '20px';
        notif.style.right = '20px';
        notif.style.zIndex = '1050';
        notif.style.maxWidth = '300px';
        notif.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        notif.innerHTML = `<strong>${itemName}</strong> ${quantity}x porsi ${size} ditambahkan ke keranjang`;
        
        // Tambahkan ke body dan hilangkan setelah 3 detik
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transition = 'opacity 0.5s';
            setTimeout(() => notif.remove(), 500);
        }, 2500);
    }
    
    // Update cart display
    function updateCart() {
        // Update count badge
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Update items display
        if (cart.length > 0) {
            let html = '';
            
            cart.forEach((item, index) => {
                html += `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.quantity}x - Porsi ${item.size}</small>
                        </div>
                        <div class="text-end">
                            <div>Rp ${formatNumber(item.price * item.quantity)}</div>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = html;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    updateCart();
                });
            });
            
            // Update total and enable checkout button
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `Rp ${formatNumber(total)}`;
            checkoutButton.disabled = false;
        } else {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted">Keranjang kosong</p>';
            cartTotalElement.textContent = 'Rp 0';
            checkoutButton.disabled = true;
        }
    }
    
    // Format number with thousand separators
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Clear cart
    clearCartButton.addEventListener('click', function() {
        cart = [];
        updateCart();
    });
    
    // Checkout
    checkoutButton.addEventListener('click', function() {
        // Generate order text
        let orderText = "Halo, saya ingin beli\n\n";
        
        cart.forEach((item, index) => {
            orderText += `${index + 1}. ${item.name} ${item.quantity}x - Porsi ${item.size}\n`;
        });
        
        // Add total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderText += `\nTotal: Rp ${formatNumber(total)}`;
        
        // Set order text in modal
        orderTextElement.textContent = orderText;
        
        // Set WhatsApp link
        const waPhone = "628123456789"; // Replace with your WhatsApp number
        const encodedText = encodeURIComponent(orderText);
        whatsappLinkElement.href = `https://wa.me/${waPhone}?text=${encodedText}`;
        
        // Show modal
        checkoutModal.show();
    });
    
    // Copy order text
    copyTextButton.addEventListener('click', function() {
        navigator.clipboard.writeText(orderTextElement.textContent)
            .then(() => {
                copyAlert.classList.remove('d-none');
                setTimeout(() => {
                    copyAlert.classList.add('d-none');
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    });
});