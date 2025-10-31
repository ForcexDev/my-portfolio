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
        'navCertifications': 'Certifications',
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
            'Securing Digital Infrastructures and Networks.', // <-- LÍNEA CAMBIADA
            'Building secure, scalable, and efficient systems.',
            'Passionate about network protocols and digital defense.',
            'Solving complex problems, one line of code at a time.',
            'Constantly learning new tools and technologies.'
        ],
        // --- About ---
        'aboutTitle': 'About Me',
        'aboutP1': 'In this space, you will find all my programming, cybersecurity, and networking projects, which I will update and improve over time.',
        'aboutP2': 'The idea is to share part of my learning, tools, and solutions, and also to offer resources for those who want to explore and learn a little more about these topics.',
        'aboutP3': 'I combine my focus on cybersecurity and networks with a touch of futuristic and retro creativity, exploring systems and networks to find ways to make them more secure. When I\'m not working, studying, or experimenting with new setups, I get inspired by music and games from my childhood: a reminder that even when programming becomes repetitive, motivation is everything. If you want, press play and join me in this experience.',
        'musicPlay': 'Play',
        'musicPause': 'Pause',
        'aboutCV': 'Download CV',

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
        'skillsTitle': 'Technical Skills',
        // Categorías
        'skillsCat1': 'Cybersecurity & Networks',
        'skillsCat2': 'Backend & Data',
        'skillsCat3': 'Frontend & Software',
        // Fila 1
        'skillCyber': 'Ethical Hacking & Defense',
        'skillLinux': 'Navigation through secure systems',
        'skillUbuntu': 'Server & Desktop Environment',
        'skillBash': 'Command-line exploration tools',
        'skillNetwork': 'System networking',
        'skillNginx': 'Nginx server https',
        'skillDocker': 'Containerizing applications',
        // Fila 2
        'skillPython': 'Python (Scripting, Data Analysis)',
        'skillJava': 'Used for data structures and algorithms',
        'skillCpp': 'Object-Oriented Programming (OOP)',
        'skillLua': 'Scripting & Game Development',
        'skillNode': 'Servers and deployment',
        'skillExpress': 'Node.js server framework',
        'skillSQL': 'Database architectures',
        'skillMongoDB': 'NoSQL database management',
        // Fila 3
        'skillJS': 'BackEnd, scripting, and interactive web',
        'skillHTML': 'Web structures',
        'skillCSS': 'Web styling',
        'skillGit': 'Version control across timelines',
        'skillAWS': 'Cloud infrastructure',
        'skillLatex': 'Technical documentation',
        'skillVSCode': 'Code editor of choice',
        'skillWebStorm': 'JetBrains IDE for web',
        'skillWindows': 'Operating System',
        'skillPhotoshop': 'Raster graphics editor',
        'skillBlender': '3D computer graphics',

        // --- Game ---
        'gameTitle': 'Star war',
        'gameIntro': 'Ready for a battle?',
        'gameStart': 'Start Mission',

        // --- Contact ---
        'contactTitle': 'Contact Hub',
        'contactText': 'Ready to explore new frontiers together? Lets connect and create something extraordinary.',
        'contactRepo': 'GitHub',
        'contactNetwork': 'LinkedIn',
        'contactHacker':'HackerRank',
        'contactLeet': 'LeetCode',
        'contactMissions': 'TryHackMe',
        'contactChannel': 'Email',

        // --- Certifications (AÑADIDO) ---
        'certificationsTitle': 'Certifications & Courses',
        'cert1Title': 'Introduction to Cybersecurity',
        'cert1Org': 'Cisco Networking Academy',
        'cert2Title': 'Networking Essentials - Network Technician Career Path',
        'cert2Org': 'Cisco Networking Academy',
        'cert3Title': 'English for Developers',
        'cert3Org': 'FreeCodeCamp',
        'certLinkView': 'View',
        'certLinkProgress': 'In Progress'

    },

    'es': {
        // --- Nav ---
        'navHome': 'Inicio',
        'navAbout': 'Sobre Mi',
        'navProjects': 'Proyectos',
        'navCertifications': 'Certificaciones',
        'navSkills': 'Habilidades',
        'navContact': 'Contacto',

        // --- Hero ---
        'heroGreeting': 'Transmitiendo desde el Cosmos Digital',
        'heroName': 'Ezequiel Morales',
        'heroTagline': 'Estudiante enfocado en Ciberseguridad y Redes',
        'heroCTA': 'Entra al Universo',
        'scrollExplore': 'Desliza para explorar',

        // --- Typewriter ---
        'typewriterWords': [
            'Asegurando Infraestructuras Digitales y Redes.', // <-- LÍNEA CAMBIADA
            'Construyendo sistemas seguros, escalables y eficientes.',
            'Apasionado por los protocolos de red y la defensa digital.',
            'Resolviendo problemas complejos, una línea de código a la vez.',
            'Aprendiendo constantemente nuevas herramientas y tecnologías.'
        ],

        // --- About ---
        'aboutTitle': 'Sobre Mi',
        'aboutP1': 'En este espacio encontrarás todos mis proyectos de programación, ciberseguridad y redes, que iré actualizando y mejorando con el tiempo.',
        'aboutP2': 'La idea es compartir parte de mi aprendizaje, herramientas y soluciones, y también ofrecer recursos para quienes quieran explorar y aprender un poco más sobre estos temas.',
        'aboutP3': 'Mi enfoque en la ciberseguridad y redes lo combino con un toque de creatividad futurista y retro, explorando sistemas y redes para encontrar formas de hacerlos más seguros. Cuando no estoy trabajando, estudiando o experimentando nuevas configuraciones, me dejo inspirar por la música y juegos de mi infancia: un recordatorio de que incluso programar cuando se vuelve repetitivo, la motivación lo es todo. Si quieres, dale al play y acompáñame en esta experiencia.',
        'musicPlay': 'Reproducir',
        'musicPause': 'Pausar',
        'aboutCV': 'Descargar CV',

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
        'skillsTitle': 'Habilidades Tenicas',
        // Categorías
        'skillsCat1': 'Ciberseguridad y Redes',
        'skillsCat2': 'Backend y Datos',
        'skillsCat3': 'Frontend y Software',
        // Fila 1
        'skillCyber': 'Defensa y ofensa ética',
        'skillLinux': 'Navegación por sistemas seguros',
        'skillUbuntu': 'Entorno de servidor y escritorio',
        'skillBash': 'Herramientas de exploración por terminal',
        'skillNetwork': 'Conexion de sistemas',
        'skillNginx': 'Servicios Nginx en https',
        'skillDocker': 'Aplicaciones contenidas',
        // Fila 2
        'skillPython': 'Python (Scripting, Análisis de Datos)',
        'skillJava': 'Implementado en estructura de datos y algoritmos',
        'skillCpp': 'Programación orientada a objetos (OPP)',
        'skillLua': 'Scripting y desarrollo de juegos',
        'skillNode': 'Servidores y deploy',
        'skillExpress': 'Framework de servidor para Node.js',
        'skillSQL': 'Arquitecturas de bases de datos',
        'skillMongoDB': 'Gestión de bases de datos NoSQL',
        // Fila 3
        'skillJS': 'BackEnd, scripting y web interactiva',
        'skillHTML': 'Estructuras web',
        'skillCSS': 'Estilización web',
        'skillGit': 'Control de versiones a través del tiempo',
        'skillAWS': 'Infraestructura en la nube',
        'skillLatex': 'Documentacion Profesional',
        'skillVSCode': 'Editor de código principal',
        'skillWebStorm': 'IDE de JetBrains para web',
        'skillWindows': 'Sistema Operativo',
        'skillPhotoshop': 'Editor de gráficos rasterizados',
        'skillBlender': 'Gráficos 3D por computadora',

        // --- Game ---

        // --- Game ---
        'gameTitle': 'Star war',
        'gameIntro': '¿Listo para la batalla?',
        'gameStart': 'Iniciar Misión',

        // --- Contact ---
        'contactTitle': 'Centro de contacto',
        'contactText': '¿Listo para explorar nuevas fronteras juntos? Conectemos y creemos algo extraordinario.',
        'contactRepo': 'GitHub',
        'contactNetwork': 'LinkedIn',
        'contactHacker':'HackerRank',
        'contactMissions': 'TryHackMe',
        'contactLeet': 'LeetCode',
        'contactChannel': 'Email',

        // --- Certifications (AÑADIDO) ---
        'certificationsTitle': 'Certificaciones',
        'cert1Title': 'Introduction to Cybersecurity',
        'cert1Org': 'Cisco Networking Academy',
        'cert2Title': 'Networking Essentials - Network Technician Career Path',
        'cert2Org': 'Cisco Networking Academy',
        'cert3Title': 'Inglés para Desarrolladores',
        'cert3Org': 'FreeCodeCamp',
        'certLinkView': 'Ver',
        'certLinkProgress': 'En Progreso'
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

// --- INICIO: Lógica de Música Principal (REVISADA) ---
const mainMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const ctaButton = document.querySelector('.cta-button[href="#about"]');

if (mainMusic && musicBtn && ctaButton) {
    mainMusic.volume = 0.17;
    const icon = musicBtn.querySelector('i');
    const text = musicBtn.querySelector('span');
    let musicStartedByListener = false; // Flag para saber si el usuario ya interactuó

    // Función para REPRODUCIR la música principal y actualizar botón
    const playMainMusic = () => {
        // No reproduzcas si la música del JUEGO ya está sonando
        // (El 'audio' viene del script del juego más abajo)
        if (typeof audio !== 'undefined' && audio.background && !audio.background.paused) {
            return;
        }

        mainMusic.play().catch(e => console.error("Audio play failed:", e));
        icon.classList.replace('fa-play', 'fa-pause');
        text.textContent = translations[currentLang].musicPause;
        musicBtn.classList.add('playing');
    };

    // Función para PAUSAR la música principal y actualizar botón
    const pauseMainMusic = () => {
        mainMusic.pause();
        icon.classList.replace('fa-pause', 'fa-play');
        text.textContent = translations[currentLang].musicPlay;
        musicBtn.classList.remove('playing');
    };

    // --- Esta es la función clave de inicio ---
    // Se dispara UNA VEZ, ya sea por scroll o por clic en el CTA.
    const startMusicOnInteraction = () => {
        if (!musicStartedByListener && mainMusic.paused) {
            playMainMusic();
            musicStartedByListener = true;
        }
        // Limpiamos ambos listeners por si acaso (aunque {once: true} debería bastar)
        window.removeEventListener('scroll', startMusicOnInteraction);
        ctaButton.removeEventListener('click', startMusicOnInteraction);
    };

    // 1. Listeners para scroll y CTA (ambos se ejecutan solo UNA VEZ)
    window.addEventListener('scroll', startMusicOnInteraction, { once: true });
    ctaButton.addEventListener('click', startMusicOnInteraction, { once: true });

    // 2. Listener para el botón de Play/Pause (control manual)
    musicBtn.addEventListener('click', () => {
        if (!musicStartedByListener) {
            // Si el primer clic es el botón manual, también cuenta
            musicStartedByListener = true;
            // Limpia los listeners automáticos
            window.removeEventListener('scroll', startMusicOnInteraction);
            ctaButton.removeEventListener('click', startMusicOnInteraction);
        }

        if (mainMusic.paused) {
            playMainMusic();
        } else {
            pauseMainMusic();
        }
    });

} else {
    console.warn("Music player elements not found.");
}
// --- FIN: Lógica de Música Principal ---

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
    createCosmicParticles();
    initNavigation();
    initScrollAnimations();
    updateActiveNavigation();
    initCardHoverEffects();

    // --- PEGA EL CÓDIGO DEL BOTÓN AQUÍ ---
    const toTopBtn = document.getElementById('backToTopBtn');

    if (toTopBtn) {
        // 1. Mostrar/Ocultar el botón
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Aparece después de 300px
                toTopBtn.classList.add('visible');
            } else {
                toTopBtn.classList.remove('visible');
            }
        });

        // 2. Hacer scroll suave al hacer clic
        toTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Previene el salto brusco del href="#home"
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // --- FIN: Lógica del Botón Back-to-Top ---

}); // <-- Justo antes de esta llave de cierre

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

