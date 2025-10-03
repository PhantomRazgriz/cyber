/**
 * THE AWAKENING - VALIDATION SYSTEM
 * Complete step validation with mandatory input enforcement
 * 
 * @version 2.0.0
 * @description Robust validation system preventing progression without complete input
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

const AwakeningState = {
    currentStep: 0,
    completedSteps: 0,
    stepData: {
        1: {},
        2: {},
        3: {},
        4: {}
    },
    validationListeners: {}
};

// ============================================================================
// STEP CONFIGURATION
// ============================================================================

const StepConfig = {
    1: {
        name: 'Recognition',
        requiredFields: [
            { id: 'step1-q1', type: 'text', minLength: 3, label: 'First check habit' },
            { id: 'step1-q2', type: 'text', minLength: 1, label: 'Daily screen time' },
            { id: 'step1-q3', type: 'textarea', minLength: 10, label: 'Last offline moment' }
        ]
    },
    2: {
        name: 'Awareness',
        requiredFields: [
            { id: 'step2-q1', type: 'textarea', minLength: 10, label: 'Apps tracking you' },
            { id: 'step2-q2', type: 'textarea', minLength: 10, label: 'Data shared' },
            { id: 'step2-q3', type: 'textarea', minLength: 10, label: 'Life without tracking' }
        ]
    },
    3: {
        name: 'Resistance',
        requiredFields: [
            { id: 'step3-q1', type: 'text', minLength: 3, label: 'Hardest app to quit' },
            { id: 'step3-q2', type: 'textarea', minLength: 10, label: 'Emotional triggers' },
            { id: 'step3-q3', type: 'textarea', minLength: 15, label: 'Concrete action' }
        ]
    },
    4: {
        name: 'Liberation',
        requiredFields: [
            { id: 'step4-q1', type: 'textarea', minLength: 20, label: 'Personal manifesto' },
            { id: 'step4-q2', type: 'textarea', minLength: 30, label: 'Three actions' },
            { id: 'step4-q3', type: 'text', minLength: 3, label: 'Accountability person' },
            { id: 'step4-commitment', type: 'checkbox', label: 'Final commitment' }
        ]
    }
};

// ============================================================================
// VALIDATION CORE
// ============================================================================

/**
 * Validate a single field
 */
function validateField(fieldConfig) {
    const element = document.getElementById(fieldConfig.id);
    if (!element) return false;

    let isValid = false;

    switch (fieldConfig.type) {
        case 'text':
        case 'textarea':
            const value = element.value.trim();
            isValid = value.length >= fieldConfig.minLength;
            break;
        case 'checkbox':
            isValid = element.checked;
            break;
        default:
            isValid = false;
    }

    // Apply visual feedback
    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
    }

    return isValid;
}

/**
 * Validate entire step
 */
function validateStep(stepNumber) {
    const config = StepConfig[stepNumber];
    if (!config) return false;

    let allValid = true;
    let validCount = 0;
    const totalFields = config.requiredFields.length;

    // Validate each field
    config.requiredFields.forEach(fieldConfig => {
        const isValid = validateField(fieldConfig);
        if (isValid) {
            validCount++;
            // Save field data
            const element = document.getElementById(fieldConfig.id);
            if (element.type === 'checkbox') {
                AwakeningState.stepData[stepNumber][fieldConfig.id] = element.checked;
            } else {
                AwakeningState.stepData[stepNumber][fieldConfig.id] = element.value.trim();
            }
        } else {
            allValid = false;
        }
    });

    // Update validation counter
    updateValidationCounter(stepNumber, validCount, totalFields);

    // Update complete button state
    updateCompleteButton(stepNumber, allValid);

    // Update progress bar on validation counter
    updateValidationProgress(stepNumber, validCount, totalFields);

    return allValid;
}

/**
 * Update validation counter display
 */
