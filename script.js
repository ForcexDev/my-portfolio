// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.timeoutID = null; // <-- CAMBIO CLAVE: Para guardar el ID del timeout
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

        // <-- CAMBIO CLAVE: Guardamos el ID para poder cancelarlo
        this.timeoutID = setTimeout(() => this.type(), typeSpeed);
    }

    // <-- CAMBIO CLAVE: Nuevo método para detener el bucle
    stop() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    }
}

// 1. EL DICCIONARIO DE TRADUCCIONES
const translations = {
    'en': {
        // --- Nav ---
        'navHome': 'Home',
        'navAbout': 'About',
        'navProjects': 'Projects',
        'navSkills': 'Skills',
        'navContact': 'Contact',

        // --- Hero ---
        'heroGreeting': 'Transmitting from the Digital Cosmos',
        'heroName': 'Ezequiel Morales',
        'heroTagline': 'Cybersecurity & Networking student',
        'heroUniv': 'Universidad Diego Portales',
        'heroCTA': 'Enter to the Universe',
        'scrollExplore': 'Scroll to explore',

        // --- Typewriter ---
        'typewriterWords': [
            'Exploring where code meets the cosmos',
            'Cybersecurity student navigating digital galaxies',
            'Mapping networks like constellations in space',
            'Protecting systems across the vast digital universe',
            'Turning data into stars that guide technology forward'
        ],

        // --- About ---
        'aboutTitle': 'About Me',
        'aboutP1': "Welcome aboard my digital spacecraft. Here you'll find my journey through cybersecurity, networking, and programming—fields I explore with the same curiosity used to chart the stars.",
        'aboutP2': "I see technology much like the universe: infinite, mysterious, and full of patterns waiting to be understood. Whether configuring systems or studying distant galaxies, I’m driven by a fascination for discovery and protection across universal frontiers.",
        'aboutP3': "When I’m not coding or experimenting with network setups, I enjoy reflecting on the cosmos—a reminder that every technical challenge is part of a much larger constellation of ideas and possibilities.",
        'musicPlay': 'Play',
        'musicPause': 'Pause',

        // --- Projects ---
        'projectsTitle': 'Projects from the Digital Frontier',
        'project1Title': 'Grand Chess Auto',
        'project1Desc': 'An online chess experience where logic and creativity orbit together. Built with Node.js and Express, this system balances strategy and technology like celestial mechanics.',
        'project2Title': 'Java EDA',
        'project2Desc': 'Data structures mapped like constellations. Organized, efficient, and essential—just like the invisible forces that hold the digital universe together.',
        'project3Title': 'Networking Systems',
        'project3Desc': 'Projects exploring the backbone of the internet—like charting the cosmic web connecting galaxies across digital space.',
        'project4Title': 'Python Projects',
        'project4Desc': 'Scripts and experiments orbiting around automation and data processing—tools for exploring the ever-expanding programming cosmos.',
        'project5Title': 'Bandit Security Guide',
        'project5Desc': 'A guided exploration of Linux security. Like venturing through uncharted regions of the digital universe, each level reveals new layers of protection and vulnerability.',
        'project6Title': 'PostgreSQL Database',
        'project6Desc': 'Organizing data with the precision of stellar catalogs. A project focused on structured information, performance, and reliability—because even data deserves order in the cosmos.',

        // --- Skills ---
        'skillsTitle': 'Technical Skills',
        'skillPython': 'Scripting through digital galaxies',
        'skillSQL': 'Designing databases like stellar maps',
        'skillLinux': 'Navigating secure systems',
        'skillBash': 'Command-line exploration tools',
        'skillJava': 'Object-oriented architecture among the stars',
        'skillCpp': 'System-level cosmic engineering',
        'skillJS': 'Interactive web constellations',
        'skillHTML': 'Structuring universes of information',
        'skillCSS': 'Styling digital nebulae',
        'skillNode': 'Server-side space stations',
        'skillGit': 'Version control across timelines',
        'skillDocker': 'Containerizing apps like orbital modules',
        'skillAWS': 'Building cloud systems across digital space',
        'skillNetwork': 'Connecting systems through the data cosmos',
        'skillCyber': 'Defending the frontiers of cyberspace',
        'skillLatex': 'Documenting missions with precision',

        // --- Contact ---
        'contactTitle': 'Communication Hub',
        'contactText': "Ready to explore new frontiers together? Let’s connect across the universal cosmos and create something extraordinary.",
        'contactRepo': 'GITHUB',
        'contactNetwork': 'LINKEDIN',
        'contactMissions': 'TRYHACKME',
        'contactChannel': 'EMAIL'
    },

    'es': {
        // --- Nav ---
        'navHome': 'Inicio',
        'navAbout': 'Sobre Mí',
        'navProjects': 'Proyectos',
        'navSkills': 'Habilidades',
        'navContact': 'Contacto',

        // --- Hero ---
        'heroGreeting': 'Transmitiendo desde el Cosmos Digital',
        'heroName': 'Ezequiel Morales',
        'heroTagline': 'Estudiante enfocado en Ciberseguridad y Redes',
        'heroUniv': 'Universidad Diego Portales',
        'heroCTA': 'Entra al Universo',
        'scrollExplore': 'Desliza para explorar',

        // --- Typewriter ---
        'typewriterWords': [
            'Explorando donde el código se encuentra con el cosmos',
            'Estudiante de Ciberseguridad navegando galaxias digitales',
            'Mapeando redes como constelaciones en el espacio',
            'Protegiendo sistemas a través del vasto universo digital',
            'Transformando datos en estrellas que guían la tecnología'
        ],

        // --- About ---
        'aboutTitle': 'Sobre Mí',
        'aboutP1': 'Bienvenido a bordo de mi nave digital. Aquí encontrarás mi recorrido por la ciberseguridad, las redes y la programación: territorios que exploro con la misma curiosidad con la que se observan las estrellas.',
        'aboutP2': 'Veo la tecnología como el universo: infinita, misteriosa y llena de patrones por descubrir. Ya sea configurando sistemas o estudiando galaxias lejanas, me impulsa la fascinación por explorar y proteger las fronteras universales.',
        'aboutP3': 'Cuando no estoy programando o experimentando con redes, me gusta contemplar el cosmos. Es un recordatorio de que cada desafío técnico forma parte de una constelación más grande de ideas y posibilidades.',
        'musicPlay': 'Reproducir',
        'musicPause': 'Pausar',

        // --- Projects ---
        'projectsTitle': 'Proyectos del Frente Digital',
        'project1Title': 'Grand Chess Auto',
        'project1Desc': 'Una experiencia de ajedrez online donde la lógica y la creatividad orbitan juntas. Desarrollado con Node.js y Express, este sistema equilibra estrategia y tecnología como mecánica celeste.',
        'project2Title': 'Java EDA',
        'project2Desc': 'Estructuras de datos trazadas como constelaciones. Organizadas, eficientes y esenciales, como las fuerzas invisibles que sostienen el universo digital.',
        'project3Title': 'Redes de Datos',
        'project3Desc': 'Proyectos que exploran la columna vertebral de Internet, como si se cartografiara la red cósmica que conecta galaxias a través del espacio digital.',
        'project4Title': 'Proyectos en Python',
        'project4Desc': 'Scripts y experimentos que orbitan alrededor de la automatización y el análisis de datos, herramientas para explorar el cosmos siempre en expansión de la programación.',
        'project5Title': 'Guía de Seguridad Bandit',
        'project5Desc': 'Una exploración guiada por la seguridad en Linux. Como viajar por regiones inexploradas del universo digital, cada nivel revela nuevas capas de protección y vulnerabilidad.',
        'project6Title': 'Base de Datos PostgreSQL',
        'project6Desc': 'Organizando datos con la precisión de los catálogos estelares. Un proyecto enfocado en el rendimiento y la integridad, porque incluso los datos merecen orden en el cosmos.',

        // --- Skills ---
        'skillsTitle': 'Habilidades Técnicas',
        'skillPython': 'Scripting a través de galaxias digitales',
        'skillSQL': 'Diseño de bases de datos como mapas estelares',
        'skillLinux': 'Navegación por sistemas seguros',
        'skillBash': 'Herramientas de exploración por terminal',
        'skillJava': 'Arquitectura orientada a objetos entre estrellas',
        'skillCpp': 'Ingeniería cósmica a nivel de sistema',
        'skillJS': 'Constelaciones web interactivas',
        'skillHTML': 'Estructurando universos de información',
        'skillCSS': 'Estilizando nebulosas digitales',
        'skillNode': 'Estaciones espaciales del lado del servidor',
        'skillGit': 'Control de versiones a través del tiempo',
        'skillDocker': 'Aplicaciones contenidas como módulos orbitales',
        'skillAWS': 'Sistemas en la nube que cruzan el espacio digital',
        'skillNetwork': 'Conectando sistemas en el cosmos de los datos',
        'skillCyber': 'Defendiendo las fronteras del ciberespacio',
        'skillLatex': 'Documentando misiones con precisión',

        // --- Contact ---
        'contactTitle': 'Centro de Comunicación',
        'contactText': '¿Listo para explorar nuevas fronteras juntos? Conectemos a través del cosmos universal y creemos algo extraordinario.',
        'contactRepo': 'GITHUB',
        'contactNetwork': 'LINKEDIN',
        'contactMissions': 'TRYHACKME',
        'contactChannel': 'EMAIL'
    }
};

