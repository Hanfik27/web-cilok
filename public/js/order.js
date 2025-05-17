document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
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
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const size = this.dataset.size;
            
            document.querySelectorAll(`.size-button[data-item-id="${itemId}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            document.querySelectorAll(`.price-tag[id^="price-${itemId}-"]`).forEach(priceTag => {
                priceTag.style.display = 'none';
            });
            document.getElementById(`price-${itemId}-${size}`).style.display = '';
        });
    });
    
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
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            const itemName = this.dataset.itemName;
            const selectedSize = document.querySelector(`.size-button.active[data-item-id="${itemId}"]`).dataset.size;
            const quantity = parseInt(document.getElementById(`quantity-${itemId}`).value);
            
            const menuItem = menuItems.find(item => item.id === itemId);
            const price = menuItem.price[selectedSize];
            
            const existingItemIndex = cart.findIndex(item => 
                item.id === itemId && item.size === selectedSize
            );
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({
                    id: itemId,
                    name: itemName,
                    size: selectedSize,
                    price: price,
                    quantity: quantity
                });
            }
            
            updateCart();
            
            showAddToCartNotification(itemName, quantity, selectedSize);
        });
    });
    
    function showAddToCartNotification(itemName, quantity, size) {
        let notif = document.getElementById('cart-notification');
        if (notif) {
            notif.remove();
        }
        
    notif = document.createElement('div');
    notif.id = 'cart-notification';
    notif.className = 'alert alert-success position-fixed';
    notif.style.top = '10%'; 
    notif.style.left = '50%'; 
    notif.style.transform = 'translate(-50%, -50%)';
    notif.style.zIndex = '1050';
    notif.style.maxWidth = '300px';
    notif.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    notif.innerHTML = `<strong>${itemName}</strong> ${quantity}x porsi ${size} ditambahkan ke keranjang`;

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.5s';
        setTimeout(() => notif.remove(), 500);
    }, 2500);
        
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transition = 'opacity 0.5s';
            setTimeout(() => notif.remove(), 500);
        }, 2500);
    }
    
    function updateCart() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
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
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    updateCart();
                });
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `Rp ${formatNumber(total)}`;
            checkoutButton.disabled = false;
        } else {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted">Keranjang kosong</p>';
            cartTotalElement.textContent = 'Rp 0';
            checkoutButton.disabled = true;
        }
    }
    
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    clearCartButton.addEventListener('click', function() {
        cart = [];
        updateCart();
    });
    
    checkoutButton.addEventListener('click', function() {
        let orderText = "Halo, saya ingin beli\n\n";
        
        cart.forEach((item, index) => {
            orderText += `${index + 1}. ${item.name} ${item.quantity}x - Porsi ${item.size}\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderText += `\nTotal: Rp ${formatNumber(total)}`;
        
        orderTextElement.textContent = orderText;
        
        const waPhone = "628123456789";
        const encodedText = encodeURIComponent(orderText);
        whatsappLinkElement.href = `https://wa.me/${waPhone}?text=${encodedText}`;
        
        checkoutModal.show();
    });
    
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