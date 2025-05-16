<template>
  <button
    class="action-button"
    :class="[
      variant,
      size,
      { 'icon-only': iconOnly, 'is-loading': isLoading, 'is-circle': isCircle }
    ]"
    :disabled="disabled || isLoading"
    @click="$emit('click', $event)"
    :type="type"
  >
    <div v-if="isLoading" class="spinner"></div>
    <span v-else class="button-content">
      <slot name="icon"></slot>
      <span v-if="!iconOnly" class="button-text"><slot></slot></span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    /**
     * Button variant
     * @values primary, secondary, danger, ghost
     */
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
    },
    
    /**
     * Button size
     * @values small, medium, large
     */
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    
    /**
     * Whether the button should only show an icon
     */
    iconOnly: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether the button should be disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether the button should show a loading state
     */
    isLoading: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether the button should be circular
     */
    isCircle: {
      type: Boolean,
      default: false
    },
    
    /**
     * HTML button type
     */
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
}

/* Size variants */
.action-button.small {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.action-button.medium {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.action-button.large {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
}

/* Button with only icon */
.action-button.icon-only {
  padding: 0.5rem;
}

.action-button.icon-only.small {
  padding: 0.375rem;
}

.action-button.icon-only.large {
  padding: 0.625rem;
}

/* Circle button */
.action-button.is-circle {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
}

.action-button.is-circle.small {
  width: 2rem;
  height: 2rem;
}

.action-button.is-circle.large {
  width: 3rem;
  height: 3rem;
}

/* Button content */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  margin-left: 0.5rem;
}

.icon-only .button-text {
  margin-left: 0;
}

/* Loading spinner */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Variant styles */

/* Primary button */
.action-button.primary {
  background-color: #2563eb;
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.action-button.primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

/* Secondary button */
.action-button.secondary {
  background-color: white;
  color: #4b5563;
  border-color: #d1d5db;
}

.action-button.secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.action-button.secondary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.4);
}

/* Danger button */
.action-button.danger {
  background-color: #ef4444;
  color: white;
}

.action-button.danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.action-button.danger:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4);
}

/* Ghost button */
.action-button.ghost {
  background-color: transparent;
  color: #4b5563;
}

.action-button.ghost:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.action-button.ghost:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.4);
}

/* Disabled state */
.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>