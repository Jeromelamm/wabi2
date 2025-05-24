// Landing Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLandingPage();
});

function initializeLandingPage() {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingHeart = document.querySelector('.loading-heart');
    
    // Skip loading on click
    if (loadingHeart) {
        loadingHeart.addEventListener('click', function() {
            hideLoadingScreen();
        });
    }
    
    // Auto hide loading screen after 3 seconds
    setTimeout(hideLoadingScreen, 3000);
    
    // Setup love meter animation
    animateLoveMeter();
    
    // Show navigation options after love meter finishes
    setTimeout(function() {
        const navigationOptions = document.querySelector('.navigation-options');
        if (navigationOptions) {
            navigationOptions.style.opacity = '1';
            navigationOptions.style.transform = 'translateY(0)';
        }
    }, 4000);
    
    // Show navigation helper after a delay
    setTimeout(function() {
        const navHelper = document.querySelector('.navigation-helper');
        if (navHelper) {
            navHelper.classList.add('show');
            
            // Hide navigation helper after 20 seconds
            setTimeout(function() {
                navHelper.classList.remove('show');
            }, 20000);
        }
    }, 5000);
    
    // Highlight the heart after a delay if no interaction
    setTimeout(function() {
        const landingHeart = document.getElementById('landing-heart');
        if (landingHeart) {
            landingHeart.classList.add('highlight-heart');
            // Add speech bubble
            showSpeechBubble(landingHeart, 'Click me!');
        }
    }, 8000);
    
    // Setup heart click functionality
    setupHeartClick();
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Animate love meter
function animateLoveMeter() {
    const loveFill = document.getElementById('love-fill');
    const lovePercentage = document.getElementById('love-percentage');
    
    if (!loveFill || !lovePercentage) return;
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            loveFill.style.width = width + '%';
            lovePercentage.textContent = width + '%';
            
            if (width > 50) {
                lovePercentage.style.color = 'white';
            }
        }
    }, 20);
}

// Setup heart click functionality
function setupHeartClick() {
    const landingHeart = document.getElementById('landing-heart');
    if (landingHeart) {
        landingHeart.addEventListener('click', heartClickEffect);
    }
}

// Heart click effect
function heartClickEffect(event) {
    // Remove highlight and speech bubble if present
    event.target.classList.remove('highlight-heart');
    const bubble = event.target.querySelector('.speech-bubble');
    if (bubble) bubble.remove();
    
    // Create mini hearts burst effect
    for (let i = 0; i < 15; i++) {
        createMiniHeart(event.clientX, event.clientY);
    }
    
    // Play heartbeat sound
    if (typeof playHeartbeatSound === 'function') {
        playHeartbeatSound();
    }
    
    // Navigate directly to initial memories page
    window.location.href = 'initial.html';
}

// Animate navigation options
function animateNavigationOptions() {
    const navigationOptions = document.querySelector('.navigation-options');
    if (navigationOptions) {
        // Hide the heart temporarily
        const landingHeart = document.getElementById('landing-heart');
        if (landingHeart) {
            landingHeart.style.transform = 'scale(0)';
            landingHeart.style.opacity = '0';
        }
        
        // Animate navigation options
        navigationOptions.style.opacity = '0';
        navigationOptions.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            navigationOptions.style.transition = 'all 0.8s ease';
            navigationOptions.style.opacity = '1';
            navigationOptions.style.transform = 'translateY(0)';
            
            // Animate each button individually
            const buttons = navigationOptions.querySelectorAll('.btn');
            buttons.forEach((btn, index) => {
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    btn.style.transition = 'all 0.6s ease';
                    btn.style.opacity = '1';
                    btn.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);
    }
}

// Create mini heart for burst effect
function createMiniHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = Math.random() * 1 + 0.5 + 'rem';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1 + 0.5;
    
    heart.style.transition = `all ${duration}s ease-out`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
        heart.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (document.body.contains(heart)) {
            document.body.removeChild(heart);
        }
    }, duration * 1000);
}

// Show speech bubble
function showSpeechBubble(element, text) {
    // Remove existing bubbles
    const existingBubble = element.querySelector('.speech-bubble');
    if (existingBubble) existingBubble.remove();
    
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;
    bubble.style.opacity = '0';
    element.appendChild(bubble);
    
    setTimeout(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateX(-50%) translateY(10px)';
        
        setTimeout(() => {
            if (bubble.parentNode === element) {
                element.removeChild(bubble);
            }
        }, 300);
    }, 3000);
}

// Enhanced navigation with fade effects
function navigateWithEffect(url) {
    // Create a fade overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'white';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    
    document.body.appendChild(overlay);
    
    // Trigger fade
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Navigate after fade
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Add click effects to navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.navigation-options .btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - button.offsetLeft - 25) + 'px';
            ripple.style.top = (e.clientY - button.offsetTop - 25) + 'px';
            ripple.style.width = '50px';
            ripple.style.height = '50px';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (button.contains(ripple)) {
                    button.removeChild(ripple);
                }
            }, 600);
            
            // Play button sound
            if (typeof playButtonSound === 'function') {
                playButtonSound();
            }
        });
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .navigation-helper {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    .navigation-helper.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);