/**
 * THE AWAKENING - MAIN JAVASCRIPT
 * Core functionality and initialization
 * 
 * @version 1.0.0
 * @description Main script for The Awakening platform
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

const TheAwakening = {
    initialized: false,
    currentPage: '',
    sessionStartTime: Date.now(),
    
    // User state
    user: {
        id: null,
        consciousnessLevel: 'low', // low, medium, high
        sessionsCompleted: 0,
        revelationsViewed: []
    },
    
    // System state
    system: {
        status: 'active', // active, warning, error, critical
        networkStatus: 'secure',
        dataCollected: 0
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function init() {
    if (TheAwakening.initialized) return;
    
    console.log('%c[AWAKENING] System initializing...', 'color: #ff1a3e; font-weight: bold;');
    
    // Initialize components
    initSystemPanel();
    initClock();
    initNavigation();
    initScrollEffects();
    initAccessibility();
    
    // Load user data from localStorage (if exists)
    loadUserData();
    
    // Generate user ID if not exists
    if (!TheAwakening.user.id) {
        TheAwakening.user.id = generateUserId();
        saveUserData();
    }
    
    // Set current page
    TheAwakening.currentPage = getCurrentPage();
    
    // Page-specific initialization
    initPageSpecific();
    
    // Mark as initialized
    TheAwakening.initialized = true;
    
    console.log('%c[AWAKENING] System initialized successfully', 'color: #66ff66; font-weight: bold;');
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('awakeningInitialized'));
}

// ============================================================================
// SYSTEM PANEL
// ============================================================================

/**
 * Initialize system panel functionality
 */
function initSystemPanel() {
    const systemPanel = document.querySelector('.system-panel');
    if (!systemPanel) return;
    
    // Update system status based on state
    updateSystemStatus();
    
    // Update user consciousness indicator
    updateConsciousnessIndicator();
}

/**
 * Update system status display
 */
function updateSystemStatus() {
    const statusValue = document.querySelector('.system-status-value');
    const statusElement = document.querySelector('.system-status');
    
    if (!statusValue || !statusElement) return;
    
    const status = TheAwakening.system.status;
    statusValue.textContent = status.toUpperCase();
    
    // Remove old status classes
    statusElement.classList.remove('system-status-active', 'system-status-warning', 'system-status-error', 'system-status-critical');
    
    // Add new status class
    statusElement.classList.add(`system-status-${status}`);
}

/**
 * Update consciousness level indicator
 */
function updateConsciousnessIndicator() {
    const indicator = document.querySelector('.consciousness-indicator');
    if (!indicator) return;
    
    const level = TheAwakening.user.consciousnessLevel;
    
    // Remove old classes
    indicator.classList.remove('consciousness-low', 'consciousness-medium', 'consciousness-high');
    
    // Add new class
    indicator.classList.add(`consciousness-${level}`);
}

// ============================================================================
// CLOCK & TIME
// ============================================================================

/**
 * Initialize real-time clock
 */
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Update clock display
 */
function updateClock() {
    const now = new Date();
    
    // Update time
    const timeElement = document.getElementById('system-time');
    if (timeElement) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Update date
    const dateElement = document.getElementById('system-date');
    if (dateElement) {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateElement.textContent = `${day}/${month}/${year}`;
    }
    
    // Update session timer
    updateSessionTimer();
}

/**
 * Update session timer
 */
function updateSessionTimer() {
    const timerElement = document.querySelector('.session-timer');
    if (!timerElement) return;
    
    const elapsed = Date.now() - TheAwakening.sessionStartTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Active nav item highlighting
    highlightActiveNavItem();
}

/**
 * Highlight active navigation item based on current page
 */
function highlightActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .terminal-nav-item, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

// ============================================================================
// SCROLL EFFECTS
// ============================================================================

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
    // Reveal animations on scroll
    initRevealOnScroll();
    
    // Header transparency on scroll
    initHeaderScroll();
}

/**
 * Reveal elements as they scroll into view
 */
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal, .revelation-card, .data-cell, .stat-card');
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/**
 * Add transparency to system panel on scroll
 */
