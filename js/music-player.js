// persistent-music-player.js - True cross-page music continuity
// This creates a persistent audio element that survives page navigation

(function() {
    'use strict';
    
    // Create a persistent iframe for the audio player that survives navigation
    let persistentFrame = null;
    let isFrameReady = false;
    
    // Global state management
    if (!window.musicPlayerPersistent) {
        window.musicPlayerPersistent = {
            isMusicPlaying: false,
            playerContainer: null,
            songItems: null,
            soundEffectVolume: 0.7,
            currentSongIndex: 0,
            isPlayerVisible: false,
            isInitialized: false,
            currentTime: 0,
            volume: 0.7,
            lastUpdateTime: Date.now(),
            backgroundMusic: null
        };
    }

    // Playlist data
    const playlist = [
        { 
            title: "Ruth B. - Dandelions",
            src: "music/Ruth B. - Dandelions (Lyrics).mp3",
            cover: "images/covers/dandelions.jpg",
            duration: "3:48"
        },
        { 
            title: "CAS - Opera House",
            src: "music/Opera House.mp3",
            cover: "images/covers/CAS.jpg",
            duration: "6:05" 
        },
        { 
            title: "Sofia Mills - Coffee Breath",
            src: "music/coffee-breath.mp3",
            cover: "images/covers/coffee-breath.png",
            duration: "2:42"
        },
        { 
            title: "The Marias - No one noticed",
            src: "music/no-one-noticed.mp3",
            cover: "images/covers/no-one-noticed.jpg",
            duration: "3:48"
        },
        { 
            title: "Christina Perri - A Thousand Years",
            src: "music/a-thousand-years.mp3",
            cover: "images/covers/thousand-years.jpg",
            duration: "4:46"
        },
        { 
            title: "John Legend - All of Me",
            src: "music/all-of-me.mp3",
            cover: "images/covers/all-of-me.jpg",
            duration: "4:30"
        },
        { 
            title: "beabadoobee - Glue Song ft. Clairo",
            src: "music/glue-song.mp3",
            cover: "images/covers/glue-song.jpg",
            duration: "2:17"
        },
        { 
            title: "Sombr - Back to friends",
            src: "music/back-to-friends.mp3",
            cover: "images/covers/BTF.jpeg",
            duration: "3:18"
        }
    ];

    // Create persistent iframe for audio
    function createPersistentAudioFrame() {
        if (persistentFrame && document.body.contains(persistentFrame)) {
            return; // Frame already exists
        }

        persistentFrame = document.createElement('iframe');
        persistentFrame.id = 'persistent-audio-frame';
        persistentFrame.style.cssText = `
            position: fixed;
            top: -1000px;
            left: -1000px;
            width: 1px;
            height: 1px;
            border: none;
            visibility: hidden;
            pointer-events: none;
        `;
        
        // Create the iframe content with audio element
        const frameContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Audio Frame</title>
            </head>
            <body>
                <audio id="persistent-audio" preload="metadata" crossorigin="anonymous"></audio>
                <script>
                    window.audioReady = true;
                    // Allow parent to access audio
                    window.getAudio = function() {
                        return document.getElementById('persistent-audio');
                    };
                    
                    // Notify parent when audio events occur
                    const audio = document.getElementById('persistent-audio');
                    audio.addEventListener('play', () => {
                        if (window.parent && window.parent.musicPlayerPersistent) {
                            window.parent.musicPlayerPersistent.isMusicPlaying = true;
                            window.parent.updatePlayButtonState && window.parent.updatePlayButtonState();
                            window.parent.updateAudioControlState && window.parent.updateAudioControlState();
                        }
                    });
                    
                    audio.addEventListener('pause', () => {
                        if (window.parent && window.parent.musicPlayerPersistent) {
                            window.parent.musicPlayerPersistent.isMusicPlaying = false;
                            window.parent.updatePlayButtonState && window.parent.updatePlayButtonState();
                            window.parent.updateAudioControlState && window.parent.updateAudioControlState();
                        }
                    });
                    
                    audio.addEventListener('timeupdate', () => {
                        if (window.parent && window.parent.updateTimeDisplay) {
                            window.parent.updateTimeDisplay();
                        }
                    });
                    
                    audio.addEventListener('ended', () => {
                        if (window.parent && window.parent.nextSong) {
                            window.parent.nextSong();
                        }
                    });
                    
                    audio.addEventListener('loadedmetadata', () => {
                        if (window.parent && window.parent.updatePlayerDisplay) {
                            window.parent.updatePlayerDisplay();
                        }
                    });
                </script>
            </body>
            </html>
        `;
        
        document.body.appendChild(persistentFrame);
        
        // Write content to iframe
        persistentFrame.contentDocument.open();
        persistentFrame.contentDocument.write(frameContent);
        persistentFrame.contentDocument.close();
        
        // Wait for iframe to be ready
        const checkReady = () => {
            try {
                if (persistentFrame.contentWindow && persistentFrame.contentWindow.audioReady) {
                    isFrameReady = true;
                    window.musicPlayerPersistent.backgroundMusic = persistentFrame.contentWindow.getAudio();
                    console.log('Persistent audio frame ready');
                    
                    // Initialize the player now that audio is ready
                    if (typeof initializeMusicPlayerComponents === 'function') {
                        initializeMusicPlayerComponents();
                    }
                } else {
                    setTimeout(checkReady, 100);
                }
            } catch (e) {
                setTimeout(checkReady, 100);
            }
        };
        
        setTimeout(checkReady, 100);
    }

    // Get audio element from persistent frame
    function getAudioElement() {
        if (!isFrameReady || !persistentFrame || !persistentFrame.contentWindow) {
            return null;
        }
        
        try {
            return persistentFrame.contentWindow.getAudio();
        } catch (e) {
            console.log('Could not access persistent audio:', e);
            return null;
        }
    }

    // State management using multiple methods for reliability
    function savePlayerState() {
        const audio = getAudioElement();
        if (!audio) return;
        
        const state = {
            isPlaying: !audio.paused,
            currentSongIndex: window.musicPlayerPersistent.currentSongIndex,
            currentTime: audio.currentTime,
            volume: audio.volume,
            src: audio.src,
            timestamp: Date.now()
        };
        
        // Store in multiple places for reliability
        window.musicPlayerPersistent.persistentState = state;
        
        try {
            window.name = JSON.stringify(state);
        } catch (e) {
            console.log('Could not save to window.name');
        }
        
        // Also store in sessionStorage as backup if available
        try {
            sessionStorage.setItem('musicState', JSON.stringify(state));
        } catch (e) {
            // sessionStorage not available, ignore
        }
    }

    function loadPlayerState() {
        let state = null;
        
        // Try to get from current window object first
        if (window.musicPlayerPersistent.persistentState) {
            const timeDiff = Date.now() - (window.musicPlayerPersistent.persistentState.timestamp || 0);
            if (timeDiff < 60 * 60 * 1000) { // 1 hour
                state = window.musicPlayerPersistent.persistentState;
            }
        }
        
        // Try window.name
        if (!state) {
            try {
                if (window.name) {
                    const parsed = JSON.parse(window.name);
                    const timeDiff = Date.now() - (parsed.timestamp || 0);
                    if (timeDiff < 60 * 60 * 1000) {
                        state = parsed;
                    }
                }
            } catch (e) {
                console.log('Could not load from window.name');
            }
        }
        
        // Try sessionStorage as backup
        if (!state) {
            try {
                const stored = sessionStorage.getItem('musicState');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const timeDiff = Date.now() - (parsed.timestamp || 0);
                    if (timeDiff < 60 * 60 * 1000) {
                        state = parsed;
                    }
                }
            } catch (e) {
                // sessionStorage not available, ignore
            }
        }
        
        return state;
    }

    // Initialize music player components (UI)
    function initializeMusicPlayerComponents() {
        console.log('Initializing music player components...');
        
        const audio = getAudioElement();
        if (!audio) {
            console.log('Audio element not ready, retrying...');
            setTimeout(initializeMusicPlayerComponents, 500);
            return;
        }
        
        // Load previous state
        const savedState = loadPlayerState();
        console.log('Loaded saved state:', savedState);
        
        // Restore saved state
        if (savedState) {
            window.musicPlayerPersistent.currentSongIndex = savedState.currentSongIndex || 0;
            window.musicPlayerPersistent.volume = savedState.volume || 0.7;
            window.musicPlayerPersistent.currentTime = savedState.currentTime || 0;
            
            // If the audio source matches, restore position
            if (savedState.src && audio.src === savedState.src) {
                audio.currentTime = savedState.currentTime;
                if (savedState.isPlaying) {
                    window.musicPlayerPersistent.isMusicPlaying = true;
                }
            }
        }
        
        // Create music player UI
        createMusicPlayer();
        
        // Create audio control button
        createAudioControl();
        
        // Setup event listeners
        setupMusicPlayerEvents();
        
        // Load the current song
        loadSong(window.musicPlayerPersistent.currentSongIndex, () => {
            // Restore volume
            audio.volume = window.musicPlayerPersistent.volume;
            
            // Restore playback position if needed
            if (window.musicPlayerPersistent.currentTime > 0 && audio.duration) {
                audio.currentTime = Math.min(window.musicPlayerPersistent.currentTime, audio.duration);
            }
            
            updatePlayerDisplay();
            updateVolumeDisplay();
            
            // Mark as initialized
            window.musicPlayerPersistent.isInitialized = true;
            
            // Resume playback if it was playing
            if (savedState && savedState.isPlaying) {
                console.log('Resuming playback...');
                setTimeout(() => {
                    audio.play().then(() => {
                        console.log('✓ Music resumed successfully');
                        window.musicPlayerPersistent.isMusicPlaying = true;
                        updatePlayButtonState();
                        updateAudioControlState();
                    }).catch(e => {
                        console.log('Auto-resume failed (user interaction required):', e.name);
                        setupUserInteractionResume();
                    });
                }, 200);
            }
            
            console.log('Music player initialized successfully');
        });
    }

    function setupUserInteractionResume() {
        const resumeOnInteraction = () => {
            const audio = getAudioElement();
            if (audio && !window.musicPlayerPersistent.isMusicPlaying) {
                audio.play().then(() => {
                    console.log('✓ Music resumed on user interaction');
                    window.musicPlayerPersistent.isMusicPlaying = true;
                    updatePlayButtonState();
                    updateAudioControlState();
                }).catch(e => {
                    console.log('Resume on interaction failed:', e);
                });
            }
            
            // Remove listeners
            document.removeEventListener('click', resumeOnInteraction);
            document.removeEventListener('keydown', resumeOnInteraction);
            document.removeEventListener('touchstart', resumeOnInteraction);
        };
        
        document.addEventListener('click', resumeOnInteraction, { once: true });
        document.addEventListener('keydown', resumeOnInteraction, { once: true });
        document.addEventListener('touchstart', resumeOnInteraction, { once: true });
    }

    function createMusicPlayer() {
        // Remove existing player if any
        const existingPlayer = document.querySelector('.music-player');
        if (existingPlayer) {
            existingPlayer.remove();
        }

        const playerContainer = document.createElement('div');
        playerContainer.className = 'music-player';
        playerContainer.innerHTML = `
            <div class="player-header">
                <span class="player-title">Songs that are dedicated to you ❤️</span>
                <button class="close-player">×</button>
            </div>
            <div class="now-playing">
                <div class="album-art">
                    <img class="album-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: none;" alt="Album cover">
                    <div class="album-fallback" style="display: flex;">Album Art</div>
                </div>
                <div class="song-info">
                    <div class="song-title">Loading...</div>
                    <div class="song-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="time-info">
                            <span class="current-time">0:00</span>
                            <span class="total-time">0:00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="player-controls">
                <button class="control-btn prev-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                <button class="control-btn play-btn">
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                </button>
                <button class="control-btn next-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
            </div>
            <div class="volume-control-container">
                <div class="volume-icon-wrapper">
                    <svg class="volume-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path class="volume-wave" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path class="volume-wave" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                </div>
                <div class="volume-slider-container">
                    <input type="range" min="0" max="100" value="70" class="volume-slider" id="volume-slider">
                    <div class="volume-level">70%</div>
                </div>
            </div>
            <div class="playlist-section">
                <ul class="songs-list"></ul>
            </div>
        `;
        
        document.body.appendChild(playerContainer);
        window.musicPlayerPersistent.playerContainer = playerContainer;
        
        // Populate playlist
        const songsList = playerContainer.querySelector('.songs-list');
        playlist.forEach((song, index) => {
            const songElement = document.createElement('li');
            songElement.className = index === window.musicPlayerPersistent.currentSongIndex ? 'song-item active' : 'song-item';
            songElement.dataset.index = index;
            songElement.innerHTML = `
                <div class="song-item-info">
                    <span class="song-number">${index + 1}</span>
                    <span class="song-title">${song.title}</span>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            songsList.appendChild(songElement);
        });
        
        window.musicPlayerPersistent.songItems = playerContainer.querySelectorAll('.song-item');
        
        // Set initial state
        playerContainer.style.display = 'none';
    }

    function createAudioControl() {
        // Remove existing audio control
        const existingControl = document.querySelector('.audio-control');
        if (existingControl) {
            existingControl.remove();
        }

        const audioToggle = document.createElement('div');
        audioToggle.className = 'audio-control';
        audioToggle.innerHTML = `
            <div class="audio-heart">❤️</div>
            <div class="audio-tooltip">Play Our Song</div>
        `;
        document.body.appendChild(audioToggle);
        
        return audioToggle;
    }

    function setupMusicPlayerEvents() {
        const playerContainer = window.musicPlayerPersistent.playerContainer;
        const audioControl = document.querySelector('.audio-control');
        
        if (!playerContainer) {
            console.error('Player container not found');
            return;
        }

        // Close button
        const closeBtn = playerContainer.querySelector('.close-player');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                playerContainer.style.animation = 'slideOutRight 0.3s forwards';
                setTimeout(() => {
                    playerContainer.style.display = 'none';
                    window.musicPlayerPersistent.isPlayerVisible = false;
                }, 300);
            });
        }

        // Audio control toggle
        if (audioControl) {
            audioControl.addEventListener('click', () => {
                if (window.musicPlayerPersistent.isPlayerVisible) {
                    // Hide player
                    playerContainer.style.animation = 'slideOutRight 0.3s forwards';
                    setTimeout(() => {
                        playerContainer.style.display = 'none';
                        window.musicPlayerPersistent.isPlayerVisible = false;
                    }, 300);
                } else {
                    // Show player
                    playerContainer.style.display = 'block';
                    playerContainer.style.animation = 'slideInRight 0.3s forwards';
                    window.musicPlayerPersistent.isPlayerVisible = true;
                    
                    // Auto-start if not playing
                    if (!window.musicPlayerPersistent.isMusicPlaying) {
                        setTimeout(toggleAudioPlayer, 100);
                    }
                }
            });
        }

        // Play/Pause button
        const playBtn = playerContainer.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', toggleAudioPlayer);
        }

        // Next/Previous buttons
        const nextBtn = playerContainer.querySelector('.next-btn');
        const prevBtn = playerContainer.querySelector('.prev-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSong);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                window.musicPlayerPersistent.currentSongIndex = (window.musicPlayerPersistent.currentSongIndex - 1 + playlist.length) % playlist.length;
                loadSong(window.musicPlayerPersistent.currentSongIndex);
            });
        }

        // Progress bar
        const progressBar = playerContainer.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const audio = getAudioElement();
                if (!audio) return;
                
                const clickPosition = e.offsetX;
                const totalWidth = progressBar.offsetWidth;
                const seekPercentage = clickPosition / totalWidth;
                
                if (audio.duration) {
                    audio.currentTime = seekPercentage * audio.duration;
                    savePlayerState();
                }
            });
        }

        // Volume control
        const volumeSlider = playerContainer.querySelector('#volume-slider');
        const volumeLevel = playerContainer.querySelector('.volume-level');
        const volumeIcon = playerContainer.querySelector('.volume-icon');
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                const audio = getAudioElement();
                if (!audio) return;
                
                const volumeValue = this.value / 100;
                audio.volume = volumeValue;
                window.musicPlayerPersistent.volume = volumeValue;
                
                if (volumeLevel) volumeLevel.textContent = `${this.value}%`;
                
                this.style.setProperty('--volume-percent', `${this.value}%`);
                window.musicPlayerPersistent.soundEffectVolume = volumeValue;
                updateVolumeIcon(volumeValue);
                savePlayerState();
            });
        }

        // Volume icon toggle
        if (volumeIcon) {
            volumeIcon.addEventListener('click', () => {
                const audio = getAudioElement();
                if (!audio) return;
                
                if (audio.volume > 0) {
                    volumeIcon.dataset.prevVolume = audio.volume;
                    audio.volume = 0;
                    window.musicPlayerPersistent.volume = 0;
                    if (volumeSlider) {
                        volumeSlider.value = 0;
                        volumeSlider.style.setProperty('--volume-percent', '0%');
                    }
                    if (volumeLevel) volumeLevel.textContent = "0%";
                    updateVolumeIcon(0);
                } else {
                    const prevVolume = parseFloat(volumeIcon.dataset.prevVolume || 0.7);
                    audio.volume = prevVolume;
                    window.musicPlayerPersistent.volume = prevVolume;
                    if (volumeSlider) {
                        volumeSlider.value = prevVolume * 100;
                        volumeSlider.style.setProperty('--volume-percent', `${prevVolume * 100}%`);
                    }
                    if (volumeLevel) volumeLevel.textContent = `${Math.round(prevVolume * 100)}%`;
                    updateVolumeIcon(prevVolume);
                }
                savePlayerState();
            });
        }

        // Playlist items
        if (window.musicPlayerPersistent.songItems) {
            window.musicPlayerPersistent.songItems.forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    if (index !== window.musicPlayerPersistent.currentSongIndex) {
                        window.musicPlayerPersistent.currentSongIndex = index;
                        loadSong(index);
                    }
                });
            });
        }

        // Set up periodic state saving
        setInterval(() => {
            if (window.musicPlayerPersistent.isMusicPlaying) {
                savePlayerState();
            }
        }, 2000);
    }

    // Core audio functions
    function toggleAudioPlayer() {
        const audio = getAudioElement();
        if (!audio) {
            console.error('Audio element not available');
            return;
        }
        
        if (window.musicPlayerPersistent.isMusicPlaying || !audio.paused) {
            audio.pause();
        } else {
            audio.play().then(() => {
                console.log('✓ Play successful');
            }).catch(e => {
                console.error('✗ Play failed:', e);
            });
        }
    }

    function loadSong(index, callback) {
        const audio = getAudioElement();
        if (!playlist[index] || !audio) {
            console.log('Invalid song index or no audio element');
            return;
        }
        
        const song = playlist[index];
        const wasPlaying = window.musicPlayerPersistent.isMusicPlaying;
        
        console.log('Loading song:', song.title);
        
        // Set up one-time event listener for when song is ready
        const onCanPlay = () => {
            console.log('Song can play, duration:', audio.duration);
            audio.removeEventListener('canplay', onCanPlay);
            
            setTimeout(() => {
                if (callback) callback();
                
                // Resume playing if it was playing before
                if (wasPlaying) {
                    audio.play();
                }
            }, 50);
        };
        
        audio.addEventListener('canplay', onCanPlay);
        
        // Set up timeout fallback
        const timeout = setTimeout(() => {
            console.log('Song load timeout, proceeding anyway...');
            audio.removeEventListener('canplay', onCanPlay);
            if (callback) callback();
            if (wasPlaying) {
                audio.play();
            }
        }, 3000);
        
        // Load the song
        audio.src = song.src;
        audio.load();
        
        // Update current song index
        window.musicPlayerPersistent.currentSongIndex = index;
        
        // Update playlist active state
        if (window.musicPlayerPersistent.songItems) {
            window.musicPlayerPersistent.songItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        // Clear timeout when done
        audio.addEventListener('canplay', () => {
            clearTimeout(timeout);
        }, { once: true });
        
        // Save state
        setTimeout(savePlayerState, 100);
    }

    function nextSong() {
        window.musicPlayerPersistent.currentSongIndex = (window.musicPlayerPersistent.currentSongIndex + 1) % playlist.length;
        loadSong(window.musicPlayerPersistent.currentSongIndex);
    }

    // UI Update Functions
    function updatePlayButtonState() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (playIcon && pauseIcon) {
            if (window.musicPlayerPersistent.isMusicPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }
    }

    function updateAudioControlState() {
        const audioHeart = document.querySelector('.audio-heart');
        const audioTooltip = document.querySelector('.audio-tooltip');
        
        if (audioHeart) {
            if (window.musicPlayerPersistent.isMusicPlaying) {
                audioHeart.classList.add('beating');
            } else {
                audioHeart.classList.remove('beating');
            }
        }
        
        if (audioTooltip) {
            audioTooltip.textContent = window.musicPlayerPersistent.isMusicPlaying ? 'Pause Our Song' : 'Play Our Song';
        }
    }

    function updateVolumeDisplay() {
        const volumeSlider = document.querySelector('#volume-slider');
        const volumeLevel = document.querySelector('.volume-level');
        
        if (volumeSlider) {
            const volumePercent = Math.round(window.musicPlayerPersistent.volume * 100);
            volumeSlider.value = volumePercent;
            volumeSlider.style.setProperty('--volume-percent', `${volumePercent}%`);
        }
        
        if (volumeLevel) {
            volumeLevel.textContent = `${Math.round(window.musicPlayerPersistent.volume * 100)}%`;
        }
        
        updateVolumeIcon(window.musicPlayerPersistent.volume);
    }

    function updatePlayerDisplay() {
        const playerContainer = window.musicPlayerPersistent.playerContainer;
        const audio = getAudioElement();
        
        if (!playerContainer) return;

        const song = playlist[window.musicPlayerPersistent.currentSongIndex];
        
        // Update song title
        const songTitleEl = playerContainer.querySelector('.song-title');
        if (songTitleEl) {
            songTitleEl.textContent = song.title;
        }
        
        // Update total time
        const totalTimeDisplay = playerContainer.querySelector('.total-time');
        if (totalTimeDisplay) {
            if (audio && audio.duration && !isNaN(audio.duration)) {
                totalTimeDisplay.textContent = formatTime(audio.duration);
            } else {
                totalTimeDisplay.textContent = song.duration;
            }
        }
        
        // Update album art
        const albumImg = playerContainer.querySelector('.album-cover-img');
        const albumFallback = playerContainer.querySelector('.album-fallback');
        
        if (song.cover && albumImg) {
            albumImg.src = song.cover;
            albumImg.style.display = 'block';
            if (albumFallback) albumFallback.style.display = 'none';
            
            albumImg.onerror = function() {
                albumImg.style.display = 'none';
                if (albumFallback) albumFallback.style.display = 'flex';
            };
        } else {
            if (albumImg) albumImg.style.display = 'none';
            if (albumFallback) albumFallback.style.display = 'flex';
        }
    }

    function updateTimeDisplay() {
        const playerContainer = window.musicPlayerPersistent.playerContainer;
        const audio = getAudioElement();
        
        if (!playerContainer || !audio) return;

        const currentTime = audio.currentTime;
        const duration = audio.duration || 1;
        const progressPercent = (currentTime / duration) * 100;
        
        const progressFill = playerContainer.querySelector('.progress-fill');
        const currentTimeDisplay = playerContainer.querySelector('.current-time');
        
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
    }

    function updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (!volumeIcon) return;
        
        const volumeWaves = volumeIcon.querySelectorAll('.volume-wave');
        
        if (volume === 0) {
            volumeIcon.classList.add('muted');
            volumeWaves.forEach(wave => wave.style.display = 'none');
        } else {
            volumeIcon.classList.remove('muted');
            
            if (volume < 0.3) {
                if (volumeWaves[0]) volumeWaves[0].style.display = 'none';
                if (volumeWaves[1]) volumeWaves[1].style.display = 'none';
            } else if (volume < 0.7) {
                if (volumeWaves[0]) volumeWaves[0].style.display = '';
                if (volumeWaves[1]) volumeWaves[1].style.display = 'none';
            } else {
                if (volumeWaves[0]) volumeWaves[0].style.display = '';
                if (volumeWaves[1]) volumeWaves[1].style.display = '';
            }
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Sound effect functions that respect the persistent player volume
    function playButtonSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(window.musicPlayerPersistent.soundEffectVolume * 0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio context not available for sound effects');
        }
    }

    function playHeartbeatSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // First beat
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 600;
            osc1.type = 'sine';
            gain1.gain.setValueAtTime(window.musicPlayerPersistent.soundEffectVolume * 0.1, audioContext.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
            osc1.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 0.12);
            
            // Second beat
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 600;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(window.musicPlayerPersistent.soundEffectVolume * 0.1, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.12);
            }, 150);
        } catch (e) {
            console.log('Audio context not available for heartbeat sound');
        }
    }

    function playSpecialSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequencies = [523, 659, 784]; // C, E, G notes
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(window.musicPlayerPersistent.soundEffectVolume * 0.08, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    osc.start(audioContext.currentTime);
                    osc.stop(audioContext.currentTime + 0.3);
                }, index * 100);
            });
        } catch (e) {
            console.log('Audio context not available for special sound');
        }
    }

    // Page lifecycle management for true persistence
    function handleBeforeUnload() {
        savePlayerState();
    }

    function handlePageShow(event) {
        console.log('Page show event triggered');
        
        // Re-initialize UI components but keep the persistent audio
        setTimeout(() => {
            if (!window.musicPlayerPersistent.isInitialized) {
                // First time initialization
                initializeMusicPlayerComponents();
            } else {
                // Re-create UI components but keep persistent audio
                const audio = getAudioElement();
                if (audio) {
                    createMusicPlayer();
                    createAudioControl();
                    setupMusicPlayerEvents();
                    updatePlayerDisplay();
                    updateVolumeDisplay();
                    updatePlayButtonState();
                    updateAudioControlState();
                    
                    console.log('Music player UI recreated, audio preserved');
                } else {
                    console.log('Persistent audio lost, reinitializing...');
                    createPersistentAudioFrame();
                }
            }
        }, 100);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            savePlayerState();
        } else {
            // Page is visible again, ensure UI is in sync
            setTimeout(() => {
                updatePlayButtonState();
                updateAudioControlState();
                updateTimeDisplay();
            }, 100);
        }
    }

    // Setup navigation and lifecycle handlers
    function setupNavigationHandlers() {
        // Save state before page unloads
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Handle page show (including back/forward navigation)
        window.addEventListener('pageshow', handlePageShow);
        
        // Handle visibility changes (tab switching, minimizing)
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Handle focus events
        window.addEventListener('focus', () => {
            setTimeout(() => {
                updatePlayButtonState();
                updateAudioControlState();
            }, 100);
        });
        
        // Intercept navigation to save state
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link) {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('http')) {
                    savePlayerState();
                }
            }
        });
    }

    // Clean up function
    function stopMusicCompletely() {
        const audio = getAudioElement();
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        window.musicPlayerPersistent.isMusicPlaying = false;
        updatePlayButtonState();
        updateAudioControlState();
        
        // Clear persistent state
        window.musicPlayerPersistent.persistentState = null;
        try {
            window.name = '';
            sessionStorage.removeItem('musicState');
        } catch (e) {
            // Ignore errors
        }
    }

    // Main initialization function
    function initializePersistentMusicPlayer() {
        console.log('Initializing persistent music player...');
        
        // Create the persistent audio frame first
        createPersistentAudioFrame();
        
        // Setup navigation handlers
        setupNavigationHandlers();
        
        console.log('Persistent music player setup complete');
    }

    // Make functions globally available
    window.toggleAudioPlayer = toggleAudioPlayer;
    window.toggleAudio = toggleAudioPlayer; // Alias for compatibility
    window.loadSong = loadSong;
    window.nextSong = nextSong;
    window.initializePersistentMusicPlayer = initializePersistentMusicPlayer;
    window.playButtonSound = playButtonSound;
    window.playHeartbeatSound = playHeartbeatSound;
    window.playSpecialSound = playSpecialSound;
    window.stopMusicCompletely = stopMusicCompletely;
    window.savePlayerState = savePlayerState;
    window.loadPlayerState = loadPlayerState;
    window.getAudioElement = getAudioElement;
    
    // Make update functions globally available for iframe communication
    window.updatePlayButtonState = updatePlayButtonState;
    window.updateAudioControlState = updateAudioControlState;
    window.updateTimeDisplay = updateTimeDisplay;
    window.updatePlayerDisplay = updatePlayerDisplay;

    // Auto-initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePersistentMusicPlayer);
    } else {
        // DOM already loaded
        setTimeout(initializePersistentMusicPlayer, 100);
    }

})();