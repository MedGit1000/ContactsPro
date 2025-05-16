<template>
  <div
    v-if="show"
    class="modal-overlay"
    @click.self="$emit('close')"
    :class="{ 'modal-fade-in': show }"
  >
    <div class="modal-container" :class="[size, { 'modal-slide-in': show }]">
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button
          class="modal-close-btn"
          @click="$emit('close')"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    /**
     * Modal title
     */
    title: {
      type: String,
      required: true,
    },

    /**
     * Whether the modal is visible
     */
    show: {
      type: Boolean,
      default: false,
    },

    /**
     * Modal size
     * @values small, medium, large
     */
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },
  },
  emits: ["close"],
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
      } else {
        document.body.style.overflow = ""; // Restore scrolling
      }
    },
  },
  unmounted() {
    document.body.style.overflow = ""; // Ensure scrolling is restored
  },
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
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.modal-fade-in {
  opacity: 1;
}

.modal-container {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  transition: transform 0.2s ease-in-out;
}

.modal-slide-in {
  transform: translateY(0);
}

.modal-container.small {
  width: 90%;
  max-width: 400px;
}

.modal-container.medium {
  width: 90%;
  max-width: 550px;
}

.modal-container.large {
  width: 90%;
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s;
}

.modal-close-btn:hover {
  background-color: #f3f4f6;
}

.modal-close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .modal-container.small,
  .modal-container.medium,
  .modal-container.large {
    width: 95%;
    max-height: 85vh;
  }
}
</style>
