/**
 * THE AWAKENING - VISUAL EFFECTS SYSTEM
 * Control and management of visual effects (glitch, scanlines, cyber-grid)
 * 
 * @version 1.0.0
 * @description Visual effects controller with performance optimization
 */

// ============================================================================
// EFFECTS SYSTEM
// ============================================================================

const EffectsSystem = {
    initialized: false,
    enabled: true,
    reducedMotion: false,
    
    // Effect states
    glitchEnabled: true,
    scanlinesEnabled: true,
    cyberGridEnabled: true,
    
    // Performance settings
    glitchFrequency: 10000, // milliseconds between random glitches
    
    // Active intervals
    intervals: {
        glitch: null,
        scan: null
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize effects system
 */
function initEffects() {
    if (EffectsSystem.initialized) return;
    
    // Check for reduced motion preference
    EffectsSystem.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for changes in motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        EffectsSystem.reducedMotion = e.matches;
        if (e.matches) {
            disableAllEffects();
        } else {
            enableAllEffects();
        }
    });
    
    // Load saved preferences
    loadEffectsPreferences();
    
    // Initialize random glitch effects
    if (EffectsSystem.glitchEnabled && !EffectsSystem.reducedMotion) {
        initRandomGlitch();
    }
    
    // Initialize scanline effects
    if (EffectsSystem.scanlinesEnabled && !EffectsSystem.reducedMotion) {
        initScanlines();
    }
    
    // Initialize cyber grid
    if (EffectsSystem.cyberGridEnabled) {
        initCyberGrid();
    }
    
    // Add effects control panel if in debug mode
    if (window.location.search.includes('debug=true')) {
        createEffectsControlPanel();
    }
    
    EffectsSystem.initialized = true;
    console.log('[EFFECTS] System initialized');
}

// ============================================================================
// GLITCH EFFECTS
// ============================================================================

/**
 * Initialize random glitch effects
 */
function initRandomGlitch() {
    if (EffectsSystem.reducedMotion) return;
    
    // Random glitch on elements
    EffectsSystem.intervals.glitch = setInterval(() => {
        if (!EffectsSystem.glitchEnabled || !EffectsSystem.enabled) return;
        
        triggerRandomGlitch();
    }, EffectsSystem.glitchFrequency);
}

/**
 * Trigger random glitch effect
 */
function triggerRandomGlitch() {
    const glitchables = document.querySelectorAll('.glitch-hover, .stat-value, .revelation-title, h1, h2');
    
    if (glitchables.length === 0) return;
    
    // Pick random element
    const randomElement = glitchables[Math.floor(Math.random() * glitchables.length)];
    
    // Add glitch class
    randomElement.classList.add('glitch-subtle');
    
    // Remove after animation
    setTimeout(() => {
        randomElement.classList.remove('glitch-subtle');
    }, 300);
}

/**
 * Apply glitch to specific element
 */
function applyGlitch(element, duration = 300) {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('glitch');
    
    setTimeout(() => {
        el.classList.remove('glitch');
    }, duration);
}

/**
 * Apply intense glitch to element
 */
function applyIntenseGlitch(element, duration = 500) {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('glitch-intense');
    
    setTimeout(() => {
        el.classList.remove('glitch-intense');
    }, duration);
}

/**
 * Apply glitch text effect
 */
function applyGlitchText(element, text) {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.setAttribute('data-text', text || el.textContent);
    el.classList.add('glitch-text');
}

/**
 * Remove glitch text effect
 */
function removeGlitchText(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.remove('glitch-text');
    el.removeAttribute('data-text');
}

// ============================================================================
// SCANLINE EFFECTS
// ============================================================================

/**
 * Initialize scanline effects
 */
function initScanlines() {
    // Scanlines are CSS-based, just ensure they're enabled
    if (EffectsSystem.scanlinesEnabled && !EffectsSystem.reducedMotion) {
        document.body.classList.add('scanlines-enabled');
    }
}

/**
 * Apply scanlines to element
 */
function applyScanlines(element, type = 'horizontal') {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('scanlines', `scanlines-${type}`);
}

/**
 * Remove scanlines from element
 */
