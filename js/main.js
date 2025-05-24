// Main JavaScript file for the interactive love story experience
// Cleaned version with conflicts removed - works with enhanced-music-player.js

// Track current section for navigation
let currentSection = 'landing';
let previousMemorySection = 'initial-memory-lane';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating hearts
    createFloatingHearts();

    // Setup image enlarger (now includes video support)
    setupImageEnlarger();
    
    // Setup video aspect ratio handling
    setupVideoAspectRatio();
    
    // Custom cursor setup
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        document.addEventListener('mousemove', function(e) {
            customCursor.style.display = 'block';
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });
    }
});

// Video Aspect Ratio Setup Function
function setupVideoAspectRatio() {
    const videos = document.querySelectorAll('.romantic-video');
    
    videos.forEach(video => {
        // Handle when video metadata loads
        video.addEventListener('loadedmetadata', function() {
            adjustVideoAspectRatio(this);
        });
        
        // If video is already loaded, adjust immediately
        if (video.readyState >= 1) {
            adjustVideoAspectRatio(video);
        }
        
        // Also handle when video can play
        video.addEventListener('canplay', function() {
            adjustVideoAspectRatio(this);
        });
        
        // Mark the gallery item as a video item for special styling
        const galleryItem = video.closest('.gallery-item');
        if (galleryItem) {
            galleryItem.classList.add('video-item');
        }
    });
    
    // Re-adjust on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            videos.forEach(video => adjustVideoAspectRatio(video));
        }, 250);
    });
}

// Adjust individual video aspect ratio
function adjustVideoAspectRatio(video) {
    if (!video.videoWidth || !video.videoHeight) return;
    
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const aspectRatio = videoWidth / videoHeight;
    
    // Container width is fixed at 600px (from CSS)
    const containerWidth = 600;
    
    // Calculate height based on aspect ratio, with constraints
    let calculatedHeight = containerWidth / aspectRatio;
    
    // Set minimum and maximum heights
    const minHeight = 300;
    const maxHeight = 450;
    
    // Clamp the height between min and max
    calculatedHeight = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    
    // Apply the calculated dimensions
    video.style.width = containerWidth + 'px';
    video.style.height = calculatedHeight + 'px';
    
    // Also adjust the parent gallery-image container if it exists
    const galleryImage = video.closest('.gallery-image');
    if (galleryImage) {
        galleryImage.style.height = calculatedHeight + 'px';
        galleryImage.style.display = 'flex';
        galleryImage.style.justifyContent = 'center';
        galleryImage.style.alignItems = 'center';
    }
    
    console.log(`Adjusted video: ${videoWidth}x${videoHeight} -> ${containerWidth}x${calculatedHeight}`);
}

// Create floating hearts background
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts-container');
    if (!container) return;
    
    const heartSizes = ['1rem', '1.5rem', '2rem', '2.5rem'];
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-2rem';
        heart.style.fontSize = heartSizes[Math.floor(Math.random() * heartSizes.length)];
        heart.style.animationDuration = 15 + Math.random() * 30 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.opacity = 0.1 + Math.random() * 0.3;
        heart.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        container.appendChild(heart);
    }
}