// 2. LÓGICA DE TRADUCCIÓN
let currentLang = localStorage.getItem('lang') || 'en'; // 'en' por defecto
let typewriterInstance; // Guardamos la instancia del TypeWriter

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang); // Guarda la preferencia

    // Actualiza el texto de la página
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.dataset.key;
        if (translations[lang][key]) {
            elem.textContent = translations[lang][key];
        }
    });

    // Actualiza el botón de idioma (visual)
    const langBtn = document.getElementById('lang-toggle');
    if (lang === 'es') {
        langBtn.innerHTML = 'EN | <span style="color: var(--nebula-blue); font-weight: 700;">ES</span>';
    } else {
        langBtn.innerHTML = '<span style="color: var(--nebula-blue); font-weight: 700;">EN</span> | ES';
    }

    // ¡Importante! Reinicia el TypeWriter con las palabras traducidas
    const txtElement = document.getElementById('typewriter');
    if (txtElement) {

        // <-- CAMBIO CLAVE: Detenemos la instancia anterior antes de crear una nueva
        if (typewriterInstance) {
            typewriterInstance.stop();
        }

        const words = translations[lang].typewriterWords;
        typewriterInstance = new TypeWriter(txtElement, words, 2000);
    }

    // ¡Importante! Actualiza el texto del botón de música
    updateMusicButtonText();
}