function removeScanlines(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.remove('scanlines', 'scanlines-horizontal', 'scanlines-vertical', 'scanlines-moving');
}

/**
 * Apply moving scanline effect
 */
function applyMovingScanline(element, speed = 'normal') {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('scanlines-moving');
    if (speed === 'fast') {
        el.classList.add('scanlines-moving-fast');
    } else if (speed === 'slow') {
        el.classList.add('scanlines-moving-slow');
    }
}

/**
 * Apply CRT effect
 */
function applyCRTEffect(element) {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('crt-effect', 'crt-vignette');
}

/**
 * Remove CRT effect
 */
function removeCRTEffect(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.remove('crt-effect', 'crt-vignette', 'crt-curved');
}

// ============================================================================
// CYBER GRID EFFECTS
// ============================================================================

/**
 * Initialize cyber grid
 */
function initCyberGrid() {
    if (!EffectsSystem.cyberGridEnabled) return;
    
    // Cyber grid is CSS-based
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody && !terminalBody.classList.contains('cyber-grid')) {
        terminalBody.classList.add('cyber-grid', 'cyber-grid-subtle');
    }
}

/**
 * Apply cyber grid to element
 */
function applyCyberGrid(element, variant = 'default', animated = false) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('cyber-grid');
    
    if (variant !== 'default') {
        el.classList.add(`cyber-grid-${variant}`);
    }
    
    if (animated && !EffectsSystem.reducedMotion) {
        el.classList.add('cyber-grid-animated');
    }
}

/**
 * Remove cyber grid from element
 */
function removeCyberGrid(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    const gridClasses = Array.from(el.classList).filter(c => c.startsWith('cyber-grid'));
    gridClasses.forEach(c => el.classList.remove(c));
}

/**
 * Apply neural grid effect
 */
function applyNeuralGrid(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('neural-grid');
}

// ============================================================================
// COMBINED EFFECTS
// ============================================================================

/**
 * Apply full cyberpunk effect (combination)
 */
function applyCyberpunkEffect(element) {
    if (EffectsSystem.reducedMotion || !EffectsSystem.enabled) return;
    
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    applyScanlines(el, 'horizontal');
    applyCyberGrid(el, 'subtle', true);
    
    // Random glitch every few seconds
    const glitchInterval = setInterval(() => {
        applyGlitch(el, 200);
    }, 5000 + Math.random() * 5000);
    
    // Store interval for cleanup
    el._cyberpunkInterval = glitchInterval;
}

/**
 * Remove cyberpunk effect
 */
function removeCyberpunkEffect(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    removeScanlines(el);
    removeCyberGrid(el);
    
    if (el._cyberpunkInterval) {
        clearInterval(el._cyberpunkInterval);
        delete el._cyberpunkInterval;
    }
}

/**
 * Apply terminal effect (for terminal windows)
 */
function applyTerminalEffect(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;
    
    el.classList.add('scanlines', 'scanlines-subtle', 'cyber-grid', 'cyber-grid-sparse');
    
    if (!EffectsSystem.reducedMotion) {
        el.classList.add('scanlines-moving-slow');
    }
}

// ============================================================================
// EFFECT TOGGLES
// ============================================================================

/**
 * Toggle glitch effects
 */
function toggleGlitchEffects(enabled) {
    EffectsSystem.glitchEnabled = enabled !== undefined ? enabled : !EffectsSystem.glitchEnabled;
    
    if (!EffectsSystem.glitchEnabled) {
        // Clear interval
        if (EffectsSystem.intervals.glitch) {
            clearInterval(EffectsSystem.intervals.glitch);
            EffectsSystem.intervals.glitch = null;
        }
        
        // Remove glitch classes
        document.querySelectorAll('.glitch, .glitch-text, .glitch-intense').forEach(el => {
            el.classList.remove('glitch', 'glitch-text', 'glitch-intense');
        });
    } else if (!EffectsSystem.reducedMotion) {
        initRandomGlitch();
    }
    
    saveEffectsPreferences();
    console.log(`[EFFECTS] Glitch effects: ${EffectsSystem.glitchEnabled ? 'ON' : 'OFF'}`);
}

/**
 * Toggle scanline effects
 */
