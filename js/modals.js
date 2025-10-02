/**
 * THE AWAKENING - MODALS SYSTEM
 * Modal dialog management with focus trap and accessibility
 * 
 * @version 1.0.0
 * @description Complete modal management system
 */

// ============================================================================
// MODAL SYSTEM
// ============================================================================

const ModalSystem = {
    activeModals: [],
    initialized: false,
    focusableSelectors: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    lastFocusedElement: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize modal system
 */
function initModals() {
    if (ModalSystem.initialized) return;
    
    // Add event listeners to all modal triggers
    const triggers = document.querySelectorAll('[data-modal-target]');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            openModal(targetId);
        });
    });
    
    // Add event listeners to all modal close buttons
    const closeBtns = document.querySelectorAll('.modal-close, [data-modal-close]');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });
    
    // Close modal on overlay click
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
    
    // Keyboard events
    document.addEventListener('keydown', handleModalKeyboard);
    
    ModalSystem.initialized = true;
    console.log('[MODALS] System initialized');
}

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================

/**
 * Open modal by ID or element
 */
function openModal(modalIdOrElement) {
    const modal = typeof modalIdOrElement === 'string'
        ? document.getElementById(modalIdOrElement) || document.querySelector(modalIdOrElement)
        : modalIdOrElement;
    
    if (!modal) {
        console.error('[MODALS] Modal not found:', modalIdOrElement);
        return false;
    }
    
    // Store last focused element
    ModalSystem.lastFocusedElement = document.activeElement;
    
    // Add to active modals
    ModalSystem.activeModals.push(modal);
    
    // Add active class
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    // Set aria attributes
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal')?.setAttribute('role', 'dialog');
    modal.querySelector('.modal')?.setAttribute('aria-modal', 'true');
    
    // Focus first focusable element
    setTimeout(() => {
        focusFirstElement(modal);
    }, 100);
    
    // Setup focus trap
    setupFocusTrap(modal);
    
    // Dispatch event
    modal.dispatchEvent(new CustomEvent('modalOpened'));
    
    console.log('[MODALS] Modal opened:', modal.id);
    return true;
}

/**
 * Close modal
 */
function closeModal(modalIdOrElement) {
    const modal = typeof modalIdOrElement === 'string'
        ? document.getElementById(modalIdOrElement) || document.querySelector(modalIdOrElement)
        : modalIdOrElement;
    
    if (!modal) return false;
    
    // Remove active class
    modal.classList.remove('active');
    
    // Set aria attributes
    modal.setAttribute('aria-hidden', 'true');
    
    // Remove from active modals
    ModalSystem.activeModals = ModalSystem.activeModals.filter(m => m !== modal);
    
    // Restore body scroll if no modals are open
    if (ModalSystem.activeModals.length === 0) {
        document.body.classList.remove('modal-open');
        
        // Restore focus to last focused element
        if (ModalSystem.lastFocusedElement) {
            ModalSystem.lastFocusedElement.focus();
            ModalSystem.lastFocusedElement = null;
        }
    }
    
    // Dispatch event
    modal.dispatchEvent(new CustomEvent('modalClosed'));
    
    console.log('[MODALS] Modal closed:', modal.id);
    return true;
}

/**
 * Toggle modal
 */
function toggleModal(modalIdOrElement) {
    const modal = typeof modalIdOrElement === 'string'
        ? document.getElementById(modalIdOrElement)
        : modalIdOrElement;
    
    if (!modal) return false;
    
    if (modal.classList.contains('active')) {
        return closeModal(modal);
    } else {
        return openModal(modal);
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    ModalSystem.activeModals.forEach(modal => {
        closeModal(modal);
    });
}

/**
 * Get active modal
 */
function getActiveModal() {
    return ModalSystem.activeModals[ModalSystem.activeModals.length - 1] || null;
}

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

/**
 * Focus first focusable element in modal
 */
function focusFirstElement(modal) {
    const focusableElements = modal.querySelectorAll(ModalSystem.focusableSelectors);
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

/**
 * Setup focus trap for modal
 */
function setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(ModalSystem.focusableSelectors);
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store reference for removal later
    modal._focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        
        // If modal is not active, don't trap
        if (!modal.classList.contains('active')) return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };
    
    modal.addEventListener('keydown', modal._focusTrapHandler);
}

