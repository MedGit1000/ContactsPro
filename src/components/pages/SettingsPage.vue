<template>
  <div class="settings-page">
    <div class="settings-header">
      <button class="back-button" @click="$emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        <span>Back</span>
      </button>
      <h1>Settings</h1>
    </div>

    <div class="settings-container">
      <!-- Display Mode Section -->
      <div class="settings-section">
        <h2 class="section-title">Display Mode</h2>
        <p class="section-description">
          Choose how your contacts are displayed
        </p>

        <div class="display-options">
          <div
            class="display-option"
            :class="{ active: viewMode === 'list' }"
            @click="updateViewMode('list')"
          >
            <div class="option-icon list-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </div>
            <div class="option-content">
              <h3>List View</h3>
              <p>Compact view with essential details</p>
            </div>
            <div class="option-check" v-if="viewMode === 'list'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>

          <div
            class="display-option"
            :class="{ active: viewMode === 'cards' }"
            @click="updateViewMode('cards')"
          >
            <div class="option-icon cards-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <div class="option-content">
              <h3>Card View</h3>
              <p>Visual cards with more details</p>
            </div>
            <div class="option-check" v-if="viewMode === 'cards'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Section -->
      <div class="settings-section">
        <h2 class="section-title">Theme</h2>
        <p class="section-description">Choose your preferred appearance</p>

        <div class="theme-toggle">
          <span class="theme-label" :class="{ active: theme === 'light' }"
            >Light</span
          >
          <label class="switch">
            <input
              type="checkbox"
              :checked="theme === 'dark'"
              @change="toggleTheme"
            />
            <span class="slider round"></span>
          </label>
          <span class="theme-label" :class="{ active: theme === 'dark' }"
            >Dark</span
          >
        </div>
      </div>

      <!-- Default Category Section -->
      <div class="settings-section">
        <h2 class="section-title">Default Category</h2>
        <p class="section-description">
          Set the default category for new contacts
        </p>

        <div class="category-selector">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-option"
            :class="{ active: defaultCategory === category.name }"
            @click="updateDefaultCategory(category.name)"
          >
            <div
              class="category-color"
              :style="{ backgroundColor: category.color }"
            ></div>
            <span class="category-name">{{ category.label }}</span>
            <div
              class="category-check"
              v-if="defaultCategory === category.name"
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
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <button class="save-button" @click="saveSettings">Save Changes</button>
      <button class="reset-button" @click="resetSettings">
        Reset to Default
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsPage",
  props: {
    initialSettings: {
      type: Object,
      default: () => ({
        viewMode: "list",
        theme: "light",
        defaultCategory: "other",
      }),
    },
  },
  emits: ["close", "update:settings"],
  data() {
    return {
      viewMode: this.initialSettings.viewMode || "list",
      theme: this.initialSettings.theme || "light",
      defaultCategory: this.initialSettings.defaultCategory || "other",
      categories: [
        { name: "family", label: "Family", color: "#4f46e5" },
        { name: "friend", label: "Friend", color: "#16a34a" },
        { name: "work", label: "Work", color: "#ea580c" },
        { name: "other", label: "Other", color: "#6b7280" },
      ],
    };
  },
  methods: {
    updateViewMode(mode) {
      this.viewMode = mode;
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    updateDefaultCategory(category) {
      this.defaultCategory = category;
    },
    saveSettings() {
      const settings = {
        viewMode: this.viewMode,
        theme: this.theme,
        defaultCategory: this.defaultCategory,
      };

      // Save to local storage
      localStorage.setItem("contactManagerSettings", JSON.stringify(settings));

      // Emit event to parent
      this.$emit("update:settings", settings);
      this.$emit("close");
    },
    resetSettings() {
      this.viewMode = "list";
      this.theme = "light";
      this.defaultCategory = "other";
    },
  },
};
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9fafb;
  color: #1f2937;
}

.settings-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem 0;
}

.back-button svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.375rem;
}

.settings-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.settings-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.settings-section {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem 0;
}

/* Display Options */
.display-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.display-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.display-option:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.display-option.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  background-color: #f3f4f6;
}

.option-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #4b5563;
}

.display-option.active .option-icon {
  background-color: #dbeafe;
}

.display-option.active .option-icon svg {
  color: #2563eb;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.option-content p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.option-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #2563eb;
}

.option-check svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.theme-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.theme-label.active {
  color: #111827;
  font-weight: 500;
}

.switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2563eb;
}

input:checked + .slider:before {
  transform: translateX(1.5rem);
}

.slider.round {
  border-radius: 1.5rem;
}

.slider.round:before {
  border-radius: 50%;
}

/* Category Selector */
.category-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-option {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-option:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.category-option.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.category-color {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.category-name {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.category-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #2563eb;
}

.category-check svg {
  width: 1rem;
  height: 1rem;
}

/* Footer */
.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.save-button {
  padding: 0.625rem 1.25rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #1d4ed8;
}

.reset-button {
  padding: 0.625rem 1.25rem;
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

@media (min-width: 768px) {
  .display-options {
    flex-direction: row;
  }

  .display-option {
    flex: 1;
  }

  .category-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
