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

// 1. EL DICCIONARIO DE TRADUCCIONES
const translations = {
    // ... (El objeto de traducciones gigante va aquí, no ha cambiado) ...
        'en': {
     // --- Nav ---
    'navHome': 'Home',
    'navAbout': 'About Me',
    'navProjects': 'Projects',
    'navSkills': 'Skills',
    'navContact': 'Contact',
    
     // --- Hero ---
    'heroGreeting': 'Transmitting from the Digital Cosmos',
    'heroName': 'Ezequiel Morales',
    'heroTagline': 'Student focused on Cybersecurity and Networks',
    'heroUniv': 'Universidad Diego Portales',
    'heroCTA': 'Enter the Universe',
    'scrollExplore': 'Scroll to explore',
    
     // --- Typewriter ---
    'typewriterWords': [
    'Exploring where code meets the cosmos',
    'Cybersecurity student navigating digital galaxies',
    'Mapping networks like constellations in space',
    'Protecting systems across the vast digital universe',
    'Transforming data into stars that guide technology'
     ],
    // --- About ---
    'aboutTitle': 'About Me',
    'aboutP1': 'In this space, you will find all my programming, cybersecurity, and networking projects, which I will update and improve over time.',
    'aboutP2': 'The idea is to share part of my learning, tools, and solutions, and also to offer resources for those who want to explore and learn a little more about these topics.',
    'aboutP3': 'I combine my focus on cybersecurity and networks with a touch of futuristic and retro creativity, exploring systems and networks to find ways to make them more secure. When I\'m not working, studying, or experimenting with new setups, I get inspired by music and games from my childhood: a reminder that even when programming becomes repetitive, motivation is everything. If you want, press play and join me in this experience.',
    'musicPlay': 'Play',
    'musicPause': 'Pause',
    
     // --- Projects ---
    'projectsTitle': 'Projects',
    'project1Desc': 'Web development project for an online chess game. It includes a robust backend with Node.js and Express, along with an interactive frontend built with HTML, CSS, and JavaScript.',
    'project2Title': 'Java EDA',
    'project2Desc': 'Implementation of various data structures using Java. This repository demonstrates my ability to design and apply efficient algorithms and fundamental data structures.',
    'project3Title': 'Data Networks',
    'project3Desc': 'Collection of implementations and experiments related to data networks. It explores concepts such as routing, communication protocols, and network configuration, reinforcing my understanding of network infrastructure.',
    'project4Title': 'Python',
    'project4Desc': 'Implementation of Python for solving various practical problems and programming exercises. Includes scripts and Jupyter notebooks that demonstrate my versatility with the language.',
    'project5Title': 'Hacking Guide: Bandit (OverTheWire)',
    'project5Desc': 'Exhaustive LaTeX documentation of the methodology and solution for the Bandit wargame challenges, focusing on Linux commands and basic exploitation techniques.',
    'project6Title': 'PostgreSQL Database',
    'project6Desc': 'Design and implementation of a relational database in PostgreSQL, applying normalization and denormalization principles to optimize performance and ensure integrity.',
    
    // --- Skills ---
    'skillsTitle': 'Skills',
    'skillPython': 'Python (Scripting, Data Analysis)',
    'skillSQL': '(PostgreSQL, MySQL)',
    'skillLinux': '(Kali, Ubuntu)',
    'skillBash': 'Bash Scripting, Scalability',
    'skillJava': 'Used for data structures and algorithms',
    'skillCpp': 'Object-Oriented Programming (OOP)',
    'skillJS': 'BackEnd, scripting, and interactive web',
    'skillHTML': 'Web structures',
    'skillCSS': 'Web styling',
    'skillNode': 'Servers and deployment',
    'skillGit': 'Version control',
    'skillDocker': 'Containerized applications',
    'skillAWS': 'Cloud systems',
    'skillNetwork': 'System networking',
    'skillCyber': 'Ethical Hacking & Defense',
    'skillLatex': 'Professional Documentation',
    
    // --- Contact ---
    'contactTitle': 'Contact Hub',
    'contactText': 'Ready to explore new frontiers together? Lets connect across the universal cosmos and create something extraordinary.',
    'contactRepo': 'GITHUB',
    'contactNetwork': 'LINKEDIN',
    'contactMissions': 'TRYHACKME',
    'contactChannel': 'EMAIL'
},

    'es': {
        // --- Nav ---
        'navHome': 'Inicio',
        'navAbout': 'Sobre Mi',
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
        'aboutTitle': 'Sobre Mi',
        'aboutP1': 'En este espacio encontrarás todos mis proyectos de programación, ciberseguridad y redes, que iré actualizando y mejorando con el tiempo.',
        'aboutP2': 'La idea es compartir parte de mi aprendizaje, herramientas y soluciones, y también ofrecer recursos para quienes quieran explorar y aprender un poco más sobre estos temas.',
        'aboutP3': 'Mi enfoque en la ciberseguridad y redes lo combino con un toque de creatividad futurista y retro, explorando sistemas y redes para encontrar formas de hacerlos más seguros. Cuando no estoy trabajando, estudiando o experimentando nuevas configuraciones, me dejo inspirar por la música y juegos de mi infancia: un recordatorio de que incluso programar cuando se vuelve repetitivo, la motivación lo es todo. Si quieres, dale al play y acompáñame en esta experiencia.',
        'musicPlay': 'Reproducir',
        'musicPause': 'Pausar',

        // --- Projects ---
        'projectsTitle': 'Proyectos',
        'project1Title': 'Grand Chess Auto',
        'project1Desc': 'Proyecto de desarrollo web para un juego de ajedrez online. Incluye un robusto backend con Node.js y Express, junto con un frontend interactivo construido con HTML, CSS y JavaScript.',
        'project2Title': 'Java EDA',
        'project2Desc': 'Implementación de diversas estructuras de datos utilizando Java. Este repositorio demuestra mi habilidad para diseñar y aplicar algoritmos eficientes y estructuras de datos fundamentales.',
        'project3Title': 'Redes de Datos',
        'project3Desc': 'Colección de implementaciones y experimentos relacionados con redes de datos. Explora conceptos como el enrutamiento, protocolos de comunicación y configuración de red, reforzando mi comprensión de la infraestructura de redes.',
        'project4Title': 'Python',
        'project4Desc': 'Implementación de Python para la resolución de diversos problemas prácticos y ejercicios de programación. Incluye scripts y cuadernos Jupyter que demuestran mi versatilidad con el lenguaje.',
        'project5Title': 'Guía de Hacking: Bandit (OverTheWire)',
        'project5Desc': 'Documentación exhaustiva en LaTeX de la metodología y solución para los desafíos del wargame Bandit, enfocándose en comandos de Linux y técnicas básicas de explotación.',
        'project6Title': 'Base de Datos PostgreSQL',
        'project6Desc': 'Diseño e implementación de una base de datos relacional en PostgreSQL, aplicando principios de normalización y desnormalización para optimizar rendimiento y garantizar la integridad.',

        // --- Skills ---
        'skillsTitle': 'Habilidades',
        'skillPython': 'Python (Scripting, Análisis de Datos)',
        'skillSQL': '(PostgreSQL, MySQL)',
        'skillLinux': '(Kali, Ubuntu)',
        'skillBash': 'Bash Scripting, Escalabilidad',
        'skillJava': 'Implementado en estructura de datos y algoritmos',
        'skillCpp': 'Programación orientada a objetos (OPP)',
        'skillJS': 'BackEnd, scripting y web interactiva',
        'skillHTML': 'Estructuras web',
        'skillCSS': 'Estilización web',
        'skillNode': 'Servidores y deploy',
        'skillGit': 'Control de versiones',
        'skillDocker': 'Aplicaciones contenidas',
        'skillAWS': 'Sistemas en la nube',
        'skillNetwork': 'Conexion de sistemas',
        'skillCyber': 'Defensa y ofensa ética',
        'skillLatex': 'Documentacion Profesional',

        // --- Contact ---
        'contactTitle': 'Centro de contacto',
        'contactText': '¿Listo para explorar nuevas fronteras juntos? Conectemos a través del cosmos universal y creemos algo extraordinario.',
        'contactRepo': 'GITHUB',
        'contactNetwork': 'LINKEDIN',
        'contactMissions': 'TRYHACKME',
        'contactChannel': 'EMAIL'
    }
};

