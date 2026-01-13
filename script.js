// ============ GLOBAL VARIABLES ============
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const leadForm = document.getElementById('leadForm');

// ============ SCHEDULE CALL FUNCTION ============
function scheduleCall() {
    if (leadForm) {
        leadForm.scrollIntoView({ behavior: 'smooth' });
        leadForm.querySelector('input[type="text"]').focus();
    }
}

// ============ MOBILE NAVIGATION TOGGLE ============
function initMobileNavigation() {
    if (!hamburger) return;
    
    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });
}

// ============ FORM VALIDATION & SUBMISSION ============
function initFormSubmission() {
    if (!leadForm) return;
    
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const programSelect = this.querySelector('select');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const program = programSelect.value;

        // Validation
        if (!name || !email || !program) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Disable submit button during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showNotification(`Thank you, ${name}! We'll contact you at ${email} soon.`, 'success');
            leadForm.reset();
            console.log('Lead captured:', { name, email, program });
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Book Free Call <i class="fas fa-calendar-check"></i>';
        }
    });
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification
    const timeout = setTimeout(() => {
        notification.classList.add('notification-hidden');
        setTimeout(() => notification.remove(), 300);
    }, 4000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(timeout);
        notification.classList.add('notification-hidden');
        setTimeout(() => notification.remove(), 300);
    });
}

// ============ SMOOTH SCROLLING ============
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============ SCROLL ANIMATIONS ============
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.program-card, .step, .price-card').forEach(el => {
        observer.observe(el);
    });
}

// ============ PROGRAM CARD HOVER EFFECTS ============
function initCardHoverEffects() {
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
}

// ============ ACTIVE NAVIGATION HIGHLIGHT ============
function initActiveNavHighlight() {
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// ============ ANIMATED METRICS COUNTER ============
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-number');
    
    if (!metrics.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metric = entry.target;
                const target = parseFloat(metric.getAttribute('data-target'));
                const suffix = metric.nextElementSibling?.classList.contains('metric-suffix') ? metric.nextElementSibling : null;
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    metric.textContent = suffix ? Math.floor(current) : current.toFixed(1);
                }, 16);
                
                observer.unobserve(metric);
            }
        });
    }, { threshold: 0.5 });
    
    metrics.forEach(metric => observer.observe(metric));
}

// ============ HORIZONTAL SCROLL CONTROL ============
function initHorizontalScroll() {
    const scrollSections = document.querySelectorAll('.scroll-section');
    
    scrollSections.forEach(section => {
        const container = section.querySelector('.scroll-container') || section.querySelector('.programs-scroll-container');
        const leftBtn = section.querySelector('.scroll-left');
        const rightBtn = section.querySelector('.scroll-right');
        
        if (!container || !leftBtn || !rightBtn) return;
        
        const scrollAmount = 350;
        
        function updateButtonStates() {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            leftBtn.classList.toggle('disabled', scrollLeft <= 10);
            rightBtn.classList.toggle('disabled', scrollLeft >= maxScroll - 10);
        }
        
        function scrollLeft() {
            if (leftBtn.classList.contains('disabled')) return;
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
        
        function scrollRight() {
            if (rightBtn.classList.contains('disabled')) return;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        
        leftBtn.addEventListener('click', scrollLeft);
        rightBtn.addEventListener('click', scrollRight);
        container.addEventListener('scroll', updateButtonStates);
        window.addEventListener('resize', updateButtonStates);
        
        // Keyboard navigation
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollRight();
            }
        });
        
        updateButtonStates();
    });
}

// ============ VIDEO PLAYBACK CONTROL ============
function initVideoPlayer() {
    const videoContainer = document.querySelector('.video-container');
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const videoElement = document.querySelector('.video-container video');
    
    if (!videoContainer || !videoPlayBtn) return;
    
    // For YouTube iframe
    if (videoContainer.querySelector('iframe')) {
        videoPlayBtn.addEventListener('click', () => {
            videoContainer.classList.add('playing');
            // Note: Would need YouTube API for actual playback
        });
        return;
    }
    
    // For local HTML5 video
    if (!videoElement) return;
    
    // Create video controls
    const videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    videoControls.innerHTML = `
        <button class="video-play-pause">
            <i class="fas fa-pause"></i>
        </button>
        <div class="video-progress">
            <div class="video-progress-bar"></div>
        </div>
        <button class="video-mute">
            <i class="fas fa-volume-up"></i>
        </button>
    `;
    
    videoContainer.appendChild(videoControls);
    
    const playPauseBtn = videoControls.querySelector('.video-play-pause');
    const muteBtn = videoControls.querySelector('.video-mute');
    const progressBar = videoControls.querySelector('.video-progress-bar');
    
    // Play/Pause
    function togglePlayPause() {
        if (videoElement.paused) {
            videoElement.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoContainer.classList.add('playing');
        } else {
            videoElement.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // Mute/Unmute
    function toggleMute() {
        videoElement.muted = !videoElement.muted;
        muteBtn.innerHTML = videoElement.muted 
            ? '<i class="fas fa-volume-mute"></i>' 
            : '<i class="fas fa-volume-up"></i>';
    }
    
    // Update progress
    function updateProgress() {
        const percent = (videoElement.currentTime / videoElement.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }
    
    // Seek on progress bar click
    videoControls.querySelector('.video-progress').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoElement.currentTime = pos * videoElement.duration;
    });
    
    // Event listeners
    videoPlayBtn.addEventListener('click', togglePlayPause);
    playPauseBtn.addEventListener('click', togglePlayPause);
    muteBtn.addEventListener('click', toggleMute);
    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        videoContainer.classList.remove('playing');
    });
    
    // Try autoplay
    videoElement.addEventListener('loadedmetadata', () => {
        if (videoElement.hasAttribute('autoplay') && videoElement.hasAttribute('muted')) {
            videoElement.play().catch(e => console.log('Autoplay prevented:', e));
        }
    });
}

