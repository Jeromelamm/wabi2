// Memory List Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMemoriesPage();
});

function initializeMemoriesPage() {
    setupMemoryItems();
    setupScrollAnimations();
    addMemoryStats();
    setupSearch();
}

// Setup memory item interactions
function setupMemoryItems() {
    const memoryItems = document.querySelectorAll('.memory-item');
    
    memoryItems.forEach((item, index) => {
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            // Gentle hover sound
            if (Math.random() > 0.7) { // Only sometimes to avoid spam
                playButtonSound();
            }
            
            // Add glow effect to date bubble
            const dateBubble = this.querySelector('.date-bubble');
            if (dateBubble) {
                dateBubble.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.6)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const dateBubble = this.querySelector('.date-bubble');
            if (dateBubble) {
                dateBubble.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.3)';
            }
        });
        
        // Add click handler for the entire item
        item.addEventListener('click', function(e) {
            // Only if not clicking on the button
            if (!e.target.classList.contains('memory-btn') && !e.target.closest('.memory-btn')) {
                const button = this.querySelector('.memory-btn');
                if (button) {
                    button.click();
                }
            }
        });
        
        // Setup photo click for enlargement
        const photo = item.querySelector('.photo');
        if (photo) {
            photo.addEventListener('click', function(e) {
                e.stopPropagation();
                enlargeImage(this);
            });
        }
        
        // Add memory button effects
        const memoryBtn = item.querySelector('.memory-btn');
        if (memoryBtn) {
            memoryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                playButtonSound();
                addClickRipple(this, e);
            });
        }
    });
}

