<template>
  <div class="loading-spinner" :class="[size, { overlay: isOverlay }]">
    <div class="spinner" :class="type" :style="{ color: color }"></div>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    /**
     * Type of spinner
     * @values bars, dots, circle
     */
    type: {
      type: String,
      default: "bars",
      validator: (value) => ["bars", "dots", "circle"].includes(value),
    },

    /**
     * Color of the spinner
     */
    color: {
      type: String,
      default: "#3b82f6", // Blue
    },

    /**
     * Size of the spinner
     * @values small, medium, large
     */
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },

    /**
     * Loading text
     */
    text: {
      type: String,
      default: "",
    },

    /**
     * Whether to display as an overlay
     */
    isOverlay: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 50;
}

.spinner {
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

/* Sizes */
.loading-spinner.small .spinner {
  width: 1.5rem;
  height: 1.5rem;
}

.loading-spinner.medium .spinner {
  width: 2.5rem;
  height: 2.5rem;
}

.loading-spinner.large .spinner {
  width: 3.5rem;
  height: 3.5rem;
}

/* Spinner text */
.spinner-text {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
}

/* Spinner types */
.spinner.bars {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
}

.spinner.bars:before,
.spinner.bars:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: currentColor;
}

.spinner.bars:before {
  z-index: 100;
  animation: spin 1s infinite;
}

.spinner.bars:after {
  border: 3px solid rgba(0, 0, 0, 0.1);
}

.spinner.dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.spinner.dots:before,
.spinner.dots:after,
.spinner.dots {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.7;
  animation: pulse 1.4s infinite ease-in-out;
}

.spinner.dots:before {
  animation-delay: -0.32s;
}

.spinner.dots:after {
  animation-delay: 0.32s;
}

.spinner.circle {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
