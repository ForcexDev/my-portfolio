/* ============================================
   PAGE TEMPLATE JAVASCRIPT
   Functionality for Walkthroughs & Showcases
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCodeBlocks();
    initBackToTop();
    createStars();
    initDynamicGlow();
    initSubpageNavbar();
    initLightbox();
    initCarousel();
    initResponsiveImages();
});

/**
 * Navbar logic for subpages
 */
function initSubpageNavbar() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        // Sticky/Blur effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
    });
}

/**
 * LIGHTBOX IMPLEMENTATION
 * Allows clicking images to view them in fullscreen
 */
function initLightbox() {
    // Create lightbox element if it doesn't exist
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="" alt="Zoomed view">
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Find all zoomable images
    const zoomableImages = document.querySelectorAll('.text-block img, .hero-banner img, .carousel-item img, .gallery-item img, .zoomable, .image-block img');

    zoomableImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // ESC key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * CAROUSEL IMPLEMENTATION
 * Simple slider for results gallery
 */
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const items = container.querySelectorAll('.carousel-item');
        const nextBtn = container.querySelector('.carousel-btn.next');
        const prevBtn = container.querySelector('.carousel-btn.prev');

        if (!items.length) return;

        let currentIndex = 0;

        const updateCarousel = () => {
            const amountToMove = items[0].offsetWidth * currentIndex;
            track.style.transform = `translateX(-${amountToMove}px)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                // Swipe left - next
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - prev
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateCarousel();
            }
        };

        // Responsive resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateCarousel();
            }, 250);
        });
    });
}

/**
 * Responsive Images - Load appropriate sizes
 */
function initResponsiveImages() {
    const images = document.querySelectorAll('.text-block img, .hero-banner img');

    images.forEach(img => {
        // Add loading="lazy" for performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

/**
 * Helper: Check if Desktop
 */
function isDesktop() {
    return window.innerWidth > 768;
}

/**
 * Cosmic Cursor for subpages (desktop only)
 */
function initCosmicCursor() {
    if (!isDesktop()) return;

    const cursor = document.querySelector('.cosmic-cursor') || document.createElement('div');
    if (!cursor.parentElement) {
        cursor.className = 'cosmic-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--nebula-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);
    }

    const trailCount = 8;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--nebula-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: ${0.5 - i * 0.06};
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(trail);
        trails.push({ el: trail, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    function animateTrail() {
        let x = mouseX, y = mouseY;
        trails.forEach((trail) => {
            const nextX = x + (trail.x - x) * 0.3;
            const nextY = y + (trail.y - y) * 0.3;
            trail.el.style.left = trail.x + 'px';
            trail.el.style.top = trail.y + 'px';
            trail.x = nextX;
            trail.y = nextY;
            x = nextX;
            y = nextY;
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const hoverElements = document.querySelectorAll('a, button, .tag, .gallery-item, .code-block, .back-link, .carousel-btn, .lightbox-close');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(66, 153, 225, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // Cleanup on window resize to mobile
    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            cursor.remove();
            trails.forEach(t => t.el.remove());
        }
    });
}

/**
 * Dynamic Glow for subpage elements (desktop only)
 */
function initDynamicGlow() {
    if (!isDesktop()) return;

    const glowElements = document.querySelectorAll('.code-block, .callout, .hero-banner, .carousel-container');

    glowElements.forEach(el => {
        if (el.querySelector('.glow-effect')) return;

        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        glow.style.cssText = `
            position: absolute;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle, rgba(66, 153, 225, 0.15), transparent 70%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: 50%;
        `;

        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }
        el.style.overflow = 'hidden';
        el.insertBefore(glow, el.firstChild);

        el.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
        });

        el.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - 90;
            const y = e.clientY - rect.top - 90;
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        });
    });

    // Cleanup on resize
    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            document.querySelectorAll('.glow-effect').forEach(g => g.remove());
        }
    });
}

/**
 * Initializes code blocks with copy-to-clipboard functionality
 */
function initCodeBlocks() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const block = btn.closest('.code-block');
            const code = block.querySelector('code').innerText;

            try {
                await navigator.clipboard.writeText(code);
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                btn.style.background = 'var(--nebula-blue)';
                btn.style.color = 'white';

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--nebula-blue)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/**
 * Creates static and individual animated stars for the background
 */
function createStars() {
    const starsContainer = document.querySelector('.stars-container') || document.createElement('div');
    if (!starsContainer.parentElement) {
        starsContainer.className = 'stars-container';
        const spaceCanvas = document.querySelector('.space-canvas');
        if (spaceCanvas) {
            spaceCanvas.appendChild(starsContainer);
        } else {
            document.body.prepend(starsContainer);
        }
    }

    // Clear existing stars on resize
    const existingStars = starsContainer.querySelectorAll('.individual-star');
    if (existingStars.length > 0) return;

    const count = window.innerWidth > 1920 ? 80 : window.innerWidth > 768 ? 60 : 30;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'individual-star';

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--twinkle-duration', `${duration}s`);
        star.style.setProperty('--twinkle-delay', `${delay}s`);

        if (Math.random() > 0.8) {
            star.classList.add(Math.random() > 0.5 ? 'blue' : 'purple');
        }

        starsContainer.appendChild(star);
    }
}

/**
 * Modern Back to Top functionality for subpages
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Performance: Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}