// 3. FUNCIÓN DE MÚSICA MODIFICADA
function initMusicPlayer() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');

    if (!musicBtn || !audio) {
        console.warn("Music player elements not found.");
        return;
    }

    audio.volume = 0.15;
    const icon = musicBtn.querySelector('i');
    const text = musicBtn.querySelector('span');

    // --- Lógica de Autoplay ---
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = translations[currentLang].musicPause; // Traducido
            musicBtn.classList.add('playing');
        }).catch(error => {
            console.warn("Autoplay fue bloqueado:", error);
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = translations[currentLang].musicPlay; // Traducido
            musicBtn.classList.remove('playing');
        });
    }

    // --- Listener del Clic ---
    musicBtn.addEventListener('click', () => {
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');

        if (audio.paused) {
            audio.play().catch(e => console.error("Audio play failed:", e));
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = translations[currentLang].musicPause; // Traducido
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = translations[currentLang].musicPlay; // Traducido
            musicBtn.classList.remove('playing');
        }
    });
}

// Nueva función auxiliar para actualizar el botón de música al cambiar idioma
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

// 4. FUNCIONES ORIGINALES (PARTÍCULAS, NAVEGACIÓN, ANIMACIONES)

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

// 5. INICIALIZADOR PRINCIPAL
document.addEventListener('DOMContentLoaded', () => {

    // Configura el botón de idioma
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    });

    // Carga el idioma guardado al iniciar (esto también inicia el TypeWriter)
    setLanguage(currentLang);

    // Inicia el resto de las funciones
    initMusicPlayer();
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