function updateValidationCounter(stepNumber, validCount, totalCount) {
    const counter = document.getElementById(`step-${stepNumber}-validation-counter`);
    if (!counter) return;

    counter.textContent = `${validCount}/${totalCount} fields completed`;
    
    // Update color based on progress
    if (validCount === 0) {
        counter.style.color = 'var(--error)';
    } else if (validCount < totalCount) {
        counter.style.color = 'var(--warning)';
    } else {
        counter.style.color = 'var(--success)';
    }

    // Add celebration effect when complete
    const counterParent = counter.parentElement;
    if (validCount === totalCount) {
        counterParent.classList.add('complete', 'celebration');
        setTimeout(() => counterParent.classList.remove('celebration'), 600);
    } else {
        counterParent.classList.remove('complete');
    }

    // Update CSS variable for progress bar
    const percentage = (validCount / totalCount) * 100;
    counterParent.style.setProperty('--progress', `${percentage}%`);
}

/**
 * Update validation progress bar
 */
function updateValidationProgress(stepNumber, validCount, totalCount) {
    const progressBar = document.getElementById(`step-${stepNumber}-progress-bar`);
    if (!progressBar) return;

    const percentage = (validCount / totalCount) * 100;
    progressBar.style.setProperty('--progress', `${percentage}%`);
}

/**
 * Update complete button state
 */
function updateCompleteButton(stepNumber, isEnabled) {
    const button = document.getElementById(`complete-step-${stepNumber}`);
    if (!button) return;

    button.disabled = !isEnabled;
    button.style.opacity = isEnabled ? '1' : '0.5';
    button.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
    
    if (isEnabled) {
        button.classList.add('ready');
    } else {
        button.classList.remove('ready');
    }
}

/**
 * Attach validation listeners to step fields
 */
function attachValidationListeners(stepNumber) {
    const config = StepConfig[stepNumber];
    if (!config) return;

    // Remove existing listeners to prevent duplicates
    if (AwakeningState.validationListeners[stepNumber]) {
        AwakeningState.validationListeners[stepNumber].forEach(({ element, handler, event }) => {
            element.removeEventListener(event, handler);
        });
    }

    AwakeningState.validationListeners[stepNumber] = [];

    config.requiredFields.forEach(fieldConfig => {
        const element = document.getElementById(fieldConfig.id);
        if (!element) return;

        const eventType = fieldConfig.type === 'checkbox' ? 'change' : 'input';
        const handler = () => validateStep(stepNumber);

        element.addEventListener(eventType, handler);
        
        // Store for cleanup
        AwakeningState.validationListeners[stepNumber].push({
            element,
            handler,
            event: eventType
        });
    });

    // Initial validation
    setTimeout(() => validateStep(stepNumber), 100);
}

// ============================================================================
// STEP MANAGEMENT
// ============================================================================

/**
 * Start a step
 */
