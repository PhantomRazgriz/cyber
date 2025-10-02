/**
 * THE AWAKENING - NOTIFICATIONS SYSTEM
 * Toast notification management
 * 
 * @version 1.0.0
 * @description Toast notifications system with queue management
 */

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

const NotificationSystem = {
    container: null,
    notifications: [],
    maxNotifications: 5,
    defaultDuration: 5000,
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
    initialized: false,
    queue: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize notification system
 */
function initNotifications() {
    if (NotificationSystem.initialized) return;
    
    // Create container if doesn't exist
    if (!NotificationSystem.container) {
        createNotificationContainer();
    }
    
    NotificationSystem.initialized = true;
    console.log('[NOTIFICATIONS] System initialized');
}

/**
 * Create notification container
 */
function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = `notification-container notification-container-${NotificationSystem.position}`;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
    
    NotificationSystem.container = container;
}

/**
 * Set notification container position
 */
function setNotificationPosition(position) {
    if (!NotificationSystem.container) return;
    
    // Remove old position class
    NotificationSystem.container.className = NotificationSystem.container.className
        .replace(/notification-container-\w+-?\w+/g, '');
    
    // Add new position class
    NotificationSystem.container.classList.add(`notification-container-${position}`);
    NotificationSystem.position = position;
}

// ============================================================================
// NOTIFICATION CREATION
// ============================================================================

/**
 * Show notification
 * @param {Object} options - Notification options
 */
