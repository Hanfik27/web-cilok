<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu Makanan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/order.css') }}">
</head>
<body>
    <div class="container py-5">
        <header class="mb-5">
            <div class="d-flex justify-content-between align-items-center">
                <h1 class="mb-0">Menu Makanan</h1>
                <div class="position-relative">
                    <button id="cart-button" class="btn btn-primary position-relative">
                        <i class="fas fa-shopping-cart"></i> Keranjang
                        <span id="cart-count" class="cart-badge">0</span>
                    </button>
                </div>
            </div>
        </header>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            @foreach($menuItems as $item)
            <div class="col">
                <div class="card menu-card">
                    <img src="{{ asset('images/' . $item['image']) }}" class="card-img-top card-image" alt="{{ $item['name'] }}">
                    <div class="card-body">
                        <h5 class="card-title">{{ $item['name'] }}</h5>
                        <p class="card-text">{{ $item['description'] }}</p>
                        
                        <div class="d-flex justify-content-between mb-3">
                            <div class="btn-group" role="group" aria-label="Pilih Ukuran">
                                <button type="button" class="btn btn-outline-primary size-button" data-size="S" data-item-id="{{ $item['id'] }}">S</button>
                                <button type="button" class="btn btn-outline-primary size-button active" data-size="M" data-item-id="{{ $item['id'] }}">M</button>
                                <button type="button" class="btn btn-outline-primary size-button" data-size="L" data-item-id="{{ $item['id'] }}">L</button>
                            </div>
                            <div class="align-self-center">
                                @foreach($item['price'] as $size => $price)
                                <span class="price-tag" id="price-{{ $item['id'] }}-{{ $size }}" style="{{ $size == 'M' ? '' : 'display: none;' }}">
                                    Rp {{ number_format($price, 0, ',', '.') }}
                                </span>
                                @endforeach
                            </div>
                        </div>

                        <div class="quantity-control mb-3">
                            <button class="quantity-btn dec-quantity" data-item-id="{{ $item['id'] }}">-</button>
                            <input type="number" class="quantity-input" id="quantity-{{ $item['id'] }}" value="1" min="1" max="10">
                            <button class="quantity-btn inc-quantity" data-item-id="{{ $item['id'] }}">+</button>
                        </div>
                        
                        <button class="btn btn-success w-100 add-to-cart" 
                                data-item-id="{{ $item['id'] }}" 
                                data-item-name="{{ $item['name'] }}">
                            <i class="fas fa-plus"></i> Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <div id="cart-drawer">
        <div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">Keranjang Anda</h4>
                <button id="close-cart" class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="cart-items" class="mb-3">
                <!-- Cart items will be displayed here -->
                <p class="text-center text-muted">Keranjang kosong</p>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-2">
                <span>Total:</span>
                <span id="cart-total">Rp 0</span>
            </div>
            <button id="checkout-button" class="btn btn-success w-100 mb-3" disabled>
                <i class="fas fa-check"></i> Checkout
            </button>
            <button id="clear-cart" class="btn btn-outline-danger w-100">
                <i class="fas fa-trash"></i> Kosongkan Keranjang
            </button>
        </div>
    </div>

    <div class="overlay" id="cart-overlay"></div>

    <!-- Checkout Modal -->
    <div class="modal fade" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="checkoutModalLabel">Checkout</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Pesanan Anda:</p>
                    <div class="border p-3 mb-3">
                        <pre id="order-text" class="mb-0"></pre>
                    </div>
                    
                    <div class="d-flex justify-content-between mb-3">
                        <button id="copy-text" class="btn btn-primary">
                            <i class="fas fa-copy"></i> Salin Teks
                        </button>
                        <a id="whatsapp-link" href="#" target="_blank" class="btn btn-success">
                            <i class="fab fa-whatsapp"></i> Kirim via WhatsApp
                        </a>
                    </div>
                    
                    <div class="alert alert-success d-none" id="copy-alert">
                        Teks berhasil disalin!
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const menuItems = @json($menuItems);
    </script>
    <script src="{{ asset('js/order.js') }}"></script>
</body>
</html>