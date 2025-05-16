<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title">{{ title }}</h1>
    </div>

    <div class="header-center">
      <div v-if="showSearch" class="search-input-wrapper">
        <svg
          class="search-icon"
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
          class="search-input"
          :placeholder="searchPlaceholder"
          v-model="searchTerm"
          @input="onSearchInput"
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
    </div>

    <div class="header-right">
      <slot name="actions">
        <button class="add-btn" @click="$emit('add')" v-if="showAddButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {{ addButtonText }}
        </button>
        <button
          class="view-all-btn"
          @click="$emit('view-all')"
          title="View All Contacts"
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>View All</span>
        </button>
        <button
          class="settings-btn"
          @click="$emit('settings')"
          title="Settings"
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
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            ></path>
          </svg>
        </button>
      </slot>
    </div>
  </header>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "AppHeader",
  props: {
    /**
     * App header title
     */
    title: {
      type: String,
      default: "Contacts",
    },

    /**
     * Whether to show the search input
     */
    showSearch: {
      type: Boolean,
      default: true,
    },

    /**
     * Search placeholder text
     */
    searchPlaceholder: {
      type: String,
      default: "Search...",
    },

    /**
     * Search term (for v-model)
     */
    modelValue: {
      type: String,
      default: "",
    },

    /**
     * Whether to show the add button
     */
    showAddButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Add button text
     */
    addButtonText: {
      type: String,
      default: "Add Contact",
    },
  },
  emits: ["update:modelValue", "search", "clear-search", "add"],
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
    const onSearchInput = () => {
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
      onSearchInput,
      clearSearch,
    };
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 200px;
}

.header-center {
  flex: 1;
  justify-content: center;
}

.header-right {
  min-width: 200px;
  justify-content: flex-end;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 3rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #111827;
  transition: background-color 0.2s;
}

.search-input:focus {
  outline: none;
  background-color: #e5e7eb;
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
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

.add-btn {
  display: flex;
  align-items: center;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn .btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.add-btn:hover {
  background-color: #1d4ed8;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #6b7280;
  border: none;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.settings-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-btn:hover {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .header-left,
  .header-center,
  .header-right {
    justify-content: space-between;
    min-width: auto;
  }

  .header-center {
    order: 3;
  }

  .search-input-wrapper {
    max-width: none;
  }
}

.view-all-btn {
  display: flex;
  align-items: center;
  background-color: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.75rem;
}

.view-all-btn:hover {
  background-color: #dbeafe;
  border-color: #93c5fd;
}

.view-all-btn svg {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

@media (max-width: 640px) {
  .view-all-btn span {
    display: none;
  }

  .view-all-btn {
    padding: 0.6rem;
  }

  .view-all-btn svg {
    margin-right: 0;
  }
}
</style>