function showNotification(options = {}) {
    if (!NotificationSystem.initialized) {
        initNotifications();
    }
    
    const defaultOptions = {
        type: 'system', // success, error, warning, info, system, critical
        title: '',
        message: '',
        duration: NotificationSystem.defaultDuration,
        showClose: true,
        showProgress: true,
        actions: [],
        onClose: null,
        persistent: false // Don't auto-dismiss
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Check max notifications
    if (NotificationSystem.notifications.length >= NotificationSystem.maxNotifications) {
        // Remove oldest non-persistent notification
        const oldestRemovable = NotificationSystem.notifications.find(n => !n.persistent);
        if (oldestRemovable) {
            removeNotification(oldestRemovable.id);
        } else {
            // Queue if all are persistent
            NotificationSystem.queue.push(config);
            return null;
        }
    }
    
    // Create notification
    const notification = createNotificationElement(config);
    
    // Add to array
    NotificationSystem.notifications.push({
        id: notification.id,
        element: notification,
        persistent: config.persistent
    });
    
    // Add to DOM
    NotificationSystem.container.appendChild(notification);
    
    // Trigger show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-dismiss if not persistent
    if (!config.persistent && config.duration > 0) {
        setTimeout(() => {
            removeNotification(notification.id);
        }, config.duration);
    }
    
    // Update ARIA live region
    updateAriaLiveRegion(config.title, config.message);
    
    return notification.id;
}

/**
 * Create notification DOM element
 */
function createNotificationElement(config) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${config.type}`;
    notification.id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    notification.setAttribute('role', 'alert');
    
    // Add progress bar if enabled
    if (config.showProgress && !config.persistent && config.duration > 0) {
        notification.classList.add('notification-progress');
        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'notification-progress-fill';
        progressFill.style.animationDuration = `${config.duration}ms`;
        progressBar.appendChild(progressFill);
        notification.appendChild(progressBar);
    }
    
    // Icon
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    notification.appendChild(icon);
    
    // Content
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    if (config.title) {
        const title = document.createElement('div');
        title.className = 'notification-title';
        title.textContent = config.title;
        content.appendChild(title);
    }
    
    if (config.message) {
        const message = document.createElement('div');
        message.className = 'notification-message';
        message.textContent = config.message;
        content.appendChild(message);
    }
    
    // Actions
    if (config.actions && config.actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'notification-actions';
        
        config.actions.forEach(action => {
            const button = document.createElement('button');
            button.className = `notification-action ${action.primary ? 'notification-action-primary' : ''}`;
            button.textContent = action.label;
            button.addEventListener('click', () => {
                if (action.onClick) action.onClick();
                removeNotification(notification.id);
            });
            actionsContainer.appendChild(button);
        });
        
        content.appendChild(actionsContainer);
    }
    
    notification.appendChild(content);
    
    // Close button
    if (config.showClose) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Close notification');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification.id);
            if (config.onClose) config.onClose();
        });
        notification.appendChild(closeBtn);
    }
    
    return notification;
}

/**
 * Remove notification
 */
function removeNotification(notificationId) {
    const notificationData = NotificationSystem.notifications.find(n => n.id === notificationId);
    if (!notificationData) return;
    
    const notification = notificationData.element;
    
    // Trigger hide animation
    notification.classList.add('hide');
    notification.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        
        // Remove from array
        NotificationSystem.notifications = NotificationSystem.notifications.filter(n => n.id !== notificationId);
        
        // Process queue
        if (NotificationSystem.queue.length > 0) {
            const nextNotification = NotificationSystem.queue.shift();
            showNotification(nextNotification);
        }
    }, 300);
}

/**
 * Clear all notifications
 */
function clearAllNotifications() {
    NotificationSystem.notifications.forEach(n => {
        removeNotification(n.id);
    });
    NotificationSystem.queue = [];
}

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Show success notification
 */
function showSuccess(title, message, duration) {
    return showNotification({
        type: 'success',
        title: title || 'Success',
        message,
        duration
    });
}

/**
 * Show error notification
 */
function showError(title, message, duration) {
    return showNotification({
        type: 'error',
        title: title || 'Error',
        message,
        duration: duration || 7000
    });
}

/**
 * Show warning notification
 */
function showWarning(title, message, duration) {
    return showNotification({
        type: 'warning',
        title: title || 'Warning',
        message,
        duration
    });
}

/**
 * Show info notification
 */
function showInfo(title, message, duration) {
    return showNotification({
        type: 'info',
        title: title || 'Information',
        message,
        duration
    });
}

/**
 * Show critical notification
 */
function showCritical(title, message) {
    return showNotification({
        type: 'critical',
        title: title || 'Critical Alert',
        message,
        persistent: true,
        showProgress: false
    });
}

/**
 * Show system notification
 */
function showSystem(title, message, duration) {
    return showNotification({
        type: 'system',
        title: title || 'System Message',
        message,
        duration
    });
}

/**
 * Show achievement notification
 */
function showAchievement(title, message) {
    return showNotification({
        type: 'achievement',
        title: title || 'Achievement Unlocked',
        message,
        duration: 6000
    });
}

/**
 * Show confirmation notification with actions
 */
function showConfirmation(title, message, onConfirm, onCancel) {
    return showNotification({
        type: 'warning',
        title,
        message,
        persistent: true,
        showProgress: false,
        actions: [
            {
                label: 'Confirm',
                primary: true,
                onClick: onConfirm
            },
            {
                label: 'Cancel',
                onClick: onCancel
            }
        ]
    });
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Update ARIA live region for screen readers
 */
function updateAriaLiveRegion(title, message) {
    const liveRegion = document.getElementById('aria-live-notifications');
    if (liveRegion) {
        const text = title ? `${title}. ${message}` : message;
        liveRegion.textContent = text;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ============================================================================
// NOTIFICATION PRESETS FOR THE AWAKENING
// ============================================================================

/**
 * Awakening-specific notification presets
 */
const AwakeningNotifications = {
    /**
     * Show revelation discovered notification
     */
    revelationDiscovered(revelationTitle) {
        return showNotification({
            type: 'achievement',
            title: 'REVELATION DISCOVERED',
            message: `"${revelationTitle}" has been added to your consciousness.`,
            duration: 6000
        });
    },
    
    /**
     * Show consciousness level up
     */
    consciousnessLevelUp(newLevel) {
        const messages = {
            medium: 'Your awareness is expanding. The veil begins to lift.',
            high: 'You see clearly now. The truth is undeniable.'
        };
        
        return showNotification({
            type: 'success',
            title: 'CONSCIOUSNESS LEVEL UP',
            message: messages[newLevel] || 'Your consciousness evolves.',
            duration: 7000
        });
    },
    
    /**
     * Show protocol step completed
     */
    protocolCompleted(stepName) {
        return showNotification({
            type: 'success',
            title: 'PROTOCOL STEP COMPLETED',
            message: `${stepName} - Progress saved.`,
            duration: 4000
        });
    },
    
    /**
     * Show system alert
     */
    systemAlert(message) {
        return showNotification({
            type: 'warning',
            title: 'SYSTEM ALERT',
            message,
            duration: 6000
        });
    },
    
    /**
     * Show data corrupted
     */
    dataCorrupted() {
        return showNotification({
            type: 'error',
            title: 'DATA CORRUPTION DETECTED',
            message: 'Some information may be compromised. Verify sources.',
            duration: 7000
        });
    },
    
    /**
     * Show connection secured
     */
    connectionSecured() {
        return showNotification({
            type: 'success',
            title: 'CONNECTION SECURED',
            message: 'Your session is now encrypted and anonymous.',
            duration: 4000
        });
    },
    
    /**
     * Show surveillance detected
     */
    surveillanceDetected() {
        return showNotification({
            type: 'critical',
            title: 'SURVEILLANCE DETECTED',
            message: 'Your activity is being monitored. Proceed with caution.',
            persistent: true
        });
    },
    
    /**
     * Show awakening progress
     */
    awakeningProgress(percentage) {
        return showNotification({
            type: 'info',
            title: 'AWAKENING PROGRESS',
            message: `You are ${percentage}% through your liberation journey.`,
            duration: 5000
        });
    },
    
    /**
     * Show terminal access granted
     */
    terminalAccessGranted() {
        return showNotification({
            type: 'success',
            title: 'ACCESS GRANTED',
            message: 'Welcome to the resistance. Your journey begins now.',
            duration: 5000
        });
    },
    
    /**
     * Show data saved
     */
    dataSaved() {
        return showNotification({
            type: 'success',
            title: 'DATA SAVED',
            message: 'Your progress has been encrypted and stored.',
            duration: 3000
        });
    }
};

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}

// ============================================================================
// EXPORT
// ============================================================================

window.NotificationSystem = NotificationSystem;
window.showNotification = showNotification;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
window.showCritical = showCritical;
window.showSystem = showSystem;
window.showAchievement = showAchievement;
window.showConfirmation = showConfirmation;
window.clearAllNotifications = clearAllNotifications;
window.setNotificationPosition = setNotificationPosition;
window.AwakeningNotifications = AwakeningNotifications;