/**
 * Remove focus trap
 */
function removeFocusTrap(modal) {
    if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        delete modal._focusTrapHandler;
    }
}

// ============================================================================
// KEYBOARD HANDLING
// ============================================================================

/**
 * Handle keyboard events for modals
 */
function handleModalKeyboard(e) {
    const activeModal = getActiveModal();
    if (!activeModal) return;
    
    // Escape key closes modal
    if (e.key === 'Escape') {
        closeModal(activeModal);
    }
}

// ============================================================================
// DYNAMIC MODAL CREATION
// ============================================================================

/**
 * Create modal dynamically
 */
function createModal(options = {}) {
    const defaults = {
        id: `modal-${Date.now()}`,
        title: '',
        content: '',
        type: '', // alert, success, warning, error, info
        size: 'md', // sm, md, lg, xl, full
        showClose: true,
        buttons: [],
        onOpen: null,
        onClose: null,
        closeOnOverlay: true
    };
    
    const config = { ...defaults, ...options };
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = config.id;
    overlay.setAttribute('aria-hidden', 'true');
    
    if (!config.closeOnOverlay) {
        overlay.addEventListener('click', (e) => e.stopPropagation());
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = `modal modal-${config.size}`;
    if (config.type) {
        modal.classList.add(`modal-${config.type}`);
    }
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'modal-title';
    titleDiv.textContent = config.title;
    header.appendChild(titleDiv);
    
    if (config.showClose) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.setAttribute('aria-label', 'Close modal');
        closeBtn.addEventListener('click', () => {
            closeModal(overlay);
            if (config.onClose) config.onClose();
        });
        header.appendChild(closeBtn);
    }
    
    modal.appendChild(header);
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (typeof config.content === 'string') {
        body.innerHTML = config.content;
    } else if (config.content instanceof HTMLElement) {
        body.appendChild(config.content);
    }
    
    modal.appendChild(body);
    
    // Create footer if buttons exist
    if (config.buttons.length > 0) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        config.buttons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.className = `btn ${buttonConfig.class || 'btn-primary'}`;
            button.textContent = buttonConfig.text;
            
            button.addEventListener('click', () => {
                if (buttonConfig.onClick) {
                    buttonConfig.onClick();
                }
                if (buttonConfig.closeOnClick !== false) {
                    closeModal(overlay);
                }
            });
            
            footer.appendChild(button);
        });
        
        modal.appendChild(footer);
    }
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
    if (config.onOpen) {
        overlay.addEventListener('modalOpened', config.onOpen);
    }
    if (config.onClose) {
        overlay.addEventListener('modalClosed', config.onClose);
    }
    
    return overlay;
}

/**
 * Remove modal from DOM
 */
function destroyModal(modalIdOrElement) {
    const modal = typeof modalIdOrElement === 'string'
        ? document.getElementById(modalIdOrElement)
        : modalIdOrElement;
    
    if (!modal) return false;
    
    // Close first
    closeModal(modal);
    
    // Remove focus trap
    removeFocusTrap(modal);
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
    
    return true;
}

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Show alert modal
 */
function showAlert(title, message, onClose) {
    const modal = createModal({
        title,
        content: `<p>${message}</p>`,
        type: 'alert',
        buttons: [
            {
                text: 'OK',
                class: 'btn-primary',
                onClick: onClose
            }
        ]
    });
    
    openModal(modal);
    return modal;
}

/**
 * Show confirm modal
 */
