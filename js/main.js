
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

    // Update placeholder translations
    document.querySelectorAll('[data-placeholder-key]').forEach(elem => {
        const key = elem.dataset.placeholderKey;
        if (translations[lang][key]) {
            elem.placeholder = translations[lang][key];
        }
    });

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

// === PUBLIC MUSIC API ===
// These functions are exposed globally for use by game.js and other modules

let _mainMusic = null;
let _musicBtn = null;
let _musicIcon = null;
let _musicText = null;

function pauseBackgroundMusic() {
    if (_mainMusic && !_mainMusic.paused) {
        _mainMusic.pause();
        if (_musicIcon) _musicIcon.classList.replace('fa-pause', 'fa-play');
        if (_musicText) _musicText.textContent = translations[currentLang].musicPlay;
        if (_musicBtn) _musicBtn.classList.remove('playing');
    }
}

// Pause for game - ONLY pauses audio, does NOT change button state
// This matches original behavior where button stayed in 'playing' state
function pauseBackgroundMusicForGame() {
    if (_mainMusic && !_mainMusic.paused) {
        _mainMusic.pause();
        // Intentionally NOT updating button/icon state
        // So we can detect it was playing when game ends
    }
}

function playBackgroundMusic() {
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer && gameContainer.classList.contains('game-active')) {
        return; // Don't play if game is active
    }
    if (_mainMusic && _mainMusic.paused) {
        _mainMusic.play().catch(e => console.error("Audio play failed:", e));
        if (_musicIcon) _musicIcon.classList.replace('fa-play', 'fa-pause');
        if (_musicText) _musicText.textContent = translations[currentLang].musicPause;
        if (_musicBtn) _musicBtn.classList.add('playing');
    }
}

// Resume after game - checks if button has 'playing' class (matches original behavior)
function resumeBackgroundMusicAfterGame() {
    // Button keeps 'playing' class when pauseBackgroundMusicForGame is called
    // So we can check if music was playing before the game started
    if (_musicBtn && _musicBtn.classList.contains('playing') && _mainMusic && _mainMusic.paused) {
        _mainMusic.play().catch(e => console.error("Audio resume failed:", e));
        // No need to update button/icon - they never changed
    }
}

function isBackgroundMusicPlaying() {
    return _mainMusic && !_mainMusic.paused;
}

// Expose Music API via namespace
window.ForcexPortfolio = window.ForcexPortfolio || {};
window.ForcexPortfolio.pauseBackgroundMusic = pauseBackgroundMusic;
window.ForcexPortfolio.pauseBackgroundMusicForGame = pauseBackgroundMusicForGame;
window.ForcexPortfolio.playBackgroundMusic = playBackgroundMusic;
window.ForcexPortfolio.resumeBackgroundMusicAfterGame = resumeBackgroundMusicAfterGame;
window.ForcexPortfolio.isBackgroundMusicPlaying = isBackgroundMusicPlaying;

// Legacy support - keep direct window references for game.js compatibility
window.pauseBackgroundMusicForGame = pauseBackgroundMusicForGame;
window.resumeBackgroundMusicAfterGame = resumeBackgroundMusicAfterGame;

// Logic for Main Music
function initMusicPlayer() {
    _mainMusic = document.getElementById('bg-music');
    _musicBtn = document.getElementById('music-toggle');
    const ctaButton = document.querySelector('.cta-button[href="#about"]');

    if (_mainMusic && _musicBtn && ctaButton) {
        _mainMusic.volume = 0.17;
        _musicIcon = _musicBtn.querySelector('i');
        _musicText = _musicBtn.querySelector('span');
        let musicStartedByListener = false;

        const startMusicOnInteraction = () => {
            if (!musicStartedByListener && _mainMusic.paused) {
                playBackgroundMusic();
                musicStartedByListener = true;
            }
        };

        // One-time listeners for first interaction
        window.addEventListener('scroll', startMusicOnInteraction, { once: true });
        ctaButton.addEventListener('click', startMusicOnInteraction, { once: true });

        _musicBtn.addEventListener('click', () => {
            musicStartedByListener = true;
            if (_mainMusic.paused) {
                playBackgroundMusic();
            } else {
                pauseBackgroundMusic();
            }
        });
    }
}