function startStep(stepNumber) {
    // Check if previous steps are completed
    if (stepNumber > 1 && AwakeningState.completedSteps < stepNumber - 1) {
        showBlockedStepWarning(stepNumber);
        return;
    }

    AwakeningState.currentStep = stepNumber;
    
    // Show step content area
    const contentArea = document.getElementById('step-content-area');
    if (contentArea) {
        contentArea.style.display = 'block';
    }
    
    // Hide all step contents
    document.querySelectorAll('.step-content-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current step content
    const stepContent = document.getElementById(`step-${stepNumber}-content`);
    if (stepContent) {
        stepContent.style.display = 'block';
    }
    
    // Attach validation listeners
    attachValidationListeners(stepNumber);
    
    // Update system status
    updateSystemStatus('IN PROGRESS');
    
    // Update protocol status
    const protocolStatus = document.getElementById('protocol-status');
    if (protocolStatus) {
        protocolStatus.textContent = 'ACTIVE';
    }
    
    // Scroll to step content
    scrollToElement('#step-content-area', 100);
    
    // Show notification
    if (typeof showInfo === 'function') {
        showInfo('STEP INITIATED', `Beginning Step ${stepNumber}: ${StepConfig[stepNumber].name}`, 4000);
    }
    
    // Apply glitch effect
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (stepElement && typeof applyGlitch === 'function') {
        applyGlitch(stepElement, 300);
    }
}

/**
 * Attempt to complete a step
 */
function completeStep(stepNumber) {
    // CRITICAL: Validate before allowing completion
    const isValid = validateStep(stepNumber);
    
    if (!isValid) {
        handleIncompleteAttempt(stepNumber);
        return;
    }

    // Mark step as completed
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (stepEl) {
        stepEl.classList.remove('active', 'incomplete-attempt');
        stepEl.classList.add('completed');
    }
    
    AwakeningState.completedSteps++;
    
    // Save to localStorage
    saveAwakeningProgress();
    
    // Update progress
    updateProgressBar();
    
    // Unlock next step
    if (stepNumber < 4) {
        unlockNextStep(stepNumber);
    }
    
    // Hide step content
    closeStepContent();
    
    // Show completion notification
    if (typeof showSuccess === 'function') {
        showSuccess(
            'STEP COMPLETED',
            `Step ${stepNumber}: ${StepConfig[stepNumber].name} completed successfully.`,
            4000
        );
    }
    
    // Update consciousness level
    updateConsciousnessLevel();
    
    // Check if all steps completed
    if (AwakeningState.completedSteps === 4) {
        handleAwakeningComplete();
    }
    
    // Scroll back to protocol steps
    scrollToElement('.protocol-steps', 100);
}

/**
 * Handle incomplete attempt
 */
function handleIncompleteAttempt(stepNumber) {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    const button = document.getElementById(`complete-step-${stepNumber}`);
    
    // Apply incomplete animation to step
    if (stepEl) {
        stepEl.classList.add('incomplete-attempt');
        setTimeout(() => stepEl.classList.remove('incomplete-attempt'), 500);
    }
    
    // Apply glitch effect to button
    if (button && typeof applyIntenseGlitch === 'function') {
        applyIntenseGlitch(button, 500);
    }
    
    // Show error notification
    if (typeof showError === 'function') {
        showError(
            '⚠ INCOMPLETE DATA',
            'All fields must be completed before progressing. The truth requires your full commitment.',
            5000
        );
    }
    
    // Scroll to first invalid field
    scrollToFirstInvalidField(stepNumber);
}

/**
 * Scroll to first invalid field
 */
function scrollToFirstInvalidField(stepNumber) {
    const config = StepConfig[stepNumber];
    if (!config) return;

    for (let fieldConfig of config.requiredFields) {
        const element = document.getElementById(fieldConfig.id);
        if (element && element.classList.contains('invalid')) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            break;
        }
    }
}

/**
 * Show blocked step warning
 */
function showBlockedStepWarning(stepNumber) {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (stepEl) {
        stepEl.classList.add('blocked');
        setTimeout(() => stepEl.classList.remove('blocked'), 2000);
    }

    if (typeof showWarning === 'function') {
        showWarning(
            'STEP LOCKED',
            `Complete Step ${stepNumber - 1} before accessing this step.`,
            4000
        );
    }
}

/**
 * Unlock next step
 */
function unlockNextStep(currentStepNumber) {
    const nextStep = document.getElementById(`step-${currentStepNumber + 1}`);
    if (!nextStep) return;
    
    nextStep.classList.add('unlocking');
    
    setTimeout(() => {
        nextStep.classList.remove('locked', 'unlocking');
        
        // Apply glitch effect
        if (typeof applyIntenseGlitch === 'function') {
            applyIntenseGlitch(nextStep, 500);
        }
        
        // Show unlock notification
        if (typeof showInfo === 'function') {
            showInfo(
                '🔓 STEP UNLOCKED',
                `Step ${currentStepNumber + 1}: ${StepConfig[currentStepNumber + 1].name} is now available.`,
                4000
            );
        }
    }, 300);
}

/**
 * Close step content
 */
