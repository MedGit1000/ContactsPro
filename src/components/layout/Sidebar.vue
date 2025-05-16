<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">{{ title }}</h2>

      <div class="sidebar-search">
        <svg
          class="sidebar-search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          class="sidebar-search-input"
          placeholder="Search"
          v-model="searchTerm"
          @input="onSearch"
        />
        <button
          v-if="searchTerm"
          class="clear-search-btn"
          @click="clearSearch"
          title="Clear search"
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

      <div class="sidebar-filters">
        <slot name="filters"></slot>
      </div>
    </div>

    <div class="sidebar-content">
      <slot></slot>
    </div>

    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "Sidebar",
  props: {
    /**
     * Sidebar title
     */
    title: {
      type: String,
      default: "Contacts",
    },

    /**
     * Search term (for v-model)
     */
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "search", "clear-search"],
  setup(props, { emit }) {
    // Local search term
    const searchTerm = ref(props.modelValue);

    // Watch for external changes to modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        searchTerm.value = newValue;
      }
    );

    // Handle search input
    const onSearch = () => {
      emit("update:modelValue", searchTerm.value);
      emit("search", searchTerm.value);
    };

    // Clear search
    const clearSearch = () => {
      searchTerm.value = "";
      emit("update:modelValue", "");
      emit("clear-search");
    };

    return {
      searchTerm,
      onSearch,
      clearSearch,
    };
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f4f7;
  border-right: 1px solid #e5e7eb;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.sidebar-search {
  position: relative;
  margin-bottom: 0.75rem;
}

.sidebar-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.sidebar-search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
}

.sidebar-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn svg {
  width: 1rem;
  height: 1rem;
}

.sidebar-filters {
  margin-top: 0.75rem;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 50;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
