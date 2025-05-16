<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="confirm-dialog">
      <div class="confirm-icon" :class="type">
        <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h3 class="confirm-title">{{ title }}</h3>
      
      <div class="confirm-message">
        <slot>
          <p>{{ message }}</p>
          <p v-if="itemToConfirm" class="confirm-item">
            <strong>{{ itemToConfirm }}</strong>
          </p>
        </slot>
      </div>
      
      <div class="confirm-actions">
        <button class="btn-cancel" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button 
          class="btn-confirm" 
          :class="type"
          @click="$emit('confirm')"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="btn-spinner"></span>
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    /**
     * Dialog title
     */
    title: {
      type: String,
      default: "Confirm Action"
    },
    
    /**
     * Dialog message
     */
    message: {
      type: String,
      default: "Are you sure you want to proceed with this action?"
    },
    
    /**
     * Item to be confirmed (highlighted)
     */
    itemToConfirm: {
      type: String,
      default: ""
    },
    
    /**
     * Dialog type determines styling (colors, icons)
     * @values info, warning, danger
     */
    type: {
      type: String,
      default: "info",
      validator: (value) => ["info", "warning", "danger"].includes(value)
    },
    
    /**
     * Text for the confirmation button
     */
    confirmText: {
      type: String,
      default: "Confirm"
    },
    
    /**
     * Text for the cancel button
     */
    cancelText: {
      type: String,
      default: "Cancel"
    },
    
    /**
     * Whether the dialog is in loading state
     */
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["confirm", "cancel"],
  mounted() {
    // Prevent scrolling when dialog is open
    document.body.style.overflow = "hidden";
  },
  beforeUnmount() {
    // Restore scrolling when dialog is closed
    document.body.style.overflow = "";
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease-out;
}

.confirm-dialog {
  background-color: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease-out;
}

.confirm-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.confirm-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Icon variants */
.confirm-icon.info {
  background-color: #dbeafe;
  color: #2563eb;
}

.confirm-icon.warning {
  background-color: #fef3c7;
  color: #d97706;
}

.confirm-icon.danger {
  background-color: #fee2e2;
  color: #ef4444;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.confirm-message {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.confirm-item {
  word-break: break-word;
  margin-top: 0.5rem;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-confirm {
  border: 1px solid transparent;
  color: white;
  position: relative;
}

.btn-confirm.info {
  background-color: #2563eb;
}

.btn-confirm.info:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-confirm.warning {
  background-color: #d97706;
}

.btn-confirm.warning:hover:not(:disabled) {
  background-color: #b45309;
}

.btn-confirm.danger {
  background-color: #ef4444;
}

.btn-confirm.danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>