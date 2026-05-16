/* =============================================
   DigitalinLabs — Enhanced JavaScript
   ============================================= */

// ===== 1. AOS (Scroll Animation) =====
AOS.init({
    once: true,
    offset: 80,
    duration: 700,
});

// ===== 2. Footer Year =====
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ===== 3. Sticky Navbar Shrink =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Back to top visibility
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});

// ===== 4. Dark / Light Mode Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== 5. Mobile Hamburger Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on nav link click
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

// ===== 6. FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const isActive = question.classList.contains('active');
        // Close all
        document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
        // Open clicked (unless it was already open)
        if (!isActive) question.classList.add('active');
    });
});

// ===== 7. WhatsApp Number — ganti dengan nomor Anda =====
const WA_NUMBER = '6281234567890'; // Format: 62 + nomor tanpa 0 depan

function buildWaLink(service, nama, detail) {
    let msg = `Halo DigitalinLabs! 👋\n\nSaya tertarik dengan *${service}*.\n`;
    if (nama) msg += `\nNama saya: *${nama}*`;
    if (detail) msg += `\nDetail kebutuhan: ${detail}`;
    msg += `\n\nMohon informasi lebih lanjut. Terima kasih! 🙏`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ===== 8. Order Modal =====
const modal = document.getElementById('order-modal');
const modalClose = document.getElementById('modal-close');
const modalSendBtn = document.getElementById('modal-send-btn');
const modalServiceLabel = document.getElementById('modal-service-name');
let currentService = '';

function openModal(serviceName) {
    currentService = serviceName;
    modalServiceLabel.textContent = serviceName;
    document.getElementById('modal-nama').value = '';
    document.getElementById('modal-wa').value = '';
    document.getElementById('modal-detail').value = '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-nama').focus();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Attach order modal to all .wa-btn buttons
document.querySelectorAll('.wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openModal(btn.dataset.service || 'Layanan DigitalinLabs');
    });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

modalSendBtn.addEventListener('click', () => {
    const nama = document.getElementById('modal-nama').value.trim();
    const wa = document.getElementById('modal-wa').value.trim();
    const detail = document.getElementById('modal-detail').value.trim();

    if (!nama) {
        alert('Mohon isi nama lengkap Anda.');
        document.getElementById('modal-nama').focus();
        return;
    }
    if (!wa) {
        alert('Mohon isi nomor WhatsApp Anda.');
        document.getElementById('modal-wa').focus();
        return;
    }

    window.open(buildWaLink(currentService, nama, detail), '_blank');
    closeModal();
});

// ===== 9. Contact Form — Send via WA =====
document.getElementById('send-wa-btn').addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const wa = document.getElementById('whatsapp').value.trim();
    const layanan = document.getElementById('layanan-select').value;
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama) { alert('Mohon isi nama lengkap Anda.'); document.getElementById('nama').focus(); return; }
    if (!wa) { alert('Mohon isi nomor WhatsApp Anda.'); document.getElementById('whatsapp').focus(); return; }
    if (!layanan) { alert('Mohon pilih layanan yang diminati.'); document.getElementById('layanan-select').focus(); return; }

    window.open(buildWaLink(layanan, nama, pesan || 'Ingin konsultasi lebih lanjut.'), '_blank');
});

// ===== 10. Testimonials Slider =====
const track = document.getElementById('testimonials-track');
const dotsContainer = document.getElementById('testimonial-dots');
const cards = track.querySelectorAll('.testimonial-card');
let currentSlide = 0;
let autoSlideTimer;

// Build dots
cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    resetAutoSlide();
}

document.getElementById('prev-btn').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('next-btn').addEventListener('click', () => goToSlide(currentSlide + 1));

function startAutoSlide() {
    autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

startAutoSlide();

// Touch/swipe support for slider
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
});

// ===== 11. Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
            const match = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('hidden', !match);
        });
    });
});

// ===== 12. Back to Top =====
const backToTopBtn = document.getElementById('back-to-top');
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== 13. Smooth active nav highlight =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.style.color = 'var(--primary-color)';
                }
            });
        }
    });
}, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => observer.observe(s));