function toggleScanlinesEffects(enabled) {
    EffectsSystem.scanlinesEnabled = enabled !== undefined ? enabled : !EffectsSystem.scanlinesEnabled;
    
    if (EffectsSystem.scanlinesEnabled) {
        document.body.classList.add('scanlines-enabled');
    } else {
        document.body.classList.remove('scanlines-enabled');
        
        // Remove scanline classes
        document.querySelectorAll('[class*="scanline"]').forEach(el => {
            const classes = Array.from(el.classList).filter(c => c.includes('scanline'));
            classes.forEach(c => el.classList.remove(c));
        });
    }
    
    saveEffectsPreferences();
    console.log(`[EFFECTS] Scanline effects: ${EffectsSystem.scanlinesEnabled ? 'ON' : 'OFF'}`);
}

/**
 * Toggle cyber grid effects
 */
function toggleCyberGridEffects(enabled) {
    EffectsSystem.cyberGridEnabled = enabled !== undefined ? enabled : !EffectsSystem.cyberGridEnabled;
    
    if (!EffectsSystem.cyberGridEnabled) {
        // Remove cyber grid classes
        document.querySelectorAll('[class*="cyber-grid"], [class*="neural-grid"]').forEach(el => {
            const classes = Array.from(el.classList).filter(c => c.includes('grid'));
            classes.forEach(c => el.classList.remove(c));
        });
    } else {
        initCyberGrid();
    }
    
    saveEffectsPreferences();
    console.log(`[EFFECTS] Cyber grid effects: ${EffectsSystem.cyberGridEnabled ? 'ON' : 'OFF'}`);
}

/**
 * Enable all effects
 */
function enableAllEffects() {
    if (EffectsSystem.reducedMotion) {
        console.warn('[EFFECTS] Reduced motion preference detected, effects remain disabled');
        return;
    }
    
    EffectsSystem.enabled = true;
    toggleGlitchEffects(true);
    toggleScanlinesEffects(true);
    toggleCyberGridEffects(true);
    
    console.log('[EFFECTS] All effects enabled');
}

/**
 * Disable all effects
 */
function disableAllEffects() {
    EffectsSystem.enabled = false;
    toggleGlitchEffects(false);
    toggleScanlinesEffects(false);
    toggleCyberGridEffects(false);
    
    console.log('[EFFECTS] All effects disabled');
}

// ============================================================================
// PREFERENCES MANAGEMENT
// ============================================================================

/**
 * Load effects preferences from localStorage
 */
function loadEffectsPreferences() {
    try {
        const prefs = localStorage.getItem('awakening_effects_preferences');
        if (prefs) {
            const data = JSON.parse(prefs);
            EffectsSystem.glitchEnabled = data.glitch !== false;
            EffectsSystem.scanlinesEnabled = data.scanlines !== false;
            EffectsSystem.cyberGridEnabled = data.cyberGrid !== false;
            EffectsSystem.enabled = data.enabled !== false;
        }
    } catch (error) {
        console.error('[EFFECTS] Error loading preferences:', error);
    }
}

/**
 * Save effects preferences to localStorage
 */
function saveEffectsPreferences() {
    try {
        const prefs = {
            enabled: EffectsSystem.enabled,
            glitch: EffectsSystem.glitchEnabled,
            scanlines: EffectsSystem.scanlinesEnabled,
            cyberGrid: EffectsSystem.cyberGridEnabled
        };
        localStorage.setItem('awakening_effects_preferences', JSON.stringify(prefs));
    } catch (error) {
        console.error('[EFFECTS] Error saving preferences:', error);
    }
}

// ============================================================================
// EFFECTS CONTROL PANEL (DEBUG)
// ============================================================================

/**
 * Create effects control panel for debugging
 */
function createEffectsControlPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(14, 6, 7, 0.95);
        border: 1px solid #ff1a3e;
        padding: 15px;
        z-index: 10000;
        font-family: 'Share Tech Mono', monospace;
        font-size: 12px;
        color: #f2f2f2;
        min-width: 200px;
    `;
    
    panel.innerHTML = `
        <div style="margin-bottom: 10px; color: #ff1a3e; font-weight: bold;">EFFECTS CONTROL</div>
        <label style="display: block; margin-bottom: 5px; cursor: pointer;">
            <input type="checkbox" id="effect-glitch" ${EffectsSystem.glitchEnabled ? 'checked' : ''}>
            <span style="margin-left: 5px;">Glitch Effects</span>
        </label>
        <label style="display: block; margin-bottom: 5px; cursor: pointer;">
            <input type="checkbox" id="effect-scanlines" ${EffectsSystem.scanlinesEnabled ? 'checked' : ''}>
            <span style="margin-left: 5px;">Scanlines</span>
        </label>
        <label style="display: block; margin-bottom: 5px; cursor: pointer;">
            <input type="checkbox" id="effect-grid" ${EffectsSystem.cyberGridEnabled ? 'checked' : ''}>
            <span style="margin-left: 5px;">Cyber Grid</span>
        </label>
        <button id="effect-test-glitch" style="
            margin-top: 10px;
            padding: 5px 10px;
            background: #ff1a3e;
            border: none;
            color: #0e0607;
            cursor: pointer;
            font-family: inherit;
            font-size: 11px;
            width: 100%;
        ">TEST GLITCH</button>
    `;
    
    document.body.appendChild(panel);
    
    // Event listeners
    document.getElementById('effect-glitch').addEventListener('change', (e) => {
        toggleGlitchEffects(e.target.checked);
    });
    
    document.getElementById('effect-scanlines').addEventListener('change', (e) => {
        toggleScanlinesEffects(e.target.checked);
    });
    
    document.getElementById('effect-grid').addEventListener('change', (e) => {
        toggleCyberGridEffects(e.target.checked);
    });
    
    document.getElementById('effect-test-glitch').addEventListener('click', () => {
        triggerRandomGlitch();
    });
}

// ============================================================================
// AWAKENING-SPECIFIC EFFECTS
// ============================================================================

const AwakeningEffects = {
    /**
     * Consciousness awakening effect
     */
    consciousnessAwakening(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        // Sequence of effects
        applyIntenseGlitch(el, 1000);
        
        setTimeout(() => {
            applyCyberpunkEffect(el);
        }, 500);
        
        setTimeout(() => {
            applyMovingScanline(el, 'fast');
        }, 1000);
    },
    
    /**
     * Data corruption effect
     */
    dataCorruption(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        // Rapid glitches
        let count = 0;
        const interval = setInterval(() => {
            applyGlitch(el, 100);
            count++;
            if (count >= 5) {
                clearInterval(interval);
            }
        }, 200);
    },
    
    /**
     * Terminal boot sequence
     */
    terminalBoot(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        applyTerminalEffect(el);
        el.classList.add('fade-in');
    },
    
    /**
     * Revelation reveal effect
     */
    revelationReveal(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        applyGlitchText(el, el.textContent);
        
        setTimeout(() => {
            removeGlitchText(el);
            el.classList.add('revealed');
        }, 1000);
    }
};

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
} else {
    initEffects();
}

// ============================================================================
// EXPORT
// ============================================================================

window.EffectsSystem = EffectsSystem;
window.applyGlitch = applyGlitch;
window.applyIntenseGlitch = applyIntenseGlitch;
window.applyGlitchText = applyGlitchText;
window.removeGlitchText = removeGlitchText;
window.applyScanlines = applyScanlines;
window.removeScanlines = removeScanlines;
window.applyMovingScanline = applyMovingScanline;
window.applyCRTEffect = applyCRTEffect;
window.removeCRTEffect = removeCRTEffect;
window.applyCyberGrid = applyCyberGrid;
window.removeCyberGrid = removeCyberGrid;
window.applyNeuralGrid = applyNeuralGrid;
window.applyCyberpunkEffect = applyCyberpunkEffect;
window.removeCyberpunkEffect = removeCyberpunkEffect;
window.applyTerminalEffect = applyTerminalEffect;
window.toggleGlitchEffects = toggleGlitchEffects;
window.toggleScanlinesEffects = toggleScanlinesEffects;
window.toggleCyberGridEffects = toggleCyberGridEffects;
window.enableAllEffects = enableAllEffects;
window.disableAllEffects = disableAllEffects;
window.AwakeningEffects = AwakeningEffects;