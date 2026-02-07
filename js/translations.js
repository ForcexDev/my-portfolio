
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

        // --- Projects ---
        'projectsTitle': 'Projects',
        'project1Title': 'Grand Chess Auto: Reimagined',
        'project1Desc': 'Real-time multiplayer chess game with Retrowave/GTA aesthetics. Features WebSocket synchronization, glassmorphism UI, and self-hosted infrastructure with Cloudflare Zero Trust.',
        'project1DetailedDesc': 'GCA: Reimagined is a complete rewrite of my original chess project, built from scratch with professional-grade architecture. It features real-time multiplayer via Socket.IO, spectator mode, precision game clocks with latency compensation, in-game chat, and a premium Glassmorphism interface. The backend runs on Node.js + Express with MongoDB Atlas, secured by Cloudflare WAF and Turnstile captcha. Self-hosted on my homelab with Cloudflare Zero Trust Tunnels.',
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
        'skillPython': 'Scripting, Data Analysis',
        'skillJava': 'Used for data structures and algorithms',
        'skillCpp': 'Object-Oriented Programming (OOP)',
        'skillLua': 'Scripting & Game Development',
        'skillNode': 'Servers and deployment',
        'skillExpress': 'Node.js server framework',
        'skillPostgres': 'Database architectures',
        'skillMongoDB': 'NoSQL database management',
        // Fila 3
        'skillJS': 'Interactive web constellation',
        'skillHTML': 'Structuring digital universes',
        'skillCSS': 'Styling cosmic interfaces',
        'skillGit': 'Version control',
        'skillAWS': 'Cloud infrastructure',
        'skillLaTeX': 'Technical documentation',
        'skillVSCode': 'Code editor of choice',

        // --- NEW SKILLS (Reinstated) ---
        'skillCloudflare': 'CDN & Security',
        'skillWireshark': 'Network Protocol Analyzer',
        'skillMetasploit': 'Penetration Testing Framework',
        'skillBurp': 'Web Security Testing',
        'skillKubernetes': 'Container Orchestration',
        'skillOracle': 'Cloud Infrastructure',
        'skillArduino': 'Hardware & IoT',
        'skillNotion': 'Project Management',

        // --- Game ---
        'gameTitle': 'Cosmic Battle',
        'gameIntro': 'Ready for a battle?',
        'gameStart': 'Start Mission',
        'gameScore': 'Score',
        'gameOver': 'Mission Failed!',
        'gameRestart': 'Retry Mission',

        'projectLinkGithub': 'View Code (GitHub)',
        'projectLinkLive': 'View Live Project',
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
        'formMessage': 'Your Message',
        'formSend': 'Send Transmission',
        'formSending': 'Transmitting...',
        'formPlaceholderName': 'John Doe',
        'formPlaceholderEmail': 'john@example.com',
        'formPlaceholderMessage': 'Hello, I would like to discuss...',

        // --- Certifications ---
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

        // --- Projects ---
        'projectsTitle': 'Proyectos',
        'project1Title': 'Grand Chess Auto: Reimagined',
        'project1Desc': 'Juego de ajedrez multijugador en tiempo real con estética Retrowave/GTA. Sincronización WebSocket, interfaz Glassmorphism e infraestructura self-hosted con Cloudflare Zero Trust.',
        'project1DetailedDesc': 'GCA: Reimagined es una reescritura completa de mi proyecto de ajedrez original, construido desde cero con arquitectura profesional. Incluye multijugador en tiempo real vía Socket.IO, modo espectador, relojes de precisión con compensación de latencia, chat integrado e interfaz premium Glassmorphism. El backend corre en Node.js + Express con MongoDB Atlas, protegido por Cloudflare WAF y Turnstile captcha. Self-hosted en mi homelab con Cloudflare Zero Trust Tunnels.',
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
        'skillPython': 'Scripting, Análisis de Datos',
        'skillJava': 'Implementado en estructura de datos y algoritmos',
        'skillCpp': 'Programación Orientada a Objetos',
        'skillLua': 'Scripting y desarrollo de juegos',
        'skillNode': 'Servidores y deploy',
        'skillExpress': 'Framework de servidor para Node.js',
        'skillPostgres': 'Arquitecturas de bases de datos',
        'skillMongoDB': 'Gestión de bases de datos NoSQL',
        // Fila 3
        'skillJS': 'Constelación web interactiva',
        'skillHTML': 'Estructuras web',
        'skillCSS': 'Estilización web',
        'skillGit': 'Control de versiones a través del tiempo',
        'skillAWS': 'Infraestructura en la nube',
        'skillLaTeX': 'Documentación Técnica',
        'skillVSCode': 'Editor de código principal',

        // --- NEW SKILLS (Reinstated) ---
        'skillCloudflare': 'CDN y Seguridad',
        'skillWireshark': 'Analizador de Protocolos de Red',
        'skillMetasploit': 'Framework de Pruebas de Penetración',
        'skillBurp': 'Pruebas de Seguridad Web',
        'skillKubernetes': 'Orquestación de Contenedores',
        'skillOracle': 'Infraestructura en la Nube',
        'skillArduino': 'Hardware e IoT',
        'skillNotion': 'Gestión de Proyectos',

        // --- Game ---
        'gameTitle': 'Batalla Cósmica',
        'gameIntro': '¿Listo para la batalla?',
        'gameStart': 'Iniciar Misión',
        'gameScore': 'Puntaje',
        'gameOver': '¡Misión Fallida!',
        'gameRestart': 'Reintentar Misión',

        'projectLinkGithub': 'Ver Código (GitHub)',
        'projectLinkLive': 'Ver Proyecto en Vivo',
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
        'contactFormTitle': 'Enviar un mensaje directo',
        'formName': 'Tu Nombre',
        'formEmail': 'Tu Email',
        'formMessage': 'Tu Mensaje',
        'formSend': 'Enviar Transmisión',
        'formSending': 'Transmitiendo...',
        'formPlaceholderName': 'Juan Pérez',
        'formPlaceholderEmail': 'juan@ejemplo.com',
        'formPlaceholderMessage': 'Hola, me gustaría hablar sobre...',

        // --- Certifications ---
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