// Navigation function - Show a specific section
function showSection(sectionId) {
    // Hide current section
    const currentEl = document.getElementById(currentSection);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    // Show new section
    const newEl = document.getElementById(sectionId);
    if (newEl) {
        newEl.classList.add('active');
    }
    
    // Update current section
    currentSection = sectionId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Show memory detail page
function showMemoryDetail(memoryId) {
    // Hide current section
    const currentEl = document.getElementById(currentSection);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    // Remember previous section for back button
    previousMemorySection = currentSection;
    
    // Show memory detail page
    const memoryEl = document.getElementById(memoryId);
    if (memoryEl) {
        memoryEl.classList.add('active');
    }
    
    // Update current section
    currentSection = memoryId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Go back to memory lane
function goBackToMemoryLane() {
    // Hide current section
    const currentEl = document.getElementById(currentSection);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    // Show memory lane section
    const memoryEl = document.getElementById(previousMemorySection);
    if (memoryEl) {
        memoryEl.classList.add('active');
    }
    
    // Update current section
    currentSection = previousMemorySection;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to navigate from memory detail back to the correct year
function goBackToYear(yearId) {
    // Hide current section
    const currentEl = document.getElementById(currentSection);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    // Show year section
    const yearEl = document.getElementById(yearId);
    if (yearEl) {
        yearEl.classList.add('active');
    }
    
    // Update current section
    currentSection = yearId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Heart click effect
function heartClickEffect(event) {
    // Remove highlight and speech bubble if present
    event.target.classList.remove('highlight-heart');
    const bubble = event.target.querySelector('.speech-bubble');
    if (bubble) bubble.remove();
    
    // Create mini hearts burst effect
    for (let i = 0; i < 10; i++) {
        createMiniHeart(event.clientX, event.clientY);
    }
    
    // Navigate to next section or create rainbow hearts
    if (currentSection === 'landing') {
        // Navigate to initial memory lane if it exists
        const initialMemoryLane = document.getElementById('initial-memory-lane');
        if (initialMemoryLane) {
            showSection('initial-memory-lane');
        }
        // Use unified sound function
        if (typeof window.playHeartbeatSound === 'function') {
            window.playHeartbeatSound();
        }
    } else {
        createRainbowHearts();
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

// Create rainbow hearts animation
function createRainbowHearts() {
    const colors = ['#ff6b6b', '#4ecdc4', '#f9d423', '#fc913a', '#a696c8'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerText = '❤';
            heart.style.position = 'fixed';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = Math.random() * 2 + 1 + 'rem';
            heart.style.zIndex = '1000';
            heart.style.pointerEvents = 'none';
            
            const animation = heart.animate([
                { transform: 'translateY(0)', opacity: 1 },
                { transform: `translateY(-${100 + Math.random() * 200}vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 4000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.2)'
            });
            
            document.body.appendChild(heart);
            
            animation.onfinish = () => {
                if (document.body.contains(heart)) {
                    document.body.removeChild(heart);
                }
            };
        }, i * 100);
    }
    
    // Use unified sound function
    if (typeof window.playSpecialSound === 'function') {
        window.playSpecialSound();
    }
}

// Create confetti
function createConfetti() {
    const container = document.getElementById('confetti-container') || document.body;
    const colors = ['#ff6b6b', '#4ecdc4', '#f9d423', '#fc913a', '#a696c8', '#ffffff'];
    const confettiCount = 200;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.position = 'fixed';
        confetti.style.top = '0';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        
        container.appendChild(confetti);
        
        // Remove confetti after animation completes
        setTimeout(() => {
            if (container.contains(confetti)) {
                container.removeChild(confetti);
            }
        }, 5000);
    }
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

// Check password function
function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    if (!passwordInput || !errorMessage) return;
    
    const password = passwordInput.value;
    
    // Check if password is correct
    if (password === '18/08/2021' || password === '18/8/2021') {
        // Show the special message section
        const specialSection = document.getElementById('special-section');
        const specialMessage = document.getElementById('special-message');
        
        if (specialSection) specialSection.classList.remove('active');
        if (specialMessage) specialMessage.classList.add('active');
        
        // Update current section
        currentSection = 'special-message';
        
        // Create celebratory confetti
        createConfetti();
        
        // Play CAS - Opera House using the unified music player
        if (typeof window.loadSong === 'function') {
            window.loadSong(1); // CAS - Opera House is at index 1
            
            // Start playing if not already playing
            setTimeout(() => {
                if (typeof window.toggleAudio === 'function' && window.musicPlayerGlobal && !window.musicPlayerGlobal.isMusicPlaying) {
                    window.toggleAudio();
                }
            }, 500);
        }
    } else {
        // Show error message
        errorMessage.style.display = 'block';
        
        // Shake the form
        const form = document.querySelector('.password-form');
        if (form) {
            form.style.animation = 'none';
            setTimeout(() => {
                form.style.animation = 'shake 0.5s';
            }, 10);
        }
    }
}

// Enhanced image enlarger functionality with video support
function setupImageEnlarger() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'image-modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <img class="modal-content" id="modal-img">
            <video class="modal-content video-modal hidden" id="modal-video" controls>
                <source src="" type="video/mp4">
            </video>
        `;
        document.body.appendChild(modal);
    }
    
    // Close modal when clicking outside or on close button
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            closeModal();
        }
    });
    
    // Add click listeners to all images with class 'photo'
    const photos = document.querySelectorAll('.photo, .memory-photo, img[onclick*="enlargeImage"]');
    photos.forEach(img => {
        // Remove any existing onclick attributes to avoid conflicts
        img.removeAttribute('onclick');
        
        // Add click event listener
        img.addEventListener('click', function(e) {
            e.preventDefault();
            enlargeImage(this);
        });
        
        // Add cursor pointer to indicate clickable
        img.style.cursor = 'pointer';
    });
    
    // Add click listeners to all videos
    const videos = document.querySelectorAll('.romantic-video');
    videos.forEach(video => {
        video.addEventListener('click', function(e) {
            e.preventDefault();
            enlargeVideo(this);
        });
        
        video.style.cursor = 'pointer';
    });
    
    // Also add listeners to any images/videos that might be added dynamically
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && 
            (e.target.classList.contains('photo') || 
             e.target.classList.contains('memory-photo') ||
             e.target.closest('.memory-item'))) {
            e.preventDefault();
            enlargeImage(e.target);
        }
        
        if (e.target.tagName === 'VIDEO' && e.target.classList.contains('romantic-video')) {
            e.preventDefault();
            enlargeVideo(e.target);
        }
    });
    
    // Add keyboard support (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Enlarge image function
function enlargeImage(img) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal && modalImg) {
        // Hide video, show image
        if (modalVideo) modalVideo.classList.add('hidden');
        modalImg.classList.remove('hidden');
        
        modal.style.display = 'flex';
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Enlarged image';
        
        // Add zoom animation
        modalImg.style.transform = 'scale(0.5)';
        modalImg.style.opacity = '0';
        modalImg.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            modalImg.style.transform = 'scale(1)';
            modalImg.style.opacity = '1';
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Enlarge video function
function enlargeVideo(video) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal && modalVideo) {
        // Hide image, show video
        if (modalImg) modalImg.classList.add('hidden');
        modalVideo.classList.remove('hidden');
        
        modal.style.display = 'flex';
        modalVideo.src = video.src;
        modalVideo.currentTime = video.currentTime; // Sync playback position
        
        // Add zoom animation
        modalVideo.style.transform = 'scale(0.5)';
        modalVideo.style.opacity = '0';
        modalVideo.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            modalVideo.style.transform = 'scale(1)';
            modalVideo.style.opacity = '1';
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal) {
        // Pause video if playing
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }
        
        // Animate out
        if (modalImg) {
            modalImg.style.transform = 'scale(0.5)';
            modalImg.style.opacity = '0';
        }
        
        if (modalVideo) {
            modalVideo.style.transform = 'scale(0.5)';
            modalVideo.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Reset states
            if (modalImg) {
                modalImg.classList.remove('hidden');
                modalImg.style.transform = '';
                modalImg.style.opacity = '';
            }
            
            if (modalVideo) {
                modalVideo.classList.add('hidden');
                modalVideo.style.transform = '';
                modalVideo.style.opacity = '';
                modalVideo.src = '';
            }
            
            // Restore body scrolling
            document.body.style.overflow = '';
        }, 300);
    }
}

