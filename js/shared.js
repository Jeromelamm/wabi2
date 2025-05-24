// shared.js - Simplified version that works with enhanced-music-player.js
// This file now only handles shared UI components and navigation

// Initialize common functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSharedComponents();
    setupFloatingHearts();
    setupCustomCursor();
    setupImageEnlarger();
});

// Initialize shared components
function initializeSharedComponents() {
    // Set active navigation link
    setActiveNavLink();
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Setup floating hearts background
function setupFloatingHearts() {
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

// Setup custom cursor
function setupCustomCursor() {
    const customCursor = document.querySelector('.custom-cursor');
    if (!customCursor) return;
    
    document.addEventListener('mousemove', function(e) {
        customCursor.style.display = 'block';
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });
}

// Image enlarger functionality (basic version to avoid conflicts)
function setupImageEnlarger() {
    // Only setup if modal doesn't already exist (avoid conflicts with main.js)
    if (document.getElementById('image-modal')) {
        return; // Already handled by main.js
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'image-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content" id="modal-img">
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside or on close button
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            closeImageModal();
        }
    });
    
    // Add click listeners to images
    const photos = document.querySelectorAll('.photo, .memory-photo');
    photos.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            enlargeImageShared(this);
        });
        
        img.style.cursor = 'pointer';
    });
    
    // Add keyboard support (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function enlargeImageShared(img) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    
    if (modal && modalImg) {
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

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    
    if (modal && modalImg) {
        modalImg.style.transform = 'scale(0.5)';
        modalImg.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Restore body scrolling
            document.body.style.overflow = '';
        }, 300);
    }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page transition effects
function fadeOut(callback) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        if (callback) callback();
    }, 300);
}

function fadeIn() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
}

// Navigation with fade effect
function navigateWithFade(url) {
    // Save music state before navigation
    if (typeof window.savePlayerState === 'function') {
        window.savePlayerState();
    }
    
    fadeOut(() => {
        window.location.href = url;
    });
}

// Utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Make safe functions globally available (only non-conflicting ones)
window.fadeOut = fadeOut;
window.fadeIn = fadeIn;
window.navigateWithFade = navigateWithFade;
window.formatTime = formatTime;