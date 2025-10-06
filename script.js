// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Gallery Modal Functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems);

// Open modal when clicking on gallery item
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openModal();
    });
});

function openModal() {
    const currentItem = galleryImages[currentImageIndex];
    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('.gallery-overlay h3').textContent;
    const description = currentItem.querySelector('.gallery-overlay p').textContent;
    
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    openModal();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    openModal();
}

// Event listeners for modal controls
closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
        }
    }
});

// Touch/swipe support for mobile gallery
let galleryTouchStartX = 0;
let galleryTouchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    galleryTouchStartX = e.changedTouches[0].screenX;
});

modal.addEventListener('touchend', (e) => {
    galleryTouchEndX = e.changedTouches[0].screenX;
    handleGallerySwipe();
});

function handleGallerySwipe() {
    const swipeThreshold = 50;
    const diff = galleryTouchStartX - galleryTouchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPrevImage();
        }
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !phone || !message) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        alert('Lütfen geçerli bir telefon numarası girin.');
        return;
    }
    
    // Create WhatsApp link
    const whatsappMessage = encodeURIComponent(
        `Merhaba! Bulut Mermerit web sitesinden mesaj gönderiyorum:\n\n` +
        `Ad Soyad: ${name}\n` +
        `Telefon: ${phone}\n\n` +
        `Mesajım:\n${message}`
    );
    
    const whatsappLink = `https://wa.me/905309748597?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    // Show success message
    alert('WhatsApp uygulamanız açılacak. Mesajınızı göndermek için "Gönder" butonuna tıklayın.');
    
    // Reset form
    contactForm.reset();
});

// Intersection Observer for animations
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
    const animatedElements = document.querySelectorAll('.gallery-item, .color-item, .feature, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Hero Slider Functionality
let currentSlide = 0;
let slides = [];
let dots = [];
let totalSlides = 0;
let slideInterval;
let isAutoSlideActive = true;
let slideTransitionDuration = 3000; // 3 seconds for faster viewing

function showSlide(index) {
    console.log('Showing slide:', index);
    
    // Remove active class from all slides and dots
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        console.log('Removed active from slide', i);
    });
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        console.log('Removed active from dot', i);
    });
    
    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
        console.log('Added active to slide', index);
    }
    if (dots[index]) {
        dots[index].classList.add('active');
        console.log('Added active to dot', index);
    }
    
    // Update current slide
    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    console.log('Moving from slide', currentSlide, 'to slide', nextIndex);
    showSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

function startAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    if (isAutoSlideActive && totalSlides > 1) {
        slideInterval = setInterval(() => {
            console.log('Auto sliding to next image...');
            nextSlide();
        }, slideTransitionDuration);
        console.log('Auto slide interval set for', slideTransitionDuration, 'ms');
    } else {
        console.log('Auto slide not started - isActive:', isAutoSlideActive, 'totalSlides:', totalSlides);
    }
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function initSlider() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
    
    console.log('Found slides:', slides.length);
    console.log('Found dots:', dots.length);
    
    if (totalSlides === 0) {
        console.error('No slides found!');
        return;
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Start auto slide
    startAutoSlide();
    console.log('Auto slide started with', slideTransitionDuration, 'ms interval');
    
    // Pause auto slide on hover/interaction
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Mouse events
        heroSection.addEventListener('mouseenter', () => {
            stopAutoSlide();
        });
        
        heroSection.addEventListener('mouseleave', () => {
            if (isAutoSlideActive) {
                startAutoSlide();
            }
        });
        
        // Touch events for mobile
        let touchStartTime = 0;
        heroSection.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
            stopAutoSlide();
        });
        
        heroSection.addEventListener('touchend', () => {
            const touchDuration = Date.now() - touchStartTime;
            // Only restart if touch was brief (not a long press)
            if (touchDuration < 500 && isAutoSlideActive) {
                setTimeout(() => {
                    startAutoSlide();
                }, 2000); // Restart after 2 seconds
            }
        });
    }
    
    // Dot click functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            showSlide(index);
            stopAutoSlide();
            // Restart auto slide after 3 seconds
            setTimeout(() => {
                if (isAutoSlideActive) {
                    startAutoSlide();
                }
            }, 3000);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            setTimeout(() => {
                if (isAutoSlideActive) {
                    startAutoSlide();
                }
            }, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            setTimeout(() => {
                if (isAutoSlideActive) {
                    startAutoSlide();
                }
            }, 3000);
        }
    });
}


// Enhanced Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isScrolling = false;
let touchStartTime = 0;

function initTouchEvents() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        isScrolling = false;
        
        // Stop auto slide on touch start
        stopAutoSlide();
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const diffX = Math.abs(touchStartX - touchEndX);
        const diffY = Math.abs(touchStartY - touchEndY);
        
        // Determine if user is scrolling vertically or swiping horizontally
        if (diffY > diffX && diffY > 10) {
            isScrolling = true;
        }
        
        // Prevent default if horizontal swipe detected
        if (diffX > diffY && diffX > 20) {
            e.preventDefault();
        }
    }, { passive: false });

    heroSection.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        
        if (!touchStartX || !touchEndX || isScrolling) {
            // Restart auto slide if it was a brief touch or scroll
            if (touchDuration < 300 && isAutoSlideActive) {
                setTimeout(() => {
                    startAutoSlide();
                }, 2000);
            }
            return;
        }
        
        handleHeroSwipe();
        
        // Reset values
        touchStartX = 0;
        touchEndX = 0;
        touchStartY = 0;
        touchEndY = 0;
        isScrolling = false;
        touchStartTime = 0;
    }, { passive: true });
}

function handleHeroSwipe() {
    const swipeThreshold = 50; // Optimal threshold for mobile experience
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Add visual feedback
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.transform = 'scale(0.98)';
            setTimeout(() => {
                heroSection.style.transform = 'scale(1)';
            }, 150);
        }
        
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
        stopAutoSlide();
        // Restart auto slide after 4 seconds
        setTimeout(() => {
            if (isAutoSlideActive) {
                startAutoSlide();
            }
        }, 4000);
    } else {
        // If swipe wasn't strong enough, restart auto slide sooner
        setTimeout(() => {
            if (isAutoSlideActive) {
                startAutoSlide();
            }
        }, 1000);
    }
}

// Parallax effect for hero section (disabled for slider)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     const rate = scrolled * -0.5;
    
//     if (hero) {
//         hero.style.transform = `translateY(${rate}px)`;
//     }
// });

// Color item hover effects
const colorItems = document.querySelectorAll('.color-item');

colorItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Statistics counter animation
function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        if (target > 0) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 30);
        }
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Observe all images for lazy loading
document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add loading states
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loaded');
    
    // Initialize slider with a small delay to ensure DOM is ready
    setTimeout(() => {
        initSlider();
        console.log('Slider initialized with', totalSlides, 'slides');
    }, 100);
    
    // Initialize touch events
    initTouchEvents();
    
    // Preload critical images
    const criticalImages = [
        'örnekler/WhatsApp Görsel 2025-10-04 saat 23.12.55_3bc21d6c.jpg',
        'renkler/WhatsApp Görsel 2025-10-04 saat 23.12.11_df090213.jpg',
        'renkler/WhatsApp Görsel 2025-10-04 saat 23.12.13_44aaa853.jpg',
        'renkler/WhatsApp Görsel 2025-10-04 saat 23.11.52_18a609fa.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log('Image loaded:', src);
        img.onerror = () => console.error('Image failed to load:', src);
    });
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyb3JzZWwgWcO2cnNlbGVtZWRpPC90ZXh0Pjwvc3ZnPg==';
        img.alt = 'Görsel yüklenemedi';
    });
});
