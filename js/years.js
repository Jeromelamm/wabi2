// Years Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeYearsPage();
});

function initializeYearsPage() {
    setupYearCollages();
    setupYearNavigation();
}

// Setup year collage interactions
function setupYearCollages() {
    const yearCollages = document.querySelectorAll('.year-collage');
    
    yearCollages.forEach(collage => {
        // Add hover sound effect
        collage.addEventListener('mouseenter', function() {
            // Subtle hover sound
            playButtonSound();
        });
        
        // Add click handler
        collage.addEventListener('click', function() {
            const yearTitle = this.querySelector('.year-title').textContent;
            showYear(yearTitle);
            playSpecialSound();
        });
        
        // Add 3D tilt effect on mouse move
        collage.addEventListener('mousemove', function(e) {
            tiltYearCard(e, this);
        });
        
        collage.addEventListener('mouseleave', function() {
            resetYearTilt(this);
        });
    });
}

// Show specific year section
function showYear(year) {
    // Hide all year collages
    const yearCollages = document.querySelector('.year-collages');
    if (yearCollages) {
        yearCollages.style.opacity = '0';
        yearCollages.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            yearCollages.style.display = 'none';
            
            // Show specific year section
            const yearSection = document.getElementById(`year-${year}`);
            if (yearSection) {
                yearSection.classList.remove('hidden');
                yearSection.classList.add('active');
                
                // Animate memory items
                animateMemoryItems(yearSection);
            }
        }, 300);
    }
    
    // Update page title
    document.title = `Our ${year} Memories`;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hide year section and show main years view
function hideYear() {
    // Hide active year section
    const activeYear = document.querySelector('.year-memories.active');
    if (activeYear) {
        activeYear.style.opacity = '0';
        activeYear.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeYear.classList.remove('active');
            activeYear.classList.add('hidden');
            
            // Show year collages again
            const yearCollages = document.querySelector('.year-collages');
            if (yearCollages) {
                yearCollages.style.display = 'grid';
                setTimeout(() => {
                    yearCollages.style.opacity = '1';
                    yearCollages.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 300);
    }
    
    // Reset page title
    document.title = 'Our Journey Through the Years';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    playButtonSound();
}

// Setup year navigation
function setupYearNavigation() {
    const backButtons = document.querySelectorAll('.back-years-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', hideYear);
    });
}

// Animate memory items in year section
function animateMemoryItems(yearSection) {
    const memoryItems = yearSection.querySelectorAll('.memory-item');
    
    memoryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// 3D tilt effect for year cards
function tiltYearCard(event, card) {
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const maxRotation = 12;
    
    const rotateX = ((centerY - mouseY) / (cardRect.height / 2)) * maxRotation;
    const rotateY = ((mouseX - centerX) / (cardRect.width / 2)) * maxRotation;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    
    // Add subtle parallax to images
    const images = card.querySelectorAll('.collage-img');
    images.forEach((img, index) => {
        const depth = (index + 1) * 2;
        const moveX = (mouseX - centerX) / (cardRect.width / 2) * depth;
        const moveY = (mouseY - centerY) / (cardRect.height / 2) * depth;
        
        img.style.transform += ` translate(${moveX}px, ${moveY}px)`;
    });
}

function resetYearTilt(card) {
    card.style.transform = 'rotateX(0) rotateY(0) translateY(-15px)';
    
    // Reset image positions
    const images = card.querySelectorAll('.collage-img');
    images.forEach(img => {
        // Remove the translate transform but keep the original transform
        const currentTransform = img.style.transform;
        const baseTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
        img.style.transform = baseTransform;
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to go back to years view
    if (e.key === 'Escape') {
        const activeYear = document.querySelector('.year-memories.active');
        if (activeYear) {
            hideYear();
        }
    }
    
    // Number keys to quickly navigate to years
    if (e.key >= '1' && e.key <= '4') {
        const yearMap = {
            '1': '2022',
            '2': '2023', 
            '3': '2024',
            '4': '2025'
        };
        
        const year = yearMap[e.key];
        if (year) {
            showYear(year);
        }
    }
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe year collages for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const yearCollages = document.querySelectorAll('.year-collage');
    yearCollages.forEach(collage => {
        observer.observe(collage);
    });
});

// Global function to be called from HTML onclick
window.showYear = showYear;