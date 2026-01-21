// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.timeoutID = null;
        this.type();
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

        this.timeoutID = setTimeout(() => this.type(), typeSpeed);
    }

    stop() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    }
}

// Global state
let currentLang = 'en';
let typewriterInstance;

// Initial Language Setup
function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromURL = urlParams.get('lang');
    if (langFromURL === 'es' || langFromURL === 'en') {
        localStorage.setItem('lang', langFromURL);
        return langFromURL;
    }
    const langFromStorage = localStorage.getItem('lang');
    if (langFromStorage === 'es' || langFromStorage === 'en') {
        return langFromStorage;
    }
    return 'en';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update all static text with data-key
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.dataset.key;
        if (translations[lang][key]) {
            elem.textContent = translations[lang][key];
        }
    });

    // Update Language Toggle Button
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        if (lang === 'es') {
            langBtn.innerHTML = 'EN | <span style="color: var(--nebula-blue); font-weight: 700;">ES</span>';
        } else {
            langBtn.innerHTML = '<span style="color: var(--nebula-blue); font-weight: 700;">EN</span> | ES';
        }
    }

    // Update Typewriter
    const txtElement = document.getElementById('typewriter');
    if (txtElement) {
        if (typewriterInstance) {
            typewriterInstance.stop();
        }
        const words = translations[lang].typewriterWords;
        typewriterInstance = new TypeWriter(txtElement, words, 2000);
    }

    // Update Music Button
    updateMusicButtonText();

    // Re-render Projects (to update titles/descriptions)
    if (typeof renderProjects === 'function') {
        renderProjects(lang);
    }
}

function updateMusicButtonText() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!musicBtn || !audio) return;
    const text = musicBtn.querySelector('span');
    if (audio.paused) {
        text.textContent = translations[currentLang].musicPlay;
    } else {
        text.textContent = translations[currentLang].musicPause;
    }
}

// Logic for Main Music
function initMusicPlayer() {
    const mainMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const ctaButton = document.querySelector('.cta-button[href="#about"]');

    if (mainMusic && musicBtn && ctaButton) {
        mainMusic.volume = 0.17;
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');
        let musicStartedByListener = false;

        const playMainMusic = () => {
            // Check if game audio plays (needs game.js loaded or variable accessible)
            // We can check if the game container has active class maybe?
            // For now simpler check:
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer && gameContainer.classList.contains('game-active')) {
                return;
            }

            mainMusic.play().catch(e => console.error("Audio play failed:", e));
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = translations[currentLang].musicPause;
            musicBtn.classList.add('playing');
        };

        const pauseMainMusic = () => {
            mainMusic.pause();
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = translations[currentLang].musicPlay;
            musicBtn.classList.remove('playing');
        };

        const startMusicOnInteraction = () => {
            if (!musicStartedByListener && mainMusic.paused) {
                playMainMusic();
                musicStartedByListener = true;
            }
            window.removeEventListener('scroll', startMusicOnInteraction);
            ctaButton.removeEventListener('click', startMusicOnInteraction);
        };

        window.addEventListener('scroll', startMusicOnInteraction, { once: true });
        ctaButton.addEventListener('click', startMusicOnInteraction, { once: true });

        musicBtn.addEventListener('click', () => {
            if (!musicStartedByListener) {
                musicStartedByListener = true;
                window.removeEventListener('scroll', startMusicOnInteraction);
                ctaButton.removeEventListener('click', startMusicOnInteraction);
            }
            if (mainMusic.paused) {
                playMainMusic();
            } else {
                pauseMainMusic();
            }
        });
    }
}

// Cosmic Particles
function createCosmicParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    const particleCount = 25;
    const particleTypes = ['star', 'dust', 'cosmic'];
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.className = `particle ${type}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        if (type === 'star' && Math.random() > 0.7) {
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.boxShadow = '0 0 8px rgba(255, 255, 255, 1)';
        }
        particlesContainer.appendChild(particle);
    }
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (!navbar || !mobileToggle || !navLinksContainer) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

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
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileToggle.querySelector('i').classList.add('fa-bars');
                mobileToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check if it's a project card to avoid double animation with lazy load
                // But since we are rendering them dynamically, we might need to observe them AFTER render
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe static elements
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
    });

    // Expose observer to be used by dynamic content
    window.globalObserver = observer;
}

// Active Nav State
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = 'home';
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

// Back To Top
function initBackToTop() {
    const toTopBtn = document.getElementById('backToTopBtn');
    if (toTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                toTopBtn.classList.add('visible');
            } else {
                toTopBtn.classList.remove('visible');
            }
        });
        toTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    currentLang = getInitialLanguage();
    setLanguage(currentLang);

    // Lang Toggle Listener
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(newLang);
        });
    }

    createCosmicParticles();
    initNavigation();
    initScrollAnimations();
    updateActiveNavigation();
    initMusicPlayer();
    initBackToTop();

    // Render Projects (imported from projects.js)
    if (typeof renderProjects === 'function') {
        renderProjects(currentLang);
    }
});
