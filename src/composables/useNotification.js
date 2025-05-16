// src/composables/useNotification.js

import { ref, watch } from 'vue';

/**
 * Composable for managing notifications in the application
 */
export function useNotification() {
    const successMessage = ref('');
    const errorMessage = ref('');

    // Auto clear success message after delay
    watch(successMessage, (newValue) => {
        if (newValue) {
            const timer = setTimeout(() => {
                successMessage.value = '';
            }, 5000);

            // Clean up timer
            return () => clearTimeout(timer);
        }
    });

    // Auto clear error message after delay
    watch(errorMessage, (newValue) => {
        if (newValue) {
            const timer = setTimeout(() => {
                errorMessage.value = '';
            }, 5000);

            // Clean up timer
            return () => clearTimeout(timer);
        }
    });

    /**
     * Show success notification
     * @param {string} message - Success message to display
     * @param {number} [duration=5000] - Duration in ms
     */
    const showSuccess = (message, duration = 5000) => {
        successMessage.value = message;

        if (duration !== 5000) {
            setTimeout(() => {
                successMessage.value = '';
            }, duration);
        }
    };

    /**
     * Show error notification
     * @param {string} message - Error message to display
     * @param {number} [duration=5000] - Duration in ms
     */
    const showError = (message, duration = 5000) => {
        errorMessage.value = message;

        if (duration !== 5000) {
            setTimeout(() => {
                errorMessage.value = '';
            }, duration);
        }
    };

    /**
     * Clear all notifications
     */
    const clearNotifications = () => {
        successMessage.value = '';
        errorMessage.value = '';
    };

    return {
        successMessage,
        errorMessage,
        showSuccess,
        showError,
        clearNotifications
    };
}