/* === INICIO: LÓGICA DEL JUEGO SPACE BATTLE === */

// Espera a que el DOM esté cargado para iniciar el juego
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN INICIAL ---
    const canvas = document.getElementById('spaceCanvasGame');
    if (!canvas) return; // Si no existe el canvas, no sigue

    const ctx = canvas.getContext('2d');
    const gameContainer = document.getElementById('gameContainer');
    const overlay = document.getElementById('gameOverlay');
    const startBtn = document.getElementById('startGameBtn');
    const messageEl = document.getElementById('gameMessage');
    const scoreContainer = document.getElementById('gameScore'); // <-- El <h3> completo
    const scoreEl = scoreContainer.querySelector('span'); // <-- El <span> de adentro

    // Canvas a tamaño HD (proporción 4:3)
    canvas.width = 800;
    canvas.height = 600;

    let player, bullets, enemies, particles, score, gameOver, gameLoopId;
    let mouse = { x: canvas.width / 2, isDown: false }; // Objeto para el mouse
    let touchInProgress = false; // Para evitar conflictos entre mouse y touch
    let gameActive = false;

    // --- 2. AUDIO ---
    // !! CAMBIA ESTO por las rutas a tus archivos de sonido !!
    const audio = {
        background: new Audio('Derezzed.mp3'),
        shoot: new Audio(''),
        explosion: new Audio('')
    };
    audio.background.loop = true;
    audio.background.volume = 0.25;
    audio.shoot.volume = 0.4;
    audio.explosion.volume = 0.2;

    // --- 3. CLASES DEL JUEGO ---

    // Clase para la Nave (Jugador)
    class Player {
        constructor() {
            this.width = 40;
            this.height = 40;
            this.x = canvas.width / 2 - this.width / 2;
            this.y = canvas.height - this.height - 20;
            this.speed = 8; // No se usa con el mouse, pero se guarda
            this.shootCooldown = 0; // Enfriamiento entre disparos
        }
        draw() {
            ctx.fillStyle = '#4299e1'; // Color --nebula-blue
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.shadowColor = '#4299e1';
            ctx.shadowBlur = 10;
        }
        update() {
            ctx.shadowBlur = 0; // Resetea la sombra

            // --- LÓGICA DE MOVIMIENTO CON MOUSE ---
            // La nave sigue al mouse. (this.width / 2) la centra en el cursor.
            this.x = mouse.x - (this.width / 2);

            // Limitar al canvas
            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;

            // --- LÓGICA DE DISPARO CON MOUSE ---
            if (mouse.isDown && this.shootCooldown <= 0) {
                this.shoot();
            }
            if (this.shootCooldown > 0) this.shootCooldown--;
            this.draw();
        }
        shoot() {
            bullets.push(new Bullet(this.x + this.width / 2, this.y));
            this.shootCooldown = 15; // 15 frames de espera
            audio.shoot.currentTime = 0; // Reinicia el sonido
            audio.shoot.play().catch(e => console.warn("Audio de disparo bloqueado"));
        }
    }

    // Clase para las Balas
    class Bullet {
        constructor(x, y) {
            this.x = x - 2.5;
            this.y = y;
            this.width = 5;
            this.height = 15;
            this.speed = 5;
        }
        draw() {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowColor = '#FFF';
            ctx.shadowBlur = 3;
        }
        update() {
            this.y -= this.speed;
            this.draw();
        }
    }

    // Clase para los Enemigos
    class Enemy {
        constructor() {
            this.width = 30;
            this.height = 30;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = -this.height;
            this.speed = Math.random() * 2 + 2;
        }
        draw() {
            ctx.fillStyle = '#6b46c1'; // Color --cosmic-purple
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowColor = '#6b46c1';
            ctx.shadowBlur = 10;
        }
        update() {
            this.y += this.speed;
            this.draw();
        }
    }

    // Clase para las Partículas (Explosión)
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 6 - 3;
            this.life = 30; // 30 frames de vida
        }
        draw() {
            ctx.fillStyle = '#9f7aea'; // Color --cosmic-magenta
            ctx.globalAlpha = this.life / 30;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            this.draw();
        }
    }

    // --- 4. FUNCIONES DEL JUEGO ---

    // Iniciar y reiniciar el juego
    function initGame() {
        player = new Player();
        bullets = [];
        enemies = [];
        particles = [];
        score = 0;
        gameOver = false;
        gameActive = true;
        scoreEl.textContent = '0';
        messageEl.style.display = 'none';
        scoreContainer.style.display = 'block'; // <-- ARREGLADO

        // Centra el mouse al inicio
        mouse.x = canvas.width / 2;
        mouse.isDown = false;

        // Ocultar overlay
        overlay.classList.add('hidden');
        gameContainer.classList.add('game-active');

        // Empezar música de fondo del juego
        // (Pausa la música principal del sitio si está sonando)
        const mainMusic = document.getElementById('bg-music');
        if (mainMusic && !mainMusic.paused) mainMusic.pause();

        audio.background.currentTime = 0;
        audio.background.play().catch(e => console.warn("Audio de fondo bloqueado"));

        // Empezar el bucle del juego
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        animate();
    }

    // Bucle principal del juego (VERSIÓN CORREGIDA y TRANSPARENTE)
    function animate() {
        if (gameOver) return;

        // Limpia el canvas para la transparencia
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Actualizar Jugador
        player.update();

        // 2. Añadir Enemigos
        if (Math.random() < 0.03) { // 3% de probabilidad por frame
            enemies.push(new Enemy());
        }

        // 3. Actualizar Balas (Bucle 'for' hacia atrás, es más seguro)
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.update();
            if (bullet.y < 0) bullets.splice(i, 1);
        }

        // 4. Actualizar Partículas (Bucle 'for' hacia atrás)
        ctx.globalAlpha = 1; // Restaurar alpha antes de partículas
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            if (particle.life <= 0) particles.splice(i, 1);
        }
        ctx.globalAlpha = 1; // Restaurar alpha después

        // 5. Actualizar Enemigos (Bucle 'for' hacia atrás)
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.update();

            // Enemigo se sale de pantalla
            if (enemy.y > canvas.height) {
                enemies.splice(i, 1);
                continue; // Pasa al siguiente enemigo
            }

            // Colisión Jugador vs Enemigo
            if (checkCollision(player, enemy)) {
                endGame();
                createExplosion(player.x + player.width / 2, player.y + player.height / 2, 20);
                continue; // Pasa al siguiente enemigo (el jugador ya murió)
            }

            // Colisión Bala vs Enemigo (Bucle 'j' anidado, también hacia atrás)
            for (let j = bullets.length - 1; j >= 0; j--) {
                const bullet = bullets[j];

                if (checkCollision(bullet, enemy)) {
                    // Previene error si la bala o enemigo ya no existen
                    if (bullets[j]) bullets.splice(j, 1);
                    if (enemies[i]) enemies.splice(i, 1);

                    score += 10;
                    scoreEl.textContent = score;
                    createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10);

                    break; // La bala ya golpeó, deja de revisar otras balas para este enemigo
                }
            }
        }

        gameLoopId = requestAnimationFrame(animate);
    }

    // Detección de colisiones (simple AABB)
    function checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    // Crear explosión
    function createExplosion(x, y, count) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
        audio.explosion.currentTime = 0;
        audio.explosion.play().catch(e => console.warn("Audio de explosión bloqueado"));
    }

    // Terminar el juego
    function endGame() {
        gameOver = true;
        gameActive = false;
        cancelAnimationFrame(gameLoopId);

        // Detener música del juego
        audio.background.pause();
        const musicBtn = document.getElementById('music-toggle');
        const mainMusic = document.getElementById('bg-music');
        if (musicBtn && mainMusic && musicBtn.classList.contains('playing')) {
            mainMusic.play().catch(e => console.warn("Reinicio de música principal bloqueado"));
        }


        // Mostrar overlay de nuevo
        overlay.classList.remove('hidden');
        gameContainer.classList.remove('game-active');
        messageEl.textContent = 'Game Over. Final Score:';
        messageEl.style.display = 'block';
        scoreContainer.style.display = 'block'; // <-- ARREGLADO

        // Actualizar texto del botón a "Retry" (usamos JS, no data-key)
        startBtn.textContent = 'Retry Mission';
    }

    // --- 5. EVENT LISTENERS (Mouse + Touch) ---

    // Botón de Inicio
    startBtn.addEventListener('click', initGame);

    // --- Controles de MOUSE (para PC) ---

    canvas.addEventListener('mousemove', (e) => {
        if (touchInProgress) return; // Si se está tocando, ignora el mouse
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        mouse.x = (e.clientX - rect.left) * scaleX;
    });

    canvas.addEventListener('mousedown', (e) => {
        if (gameActive && !touchInProgress) {
            mouse.isDown = true;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (gameActive && !touchInProgress) {
            mouse.isDown = false;
        }
    });

    // --- Controles TÁCTILES (para Teléfono) ---

    // Función para actualizar la posición táctil
    function handleTouchMove(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        mouse.x = (e.touches[0].clientX - rect.left) * scaleX;
    }

    canvas.addEventListener('touchstart', (e) => {
        if (gameActive) {
            e.preventDefault();
            touchInProgress = true;
            mouse.isDown = true; // Empieza a disparar
            handleTouchMove(e); // Mueve la nave a la posición inicial del dedo
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (gameActive) {
            e.preventDefault();
            handleTouchMove(e); // Actualiza la posición de la nave
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (gameActive) {
            e.preventDefault();
            touchInProgress = false;
            mouse.isDown = false; // Deja de disparar
        }
    }, { passive: false });

    // Prevenir que el clic derecho abra el menú contextual en el juego
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

});
/* === FIN: LÓGICA DEL JUEGO SPACE BATTLE === */