// Add click ripple effect
function addClickRipple(button, event) {
    const ripple = document.createElement('div');
    const buttonRect = button.getBoundingClientRect();
    const size = Math.max(buttonRect.width, buttonRect.height);
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = (event.clientX - buttonRect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - buttonRect.top - size / 2) + 'px';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add extra animation for special elements
                if (entry.target.classList.contains('glow-button')) {
                    setTimeout(() => {
                        entry.target.style.animation = 'glow 2s ease-in-out infinite alternate';
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    // Observe memory items
    const memoryItems = document.querySelectorAll('.memory-item');
    memoryItems.forEach(item => {
        observer.observe(item);
    });
    
    // Observe other animated elements
    const animatedElements = document.querySelectorAll('.second-caption, .glow-button');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Add memory statistics
function addMemoryStats() {
    const memoryItems = document.querySelectorAll('.memory-item');
    const totalMemories = memoryItems.length;
    
    // Calculate years span
    const dates = Array.from(memoryItems).map(item => {
        const dateBubble = item.querySelector('.date-bubble');
        return dateBubble ? dateBubble.textContent : '';
    }).filter(date => date);
    
    const years = [...new Set(dates.map(date => {
        const year = date.match(/\d{4}/);
        return year ? year[0] : '';
    }).filter(year => year))];
    
    // Count countries visited (basic detection)
    const countries = new Set();
    memoryItems.forEach(item => {
        const caption = item.querySelector('.initial-caption');
        if (caption) {
            const text = caption.textContent.toLowerCase();
            if (text.includes('singapore') || text.includes('sg')) countries.add('Singapore');
            if (text.includes('bohol') || text.includes('philippines') || text.includes('ph')) countries.add('Philippines');
            if (text.includes('thailand')) countries.add('Thailand');
            if (text.includes('vietnam')) countries.add('Vietnam');
        }
    });
    
    // Create stats section if it doesn't exist
    let statsSection = document.querySelector('.memory-stats');
    if (!statsSection && totalMemories > 0) {
        statsSection = document.createElement('div');
        statsSection.className = 'memory-stats';
        statsSection.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${totalMemories}</span>
                <span class="stat-label">Precious Memories</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${years.length}</span>
                <span class="stat-label">Years Together</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${countries.size}</span>
                <span class="stat-label">Countries Explored</span>
            </div>
        `;
        
        // Insert after the main heading
        const mainHeading = document.querySelector('.memories-section h1');
        if (mainHeading) {
            mainHeading.parentNode.insertBefore(statsSection, mainHeading.nextSibling);
        }
        
        // Animate stats numbers
        animateStats(statsSection);
    }
}

// Animate statistics numbers
function animateStats(statsSection) {
    const statNumbers = statsSection.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statNumber => {
        const finalValue = parseInt(statNumber.textContent);
        statNumber.textContent = '0';
        
        let current = 0;
        const increment = finalValue / 60; // 60 frames for 1 second animation
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                statNumber.textContent = finalValue;
                clearInterval(timer);
            } else {
                statNumber.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Setup search functionality
function setupSearch() {
    // Create search container if it doesn't exist
    let searchContainer = document.querySelector('.memory-search');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'memory-search';
        searchContainer.innerHTML = `
            <input type="text" id="memory-search-input" placeholder="Search memories..." class="search-input">
            <div class="memory-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="2022">2022</button>
                <button class="filter-btn" data-filter="2023">2023</button>
                <button class="filter-btn" data-filter="2024">2024</button>
                <button class="filter-btn" data-filter="2025">2025</button>
            </div>
        `;
        
        // Insert after stats section or after heading
        const statsSection = document.querySelector('.memory-stats');
        const mainHeading = document.querySelector('.memories-section h1');
        const insertAfter = statsSection || mainHeading;
        
        if (insertAfter) {
            insertAfter.parentNode.insertBefore(searchContainer, insertAfter.nextSibling);
        }
        
        // Setup search functionality
        setupSearchHandlers();
    }
}

// Setup search event handlers
function setupSearchHandlers() {
    const searchInput = document.getElementById('memory-search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterMemories(this.value.toLowerCase());
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterMemoriesByYear(filter);
            
            playButtonSound();
        });
    });
}

// Filter memories by search term
function filterMemories(searchTerm) {
    const memoryItems = document.querySelectorAll('.memory-item');
    
    memoryItems.forEach(item => {
        const caption = item.querySelector('.initial-caption');
        const dateBubble = item.querySelector('.date-bubble');
        
        const captionText = caption ? caption.textContent.toLowerCase() : '';
        const dateText = dateBubble ? dateBubble.textContent.toLowerCase() : '';
        
        const matches = captionText.includes(searchTerm) || dateText.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (item.style.opacity === '0') {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Filter memories by year
function filterMemoriesByYear(year) {
    const memoryItems = document.querySelectorAll('.memory-item');
    
    memoryItems.forEach(item => {
        const dateBubble = item.querySelector('.date-bubble');
        const dateText = dateBubble ? dateBubble.textContent : '';
        
        const matches = year === 'all' || dateText.includes(year);
        
        if (matches) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (item.style.opacity === '0') {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Clear search input when using filters
    const searchInput = document.getElementById('memory-search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Random memory functionality
function showRandomMemory() {
    const memoryButtons = document.querySelectorAll('.memory-btn');
    const visibleButtons = Array.from(memoryButtons).filter(btn => 
        btn.closest('.memory-item').style.display !== 'none'
    );
    
    if (visibleButtons.length > 0) {
        const randomButton = visibleButtons[Math.floor(Math.random() * visibleButtons.length)];
        
        // Highlight the selected memory briefly
        const memoryItem = randomButton.closest('.memory-item');
        memoryItem.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))';
        memoryItem.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            randomButton.click();
        }, 500);
        
        setTimeout(() => {
            memoryItem.style.background = '';
            memoryItem.style.transform = '';
        }, 1000);
        
        playSpecialSound();
    }
}

// Add random memory button
function addRandomMemoryButton() {
    const glowButton = document.querySelector('.glow-button');
    if (glowButton) {
        const randomBtn = document.createElement('button');
        randomBtn.className = 'btn btn-3d';
        randomBtn.textContent = '🎲 Surprise Me!';
        randomBtn.style.marginLeft = '1rem';
        randomBtn.addEventListener('click', showRandomMemory);
        
        glowButton.parentNode.insertBefore(randomBtn, glowButton);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('memory-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // R for random memory
    if (e.key === 'r' || e.key === 'R') {
        showRandomMemory();
    }
    
    // Number keys for year filters
    if (e.key >= '1' && e.key <= '4') {
        const yearMap = {
            '1': '2022',
            '2': '2023',
            '3': '2024',
            '4': '2025'
        };
        filterMemoriesByYear(yearMap[e.key]);
    }
    
    // Escape to clear filters
    if (e.key === 'Escape') {
        filterMemoriesByYear('all');
        const searchInput = document.getElementById('memory-search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
});

// Add CSS for search and enhanced features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .memory-search {
        max-width: 800px;
        margin: 2rem auto;
        text-align: center;
    }
    
    .search-input {
        width: 100%;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border: 2px solid var(--primary);
        border-radius: 50px;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
        font-family: 'Comic Neue', cursive;
    }
    
    .search-input:focus {
        outline: none;
        box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        border-color: var(--secondary);
    }
    
    .search-input::placeholder {
        color: #999;
        font-style: italic;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .memory-search {
            margin: 1.5rem auto;
        }
        
        .search-input {
            font-size: 1rem;
            padding: 0.8rem 1.2rem;
        }
        
        .memory-filters {
            gap: 0.5rem;
        }
        
        .filter-btn {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addRandomMemoryButton();
    }, 1000);
});