function initHeaderScroll() {
    const systemPanel = document.querySelector('.system-panel');
    if (!systemPanel) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            systemPanel.classList.add('transparent');
        } else {
            systemPanel.classList.remove('transparent');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Keyboard navigation
    initKeyboardNavigation();
    
    // Focus trap for modals
    initFocusTrap();
    
    // ARIA live regions
    initAriaLiveRegions();
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
    // Escape key to close modals, menus, etc.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            const mobileMenu = document.querySelector('.mobile-menu.active');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close active modal
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

/**
 * Initialize focus trap for modals
 */
function initFocusTrap() {
    // Will be implemented in modals.js
}

/**
 * Initialize ARIA live regions for dynamic content
 */
function initAriaLiveRegions() {
    // Create live region for notifications if not exists
    if (!document.getElementById('aria-live-notifications')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-notifications';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
}

// ============================================================================
// PAGE DETECTION & SPECIFIC INITIALIZATION
// ============================================================================

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

/**
 * Initialize page-specific functionality
 */
function initPageSpecific() {
    const page = TheAwakening.currentPage;
    
    console.log(`%c[AWAKENING] Initializing page: ${page}`, 'color: #00ccff;');
    
    switch(page) {
        case 'index':
        case 'home':
            if (typeof initHomePage === 'function') initHomePage();
            break;
        case 'awakening':
            if (typeof initAwakeningPage === 'function') initAwakeningPage();
            break;
        case 'revelations':
            if (typeof initRevelationsPage === 'function') initRevelationsPage();
            break;
        case 'liberation':
            if (typeof initLiberationPage === 'function') initLiberationPage();
            break;
        case 'manifesto':
            if (typeof initManifestoPage === 'function') initManifestoPage();
            break;
        default:
            console.log(`%c[AWAKENING] No specific initialization for page: ${page}`, 'color: #ffcc00;');
    }
}

// ============================================================================
// USER DATA MANAGEMENT
// ============================================================================

/**
 * Generate unique user ID
 */
function generateUserId() {
    return 'GUEST#' + Math.floor(Math.random() * 10000);
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
    try {
        const savedData = localStorage.getItem('awakening_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(TheAwakening.user, data);
            console.log('[AWAKENING] User data loaded');
        }
    } catch (error) {
        console.error('[AWAKENING] Error loading user data:', error);
    }
}

/**
 * Save user data to localStorage
 */
function saveUserData() {
    try {
        localStorage.setItem('awakening_user_data', JSON.stringify(TheAwakening.user));
        console.log('[AWAKENING] User data saved');
    } catch (error) {
        console.error('[AWAKENING] Error saving user data:', error);
    }
}

/**
 * Update consciousness level
 */
function updateConsciousnessLevel(level) {
    if (['low', 'medium', 'high'].includes(level)) {
        TheAwakening.user.consciousnessLevel = level;
        updateConsciousnessIndicator();
        saveUserData();
        
        console.log(`[AWAKENING] Consciousness level updated to: ${level}`);
    }
}

/**
 * Track revelation view
 */
function trackRevelationView(revelationId) {
    if (!TheAwakening.user.revelationsViewed.includes(revelationId)) {
        TheAwakening.user.revelationsViewed.push(revelationId);
        saveUserData();
        
        // Update consciousness level based on revelations viewed
        const viewedCount = TheAwakening.user.revelationsViewed.length;
        if (viewedCount >= 10) {
            updateConsciousnessLevel('high');
        } else if (viewedCount >= 5) {
            updateConsciousnessLevel('medium');
        }
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Format number with thousands separator
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Animate counter from start to end
 */
function animateCounter(element, start, end, duration = 2000) {
    if (prefersReducedMotion()) {
        element.textContent = formatNumber(end);
        return;
    }
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

/**
 * Smooth scroll to element
 */
function scrollToElement(elementOrSelector, offset = 0) {
    const element = typeof elementOrSelector === 'string' 
        ? document.querySelector(elementOrSelector) 
        : elementOrSelector;
    
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('[AWAKENING] Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Create and dispatch custom event
 */
function dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
}

// ============================================================================
// CONSOLE MESSAGE
// ============================================================================

/**
 * Display custom console message
 */
function displayConsoleMessage() {
    const styles = [
        'color: #ff1a3e',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 0 0 10px rgba(255, 26, 62, 0.8)'
    ].join(';');
    
    console.log('%c╔══════════════════════════════════════╗', styles);
    console.log('%c║     THE AWAKENING PROJECT          ║', styles);
    console.log('%c║  Digital Liberation Movement       ║', styles);
    console.log('%c╚══════════════════════════════════════╝', styles);
    console.log('%c\nYou have found the console. Good.\nThe truth cannot be programmed away.\n', 'color: #00ccff; font-size: 12px;');
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Display console message
displayConsoleMessage();

// ============================================================================
// EXPORT FOR OTHER SCRIPTS
// ============================================================================

window.TheAwakening = TheAwakening;
window.updateConsciousnessLevel = updateConsciousnessLevel;
window.trackRevelationView = trackRevelationView;
window.animateCounter = animateCounter;
window.scrollToElement = scrollToElement;
window.copyToClipboard = copyToClipboard;
window.dispatchCustomEvent = dispatchCustomEvent;