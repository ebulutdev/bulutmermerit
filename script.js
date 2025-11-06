// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Video Playback Control - Pause on scroll for better performance
const heroVideos = document.querySelectorAll('.hero-video');
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        heroVideos.forEach(video => {
            if (isElementInViewport(video)) {
                video.play().catch(e => console.log('Video play failed:', e));
            } else {
                // Optionally pause videos not in viewport for performance
                // video.pause();
            }
        });
        setTimeout(() => {
            isScrolling = false;
        }, 100);
    }
}, { passive: true });

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Image Modal for Catalog
const catalogItems = document.querySelectorAll('.catalog-item');
const body = document.body;

// Create modal element
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <span class="modal-close">&times;</span>
    <img class="modal-content" src="" alt="Mermerit Sehpa">
`;

document.body.appendChild(modal);

const modalImg = modal.querySelector('.modal-content');
const modalClose = modal.querySelector('.modal-close');

// Open modal on catalog item click
catalogItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('active');
            body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .value-item, .catalog-item, .contact-card, .thickness-card, .order-form-section');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Video Autoplay Handling for Mobile - Optimized
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.hero-video');
    
    videos.forEach(video => {
        // Mobil cihazlar için gerekli özellikler
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('autoplay', '');
        
        // Video yüklendiğinde oynat
        const playVideo = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Video başarıyla oynatıldı
                        video.style.opacity = '1';
                    })
                    .catch(error => {
                        // Mobil cihazlarda autoplay engellenebilir
                        console.log('Video autoplay prevented:', error);
                        // Kullanıcı etkileşimi bekleniyor
                        video.style.opacity = '0.8';
                    });
            }
        };
        
        // Video yüklendiğinde oynat
        if (video.readyState >= 2) {
            playVideo();
        } else {
            video.addEventListener('loadeddata', playVideo, { once: true });
            video.addEventListener('canplay', playVideo, { once: true });
        }
        
        // Video hata durumunda
        video.addEventListener('error', (e) => {
            console.error('Video yükleme hatası:', e);
        });
        
        // Intersection Observer ile görünür olduğunda oynat
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Autoplay engellenmişse sessizce devam et
                    });
                } else {
                    // Video görünür değilse duraklat (performans için)
                    // video.pause();
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(video);
    });
    
    // Sayfa görünür olduğunda videoları oynat
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            videos.forEach(video => {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            });
        }
    });
});

// Performance: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// Order Form Functionality
document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
    
    if (!orderForm || !sendEmailBtn || !sendWhatsAppBtn) return;
    
    // Get product type label
    function getProductTypeLabel(value) {
        const options = {
            '65x65': 'Büyük Boy Orta Sehpa (65 x 65 cm)',
            '55x55': 'Standart Orta/Yan Sehpa (55 x 55 cm)',
            '45x45': 'Küçük Yan Sehpa/Zigon (45 x 45 cm)',
            'custom': 'Özel Ölçü'
        };
        return options[value] || value;
    }
    
    // Format form data for email/WhatsApp
    function formatOrderData() {
        const formData = new FormData(orderForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        const productType = getProductTypeLabel(data.productType);
        
        // Özel ölçü bilgisi
        const customWidth = data.customWidth || '';
        const customHeight = data.customHeight || '';
        const customSize = (customWidth && customHeight) ? `${customWidth} x ${customHeight} cm` : '';
        
        // Kalınlık bilgisi
        let thicknessInfo = data.thickness;
        if (data.thickness === 'custom' && data.customThickness) {
            thicknessInfo = `Özel: ${data.customThickness} cm`;
        } else if (data.customThickness && data.thickness !== 'custom') {
            thicknessInfo = `${data.thickness} (Özel: ${data.customThickness} cm)`;
        }
        
        // Şekil bilgisi
        const shapeLabels = {
            'kare': 'Kare',
            'yuvarlak': 'Yuvarlak',
            'dikdortgen': 'Dikdörtgen',
            'oval': 'Oval',
            'diger': 'Diğer'
        };
        const shapeInfo = data.shape ? shapeLabels[data.shape] || data.shape : 'Belirtilmedi';
        
        const orderText = `📋 TOPTAN SİPARİŞ TALEBİ

🏢 Şirket Adı: ${data.companyName}
👤 İletişim Kişisi: ${data.contactName}
📧 E-posta: ${data.email}
📱 Telefon: ${data.phone}

📦 ÜRÜN BİLGİLERİ:
Referans Tip: ${productType}
Özel Ölçü: ${customSize || 'Belirtilmedi'}
Kalınlık: ${thicknessInfo}
Şekil: ${shapeInfo}
Adet: ${data.quantity}

📝 Ek Notlar:
${data.message || 'Yok'}

---
Bu sipariş talebi web sitesinden gönderilmiştir.`;
        
        return orderText;
    }
    
    // Send via Email
    sendEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }
        
        const orderText = formatOrderData();
        const emailSubject = encodeURIComponent('Toptan Sipariş Talebi - Mermerit Sehpa');
        const emailBody = encodeURIComponent(orderText);
        const emailTo = 'emircanbulut04@gmail.com';
        
        window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
    });
    
    // Send via WhatsApp
    sendWhatsAppBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }
        
        const orderText = formatOrderData();
        const whatsappNumber = '905531967401';
        const whatsappMessage = encodeURIComponent(orderText);
        
        // WhatsApp URL - hem web hem mobil için çalışır
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        
        // Yeni sekmede aç (mobil cihazlarda WhatsApp uygulaması açılır, masaüstünde WhatsApp Web açılır)
        window.open(whatsappUrl, '_blank');
    });
    
    // Show/hide custom thickness field based on thickness selection
    const thicknessSelect = document.getElementById('thickness');
    const customThicknessInput = document.getElementById('customThickness');
    const customThicknessGroup = customThicknessInput ? customThicknessInput.closest('.form-group') : null;
    
    if (thicknessSelect && customThicknessGroup && customThicknessInput) {
        function updateCustomThicknessField() {
            if (thicknessSelect.value === 'custom') {
                customThicknessInput.required = true;
                customThicknessGroup.style.opacity = '1';
            } else {
                customThicknessInput.required = false;
                if (!customThicknessInput.value) {
                    customThicknessGroup.style.opacity = '0.6';
                }
            }
        }
        
        thicknessSelect.addEventListener('change', updateCustomThicknessField);
        customThicknessInput.addEventListener('input', () => {
            if (customThicknessInput.value) {
                customThicknessGroup.style.opacity = '1';
            } else if (thicknessSelect.value !== 'custom') {
                customThicknessGroup.style.opacity = '0.6';
            }
        });
        
        // Initial state
        updateCustomThicknessField();
    }
    
    // Auto-fill custom size when product type is selected
    const productTypeSelect = document.getElementById('productType');
    const customWidthInput = document.getElementById('customWidth');
    const customHeightInput = document.getElementById('customHeight');
    
    if (productTypeSelect && customWidthInput && customHeightInput) {
        productTypeSelect.addEventListener('change', () => {
            const value = productTypeSelect.value;
            if (value === '65x65') {
                customWidthInput.value = '65';
                customHeightInput.value = '65';
            } else if (value === '55x55') {
                customWidthInput.value = '55';
                customHeightInput.value = '55';
            } else if (value === '45x45') {
                customWidthInput.value = '45';
                customHeightInput.value = '45';
            }
            // 'custom' seçildiğinde değerleri temizlemez, kullanıcı kendi girer
        });
    }
});

