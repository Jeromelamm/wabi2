// Fixed Image and Video Enlarger Module
// This file handles image and video enlargement functionality across all pages

// Initialize enlarger when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupMediaEnlarger();
});

// Media enlarger functionality for both images and videos
function setupMediaEnlarger() {
    // Remove old modal if it exists
    const oldModal = document.getElementById('image-modal') || document.getElementById('media-modal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Create new unified modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'media-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content" id="modal-img" style="display: none;">
        <video class="modal-content" id="modal-video" controls style="display: none;">
            Your browser does not support the video tag.
        </video>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside or on close button
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            closeModal();
        }
    });
    
    // Prevent modal from closing when clicking on video controls
    const modalVideo = document.getElementById('modal-video');
    const modalImg = document.getElementById('modal-img');
    
    if (modalVideo) {
        modalVideo.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (modalImg) {
        modalImg.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Add click listeners to all images and videos
    setupClickListeners();
    
    // Add keyboard support (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function setupClickListeners() {
    // Handle images
    const images = document.querySelectorAll('.photo, .memory-photo, img.romantic-photo, .gallery-item img:not(video)');
    images.forEach(element => {
        // Remove any existing onclick attributes to avoid conflicts
        element.removeAttribute('onclick');
        
        // Add click event listener for images only
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Double-check this is actually an image, not a video
            if (this.tagName === 'IMG') {
                enlargeImage(this);
            }
        });
        
        // Add cursor pointer to indicate clickable
        element.style.cursor = 'pointer';
    });
    
    // Handle videos separately
    const videos = document.querySelectorAll('.romantic-video, video');
    videos.forEach(element => {
        // Remove any existing onclick attributes to avoid conflicts
        element.removeAttribute('onclick');
        
        // Add click event listener for videos only
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Double-check this is actually a video
            if (this.tagName === 'VIDEO') {
                enlargeVideo(this);
            }
        });
        
        element.style.cursor = 'pointer';
    });
    
    // Global click handler as backup
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if it's a clickable image (but NOT a video)
        if (target.tagName === 'IMG' && 
            (target.classList.contains('photo') || 
             target.classList.contains('memory-photo') ||
             target.closest('.memory-item') ||
             target.closest('.gallery-item')) &&
            !target.closest('video')) { // Make sure it's not inside a video element
            e.preventDefault();
            e.stopPropagation();
            enlargeImage(target);
        }
        
        // Check if it's a clickable video
        if (target.tagName === 'VIDEO' && 
            (target.classList.contains('romantic-video') ||
             target.closest('.memory-item') ||
             target.closest('.gallery-item'))) {
            e.preventDefault();
            e.stopPropagation();
            enlargeVideo(target);
        }
    });
}

function enlargeImage(img) {
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal && modalImg) {
        console.log('Enlarging image:', img.src);
        
        // Hide video, show image
        modalVideo.style.display = 'none';
        modalVideo.pause(); // Pause any playing video
        modalVideo.src = ''; // Clear video source
        modalImg.style.display = 'block';
        
        modal.style.display = 'flex';
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Enlarged image';
        
        // Reset any video-specific styling
        modalImg.style.objectFit = 'contain';
        modalImg.style.maxWidth = '90vw';
        modalImg.style.maxHeight = '90vh';
        modalImg.style.width = 'auto';
        modalImg.style.height = 'auto';
        modalImg.style.backgroundColor = 'transparent';
        modalImg.style.borderRadius = '10px';
        
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

function enlargeVideo(video) {
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal && modalVideo) {
        console.log('Enlarging video:', video.src || video.querySelector('source')?.src);
        
        // Hide image, show video
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';
        
        modal.style.display = 'flex';
        
        // Set video source properly
        const videoSource = video.querySelector('source');
        if (videoSource && videoSource.src) {
            modalVideo.src = videoSource.src;
        } else if (video.src) {
            modalVideo.src = video.src;
        }
        
        modalVideo.currentTime = video.currentTime || 0;
        
        // Force proper video styling for modal
        modalVideo.style.objectFit = 'contain';
        modalVideo.style.maxWidth = '90vw';
        modalVideo.style.maxHeight = '90vh';
        modalVideo.style.width = 'auto';
        modalVideo.style.height = 'auto';
        modalVideo.style.backgroundColor = '#000';
        modalVideo.style.borderRadius = '10px';
        modalVideo.style.margin = '0';
        
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
        
        // Load the video
        modalVideo.load();
    }
}

function closeModal() {
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    
    if (modal) {
        console.log('Closing modal');
        
        // Pause video if playing
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }
        
        // Animate out
        if (modalImg && modalImg.style.display !== 'none') {
            modalImg.style.transform = 'scale(0.5)';
            modalImg.style.opacity = '0';
        }
        
        if (modalVideo && modalVideo.style.display !== 'none') {
            modalVideo.style.transform = 'scale(0.5)';
            modalVideo.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            if (modalImg) {
                modalImg.style.display = 'none';
                modalImg.src = ''; // Clear image source
            }
            if (modalVideo) {
                modalVideo.style.display = 'none';
                modalVideo.src = ''; // Clear video source
            }
            // Restore body scrolling
            document.body.style.overflow = '';
        }, 300);
    }
}

// Global functions for onclick handlers (if any remain)
window.enlargeImage = enlargeImage;
window.enlargeVideo = enlargeVideo;
window.closeModal = closeModal;