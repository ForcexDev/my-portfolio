
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

    // Update Terminal Output (Static - No Typewriter)
    const txtElement = document.getElementById('typewriter');
    if (txtElement) {
        // Stop any existing instance just in case
        if (typewriterInstance) {
            typewriterInstance.stop();
            typewriterInstance = null;
        }

        // simple static translation mapping for 'job_title' or similar
        // utilizing the existing data-key logic if possible, or manual map here
        const staticOutputs = {
            'en': "Cybersecurity & Network Engineering",
            'es': "Ciberseguridad e Ingeniería de Redes"
        };

        txtElement.textContent = staticOutputs[lang] || staticOutputs['en'];
    }
    // Update Music Button
    // updateMusicButtonText() removed

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

// Music Logic Removed


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
        threshold: 0.05, // Lower threshold for faster trigger
        rootMargin: '0px 0px -80px 0px' // Trigger slightly before it fully enters
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Once animated, no need to observe anymore for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe Skills (Index reset for this section)
    document.querySelectorAll('#skills .skill-item').forEach((item, index) => {
        item.style.animationDelay = `${(index % 6) * 0.08}s`; // Limit max delay spread
        observer.observe(item);
    });

    // Observe Certifications (Index reset for this section)
    document.querySelectorAll('#certifications .skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`; // Smooth stagger for certs
        observer.observe(item);
    });

    // Observe Project Cards (if any not handled by dynamic loader)
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Expose observer
    window.globalObserver = observer;
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
        setTimeout(hideLoader, 300);
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
        // initMusicPlayer() removed

        // initCosmicCursor(); // Removed by user request
        initDynamicGlow();

        // Add CV Modal Logic
        window.openCVModal = function () {
            // Mobile Optimization: Open directly in new tab instead of modal
            // (iFrames for PDFs are often buggy on mobile browsers)
            if (window.innerWidth <= 768) {
                window.open("CVEzequiel_Morales2025-11.pdf", "_blank");
                return;
            }

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
        window.ForcexPortfolio.globalObserver = window.globalObserver;

        // Legacy compatibility
        window.initGlowForElement = initGlowForElement;

        // Render Projects
        if (typeof renderProjects === 'function') {
            renderProjects(currentLang);
        }
        // Terminal Animation
        // Terminal Animation Sequence
        async function initTerminalAnimation() {
            const cmdElement = document.getElementById('typeCommand');
            const typewriterElement = document.getElementById('typewriter');
            const cursor = document.getElementById('cmdCursor');

            if (!cmdElement || !typewriterElement) return;

            typewriterElement.classList.remove('active');
            typewriterElement.textContent = "";
            cmdElement.textContent = "";

            // Helper for delay
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Helper to type command
            async function typeCommand(text) {
                cursor.style.display = 'inline'; // Show cursor while typing
                for (let char of text) {
                    cmdElement.textContent += char;
                    await wait(Math.random() * 30 + 20); // Faster, snappy typing
                }
                await wait(200); // Shorter pause
            }

            // Helper to clear command input (backspace effect or instant)
            async function clearCommandInput() {
                cmdElement.textContent = "";
                await wait(200);
            }

            // Sequence Data
            const sequences = [
                {
                    cmd: "whoami",
                    output_en: "Cybersecurity & Network Engineering",
                    output_es: "Ciberseguridad e Ingeniería de Redes",
                    delayAfter: 1500, // Faster
                    action: "output"
                },
                {
                    cmd: "clear",
                    action: "clear",
                    delayAfter: 300
                },
                {
                    cmd: "cat profile.txt",
                    output_en: "Pentesting | Network Security | CTF Participant | Hackathon Participant",
                    output_es: "Pentesting | Seguridad de Redes | Participante CTF | Participante Hackathon",
                    delayAfter: 2000, // Faster
                    action: "output"
                },
                {
                    cmd: "clear",
                    action: "clear",
                    delayAfter: 300
                },
                {
                    cmd: "echo $Passion",
                    output_en: "Breaking & securing systems, loving every challenge along the way.",
                    output_es: "Rompiendo y asegurando sistemas, amando cada desafío en el camino.",
                    delayAfter: 3500, // Faster
                    action: "output"
                },
                {
                    cmd: "clear",
                    action: "clear",
                    delayAfter: 100
                }
            ];

            await wait(500); // Faster initial delay

            // Run Loop
            while (true) {
                for (const step of sequences) {
                    // Type the command
                    await typeCommand(step.cmd);

                    // Press Enter (Visual delay)
                    await wait(200);

                    if (step.action === "clear") {
                        // Clear Action - Fade Out
                        typewriterElement.classList.remove('active');

                        // Wait for Opacity (0.5s)
                        await wait(500);

                        // Now clear text
                        typewriterElement.textContent = "";

                        // Clear the command line itself for next input
                        await clearCommandInput();
                    } else {
                        // Show Output
                        const lang = currentLang;
                        const text = step[`output_${lang}`] || step.output_en;

                        cursor.style.display = 'none'; // Hide cursor on output
                        typewriterElement.textContent = text;
                        typewriterElement.classList.add('active');

                        // Wait for reading time
                        await wait(step.delayAfter);

                        // Clear command line to prepare for next
                        await clearCommandInput();
                    }

                    // Small pause between steps
                    await wait(100);
                }
            }
        }
        initTerminalAnimation();
    } catch (error) {
        console.error("Initialization error:", error);
        // Ensure loader is hidden even on error
        hideLoader();
    }
});