// Cosmic Particles (Original User Version)
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

// === REALISTIC STARS WITH INDIVIDUAL TWINKLE ===
// Each star has its own random animation delay for organic effect
function createRealisticStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    // Clear any existing stars
    container.innerHTML = '';

    // Responsive star count: fewer on mobile for performance
    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 50 : 80;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');

        // 80% white, 10% blue, 10% purple
        let colorClass = '';
        const rand = Math.random();
        if (rand > 0.9) colorClass = 'blue';
        else if (rand > 0.8) colorClass = 'purple';

        star.className = `individual-star ${colorClass}`.trim();

        // Random position across the viewport
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (1-3px for depth illusion)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // KEY: Random animation delay (0-8s) so each star twinkles independently
        const delay = Math.random() * 8;
        star.style.setProperty('--twinkle-delay', delay + 's');

        // Random animation duration (2-5s) for variety
        const duration = Math.random() * 3 + 2;
        star.style.setProperty('--twinkle-duration', duration + 's');

        // Random opacity range for depth
        const minOpacity = Math.random() * 0.3 + 0.2; // 0.2-0.5
        const maxOpacity = Math.random() * 0.3 + 0.7; // 0.7-1.0
        star.style.setProperty('--star-min-opacity', minOpacity);
        star.style.setProperty('--star-max-opacity', maxOpacity);

        // Brighter stars get a subtle glow
        if (size > 2) {
            star.style.boxShadow = `0 0 ${size}px rgba(255, 255, 255, 0.5)`;
        }

        container.appendChild(star);
    }
}

// === UNIFIED SCROLL HANDLER ===
// All scroll-dependent logic consolidated here for performance

let _navbar = null;
let _sections = null;
let _navLinks = null;
let _toTopBtn = null;

function handleGlobalScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // 1. Navbar style change + scroll progress bar
    if (_navbar) {
        _navbar.style.setProperty('--scroll-progress', scrollProgress + '%');
        if (scrollY > 100) {
            _navbar.classList.add('scrolled');
        } else {
            _navbar.classList.remove('scrolled');
        }
    }

    // 2. Active navigation section
    if (_sections && _navLinks) {
        let current = 'home';
        _sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        _navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // 3. Back to top button visibility
    if (_toTopBtn) {
        if (scrollY > 300) {
            _toTopBtn.classList.add('visible');
        } else {
            _toTopBtn.classList.remove('visible');
        }
    }
}

// Navigation
function initNavigation() {
    _navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    _navLinks = document.querySelectorAll('.nav-link');
    _sections = document.querySelectorAll('section[id]');

    if (!_navbar || !mobileToggle || !navLinksContainer) return;

    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    _navLinks.forEach(link => {
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
            _navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.querySelector('i').classList.add('fa-bars');
                mobileToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
}

// Scroll Animations (uses IntersectionObserver, not scroll event)
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

    // Observe static elements
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
    });

    // Expose observer
    window.globalObserver = observer;
}

