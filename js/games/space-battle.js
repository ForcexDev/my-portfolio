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
        background: new Audio('../../assets/audio/Derezzed.mp3'),
        shoot: new Audio(''),
        explosion: new Audio('')
    };
    audio.background.loop = true;
    audio.background.volume = 0.25;
    audio.shoot.volume = 0.4;
    audio.explosion.volume = 0.2;

    // --- 2.5 COLORS FROM CSS VARIABLES ---
    // Read theme colors from CSS for visual consistency
    const rootStyles = getComputedStyle(document.documentElement);
    const gameColors = {
        player: rootStyles.getPropertyValue('--nebula-blue').trim() || '#4299e1',
        enemy: rootStyles.getPropertyValue('--cosmic-purple').trim() || '#6b46c1',
        particle: rootStyles.getPropertyValue('--cosmic-magenta').trim() || '#9f7aea'
    };

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
            ctx.fillStyle = gameColors.player;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.shadowColor = gameColors.player;
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
            ctx.fillStyle = gameColors.enemy;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowColor = gameColors.enemy;
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
            ctx.fillStyle = gameColors.particle;
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
        // Use public API from main.js - remembers if music was playing
        if (typeof window.pauseBackgroundMusicForGame === 'function') {
            window.pauseBackgroundMusicForGame();
        }

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

        // Use public API from main.js - resumes music if it was playing before game
        if (typeof window.resumeBackgroundMusicAfterGame === 'function') {
            window.resumeBackgroundMusicAfterGame();
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