// Add shake animation CSS and responsive video styles
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    /* Enhanced video modal styles */
    .video-modal {
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        background-color: #000;
    }
    
    .hidden {
        display: none !important;
    }
    
    /* Responsive video adjustments */
    @media (max-width: 768px) {
        .gallery-item.video-item {
            width: 100%;
            max-width: 350px;
        }
        
        .gallery-item.video-item .romantic-video {
            width: 100% !important;
            max-width: 350px;
            height: auto !important;
            min-height: 200px;
            max-height: 300px;
        }
        
        .gallery-item.video-item .gallery-image {
            width: 100% !important;
            max-width: 350px;
            height: auto !important;
            min-height: 200px;
            max-height: 300px;
        }
    }
    
    @media (max-width: 480px) {
        .gallery-item.video-item .romantic-video {
            min-height: 180px !important;
            max-height: 250px !important;
        }
        
        .gallery-item.video-item .gallery-image {
            min-height: 180px !important;
            max-height: 250px !important;
        }
    }
`;
document.head.appendChild(enhancedStyles);

// Make functions globally available (non-conflicting ones)
window.showSection = showSection;
window.showMemoryDetail = showMemoryDetail;
window.goBackToMemoryLane = goBackToMemoryLane;
window.goBackToYear = goBackToYear;
window.heartClickEffect = heartClickEffect;
window.createMiniHeart = createMiniHeart;
window.createRainbowHearts = createRainbowHearts;
window.createConfetti = createConfetti;
window.showSpeechBubble = showSpeechBubble;
window.checkPassword = checkPassword;
window.enlargeImage = enlargeImage;
window.enlargeVideo = enlargeVideo;
window.closeModal = closeModal;