// ============ PAGE INITIALIZATION ============
function initPage() {
    initMobileNavigation();
    initFormSubmission();
    initSmoothScrolling();
    initScrollAnimations();
    initCardHoverEffects();
    initActiveNavHighlight();
    initHorizontalScroll();
    animateMetrics();
    initVideoPlayer(); // Add video initialization here
    
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// ============ INITIALIZE EVERYTHING ============
document.addEventListener('DOMContentLoaded', initPage);

// ============ VIDEO PLAYBACK CONTROL ============
function initVideoPlayer() {
    const videoContainer = document.querySelector('.video-container');
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const videoElement = document.querySelector('.video-container video');
    
    if (!videoContainer || !videoPlayBtn) return;
    
    // For local HTML5 video
    if (!videoElement) return;
    
    // Create video controls
    const videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    videoControls.innerHTML = `
        <button class="video-play-pause">
            <i class="fas fa-pause"></i>
        </button>
        <div class="video-progress">
            <div class="video-progress-bar"></div>
        </div>
        <div class="video-volume-container">
            <button class="video-volume-btn">
                <i class="fas fa-volume-up"></i>
            </button>
            <div class="video-volume-slider">
                <input type="range" min="0" max="1" step="0.1" value="1" class="video-volume-range">
            </div>
        </div>
    `;
    
    videoContainer.appendChild(videoControls);
    
    const playPauseBtn = videoControls.querySelector('.video-play-pause');
    const volumeBtn = videoControls.querySelector('.video-volume-btn');
    const volumeSlider = videoControls.querySelector('.video-volume-range');
    const progressBar = videoControls.querySelector('.video-progress-bar');
    
    // Play/Pause - UPDATED: Unmute when play button is pressed
    function togglePlayPause() {
        if (videoElement.paused) {
            videoElement.muted = false; // UNMUTE WHEN PLAYING
            videoElement.volume = 1; // SET VOLUME TO 100%
            if (volumeSlider) volumeSlider.value = 1;
            videoElement.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoContainer.classList.add('playing');
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            videoElement.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // Volume control
    function updateVolume() {
        videoElement.volume = volumeSlider.value;
        videoElement.muted = volumeSlider.value == 0;
        
        // Update volume button icon
        if (videoElement.muted || volumeSlider.value == 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volumeSlider.value < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    // Toggle mute
    function toggleMute() {
        if (videoElement.muted) {
            videoElement.muted = false;
            videoElement.volume = 1;
            if (volumeSlider) volumeSlider.value = 1;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            videoElement.muted = true;
            if (volumeSlider) volumeSlider.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }
    
    // Update progress
    function updateProgress() {
        const percent = (videoElement.currentTime / videoElement.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }
    
    // Seek on progress bar click
    videoControls.querySelector('.video-progress').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoElement.currentTime = pos * videoElement.duration;
    });
    
    // Event listeners
    videoPlayBtn.addEventListener('click', togglePlayPause);
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeBtn.addEventListener('click', toggleMute);
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', updateVolume);
    }
    
    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        videoContainer.classList.remove('playing');
    });
    
    // Try autoplay (muted)
    videoElement.addEventListener('loadedmetadata', () => {
        if (videoElement.hasAttribute('autoplay') && videoElement.hasAttribute('muted')) {
            videoElement.muted = true; // Start muted for autoplay
            videoElement.play().catch(e => console.log('Autoplay prevented:', e));
            // Update UI for muted state
            if (volumeSlider) volumeSlider.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Update volume UI when video metadata loads
    videoElement.addEventListener('loadedmetadata', () => {
        if (volumeSlider) {
            volumeSlider.value = videoElement.volume;
            updateVolume();
        }
    });
}