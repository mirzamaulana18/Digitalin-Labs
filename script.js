/* =============================================
   DigitalinLabs — Fixed & Enhanced JavaScript
   =============================================
   BUG FIXES:
   1. backToTopBtn dideklarasikan lebih awal
   2. Honeypot check dipindah ke dalam event listener (bukan top-level)
   3. Hapus duplicate event listener send-wa-btn
   4. WA_NUMBER diupdate ke nomor yang benar
   ============================================= */

// ===== 1. Deklarasi elemen penting di awal =====
const backToTopBtn = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');

// ===== 2. AOS (Scroll Animation) =====
AOS.init({
    once: true,
    offset: 80,
    duration: 700,
});

// ===== 3. Footer Year =====
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ===== 4. Sticky Navbar + Back to Top Visibility =====
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});

// ===== 5. Dark / Light Mode Toggle =====
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

// ===== 6. Mobile Hamburger Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

// ===== 7. FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const isActive = question.classList.contains('active');
        document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
        if (!isActive) question.classList.add('active');
    });
});

// ===== 8. WhatsApp Number =====
const WA_NUMBER = '6285285560661';

function buildWaLink(service, nama, detail) {
    const cleanService = sanitizeInput(service);
    const cleanNama = sanitizeInput(nama);
    const cleanDetail = sanitizeInput(detail || '');
    let msg = `Halo DigitalinLabs! 👋\n\nSaya tertarik dengan *${cleanService}*.\n`;
    if (cleanNama) msg += `\nNama saya: *${cleanNama}*`;
    if (cleanDetail) msg += `\nDetail kebutuhan: ${cleanDetail}`;
    msg += `\n\nMohon informasi lebih lanjut. Terima kasih! 🙏`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ===== 9. Order Modal =====
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
    setTimeout(() => document.getElementById('modal-nama').focus(), 100);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openModal(btn.dataset.service || 'Layanan DigitalinLabs');
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

modalSendBtn.addEventListener('click', () => {
    const nama = document.getElementById('modal-nama').value.trim();
    const wa = document.getElementById('modal-wa').value.trim();
    const detail = document.getElementById('modal-detail').value.trim();

    if (!nama) { alert('Mohon isi nama lengkap Anda.'); document.getElementById('modal-nama').focus(); return; }
    if (!validatePhone(wa)) { alert('Format nomor WhatsApp tidak valid.'); document.getElementById('modal-wa').focus(); return; }

    window.open(buildWaLink(currentService, nama, detail), '_blank');
    closeModal();
});

// ===== 10. Testimonials Slider =====
const track = document.getElementById('testimonials-track');
const dotsContainer = document.getElementById('testimonial-dots');
const cards = track.querySelectorAll('.testimonial-card');
let currentSlide = 0;
let autoSlideTimer;

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
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== 13. Active Nav Highlight =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
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

sections.forEach(s => sectionObserver.observe(s));

// ============================================
// SECURITY — FUNGSI KEAMANAN
// ============================================

function sanitizeInput(text) {
    if (!text) return '';
    return text
        .replace(/[\u200B-\u200D\uFEFF\u00AD\u034F\u2060\u2800]/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/[\u0600-\u06FF\u0750-\u077F]{10,}/g, '')
        .replace(/https?:\/\/[^\s]*/gi, '[link dihapus]')
        .replace(/[<>\"\'`;]/g, '')
        .replace(/[\r\n]{3,}/g, '\n\n')
        .replace(/\s{5,}/g, ' ')
        .replace(/(.)\1{9,}/g, '$1$1$1')
        .trim();
}

function validateName(name) {
    if (!name || name.length < 2 || name.length > 50) return false;
    return /^[a-zA-Z\s\.,'\-]+$/.test(name);
}

function validatePhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+62|62|0)[0-9]{8,13}$/.test(cleaned);
}

function detectVirtex(text) {
    if (!text) return false;
    const checks = [
        /[\u0600-\u06FF]{5,}/,
        /[\u0300-\u036F]{3,}/,
        /[\u200B-\u200F\u2028-\u202F]/,
        /([\uD800-\uDBFF][\uDC00-\uDFFF]){5,}/,
        /(.)\1{15,}/,
        /<script|javascript:|on\w+\s*=|eval\(|alert\(|document\.|window\./gi,
        /('|--|;|DROP\s|SELECT\s|INSERT\s|UPDATE\s|DELETE\s|UNION\s|WHERE\s)/gi,
    ];
    return checks.some(pattern => pattern.test(text));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function showFormError(message) {
    const existing = document.querySelector('.form-error-msg');
    if (existing) existing.remove();
    const errDiv = document.createElement('p');
    errDiv.className = 'form-error-msg';
    errDiv.style.cssText = 'color:#ef4444;font-size:0.85rem;font-weight:600;margin-top:10px;text-align:center;';
    errDiv.textContent = message;
    const btn = document.getElementById('send-wa-btn');
    btn.insertAdjacentElement('afterend', errDiv);
    setTimeout(() => { if (errDiv.parentNode) errDiv.remove(); }, 4000);
}

// ===== 14. Contact Form — dengan semua security =====
let lastOrderTime = 0;
let orderAttempts = 0;
const ORDER_COOLDOWN = 30000;
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 300000;
let blockedUntil = 0;

document.getElementById('send-wa-btn').addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const wa = document.getElementById('whatsapp').value.trim();
    const layanan = document.getElementById('layanan-select').value;
    const pesan = document.getElementById('pesan').value.trim();
    const now = Date.now();

    // ✅ Cek honeypot — HARUS di dalam event listener, bukan di luar
    const honeypot = document.getElementById('hp-name').value;
    if (honeypot !== '') {
        showFormError('✅ Pesan berhasil dikirim!'); // Pura-pura sukses
        return;
    }

    // Cek blokir
    if (now < blockedUntil) {
        const menitSisa = Math.ceil((blockedUntil - now) / 60000);
        showFormError(`🚫 Terlalu banyak percobaan. Coba lagi dalam ${menitSisa} menit.`);
        return;
    }

    // Rate limiting
    if (now - lastOrderTime < ORDER_COOLDOWN) {
        const detikSisa = Math.ceil((ORDER_COOLDOWN - (now - lastOrderTime)) / 1000);
        showFormError(`⏳ Tunggu ${detikSisa} detik sebelum mengirim lagi.`);
        return;
    }

    // Hitung percobaan gagal
    orderAttempts++;
    if (orderAttempts >= MAX_ATTEMPTS) {
        blockedUntil = now + BLOCK_DURATION;
        orderAttempts = 0;
        showFormError('🚫 Terlalu banyak percobaan. Anda diblokir sementara 5 menit.');
        return;
    }

    // Validasi
    if (!nama) { showFormError('⚠️ Mohon isi nama lengkap Anda.'); return; }
    if (!validateName(nama)) { showFormError('⚠️ Nama hanya boleh berisi huruf dan spasi.'); return; }
    if (!validatePhone(wa)) { showFormError('⚠️ Format nomor WhatsApp tidak valid. Contoh: 08123456789'); return; }
    if (!layanan) { showFormError('⚠️ Mohon pilih layanan yang diminati.'); return; }
    if ((nama + wa + pesan).length > 1000) { showFormError('⚠️ Input terlalu panjang.'); return; }

    // Deteksi Virtex
    if (detectVirtex(nama) || detectVirtex(pesan)) {
        showFormError('⚠️ Input mengandung karakter yang tidak diizinkan.');
        blockedUntil = now + BLOCK_DURATION;
        return;
    }

    // Sukses — reset counter
    orderAttempts = 0;
    lastOrderTime = Date.now();

    window.open(buildWaLink(layanan, nama, pesan || 'Ingin konsultasi lebih lanjut.'), '_blank');
});

// ===== 15. Character Counter =====
const pesanInput = document.getElementById('pesan');
const pesanCounter = document.getElementById('pesan-counter');

pesanInput.addEventListener('input', function () {
    const length = this.value.length;
    pesanCounter.textContent = `${length}/500 karakter`;
    pesanCounter.classList.remove('warning', 'danger');
    if (length >= 400) pesanCounter.classList.add('danger');
    else if (length >= 300) pesanCounter.classList.add('warning');
});

// ============================================
// SUPABASE — REVIEW / KOMENTAR
// ============================================
const SUPABASE_URL = 'https://mmbyfihyirhfwqwiqvvi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYnlmaWh5aXJoZndxd2lxdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTgwODAsImV4cCI6MjA5NDUzNDA4MH0.6g0_nuPTew3sIJkaQ5yP_Ip45NYcB-uF3coBAL6cQQk';

async function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    try {
        reviewsList.innerHTML = '<p class="loading-reviews">Memuat review...</p>';

        const res = await fetch(`${SUPABASE_URL}/rest/v1/komentar?order=created_at.desc&limit=20`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">Belum ada review. Jadilah yang pertama! 😊</p>';
            return;
        }

        reviewsList.innerHTML = data.map(review => `
            <div class="review-card">
                <div class="review-card-header">
                    <strong>${escapeHtml(review.nama || 'Anonim')}</strong>
                    <span class="review-card-stars">${'★'.repeat(Number(review.rating) || 5)}${'☆'.repeat(5 - (Number(review.rating) || 5))}</span>
                </div>
                <p>${escapeHtml(review.pesan || '')}</p>
                <span class="review-card-date">${formatTanggal(review.created_at)}</span>
            </div>
        `).join('');

    } catch (err) {
        console.error('Review load error:', err);
        reviewsList.innerHTML = '<p class="no-reviews">Gagal memuat review. Coba refresh halaman.</p>';
    }
}

async function submitReview() {
    const nama = document.getElementById('review-nama').value.trim();
    const pesan = document.getElementById('review-pesan').value.trim();
    const btn = document.getElementById('submit-review');

    // Validasi
    if (!nama || nama.length < 2) { showStatus('⚠️ Nama minimal 2 karakter.', 'error'); return; }
    if (selectedRating === 0) { showStatus('⚠️ Pilih rating bintang dulu.', 'error'); return; }
    if (!pesan || pesan.length < 10) { showStatus('⚠️ Review minimal 10 karakter.', 'error'); return; }
    if (detectVirtex(nama) || detectVirtex(pesan)) { showStatus('⚠️ Input mengandung karakter tidak diizinkan.', 'error'); return; }

    const cleanNama = sanitizeInput(nama);
    const cleanPesan = sanitizeInput(pesan);

    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/komentar`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nama: cleanNama, pesan: cleanPesan, rating: selectedRating })
        });

        if (res.ok || res.status === 201) {
            showStatus('✅ Review berhasil dikirim! Terima kasih 🙏', 'success');
            document.getElementById('review-nama').value = '';
            document.getElementById('review-pesan').value = '';
            document.getElementById('char-count').textContent = '0/500 karakter';
            selectedRating = 0;
            document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            await loadReviews();
        } else {
            const errText = await res.text();
            console.error('Submit error:', res.status, errText);
            showStatus('❌ Gagal mengirim. Coba lagi.', 'error');
        }
    } catch (err) {
        console.error('Submit exception:', err);
        showStatus('❌ Koneksi bermasalah. Coba lagi.', 'error');
    }

    btn.disabled = false;
    btn.textContent = 'Kirim Review';
}

function showStatus(msg, type) {
    const status = document.getElementById('review-status');
    if (!status) return;
    status.textContent = msg;
    status.className = 'review-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'review-status'; }, 5000);
}

function formatTanggal(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Star rating
let selectedRating = 0;
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('mouseover', function () {
        const val = parseInt(this.dataset.value);
        document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < val));
    });
    star.addEventListener('mouseout', function () {
        document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });
    star.addEventListener('click', function () {
        selectedRating = parseInt(this.dataset.value);
        document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });
});

// Char counter review
const reviewPesanInput = document.getElementById('review-pesan');
if (reviewPesanInput) {
    reviewPesanInput.addEventListener('input', function () {
        const charCount = document.getElementById('char-count');
        if (charCount) charCount.textContent = `${this.value.length}/500 karakter`;
    });
}

// Submit review
const submitReviewBtn = document.getElementById('submit-review');
if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', submitReview);
}

// Load reviews saat halaman dibuka
loadReviews();