function closeStepContent() {
    const contentArea = document.getElementById('step-content-area');
    if (contentArea) {
        contentArea.style.display = 'none';
    }
    AwakeningState.currentStep = 0;
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

/**
 * Update progress bar
 */
function updateProgressBar() {
    const progress = (AwakeningState.completedSteps / 4) * 100;
    
    const progressText = document.getElementById('awakening-progress');
    if (progressText) {
        progressText.textContent = `${progress}%`;
    }
    
    const progressBar = document.getElementById('awakening-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        
        // Add milestone class
        const progressContainer = document.querySelector('.protocol-progress');
        if (progressContainer) {
            progressContainer.classList.add(`milestone-${progress}`);
            setTimeout(() => {
                progressContainer.classList.remove(`milestone-${progress}`);
            }, 1000);
        }
    }
    
    const stepsCompleted = document.getElementById('steps-completed');
    if (stepsCompleted) {
        stepsCompleted.textContent = AwakeningState.completedSteps;
    }
}

/**
 * Update consciousness level
 */
function updateConsciousnessLevel() {
    let level = 'LOW';
    let cssClass = 'warning';
    
    if (AwakeningState.completedSteps >= 4) {
        level = 'HIGH';
        cssClass = 'success';
    } else if (AwakeningState.completedSteps >= 2) {
        level = 'MEDIUM';
        cssClass = 'active';
    }
    
    const consciousnessEl = document.getElementById('consciousness-level');
    if (consciousnessEl) {
        consciousnessEl.textContent = level;
        consciousnessEl.className = `status-value ${cssClass}`;
    }
}

/**
 * Update system status
 */
function updateSystemStatus(status) {
    const systemStatus = document.querySelector('.system-status-value');
    if (systemStatus) {
        systemStatus.textContent = status;
    }
}

/**
 * Handle awakening complete
 */
function handleAwakeningComplete() {
    updateConsciousnessLevel();
    
    setTimeout(() => {
        if (typeof showAlert === 'function') {
            showAlert(
                '✓ AWAKENING COMPLETE',
                'You have completed the awakening sequence. Your consciousness has been elevated. Continue to the Liberation Protocol to take action.',
                () => {
                    window.location.href = 'liberation.html';
                }
            );
        }
    }, 2000);
}

// ============================================================================
// DATA PERSISTENCE
// ============================================================================

/**
 * Save awakening progress to localStorage
 */
function saveAwakeningProgress() {
    try {
        const data = {
            completedSteps: AwakeningState.completedSteps,
            stepData: AwakeningState.stepData,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('awakening_progress', JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

/**
 * Load awakening progress from localStorage
 */
function loadAwakeningProgress() {
    try {
        const saved = localStorage.getItem('awakening_progress');
        if (saved) {
            const data = JSON.parse(saved);
            AwakeningState.completedSteps = data.completedSteps || 0;
            AwakeningState.stepData = data.stepData || { 1: {}, 2: {}, 3: {}, 4: {} };
            
            // Update UI to reflect loaded state
            updateProgressBar();
            updateConsciousnessLevel();
            
            // Mark completed steps
            for (let i = 1; i <= AwakeningState.completedSteps; i++) {
                const stepEl = document.getElementById(`step-${i}`);
                if (stepEl) {
                    stepEl.classList.remove('active', 'locked');
                    stepEl.classList.add('completed');
                }
            }
            
            // Unlock next step if not all completed
            if (AwakeningState.completedSteps < 4) {
                const nextStep = document.getElementById(`step-${AwakeningState.completedSteps + 1}`);
                if (nextStep) {
                    nextStep.classList.remove('locked');
                    nextStep.classList.add('active');
                }
            }
        }
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Scroll to element
 */
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize awakening sequence
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('[AWAKENING] Validation system initialized');
    
    // Load saved progress
    loadAwakeningProgress();
    
    // Show initial warning modal after 2 seconds (if not already completed)
    if (AwakeningState.completedSteps === 0) {
        setTimeout(() => {
            if (typeof showConfirm === 'function') {
                showConfirm(
                    '⚠ BEGIN AWAKENING?',
                    'This sequence will permanently change how you see your digital life. Once you begin, there is no going back to ignorance. Do you wish to proceed?',
                    () => {
                        if (typeof showSuccess === 'function') {
                            showSuccess('ACCESS GRANTED', 'Your awakening journey begins now.', 4000);
                        }
                        
                        // Update connection status
                        const connStatus = document.querySelector('.connection-status');
                        if (connStatus) {
                            connStatus.textContent = 'CONNECTED';
                            connStatus.classList.remove('connection-unstable');
                        }
                        
                        // Activate RX indicator
                        const rxIndicator = document.querySelector('.indicator-rx');
                        if (rxIndicator) {
                            rxIndicator.classList.add('active');
                        }
                    },
                    () => {
                        if (typeof showWarning === 'function') {
                            showWarning('SEQUENCE POSTPONED', 'The truth will be waiting when you\'re ready.', 5000);
                        }
                    }
                );
            }
        }, 2000);
    }
});

// Make functions globally available
window.startStep = startStep;
window.completeStep = completeStep;
window.closeStepContent = closeStepContent;