// Special Letter Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFinalPage();
});

function initializeFinalPage() {
    setupPasswordForm();
    setupSpecialEffects();
    
    // Check if we should show the letter immediately (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('unlock') === 'true') {
        showSpecialMessage();
    }
}

// Setup password form functionality
function setupPasswordForm() {
    const passwordInput = document.getElementById('password');
    const unlockBtn = document.querySelector('.unlock-btn');
    const errorMessage = document.getElementById('error-message');
    
    if (passwordInput) {
        // Add enter key listener
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Add input animation
        passwordInput.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
        });
        
        passwordInput.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
        });
        
        // Real-time validation feedback
        passwordInput.addEventListener('input', function() {
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
            
            // Add visual feedback for correct format
            const value = this.value;
            if (value.includes('/') && value.length >= 8) {
                this.style.borderColor = 'var(--secondary)';
                this.style.boxShadow = '0 0 15px rgba(78, 205, 196, 0.3)';
            } else {
                this.style.borderColor = '#e0e0e0';
                this.style.boxShadow = 'none';
            }
        });
    }
    
    if (unlockBtn) {
        unlockBtn.addEventListener('click', checkPassword);
        
        // Add button animation
        unlockBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        unlockBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Check password function
function checkPassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Correct passwords
    const correctPasswords = ['18/08/2021', '18/8/2021', '08/18/2021', '8/18/2021'];
    
    if (correctPasswords.includes(password)) {
        // Success!
        playSpecialSound();
        showSpecialMessage();
    } else {
        // Show error
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Incorrect password. Try the date that changed everything! 💕';
        }
        
        // Shake animation
        const form = document.querySelector('.special-message-box');
        if (form) {
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
        
        // Clear input and refocus
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
            passwordInput.style.borderColor = 'var(--primary)';
            passwordInput.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.3)';
        }
        
        playButtonSound();
    }
}

// Show the special message
function showSpecialMessage() {
    const passwordSection = document.getElementById('password-section');
    const specialMessage = document.getElementById('special-message');
    
    if (passwordSection && specialMessage) {
        // Fade out password section
        passwordSection.style.opacity = '0';
        passwordSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            passwordSection.style.display = 'none';
            
            // Show special message
            specialMessage.classList.remove('hidden');
            specialMessage.style.display = 'flex';
            
            // Animate in
            setTimeout(() => {
                specialMessage.style.opacity = '1';
                specialMessage.style.transform = 'translateY(0)';
                
                // Trigger special effects
                createConfetti();
                animateLetter();
                changeToSpecialMusic();
                
            }, 100);
        }, 500);
    }
    
    // Update page title
    document.title = 'A Letter From My Heart';
}

// Animate letter content
function animateLetter() {
    const letterContent = document.querySelector('.letter-content');
    const gallery = document.querySelector('.special-message .gallery');
    const navigationOptions = document.querySelector('.navigation-options');
    
    // Animate letter content
    if (letterContent) {
        letterContent.style.opacity = '0';
        setTimeout(() => {
            letterContent.style.transition = 'opacity 2s ease';
            letterContent.style.opacity = '1';
        }, 1000);
    }
    
    // Animate gallery items
    if (gallery) {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.8s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 2000 + (index * 200));
        });
    }
    
    // Animate navigation options
    if (navigationOptions) {
        navigationOptions.style.opacity = '0';
        setTimeout(() => {
            navigationOptions.style.transition = 'opacity 1s ease';
            navigationOptions.style.opacity = '1';
        }, 4000);
    }
}

// Change to special music
function changeToSpecialMusic() {
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        // Fade out current music
        const fadeOut = setInterval(() => {
            if (backgroundMusic.volume > 0.1) {
                backgroundMusic.volume -= 0.1;
            } else {
                clearInterval(fadeOut);
                
                // Change to special song
                backgroundMusic.src = "audio/Opera House.mp3";
                backgroundMusic.volume = 0.7;
                
                // Play new song
                backgroundMusic.play().then(() => {
                    // Update UI if music player exists
                    updateMusicPlayerForSpecialSong();
                }).catch(error => {
                    console.error("Error playing special music:", error);
                });
            }
        }, 100);
    }
}

// Update music player for special song
function updateMusicPlayerForSpecialSong() {
    // Try to update music player if it exists
    try {
        if (typeof window.loadSong === 'function') {
            window.loadSong(2); // Index for CAS - Opera House
        }
        
        // Update audio control
        const audioHeart = document.querySelector('.audio-heart');
        const audioTooltip = document.querySelector('.audio-tooltip');
        
        if (audioHeart) {
            audioHeart.classList.add('beating');
        }
        if (audioTooltip) {
            audioTooltip.textContent = 'Our Special Song';
        }
        
        // Set global music state
        window.isMusicPlaying = true;
        
    } catch (error) {
        console.log("Music player update failed:", error);
    }
}

// Setup special effects
function setupSpecialEffects() {
    // Setup heart click effect
    const heart = document.querySelector('.special-message .heart');
    if (heart) {
        heart.addEventListener('click', function(e) {
            createRainbowHearts();
            createMiniHeart(e.clientX, e.clientY);
        });
    }
    
    // Setup navigation button effects
    const navButtons = document.querySelectorAll('.navigation-options .btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playButtonSound();
        });
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
    });
}

// Create confetti effect
function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#f9d423', '#fc913a', '#a696c8', '#ffffff'];
    const confettiCount = 300;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 12 + 5 + 'px';
            confetti.style.height = Math.random() * 12 + 5 + 'px';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            container.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 8000);
        }, i * 10);
    }
}

// Create rainbow hearts animation
function createRainbowHearts() {
    const colors = ['#ff6b6b', '#4ecdc4', '#f9d423', '#fc913a', '#a696c8'];
    
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerText = '❤';
            heart.style.position = 'fixed';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = Math.random() * 2.5 + 1 + 'rem';
            heart.style.zIndex = '1500';
            heart.style.pointerEvents = 'none';
            
            const animation = heart.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(-${100 + Math.random() * 300}vh) rotate(${Math.random() * 720}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 5000 + Math.random() * 4000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.2)'
            });
            
            document.body.appendChild(heart);
            
            animation.onfinish = () => {
                if (document.body.contains(heart)) {
                    document.body.removeChild(heart);
                }
            };
        }, i * 80);
    }
    
    playSpecialSound();
}

// Add some easter eggs
document.addEventListener('keydown', function(e) {
    // Konami code for extra hearts
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    window.konamiProgress = window.konamiProgress || 0;
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            // Easter egg activated!
            createRainbowHearts();
            createConfetti();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
    
    // Press L to reveal letter (for testing)
    if (e.key === 'L' && e.shiftKey && e.ctrlKey) {
        showSpecialMessage();
    }
});

// Global functions
window.checkPassword = checkPassword;
window.createRainbowHearts = createRainbowHearts;
window.createConfetti = createConfetti;