// Back To Top (click handler only, scroll handled by unified handler)
function initBackToTop() {
    _toTopBtn = document.getElementById('backToTopBtn');
    if (_toTopBtn) {
        _toTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// === MISSING FUNCTIONS RESTORED ===

// Helper: Check if Desktop
function isDesktop() {
    return window.innerWidth > 768;
}

// Cosmic Cursor
function initCosmicCursor() {
    if (!isDesktop()) return;

    // Remove existing if any
    const existingCursor = document.querySelector('.cosmic-cursor');
    if (existingCursor) existingCursor.remove();
    document.querySelectorAll('.cursor-trail').forEach(el => el.remove());

    const cursor = document.createElement('div');
    cursor.className = 'cosmic-cursor';
    document.body.appendChild(cursor);

    // Create trail elements
    const trailCount = 12;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({ el: trail, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // The CSS handles centering via transform: translate(-50%, -50%)
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Click indicator
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    // Animate trail
    function animateTrail() {
        let x = mouseX, y = mouseY;
        trails.forEach((trail, index) => {
            const nextX = x + (trail.x - x) * 0.3;
            const nextY = y + (trail.y - y) * 0.3;
            // Trail also centered via CSS
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

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .cta-button, .nav-link, .lang-btn, .music-play-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

// Dynamic Glow Effect (Corrected Offset -90)
function initDynamicGlow() {
    if (!isDesktop()) return;

    const glowElements = document.querySelectorAll('.skill-item');

    glowElements.forEach(el => {
        // Prevent duplicate glow
        if (el.querySelector('.glow-effect')) return;

        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.insertBefore(glow, el.firstChild);

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - 90; // Centered for 180px glow
            const y = e.clientY - rect.top - 90;
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        });
    });
}

// Init Glow for Project Cards (Corrected Offset -90)
function initGlowForElement(el) {
    if (!isDesktop()) return;
    if (el.querySelector('.glow-effect')) return;

    const glow = document.createElement('div');
    glow.className = 'glow-effect';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.insertBefore(glow, el.firstChild);

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - 90;
        const y = e.clientY - rect.top - 90;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
    });
}

// Helper to init shine on a single element (exposed for dynamic content)
function initShineSingle(el) {
    if (!isDesktop()) return;

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / 30;
        const moveY = (y - centerY) / 30;

        el.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg) scale(1.02)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// Restore initShineEffect for static elements
function initShineEffect() {
    if (!isDesktop()) return;
    const shineElements = document.querySelectorAll('.project-card, .skill-item');
    shineElements.forEach(el => initShineSingle(el));
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

    // Hide cosmic loader with fail-safe
    const cosmicLoader = document.getElementById('cosmic-loader');

    const hideLoader = () => {
        if (cosmicLoader && !cosmicLoader.classList.contains('hidden')) {
            cosmicLoader.classList.add('hidden');
        }
    };

    // Attempt to hide after load
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 800);
    });

    // Fallback: Force hide after 3 seconds max (in case window.load hangs)
    setTimeout(hideLoader, 3000);

    // Initializations protected by try-catch to prevent blocking
    try {
        createCosmicParticles();
        createRealisticStars();
        // Initialize everything
        // Initialize everything
        initNavigation();
        initScrollAnimations();
        initMusicPlayer();
        initBackToTop();
        initCosmicCursor();
        initDynamicGlow();
        initShineEffect();

        // Add CV Modal Logic
        window.openCVModal = function () {
            const modal = document.getElementById('cvModal');
            const iframe = document.getElementById('cvFrame');
            if (modal && iframe) {
                iframe.src = "CVEzequiel_Morales2025-11.pdf";
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeCVModal = function () {
            const modal = document.getElementById('cvModal');
            const iframe = document.getElementById('cvFrame');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                // Clear src to stop loading/playing
                if (iframe) iframe.src = "";
            }
        };

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cvModal') {
                window.closeCVModal();
            }
        });
        window.addEventListener('scroll', handleGlobalScroll);

        // Expose for projects.js via namespace
        window.ForcexPortfolio = window.ForcexPortfolio || {};
        window.ForcexPortfolio.initGlowForElement = initGlowForElement;
        window.ForcexPortfolio.initShineSingle = initShineSingle;
        window.ForcexPortfolio.globalObserver = window.globalObserver;

        // Legacy compatibility
        window.initGlowForElement = initGlowForElement;
        window.initShineSingle = initShineSingle;

        // Render Projects
        if (typeof renderProjects === 'function') {
            renderProjects(currentLang);
        }
    } catch (error) {
        console.error("Initialization error:", error);
        // Ensure loader is hidden even on error
        hideLoader();
    }
});