// 2. LÓGICA DE TRADUCCIÓN
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
let currentLang = getInitialLanguage();
let typewriterInstance;

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.dataset.key;
        if (translations[lang][key]) {
            elem.textContent = translations[lang][key];
        }
    });
    const langBtn = document.getElementById('lang-toggle');
    if (lang === 'es') {
        langBtn.innerHTML = 'EN | <span style="color: var(--nebula-blue); font-weight: 700;">ES</span>';
    } else {
        langBtn.innerHTML = '<span style="color: var(--nebula-blue); font-weight: 700;">EN</span> | ES';
    }
    const txtElement = document.getElementById('typewriter');
    if (txtElement) {
        if (typewriterInstance) {
            typewriterInstance.stop();
        }
        const words = translations[lang].typewriterWords;
        typewriterInstance = new TypeWriter(txtElement, words, 2000);
    }
    updateMusicButtonText();
}

// 3. FUNCIÓN DE MÚSICA MODIFICADA
function initMusicPlayer() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    
    // --- INICIO: CAMBIO ---
    // Seleccionamos el botón CTA
    const ctaButton = document.querySelector('.cta-button'); 
    // --- FIN: CAMBIO ---

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
            // Autoplay funcionó
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = translations[currentLang].musicPause;
            musicBtn.classList.add('playing');
        }).catch(error => {
            // Autoplay fue bloqueado
            console.warn("Autoplay fue bloqueado:", error);
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = translations[currentLang].musicPlay;
            musicBtn.classList.remove('playing');

            // --- INICIO: LÓGICA HÍBRIDA (SCROLL O CLIC) ---
            
            // Creamos una sola función para reproducir
            const playOnInteraction = () => {
                if (audio.paused) {
                    audio.play().then(() => {
                        icon.classList.replace('fa-play', 'fa-pause');
                        text.textContent = translations[currentLang].musicPause;
                        musicBtn.classList.add('playing');
                    }).catch(e => {
                        console.warn("La reproducción en interacción también falló:", e);
                    });
                }
                
                // --- IMPORTANTE: Removemos ambos listeners después del primer intento ---
                //    (Aunque {once: true} ya hace esto, es una doble seguridad)
                window.removeEventListener('scroll', playOnInteraction);
                if (ctaButton) {
                    ctaButton.removeEventListener('click', playOnInteraction);
                }
            };

            // Agregamos el listener para SCROLL (se ejecuta 1 vez)
            window.addEventListener('scroll', playOnInteraction, { once: true });
            
            // Agregamos el listener para el CLIC en el BOTÓN (se ejecuta 1 vez)
            if (ctaButton) {
                ctaButton.addEventListener('click', playOnInteraction, { once: true });
            }
            // --- FIN: LÓGICA HÍBRIDA ---
        });
    }

    // --- Listener del Clic (en el botón de Pausa/Play) ---
    musicBtn.addEventListener('click', () => {
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');

        if (audio.paused) {
            audio.play().catch(e => console.error("Audio play failed:", e));
            icon.classList.replace('fa-play', 'fa-pause');
            text.textContent = translations[currentLang].musicPause;
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            icon.classList.replace('fa-pause', 'fa-play');
            text.textContent = translations[currentLang].musicPlay;
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

// Navigation functionality
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
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
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

// Simple card hover effects (no tilt)
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {});
        card.addEventListener('mouseleave', () => {});
    });
}

// 5. INICIALIZADOR PRINCIPAL
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    });
    setLanguage(currentLang);
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
window.addEventListener('scroll', throttle(() => {}, 10));
document.addEventListener('DOMContentLoaded', () => {
    document.body.offsetHeight;

});
