/* === RADIO WIDGET LOGIC === */
// YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var isPlaying = false;
var volume = 30;
var currentStationIndex = 0;

// Station Playlist
const stations = [
    {
        id: 'QOzC_AbsPlw',
        title: 'Cosmic Radio - Deep Space Ambient',
        image: 'https://i.giphy.com/eHXed39iQn3TrMAZJO.webp' // Astronaut/Space
    },
    {
        id: 'HuFYqnbVbzY',
        title: 'Midnight Brew - Lofi Jazz Radio',
        image: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3I3amZ3anQ0OHI2ejl5bXF0cGZ5MXBlbndibGdmMGVsMXYwY3F2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RMwgs5kZqkRyhF24KK/giphy.gif' // Coffee Shop
    },
    {
        id: '4xDzrJKXOOY',
        title: 'Neon Horizon - Synthwave Radio',
        image: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGx0dWZyb3doeHg0NmQzM2pmY3l4NnN1cWVqaTFobzFlZXJleGlmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N43iolnh53IoyCjYp4/giphy.gif' // Neon Sun
    }
];

function onYouTubeIframeAPIReady() {
    // Initialize with first station
    const initialStation = stations[currentStationIndex];
    updateStationInfo(initialStation);

    player = new YT.Player('radio-player-container', {
        height: '0',
        width: '0',
        videoId: initialStation.id,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'loop': 1,
            'playlist': initialStation.id
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(volume);

    // UI Elements
    const toggleBtn = document.getElementById('radio-toggle');
    const prevBtn = document.getElementById('radio-prev');
    const nextBtn = document.getElementById('radio-next');
    const volumeSlider = document.getElementById('radio-volume');

    // Controls
    toggleBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', () => changeStation(-1));
    nextBtn.addEventListener('click', () => changeStation(1));

    // Volume
    volumeSlider.addEventListener('input', function () {
        volume = this.value;
        if (player && player.setVolume) {
            player.setVolume(volume);
        }
        updateVolumeIcon(volume);
    });

    updateVolumeIcon(volume);

    // Close Button Handling
    const closeBtn = document.getElementById('radio-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (player && player.pauseVideo) {
                player.pauseVideo();
            }
            const widget = document.getElementById('radio-widget');
            if (widget) {
                widget.style.opacity = '0';
                widget.style.pointerEvents = 'none'; // Prevent clicks while fading
                setTimeout(() => {
                    widget.style.display = 'none';
                }, 300);
            }
        });
    }
}

function togglePlay() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function changeStation(direction) {
    currentStationIndex += direction;

    // Circular navigation
    if (currentStationIndex >= stations.length) currentStationIndex = 0;
    if (currentStationIndex < 0) currentStationIndex = stations.length - 1;

    const station = stations[currentStationIndex];

    // Update Info
    updateStationInfo(station);

    // Update Player
    if (player && player.loadVideoById) {
        player.loadVideoById({
            videoId: station.id,
            startSeconds: 0
        });
        // Auto play when changing station
        // YT automatically plays after loadVideoById mostly.
    }
}

function updateStationInfo(station) {
    const titleEl = document.querySelector('.radio-title-text');
    const coverEl = document.querySelector('.radio-cover');

    // Fade out effect manually slightly visible by snap update
    if (titleEl) titleEl.textContent = station.title;
    if (coverEl) coverEl.src = station.image;
}

function onPlayerStateChange(event) {
    const toggleBtn = document.getElementById('radio-toggle');
    const widget = document.getElementById('radio-widget');
    const icon = toggleBtn.querySelector('i');
    const statusText = document.querySelector('.radio-status-badge');

    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        icon.className = 'fas fa-pause';
        widget.classList.add('playing');
        if (statusText) statusText.innerHTML = '<span class="status-dot"></span> LIVE';
    } else {
        isPlaying = false;
        icon.className = 'fas fa-play';
        widget.classList.remove('playing');
        if (statusText) statusText.innerHTML = '<span class="status-dot" style="animation:none; opacity:0.5; background:grey;"></span> PAUSED';
    }
}

function updateVolumeIcon(vol) {
    const volIcon = document.querySelector('.volume-icon');
    if (vol == 0) {
        volIcon.className = 'fas fa-volume-mute volume-icon';
    } else if (vol < 50) {
        volIcon.className = 'fas fa-volume-down volume-icon';
    } else {
        volIcon.className = 'fas fa-volume-up volume-icon';
    }
}

// === EXTERNAL GAME CONTROL ===
let wasPlayingBeforeGame = false;

window.pauseRadio = function () {
    if (player && isPlaying) {
        wasPlayingBeforeGame = true;
        player.pauseVideo();
    } else {
        wasPlayingBeforeGame = false;
    }
};

window.resumeRadio = function () {
    if (player && wasPlayingBeforeGame) {
        player.playVideo();
        wasPlayingBeforeGame = false;
    }
};
