// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;
        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === INICIO: Nueva Función de Música ===
function initMusicPlayer() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');

    if (!musicBtn || !audio) {
        console.warn("Music player elements not found.");
        return;
    }

    // Set initial volume
    audio.volume = 0.15;

    musicBtn.addEventListener('click', () => {
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');

        if (audio.paused) {
            audio.play().catch(e => console.error("Audio play failed:", e));
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = 'Pausar Música';
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = 'Reproducir Música Ambiente';
            musicBtn.classList.remove('playing');
        }
    });
}
// === FIN: Nueva Función de Música ===

// Cosmic Particles System
function createCosmicParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return; // Guard clause

    const particleCount = 25;
    const particleTypes = ['star', 'dust', 'cosmic'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.className = `particle ${type}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        // Add some particles with different sizes for depth
        if (type === 'star' && Math.random() > 0.7) {
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.boxShadow = '0 0 8px rgba(255, 255, 255, 1)';
        }

        particlesContainer.appendChild(particle);
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (!navbar || !mobileToggle || !navLinksContainer) return;

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active link
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');

            // Close mobile menu
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileToggle.querySelector('i').classList.add('fa-bars');
                mobileToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe skill items
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
    });
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = 'home'; // Default to home
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Simple card hover effects (no tilt)
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Hover effect is now handled by CSS :hover
        });

        card.addEventListener('mouseleave', () => {
            // Hover effect is now handled by CSS :hover
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Typewriter (movido aquí)
    const txtElement = document.getElementById('typewriter');
    if (txtElement) {
        const words = [
            'Exploring the intersection of technology and the cosmos',
            'Cybersecurity Student at Universidad Diego Portales',
            'Navigating digital frontiers like cosmic exploration',
            'Protecting systems across the digital universe',
            'Mapping network architectures like star formations'
        ];
        new TypeWriter(txtElement, words, 2000);
    }

    // === INICIO: Llamada a la nueva función de música ===
    initMusicPlayer();
    // === FIN: Llamada a la nueva función de música ===

    createCosmicParticles();
    initNavigation();
    initScrollAnimations();
    updateActiveNavigation();
    initCardHoverEffects();
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Las funciones de scroll (updateActiveNavigation y navbar scroll) ya están en listeners
}, 10));

// Preload critical animations
document.addEventListener('DOMContentLoaded', () => {
    // Force repaint to ensure smooth initial animations
    document.body.offsetHeight;
});