function showConfirm(title, message, onConfirm, onCancel) {
    const modal = createModal({
        title,
        content: `<p>${message}</p>`,
        type: 'warning',
        buttons: [
            {
                text: 'Confirm',
                class: 'btn-primary',
                onClick: () => {
                    if (onConfirm) onConfirm();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                onClick: () => {
                    if (onCancel) onCancel();
                }
            }
        ]
    });
    
    openModal(modal);
    return modal;
}

/**
 * Show prompt modal
 */
function showPrompt(title, message, defaultValue = '', onSubmit, onCancel) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input';
    input.value = defaultValue;
    input.placeholder = message;
    
    const container = document.createElement('div');
    container.innerHTML = `<p>${message}</p>`;
    container.appendChild(input);
    
    const modal = createModal({
        title,
        content: container,
        type: 'info',
        buttons: [
            {
                text: 'Submit',
                class: 'btn-primary',
                onClick: () => {
                    if (onSubmit) onSubmit(input.value);
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                onClick: () => {
                    if (onCancel) onCancel();
                }
            }
        ]
    });
    
    openModal(modal);
    
    // Focus input
    setTimeout(() => input.focus(), 100);
    
    return modal;
}

/**
 * Show loading modal
 */
function showLoading(title = 'Loading', message = 'Please wait...') {
    const modal = createModal({
        id: 'loading-modal',
        title,
        content: `
            <div class="modal-loading-spinner"></div>
            <div class="modal-loading-text">${message}</div>
        `,
        showClose: false,
        closeOnOverlay: false
    });
    
    modal.classList.add('modal-loading');
    openModal(modal);
    return modal;
}

/**
 * Hide loading modal
 */
function hideLoading() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        destroyModal(loadingModal);
    }
}

// ============================================================================
// AWAKENING-SPECIFIC MODALS
// ============================================================================

const AwakeningModals = {
    /**
     * Show revelation detail modal
     */
    showRevelation(revelation) {
        const modal = createModal({
            title: revelation.title,
            content: `
                <div class="revelation-modal-content">
                    <div class="revelation-category">${revelation.category}</div>
                    <div class="revelation-description">${revelation.description}</div>
                    ${revelation.evidence ? `<div class="revelation-evidence">
                        <h4>Evidence:</h4>
                        <ul>${revelation.evidence.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>` : ''}
                    ${revelation.source ? `<div class="revelation-source">Source: ${revelation.source}</div>` : ''}
                </div>
            `,
            size: 'lg',
            type: 'info',
            buttons: [
                {
                    text: 'Close',
                    class: 'btn-primary'
                }
            ]
        });
        
        openModal(modal);
        return modal;
    },
    
    /**
     * Show consciousness assessment
     */
    showConsciousnessAssessment() {
        const modal = createModal({
            title: 'CONSCIOUSNESS ASSESSMENT',
            content: `
                <div class="assessment-content">
                    <p>Answer honestly to measure your current level of digital awareness.</p>
                    <div class="assessment-questions">
                        <!-- Questions would be dynamically generated -->
                        <p>Assessment interface would go here...</p>
                    </div>
                </div>
            `,
            size: 'lg',
            buttons: [
                {
                    text: 'Start Assessment',
                    class: 'btn-primary'
                },
                {
                    text: 'Later',
                    class: 'btn-secondary'
                }
            ]
        });
        
        openModal(modal);
        return modal;
    },
    
    /**
     * Show protocol instructions
     */
    showProtocolInstructions(step) {
        const modal = createModal({
            title: `PROTOCOL STEP ${step.number}`,
            content: `
                <div class="protocol-instructions">
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                    <div class="protocol-actions">
                        ${step.actions.map(a => `<p>▸ ${a}</p>`).join('')}
                    </div>
                </div>
            `,
            type: 'info',
            buttons: [
                {
                    text: 'Begin',
                    class: 'btn-primary'
                }
            ]
        });
        
        openModal(modal);
        return modal;
    },
    
    /**
     * Show terminal access
     */
    showTerminalAccess() {
        return showConfirm(
            'TERMINAL ACCESS',
            'You are about to access restricted information. This cannot be undone. Continue?',
            () => {
                console.log('[AWAKENING] Terminal access granted');
                AwakeningNotifications.terminalAccessGranted();
            }
        );
    },
    
    /**
     * Show data corruption warning
     */
    showDataCorruptionWarning() {
        return showAlert(
            'DATA CORRUPTION WARNING',
            'Some files may be compromised. Verify all sources before proceeding.',
            () => {
                console.log('[AWAKENING] Data corruption acknowledged');
            }
        );
    }
};

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
} else {
    initModals();
}

// ============================================================================
// EXPORT
// ============================================================================

window.ModalSystem = ModalSystem;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleModal = toggleModal;
window.closeAllModals = closeAllModals;
window.createModal = createModal;
window.destroyModal = destroyModal;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.AwakeningModals = AwakeningModals;