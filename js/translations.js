
const translations = {
    'en': {
        // --- Nav ---
        'navHome': 'Home',
        'navAbout': 'About Me',
        'navProjects': 'Projects',
        'navCertifications': 'Certifications',
        'navSkills': 'Skills',
        'navContact': 'Contact',

        // --- Hero ---
        'heroGreeting': '',
        'heroName': 'Ezequiel Morales',
        'heroTagline': 'Cybersecurity & Network Engineering',
        'heroUniv': 'Universidad Diego Portales',
        'heroCTA': 'View My Work',
        'scrollExplore': 'Scroll to explore',

        // --- Typewriter ---
        'typewriterWords': [
            'Securing Digital Infrastructures and Networks.',
            'Building secure, scalable, and efficient systems.',
            'Passionate about network protocols and digital defense.',
            'Solving complex problems, one line of code at a time.',
            'Constantly learning new tools and technologies.'
        ],
        // --- About ---
        'aboutTitle': 'About Me',
        'aboutP1': 'In this space, you will find all my programming, cybersecurity, and networking projects, which I will update and improve over time.',
        'aboutP2': 'The idea is to share part of my learning, tools, and solutions, and also to offer resources for those who want to explore and learn a little more about these topics.',
        'aboutP3': 'I combine my focus on cybersecurity and networks with a touch of futuristic and retro creativity, exploring systems and networks to find ways to make them more secure. When I\'m not working, studying, or experimenting with new setups, I get inspired by music and games from my childhood: a reminder that even in the most complex technical challenges, there\'s always a bigger picture to consider. If you want, press play and join me in this experience.',
        'musicPlay': 'Play',
        'musicPause': 'Pause',
        'aboutCV': 'Download CV',
        'aboutViewCV': 'View CV',
        'cvDownload': 'Download PDF',
        'cvOpenExternal': 'Open in New Tab',

        // --- Projects ---
        'projectsTitle': 'Projects',
        'project1Title': 'Grand Chess Auto: Reimagined',
        'project1Desc': 'Real-time multiplayer chess game with Retrowave/GTA aesthetics. Features WebSocket synchronization, glassmorphism UI, and self-hosted infrastructure with Cloudflare Zero Trust.',
        'project1DetailedDesc': 'GCA: Reimagined is a complete rewrite of my original chess project, built from scratch with professional-grade architecture. It features real-time multiplayer via Socket.IO, spectator mode, precision game clocks with latency compensation, in-game chat, and a premium Glassmorphism interface. The backend runs on Node.js + Express with MongoDB Atlas, secured by Cloudflare WAF and Turnstile captcha. Self-hosted on my homelab with Cloudflare Zero Trust Tunnels.',
        'projectIaTitle': 'IAimageBetter - AI Image Enhancer',
        'projectIaDesc': 'A professional-grade, self-hosted web application for AI-powered image upscaling and enhancement using Real-ESRGAN. Built with React and Python.',
        'projectIaDetailedDesc': 'Professional self-hosted web application for AI-powered image upscaling using Real-ESRGAN. Features unlimited localized processing, smart hardware detection (CUDA/CPU), privacy-focused offline design, and a modern UI with before/after comparisons. Built with React 18, FastAPI, PyTorch, Docker, and Nginx. Supports multiple AI models (x2, x4) for photography and anime.',
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
        'viewProject': 'View Project',
        'viewCode': 'View Code',

        // --- Skills ---
        'skillsTitle': 'Technical Skills',
        'skillsSubtitle': 'Technologies I\'ve worked with',
        // Categorías
        'skillsCat1': 'Cybersecurity & Cloud Infrastructure',
        'skillsCat2': 'Backend & Data',
        'skillsCat3': 'Frontend & Modern Web',
        // Fila 1 - Cyber & Infra
        'skillCyber': 'Ethical Hacking & Defense',
        'skillLinux': 'Kali Linux & Hyprland Rice',
        'skillUbuntu': 'Server & Desktop Environment',
        'skillBash': 'Command-line exploration tools',
        'skillNetwork': 'System networking',
        'skillNginx': 'Reverse Proxy & Load Balancing',
        'skillDocker': 'Containerization & Orchestration',
        // Fila 2 - Backend & Cloud
        'skillPython': 'FastAPI & Scripting',
        'skillJava': 'Data Structures & Algorithms',
        'skillCpp': 'System-level Programming',
        'skillLua': 'Scripting & Configs',
        'skillNode': 'Backend Javascript Runtime',
        'skillExpress': 'API Development',
        'skillPostgres': 'Relational Databases',
        'skillMongoDB': 'NoSQL Document Store',
        'skillRedis': 'In-Memory Data Structures',
        'skillKubernetes': 'Container Orchestration',
        'skillOracle': 'Cloud Infrastructure',
        // Fila 3 - Frontend
        'skillJS': 'ES6+ Modern Javascript',
        'skillHTML': 'Semantic Structure',
        'skillCSS': 'Responsive Design',
        'skillReact': 'Modern UI Library',
        'skillTailwind': 'Utility-First CSS',
        'skillGit': 'Version Control & CI/CD',
        'skillAWS': 'Cloud Services',
        'skillFastAPI': 'High-performance APIs',

        // --- NEW SKILLS (Reinstated) ---
        'skillCloudflare': 'CDN, WAF & Tunnels',
        'skillWireshark': 'Network Protocol Analysis',
        'skillMetasploit': 'Exploitation Framework',
        'skillBurp': 'Web Vulnerability Scanning',

        // --- Game ---
        'gameTitle': 'Cosmic Battle',
        'gameIntro': 'Ready for a battle?',
        'gameStart': 'Start Mission',
        'gameScore': 'Score',
        'gameOver': 'Mission Failed!',
        'gameRestart': 'Retry Mission',

        'projectLinkGithub': 'Code',
        'projectLinkLive': 'Live',
        'projectLinkDetails': 'Details',
        'projectDetails': 'Read More',
        'closeModal': 'Close',

        // --- Contact ---
        'contactTitle': 'Contact Hub',
        'contactText': 'Ready to explore new frontiers together? Lets connect and create something extraordinary.',
        'contactRepo': 'GitHub',
        'contactNetwork': 'LinkedIn',
        'contactHacker': 'HackerRank',
        'contactLeet': 'LeetCode',
        'contactMissions': 'TryHackMe',
        'contactHTB': 'HackTheBox',
        'contactChannel': 'Email',

        // Contact Form
        'contactFormTitle': 'Send a direct message',
        'formName': 'Your Name',
        'formEmail': 'Your Email',
        'formSubject': 'Subject', // New
        'formMessage': 'Your Message',
        'formSend': 'Send',
        'formSending': 'Transmitting...',
        'formPlaceholderName': 'Name',
        'formPlaceholderEmail': 'email@example.com',
        'formPlaceholderSubject': 'Project Inquiry', // New
        'formPlaceholderMessage': 'Hello, I would like to discuss...',
        'formSuccess': 'Message sent successfully! I\'ll respond soon.',
        'formError': 'Failed to send message. Please try again or use email directly.',
        'formErrorConfig': 'Contact form not configured. Please use email link above.',

        // --- Certifications ---
        'certificationsTitle': 'Certifications',
        'cert1Title': 'Introduction to Cybersecurity',
        'cert1Org': 'Cisco Networking Academy',
        'cert2Title': 'Networking Essentials - Network Technician Career Path',
        'cert2Org': 'Cisco Networking Academy',
        'cert3Title': 'English for Developers',
        'cert3Org': 'FreeCodeCamp',
        'certLinkView': 'View',
        'certLinkProgress': 'In Progress',
        'viewMore': 'View More',
        'viewLess': 'View Less'

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
        'heroGreeting': '',
        'heroName': 'Ezequiel Morales',
        'heroTagline': 'Ciberseguridad e Ingeniería de Redes',
        'heroCTA': 'Ver Mis Trabajos',
        'scrollExplore': 'Desliza para explorar',

        // --- Typewriter ---
        'typewriterWords': [
            'Asegurando Infraestructuras Digitales y Redes.',
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
        'aboutViewCV': 'Ver CV',
        'cvDownload': 'Descargar PDF',
        'cvOpenExternal': 'Abrir en Pestaña',

        // --- Projects ---
        'projectsTitle': 'Proyectos',
        'project1Title': 'Grand Chess Auto: Reimagined',
        'project1Desc': 'Juego de ajedrez multijugador en tiempo real con estética Retrowave/GTA. Sincronización WebSocket, interfaz Glassmorphism e infraestructura self-hosted con Cloudflare Zero Trust.',
        'project1DetailedDesc': 'GCA: Reimagined es una reescritura completa de mi proyecto de ajedrez original, construido desde cero con arquitectura profesional. Incluye multijugador en tiempo real vía Socket.IO, modo espectador, relojes de precisión con compensación de latencia, chat integrado e interfaz premium Glassmorphism. El backend corre en Node.js + Express con MongoDB Atlas, protegido por Cloudflare WAF y Turnstile captcha. Self-hosted en mi homelab con Cloudflare Zero Trust Tunnels.',
        'projectIaTitle': 'IAimageBetter - Mejora de Imágenes con IA',
        'projectIaDesc': 'Aplicación web profesional self-hosted para el escalado y mejora de imágenes mediante IA usando Real-ESRGAN. Sin límites, privada y acelerada por GPU.',
        'projectIaDetailedDesc': 'Aplicación web profesional self-hosted para el escalado de imágenes con IA utilizando Real-ESRGAN. Ofrece procesamiento local ilimitado, detección inteligente de hardware (CUDA/CPU), diseño centrado en la privacidad offline y una interfaz moderna con comparativas antes/después. Construida con React 18, FastAPI, PyTorch, Docker y Nginx. Soporta múltiples modelos de IA (x2, x4) para fotografía y anime.',
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
        'viewProject': 'Ver Proyecto',
        'viewCode': 'Ver Código',

        // --- Skills ---
        'skillsTitle': 'Habilidades Técnicas',
        'skillsSubtitle': 'Tecnologías con las que he trabajado',
        // Categorías
        'skillsCat1': 'Ciberseguridad e Infraestructura Cloud',
        'skillsCat2': 'Backend y Datos',
        'skillsCat3': 'Frontend y Modern Web',
        // Fila 1 - Cyber & Infra
        'skillCyber': 'Hacking Ético & Defensa',
        'skillLinux': 'Kali Linux & Hyprland Rice',
        'skillUbuntu': 'Entorno de Servidor y Escritorio',
        'skillBash': 'Herramientas de línea de comandos',
        'skillNetwork': 'Redes de Sistemas',
        'skillNginx': 'Proxy Inverso y Balanceo de Carga',
        'skillDocker': 'Contenerización y Orquestación',
        // Fila 2 - Backend & Cloud
        'skillPython': 'FastAPI y Scripting',
        'skillJava': 'Estructuras de Datos y Algoritmos',
        'skillCpp': 'Programación de bajo nivel',
        'skillLua': 'Scripting y Desarrollo de Juegos',
        'skillNode': 'Runtime de Javascript Backend',
        'skillExpress': 'Desarrollo de APIs',
        'skillPostgres': 'Bases de Datos Relacionales',
        'skillMongoDB': 'Base de Datos NoSQL',
        'skillRedis': 'Estructuras de Datos en Memoria',
        'skillKubernetes': 'Orquestación de Contenedores',
        'skillOracle': 'Infraestructura Cloud',
        // Fila 3 - Frontend
        'skillJS': 'Javascript Moderno ES6+',
        'skillHTML': 'Estructura Semántica',
        'skillCSS': 'Diseño Responsivo',
        'skillReact': 'Librería de UI Moderna',
        'skillTailwind': 'CSS Utility-First',
        'skillGit': 'Control de Versiones y CI/CD',
        'skillAWS': 'Servicios en la Nube',
        'skillFastAPI': 'APIs de alto rendimiento',

        // --- NEW SKILLS (Reinstated) ---
        'skillCloudflare': 'CDN, WAF y Túneles',
        'skillWireshark': 'Análisis de Protocolos de Red',
        'skillMetasploit': 'Framework de Explotación',
        'skillBurp': 'Escaneo de Vulnerabilidades Web',
        'skillArduino': 'Hardware & IoT',
        'skillLatex': 'Technical Documentation',
        // Removed: VSCode, Notion

        // --- Game ---
        'gameTitle': 'Batalla Cósmica',
        'gameIntro': '¿Listo para la batalla?',
        'gameStart': 'Iniciar Misión',
        'gameScore': 'Puntaje',
        'gameOver': '¡Misión Fallida!',
        'gameRestart': 'Reintentar Misión',

        'projectLinkGithub': 'Código',
        'projectLinkLive': 'en Vivo',
        'projectLinkDetails': 'Detalles',
        'projectDetails': 'Leer Más',
        'closeModal': 'Cerrar',

        // --- Contact ---
        'contactTitle': 'Centro de contacto',
        'contactText': '¿Listo para explorar nuevas fronteras juntos? Conectemos y creemos algo extraordinario.',
        'contactRepo': 'GitHub',
        'contactNetwork': 'LinkedIn',
        'contactHacker': 'HackerRank',
        'contactMissions': 'TryHackMe',
        'contactLeet': 'LeetCode',
        'contactHTB': 'HackTheBox',
        'contactChannel': 'Email',

        // Contact Form
        'contactFormTitle': 'Mensaje directo',
        'formName': 'Tu Nombre',
        'formEmail': 'Tu Email',
        'formSubject': 'Asunto',
        'formMessage': 'Tu Mensaje',
        'formSend': 'Enviar',
        'formSending': 'Transmitiendo...',
        'formPlaceholderName': 'Nombre',
        'formPlaceholderEmail': 'correo@ejemplo.com',
        'formPlaceholderSubject': 'Consulta de Proyecto',
        'formPlaceholderMessage': 'Hola, me gustaría hablar sobre...',
        'formSuccess': '¡Mensaje enviado exitosamente! Responderé pronto.',
        'formError': 'Error al enviar el mensaje. Por favor intenta de nuevo o usa el email directamente.',
        'formErrorConfig': 'Formulario no configurado. Por favor usa el enlace de email arriba.',

        // --- Certifications ---
        'certificationsTitle': 'Certificaciones',
        'cert1Title': 'Introduction to Cybersecurity',
        'cert1Org': 'Cisco Networking Academy',
        'cert2Title': 'Networking Essentials - Network Technician Career Path',
        'cert2Org': 'Cisco Networking Academy',
        'cert3Title': 'Inglés para Desarrolladores',
        'cert3Org': 'FreeCodeCamp',
        'certLinkView': 'Ver',
        'certLinkProgress': 'En Progreso',
        'viewMore': 'Ver Más',
        'viewLess': 'Ver Menos'
    }
};
