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
// Cek honeypot
const honeypot = document.getElementById('hp-name').value;
if (honeypot !== '') {
    // Pura-pura berhasil agar bot tidak tahu diblokir
    showFormError('✅ Pesan berhasil dikirim!');
    return;
}

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


// ============================================
// SECURITY MAKSIMAL — FORM ORDER
// ============================================

// Rate limiting
let lastOrderTime = 0;
let orderAttempts = 0;
const ORDER_COOLDOWN = 30000;    // 30 detik antar kiriman
const MAX_ATTEMPTS = 5;          // Maksimal 5x percobaan
const BLOCK_DURATION = 300000;   // Diblokir 5 menit kalau melebihi

let blockedUntil = 0;

// ---- Sanitasi Input ----
function sanitizeInput(text) {
    if (!text) return '';
    return text
        // Hapus karakter zero-width (sering dipakai Virtex)
        .replace(/[\u200B-\u200D\uFEFF\u00AD\u034F\u2060\u2800]/g, '')
        // Hapus karakter kontrol berbahaya
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        // Batasi emoji berturutan (max 3)
        .replace(/([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}){4,}/gu, '...')
        // Hapus karakter Arab/RTL berlebihan (Virtex)
        .replace(/[\u0600-\u06FF\u0750-\u077F]{10,}/g, '')
        // Hapus URL
        .replace(/https?:\/\/[^\s]*/gi, '[link dihapus]')
        // Hapus karakter XSS
        .replace(/[<>\"\'`;]/g, '')
        // Hapus newline berlebihan
        .replace(/[\r\n]{3,}/g, '\n\n')
        // Hapus spasi berlebihan
        .replace(/\s{5,}/g, ' ')
        // Hapus karakter berulang berlebihan (aaaaaa / !!!!!!)
        .replace(/(.)\1{9,}/g, '$1$1$1')
        .trim();
}

// ---- Validasi Nama ----
function validateName(name) {
    if (!name || name.length < 2 || name.length > 50) return false;
    // Hanya huruf, spasi, titik, koma, apostrof
    return /^[a-zA-Z\s\.,'\-]+$/.test(name);
}

// ---- Validasi Nomor WA ----
function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+62|62|0)[0-9]{8,13}$/.test(cleaned);
}

// ---- Deteksi Virtex & Karakter Berbahaya ----
function detectVirtex(text) {
    const checks = [
        // Karakter Arab berlebihan (Virtex klasik)
        /[\u0600-\u06FF]{5,}/,
        // Karakter Zalgo (teks berantakan)
        /[\u0300-\u036F]{3,}/,
        // Karakter invisible/zero-width
        /[\u200B-\u200F\u2028-\u202F]/,
        // Emoji berlebihan
        /([\uD800-\uDBFF][\uDC00-\uDFFF]){5,}/,
        // Karakter berulang ekstrem
        /(.)\1{15,}/,
        // Script injection
        /<script|javascript:|on\w+\s*=|eval\(|alert\(|document\.|window\./gi,
        // SQL injection
        /('|--|;|DROP|SELECT|INSERT|UPDATE|DELETE|UNION|WHERE)\s/gi,
    ];
    return checks.some(pattern => pattern.test(text));
}

// ---- Cek Panjang Total Pesan ----
function checkTotalLength(nama, wa, pesan) {
    const total = (nama + wa + pesan).length;
    return total <= 1000; // Maksimal 1000 karakter total
}

// ---- Tampilkan Error di Form ----
function showFormError(message) {
    // Hapus error lama kalau ada
    const existing = document.querySelector('.form-error-msg');
    if (existing) existing.remove();

    const errDiv = document.createElement('p');
    errDiv.className = 'form-error-msg';
    errDiv.style.cssText = 'color:#ef4444;font-size:0.85rem;font-weight:600;margin-top:10px;text-align:center;';
    errDiv.textContent = message;

    const btn = document.getElementById('send-wa-btn');
    btn.insertAdjacentElement('afterend', errDiv);
    setTimeout(() => errDiv.remove(), 4000);
}

// ---- Event Listener Form Order ----
document.getElementById('send-wa-btn').addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const wa = document.getElementById('whatsapp').value.trim();
    const layanan = document.getElementById('layanan-select').value;
    const pesan = document.getElementById('pesan').value.trim();
    const now = Date.now();

    // Cek apakah sedang diblokir
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

    // Validasi nama
    if (!nama) { showFormError('⚠️ Mohon isi nama lengkap Anda.'); return; }
    if (!validateName(nama)) {
        showFormError('⚠️ Nama hanya boleh berisi huruf dan spasi.'); return;
    }

    // Validasi WA
    if (!wa) { showFormError('⚠️ Mohon isi nomor WhatsApp Anda.'); return; }
    if (!validatePhone(wa)) {
        showFormError('⚠️ Format nomor WhatsApp tidak valid. Contoh: 08123456789'); return;
    }

    // Validasi layanan
    if (!layanan) { showFormError('⚠️ Mohon pilih layanan yang diminati.'); return; }

    // Cek panjang total
    if (!checkTotalLength(nama, wa, pesan)) {
        showFormError('⚠️ Input terlalu panjang.'); return;
    }

    // Deteksi Virtex & karakter berbahaya
    if (detectVirtex(nama) || detectVirtex(pesan)) {
        showFormError('⚠️ Input mengandung karakter yang tidak diizinkan.');
        // Blokir langsung kalau ada Virtex
        blockedUntil = now + BLOCK_DURATION;
        return;
    }

    // Semua aman — sanitasi dan kirim
    const cleanNama = sanitizeInput(nama);
    const cleanPesan = sanitizeInput(pesan);

    // Reset percobaan kalau berhasil
    orderAttempts = 0;
    lastOrderTime = Date.now();

    window.open(buildWaLink(layanan, cleanNama, cleanPesan || 'Ingin konsultasi lebih lanjut.'), '_blank');
});


// Character counter form kontak
const pesanInput = document.getElementById('pesan');
const pesanCounter = document.getElementById('pesan-counter');

pesanInput.addEventListener('input', function() {
    const length = this.value.length;
    pesanCounter.textContent = `${length}/500 karakter`;
    
    pesanCounter.classList.remove('warning', 'danger');
    if (length >= 400) pesanCounter.classList.add('danger');
    else if (length >= 300) pesanCounter.classList.add('warning');
});



// ===== SUPABASE KOMENTAR =====
const SUPABASE_URL = 'https://mmbyfihyirhfwqwiqvvi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYnlmaWh5aXJoZndxd2lxdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTgwODAsImV4cCI6MjA5NDUzNDA4MH0.6g0_nuPTew3sIJkaQ5yP_Ip45NYcB-uF3coBAL6cQQk';

// Ambil semua review dari Supabase
async function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/komentar?order=created_at.desc&limit=20`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await res.json();

        if (!data || data.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">Belum ada review. Jadilah yang pertama! 😊</p>';
            return;
        }

        reviewsList.innerHTML = data.map(review => `
            <div class="review-card">
                <div class="review-card-header">
                    <strong>${escapeHtml(review.nama)}</strong>
                    <span class="review-card-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p>${escapeHtml(review.pesan)}</p>
                <span class="review-card-date">${formatTanggal(review.created_at)}</span>
            </div>
        `).join('');
    } catch (err) {
        reviewsList.innerHTML = '<p class="no-reviews">Gagal memuat review. Coba refresh halaman.</p>';
    }
}

// Kirim review baru ke Supabase
async function submitReview() {
    const nama = document.getElementById('review-nama').value.trim();
    const pesan = document.getElementById('review-pesan').value.trim();
    const status = document.getElementById('review-status');
    const btn = document.getElementById('submit-review');

    // Validasi
    if (!nama || nama.length < 2) {
        showStatus('⚠️ Nama minimal 2 karakter.', 'error'); return;
    }
    if (selectedRating === 0) {
        showStatus('⚠️ Pilih rating bintang dulu.', 'error'); return;
    }
    if (!pesan || pesan.length < 10) {
        showStatus('⚠️ Review minimal 10 karakter.', 'error'); return;
    }

    // Loading state
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
            body: JSON.stringify({ nama, pesan, rating: selectedRating })
        });

        if (res.ok) {
            showStatus('✅ Review berhasil dikirim! Terima kasih 🙏', 'success');
            // Reset form
            document.getElementById('review-nama').value = '';
            document.getElementById('review-pesan').value = '';
            document.getElementById('char-count').textContent = '0/500 karakter';
            selectedRating = 0;
            document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            loadReviews(); // Refresh daftar review
        } else {
            showStatus('❌ Gagal mengirim. Coba lagi.', 'error');
        }
    } catch (err) {
        showStatus('❌ Koneksi bermasalah. Coba lagi.', 'error');
    }

    btn.disabled = false;
    btn.textContent = 'Kirim Review';
}

// Helper functions
function showStatus(msg, type) {
    const status = document.getElementById('review-status');
    status.textContent = msg;
    status.className = 'review-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'review-status'; }, 4000);
}

function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatTanggal(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Star rating interaction
let selectedRating = 0;
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('mouseover', function() {
        const val = parseInt(this.dataset.value);
        document.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('active', i < val);
        });
    });
    star.addEventListener('mouseout', function() {
        document.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('active', i < selectedRating);
        });
    });
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.value);
        document.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('active', i < selectedRating);
        });
    });
});

// Char counter
document.getElementById('review-pesan').addEventListener('input', function() {
    document.getElementById('char-count').textContent = `${this.value.length}/500 karakter`;
});

// Submit button
document.getElementById('submit-review').addEventListener('click', submitReview);

// Load reviews saat halaman dibuka
loadReviews();