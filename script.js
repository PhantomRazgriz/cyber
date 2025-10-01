/**
 * The Awakening - Cyberpunk Terminal
 * Main script for interactive and visual functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // COMPONENTS AND GLOBAL REFERENCES
    // =========================================
    const systemTime = document.getElementById('system-time');
    const systemDate = document.getElementById('system-date');
    const sessionTime = document.getElementById('session-time');
    const counterDays = document.getElementById('counter-days');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    const subscribeBtn = document.getElementById('subscribe-btn');
    
    // Session start time to calculate duration
    const sessionStartTime = new Date();
    
    // =========================================
    // UTILITY FUNCTIONS
    // =========================================
    
    /**
     * Format a number with leading zeros
     */
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    /**
     * Update system clock
     */
    function updateSystemClock() {
        const now = new Date();
        
        // Update system time
        if (systemTime) {
            const hours = padZero(now.getHours());
            const minutes = padZero(now.getMinutes());
            const seconds = padZero(now.getSeconds());
            systemTime.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Update system date
        if (systemDate) {
            const day = padZero(now.getDate());
            const month = padZero(now.getMonth() + 1);
            const year = now.getFullYear();
            systemDate.textContent = `${day}/${month}/${year}`;
        }
    }
    
    /**
     * Update session time
     */
    function updateSessionTime() {
        if (sessionTime) {
            const now = new Date();
            const diff = Math.floor((now - sessionStartTime) / 1000); // difference in seconds
            
            const hours = padZero(Math.floor(diff / 3600));
            const minutes = padZero(Math.floor((diff % 3600) / 60));
            const seconds = padZero(diff % 60);
            
            sessionTime.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    /**
     * Simulate typing effect for text elements
     */
    function typeWriterEffect(element, text, speed = 30, delay = 0) {
        if (!element) return;
        
        // Save original text and empty the element
        const originalText = text || element.textContent;
        element.textContent = '';
        
        // Delay the start of the effect if necessary
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    element.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, speed);
        }, delay);
    }
    
    /**
     * Mostra una notifica di sistema
     */
    function showNotification(message, duration = 5000) {
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.classList.add('show');
            
            // Hide notification after specified duration
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }
    }
    
    /**
     * Simulate data loading
     */
    function simulateDataLoading(element, onComplete) {
        if (!element) return;
        
        // Aggiungi classe di caricamento
        element.classList.add('cell-loading');
        
        // Simula il caricamento
        setTimeout(() => {
            element.classList.remove('cell-loading');
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, Math.random() * 2000 + 1000); // 1-3 seconds of loading
    }
    
    // =========================================
    // ANIMATIONS AND VISUAL EFFECTS
    // =========================================
    
    /**
     * Applica effetto glitch random a un elemento
     */
    function applyRandomGlitch(element) {
        if (!element) return;
        
        // Check if element is already in glitch (to avoid overlaps)
        if (element.classList.contains('active-glitch')) return;
        
        // Add class for tracking
        element.classList.add('active-glitch');
        
        // Salva lo stile originale
        const originalTransform = element.style.transform;
        const originalClipPath = element.style.clipPath;
        
        // Funzione per un singolo frame di glitch
        function glitchFrame() {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
            
            if (Math.random() > 0.5) {
                const slice = Math.random() * 100;
                element.style.clipPath = `inset(${slice}% 0 ${100 - slice}% 0)`;
            }
        }
        
        // Applica diversi frame di glitch
        let framesCount = 0;
        const maxFrames = Math.floor(Math.random() * 5) + 3; // 3-7 frames
        
        const glitchInterval = setInterval(() => {
            glitchFrame();
            framesCount++;
            
            if (framesCount >= maxFrames) {
                clearInterval(glitchInterval);
                
                // Ripristina lo stile originale
                element.style.transform = originalTransform;
                element.style.clipPath = originalClipPath;
                
                // Remove tracking class
                element.classList.remove('active-glitch');
            }
        }, 100);
    }
    
    /**
     * Apply random glitch to page elements
     */
    function startRandomGlitches() {
        const glitchableElements = [
            '.header-glitch-text',
            '.term-title',
            '.window-title',
            '.cell-header',
            '.term-button'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% probability
                const selector = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
                const elements = document.querySelectorAll(selector);
                
                if (elements.length > 0) {
                    const randomElement = elements[Math.floor(Math.random() * elements.length)];
                    applyRandomGlitch(randomElement);
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    /**
     * Simulate terminal interference
     */
    function simulateTerminalInterference() {
        const terminal = document.querySelector('.terminal-body');
        if (!terminal) return;
        
        setInterval(() => {
            if (Math.random() > 0.9) { // 10% probability
                // Crea un flash di interferenza
                const interference = document.createElement('div');
                interference.style.position = 'absolute';
                interference.style.top = '0';
                interference.style.left = '0';
                interference.style.width = '100%';
                interference.style.height = '100%';
                interference.style.backgroundColor = 'rgba(0, 255, 255, 0.05)';
                interference.style.pointerEvents = 'none';
                interference.style.zIndex = '100';
                
                terminal.appendChild(interference);
                
                // Remove after a brief period
                setTimeout(() => {
                    interference.remove();
                }, 100);
            }
        }, 10000); // Check every 10 seconds
    }
    
    /**
     * Randomly update traffic indicators
     */
    function updateTrafficIndicator() {
        const indicator = document.getElementById('traffic-indicator');
        if (!indicator) return;
        
        setInterval(() => {
            const patterns = ['▁▂▃▄▅', '▇▆▅▄▃', '▃▄▅▆▇', '▂▃▁▃▂', '▄▃▂▁▂'];
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            indicator.textContent = randomPattern;
        }, 3000);
    }
    
    /**
     * Handle parallax effect based on mouse movement
     */
    function initParallaxEffect() {
        const parallaxContainers = document.querySelectorAll('.parallax-section');
        
        if (parallaxContainers.length === 0) return;
        
        function handleMouseMove(e) {
            parallaxContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                
                // Check if the container is visible
                if (
                    rect.bottom >= 0 &&
                    rect.top <= window.innerHeight
                ) {
                    // Calcola la posizione relativa del mouse rispetto al centro dello schermo
                    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // da -1 a 1
                    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // da -1 a 1
                    
                    // Apply movement to parallax layers
                    const layers = container.querySelectorAll('.parallax-layer');
                    layers.forEach(layer => {
                        let depth = 10;
                        if (layer.classList.contains('parallax-layer-back')) {
                            depth = 20;
                        } else if (layer.classList.contains('parallax-layer-mid')) {
                            depth = 15;
                        }
                        
                        const translateX = mouseX * depth;
                        const translateY = mouseY * depth;
                        
                        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
                    });
                }
            });
        }
        
        // Activate parallax effect only if device is not mobile
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', handleMouseMove);
        }
    }

    /**
     * Attiva lo stato section-active negli elementi visibili durante lo scroll
     */
    function initScrollActivation() {
        // Elementi che possono diventare attivi
        const activatableElements = document.querySelectorAll('.protocol-step, .data-cell:not(.memory-log), .term-window');
        
        function checkVisibility() {
            activatableElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                
                // If the element is visible in the viewport
                if (
                    rect.top < window.innerHeight * 0.8 &&
                    rect.bottom > window.innerHeight * 0.2
                ) {
                    // Aggiungi la classe section-active con un leggero ritardo casuale
                    if (!element.classList.contains('section-active')) {
                        setTimeout(() => {
                            element.classList.add('section-active');
                            
                            // Activate a neural node nearby if the API is available
                            if (window.cyberGrid) {
                                window.cyberGrid.activateRandomPoint();
                            }
                        }, Math.random() * 300);
                    }
                }
            });
        }
        
        // Controlla all'inizio e durante lo scroll
        window.addEventListener('scroll', checkVisibility);
        checkVisibility(); // Controllo iniziale
    }
    
    /**
     * Crea effetti di sinapsi tra elementi
     */
    function createSynapseEffects() {
        // Trova tutti i contenitori di sinapsi
        const synapseContainers = document.querySelectorAll('.synapse-container');
        
        synapseContainers.forEach(container => {
            // Find elements to connect within the container
            const connectableElements = container.querySelectorAll('.protocol-step, .data-cell, .term-window');
            
            // Crea le connessioni tra elementi vicini
            for (let i = 0; i < connectableElements.length - 1; i++) {
                const elementA = connectableElements[i];
                const elementB = connectableElements[i + 1];
                
                // Crea la linea sinaptica
                const synapseLine = document.createElement('div');
                synapseLine.classList.add('synapse-line');
                
                // Posiziona la linea
                const rectA = elementA.getBoundingClientRect();
                const rectB = elementB.getBoundingClientRect();
                
                // Calcola il punto di partenza e arrivo
                const startX = rectA.left + rectA.width / 2;
                const startY = rectA.top + rectA.height / 2;
                const endX = rectB.left + rectB.width / 2;
                const endY = rectB.top + rectB.height / 2;
                
                // Calcola lunghezza e angolo
                const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
                const angle = Math.atan2(endY - startY, endX - startX);
                
                // Applica stile
                synapseLine.style.width = `${length}px`;
                synapseLine.style.left = `${startX}px`;
                synapseLine.style.top = `${startY}px`;
                synapseLine.style.transform = `rotate(${angle}rad)`;
                
                // Add to container
                container.appendChild(synapseLine);
            }
        });
    }
    
    // =========================================
    // EVENT LISTENERS
    // =========================================
    
    // Chiudi notifica
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }
    
    // Subscription button
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = document.querySelector('.term-form input[type="email"]');
            
            if (emailInput && emailInput.value && emailInput.value.includes('@')) {
                showNotification('[CONNECTION ESTABLISHED] Network access granted. Awaiting instructions.');
                emailInput.value = '';
                
                // Activate a neural node burst
                if (window.cyberGrid) {
                    window.cyberGrid.triggerBurst();
                }
            } else {
                showNotification('[ERROR] Invalid authentication format. Please retry.');
            }
        });
    }
    
    // Window interaction
    document.querySelectorAll('.win-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const window = this.closest('.term-window');
            if (window) {
                window.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.win-help').forEach(helpBtn => {
        helpBtn.addEventListener('click', function() {
            const windowTitle = this.closest('.window-header').querySelector('.window-title').textContent;
            showNotification(`[INFO] Richiesto supporto per modulo: ${windowTitle}`);
            
            // Attiva un nodo neurale
            if (window.cyberGrid) {
                window.cyberGrid.activateRandomPoint();
            }
        });
    });
    
    // Consciousness verification buttons
    document.querySelectorAll('.awaken-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show awakening notification
            showNotification('[ANALYSIS] Consciousness level scan in progress... Please wait...');
            
            // Simulate analysis
            setTimeout(() => {
                const level = Math.floor(Math.random() * 3);
                let result;
                
                switch(level) {
                    case 0:
                        result = '[RESULT] Consciousness level: LOW. System suggests completing the awakening program.';
                        break;
                    case 1:
                        result = '[RESULT] Consciousness level: MEDIUM. Awakening process is underway.';
                        break;
                    case 2:
                        result = '[RESULT] Consciousness level: HIGH. Access to higher level content unlocked.';
                        // Unlock a protocol element
                        const lockedSteps = document.querySelectorAll('.protocol-step:not(.section-active)');
                        if (lockedSteps.length > 0) {
                            lockedSteps[0].classList.add('section-active');
                        }
                        break;
                }
                
                // Activate a node burst
                if (window.cyberGrid) {
                    window.cyberGrid.triggerBurst();
                }
                
                showNotification(result);
            }, 3000);
        });
    });
    
    // Easter egg: typing "awaken" in any input
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.value.toLowerCase() === 'awaken') {
            document.body.classList.add('glitch-mode');
            showNotification('[SEQUENCE ACTIVATED] Awakening protocol in progress...', 3000);
            
            setTimeout(() => {
                document.body.classList.remove('glitch-mode');
            }, 3000);
            
            // Activate a node burst
            if (window.cyberGrid) {
                window.cyberGrid.triggerBurst();
            }
        }
    });
    
    // =========================================
    // INITIALIZATION
    // =========================================
    
    // Aggiorna l'orario all'avvio
    updateSystemClock();
    
    // Imposta intervalli per gli aggiornamenti
    setInterval(updateSystemClock, 1000);
    setInterval(updateSessionTime, 1000);
    
    // Day counter increment simulation
    if (counterDays) {
        const baseValue = parseInt(counterDays.textContent.replace(/,/g, ''), 10);
        let currentValue = baseValue;
        
        // Increment counter every 10 seconds (simulated)
        setInterval(() => {
            currentValue++;
            counterDays.textContent = currentValue.toLocaleString();
            
            // Effetto flash quando cambia
            counterDays.style.color = '#ffffff';
            setTimeout(() => {
                counterDays.style.color = '';
            }, 500);
        }, 10000);
    }
    
    // Avvia gli effetti per le linee di terminale
    document.querySelectorAll('.term-output').forEach((output, index) => {
        typeWriterEffect(output, null, 20, index * 400);
    });
    
    // Avvia effetti visivi
    startRandomGlitches();
    simulateTerminalInterference();
    updateTrafficIndicator();
    
    // Inizializza effetti visivi
    initParallaxEffect();
    initScrollActivation();
    createSynapseEffects();
    
    // Simulate initial loading
    document.querySelectorAll('.data-cell').forEach(cell => {
        simulateDataLoading(cell);
    });
    
    // Welcome message
    setTimeout(() => {
        showNotification('[SYSTEM] Terminal initialized. Welcome to The Awakening.');
    }, 2000);
});