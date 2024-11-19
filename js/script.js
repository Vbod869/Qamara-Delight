document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Close menu when clicking on a nav link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    const contactForm = document.getElementById('contact-form');
    let cart = [];

    // Inisialisasi ScrollReveal
    ScrollReveal().reveal('.product-card', {
        delay: 200,
        distance: '30px',
        origin: 'bottom',
        interval: 100,
        mobile: true
    });

    ScrollReveal().reveal('.about-content, .contact-container', {
        delay: 200,
        distance: '30px',
        origin: 'bottom',
        mobile: true
    });

    // Fungsi untuk menambahkan produk ke keranjang
    function addToCart(event) {
        const button = event.target;
        const product = button.parentElement;
        const productName = product.querySelector('h3').textContent;
        const productPrice = product.querySelector('.price').textContent;
        const priceValue = parseInt(productPrice.replace('Rp ', '').replace('.', ''));

        cart.push({ name: productName, price: priceValue });
        updateCartCount();
        updateCartModal();

        // Animasi tombol
        button.textContent = 'Ditambahkan!';
        button.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            button.textContent = 'Tambah ke Keranjang';
            button.style.backgroundColor = '';
        }, 1000);
    }

    // Fungsi untuk memperbarui jumlah item di keranjang
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'inline' : 'none';
    }

    // Fungsi untuk memperbarui modal keranjang
    function updateCartModal() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <p>${item.name} - Rp ${item.price.toLocaleString('id-ID')}</p>
                <button class="remove-item" data-index="${index}">Hapus</button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price;
        });

        cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
    }

    // Fungsi untuk menghapus item dari keranjang
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartCount();
        updateCartModal();
    }

    // Event listener untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Event listener untuk ikon keranjang
    cartIcon.addEventListener('click', () => {
        updateCartModal();
        cartModal.style.display = 'block';
    });

    // Event listener untuk tombol close pada modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });

    // Event listener untuk klik di luar modal
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    // Event listener untuk tombol checkout
    checkoutBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
        updateOrderSummary();
        checkoutModal.style.display = 'block';
    });

    // Fungsi untuk memperbarui ringkasan pesanan
    function updateOrderSummary() {
        orderSummary.innerHTML = '<h3>Ringkasan Pesanan:</h3>';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = `${item.name} - Rp ${item.price.toLocaleString('id-ID')}`;
            orderSummary.appendChild(itemElement);
            total += item.price;
        });

        const totalElement = document.createElement('p');
        totalElement.innerHTML = `<strong>Total: Rp ${total.toLocaleString('id-ID')}</strong>`;
        orderSummary.appendChild(totalElement);
    }

    // Tambahkan fungsi baru untuk membuat pesan WhatsApp
    function createWhatsAppMessage(formData) {
        let message = "Halo, saya ingin memesan:\n\n";
        let total = 0;

        cart.forEach(item => {
            message += `${item.name} - Rp ${item.price.toLocaleString('id-ID')}\n`;
            total += item.price;
        });

        message += `\nTotal: Rp ${total.toLocaleString('id-ID')}\n\n`;
        message += `Nama: ${formData.get('name')}\n`;
        message += `Email: ${formData.get('email')}\n`;
        message += `Telepon: ${formData.get('phone')}\n`;
        message += `Alamat: ${formData.get('address')}`;

        return encodeURIComponent(message);
    }


    // Event listener untuk form checkout
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const whatsappMessage = createWhatsAppMessage(formData);
        const whatsappNumber = "62895358165040"; // Ganti dengan nomor WhatsApp toko Anda
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');

        // Reset keranjang dan tutup modal
        cart = [];
        updateCartCount();
        checkoutModal.style.display = 'none';
        checkoutForm.reset();
    });

    // Event listener untuk tombol hapus item
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });

    // Fungsi untuk menangani pengiriman formulir kontak
    function handleContactFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simulasi pengiriman pesan
        setTimeout(() => {
            alert(`Terima kasih, ${name}! Pesan Anda telah diterima. Kami akan menghubungi Anda di ${email} segera.`);
            contactForm.reset();
        }, 1000);

        // Animasi tombol submit
        const submitButton = contactForm.querySelector('button');
        submitButton.textContent = 'Mengirim...';
        submitButton.disabled = true;
        setTimeout(() => {
            submitButton.textContent = 'Kirim Pesan';
            submitButton.disabled = false;
        }, 1000);
    }

    // Menambahkan event listener ke formulir kontak
    contactForm.addEventListener('submit', handleContactFormSubmit);

    // Animasi scroll halus untuk navigasi
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animasi parallax untuk hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        document.querySelector('.hero').style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
});

const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show'); // Menambahkan atau menghapus kelas "show"
});
