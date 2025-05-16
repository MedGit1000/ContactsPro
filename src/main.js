// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/base.css'

// Create Vue application
const app = createApp(App);

// Custom directive for autofocus
app.directive('focus', {
    mounted(el) {
        el.focus();
    }
});

// Global error handler
app.config.errorHandler = (err, vm, info) => {
    console.error('Application error:', err);
    console.error('Info:', info);

    // In production, you might want to send errors to a monitoring service like Sentry
    if (process.env.NODE_ENV === 'production') {
        // sendToErrorMonitoring(err, info);
    }
};

// Performance tracking in development
if (process.env.NODE_ENV === 'development') {
    app.config.performance = true;
}

// Mount the application
app.mount('#app');

console.log('Contact Manager application started successfully!');