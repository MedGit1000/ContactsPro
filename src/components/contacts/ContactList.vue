<template>
  <div class="contact-list-container">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Loading contacts...</p>
    </div>

    <!-- Empty state message -->
    <div v-else-if="contacts.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="empty-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
      <span>
        No contacts available. Add your first contact using the button above.
      </span>
    </div>

    <!-- Search box -->
    <div v-else-if="contacts.length > 0" class="search-container">
      <div class="search-input-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="search-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Search contacts"
          v-model="searchTerm"
        />
        <button
          v-if="searchTerm"
          class="clear-search-btn"
          @click="clearSearch"
          title="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Category filter -->
      <div class="category-filter">
        <select v-model="selectedCategory" class="category-select">
          <option value="">All Categories</option>
          <option value="family">Family</option>
          <option value="friend">Friend</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div class="view-mode-switcher">
      <button
        :class="['view-mode-btn', { active: viewMode === 'list' }]"
        @click="$emit('update:viewMode', 'list')"
        title="List View"
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
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        :class="['view-mode-btn', { active: viewMode === 'cards' }]"
        @click="$emit('update:viewMode', 'cards')"
        title="Card View"
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
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
    </div>

    <div class="contacts-container">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="contacts-list">
        <ContactItem
          v-for="contact in filteredContacts"
          :key="contact.id"
          :contact="contact"
          :is-selected="selectedContactId === contact.id"
          @select="selectContact(contact)"
          @edit="$emit('edit-contact', contact)"
          @delete="$emit('delete-contact', contact)"
        />
      </div>

      <!-- Card View -->
      <div v-else class="contacts-grid">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="contact-card"
          :class="{ 'selected-card': selectedContactId === contact.id }"
          @click="selectContact(contact)"
        >
          <div class="contact-card-avatar" :style="getCardAvatarStyle(contact)">
            <span v-if="!contact.avatar">{{ getInitials(contact.name) }}</span>
            <img v-else :src="contact.avatar" :alt="contact.name" />
          </div>

          <div class="contact-card-info">
            <h3 class="contact-card-name">{{ contact.name }}</h3>
            <div
              class="contact-card-category"
              :style="{ backgroundColor: getCategoryColor(contact.category) }"
            >
              {{ getCategoryLabel(contact.category) }}
            </div>
            <p class="contact-card-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                ></path>
              </svg>
              <span>{{ contact.phone }}</span>
            </p>
            <p class="contact-card-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                ></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{{ contact.email }}</span>
            </p>
          </div>

          <div class="contact-card-actions">
            <button
              class="card-action-btn"
              @click.stop="$emit('edit-contact', contact)"
              title="Edit"
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
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                ></path>
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                ></path>
              </svg>
            </button>
            <button
              class="card-action-btn delete-btn"
              @click.stop="$emit('delete-contact', contact)"
              title="Delete"
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact list -->
    <div v-if="filteredContacts.length > 0" class="contacts-list">
      <contact-item
        v-for="contact in filteredContacts"
        :key="contact.id"
        :contact="contact"
        :is-selected="selectedContactId === contact.id"
        @select="selectContact(contact)"
        @edit="$emit('edit-contact', contact)"
        @delete="$emit('delete-contact', contact)"
      />
    </div>

    <!-- Search results empty state -->
    <div v-else-if="searchTerm || selectedCategory" class="no-results">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="no-results-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
      <p>No contacts match your search</p>
      <button class="clear-filters-btn" @click="clearFilters">
        Clear filters
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import ContactItem from "./ContactItem.vue";

export default {
  name: "ContactList",
  components: {
    ContactItem,
  },
  props: {
    contacts: {
      type: Array,
      required: true,
    },
    selectedContactId: {
      type: [Number, String],
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    searchTerm: {
      type: String,
      default: "",
    },
    viewMode: {
      type: String,
      default: "list", // 'list' or 'cards'
      validator: (value) => ["list", "cards"].includes(value),
    },
  },
  emits: ["select-contact", "edit-contact", "delete-contact", "clear-search"],
  setup(props, { emit }) {
    // Local state
    const localSearchTerm = ref("");
    const selectedCategory = ref("");

    // Use prop searchTerm if provided, otherwise use local
    const searchTerm = computed({
      get: () => props.searchTerm || localSearchTerm.value,
      set: (value) => {
        if (props.searchTerm !== undefined) {
          emit("update:searchTerm", value);
        } else {
          localSearchTerm.value = value;
        }
      },
    });

    // Category mapping for backwards compatibility
    const categoryMapping = {
      famille: "family",
      amis: "friend",
      travail: "work",
      autres: "other",
    };

    // Normalize category (handle old French categories)
    const normalizeCategory = (category) => {
      if (!category) return "";
      return categoryMapping[category] || category;
    };

    // Filtered contacts based on search and category
    const filteredContacts = computed(() => {
      let filtered = [...props.contacts];

      // Filter by search term
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter((contact) => {
          return (
            contact.name?.toLowerCase().includes(term) ||
            contact.email?.toLowerCase().includes(term) ||
            contact.phone?.includes(term) ||
            contact.notes?.toLowerCase().includes(term)
          );
        });
      }

      // Filter by category
      if (selectedCategory.value) {
        filtered = filtered.filter((contact) => {
          const contactCategory = normalizeCategory(contact.category);
          return contactCategory === selectedCategory.value;
        });
      }

      return filtered;
    });

    // Watch for changes in contacts to update selection
    watch(
      () => props.contacts,
      () => {
        // If the selected contact is no longer in the list, select the first contact
        if (
          props.selectedContactId &&
          !props.contacts.some((c) => c.id === props.selectedContactId)
        ) {
          if (props.contacts.length > 0) {
            selectContact(props.contacts[0]);
          }
        }
      }
    );

    // Select a contact
    const selectContact = (contact) => {
      emit("select-contact", contact);
    };

    // Clear search
    const clearSearch = () => {
      searchTerm.value = "";
      emit("clear-search");
    };

    // Clear all filters
    const clearFilters = () => {
      searchTerm.value = "";
      selectedCategory.value = "";
      emit("clear-search");
    };

    return {
      searchTerm,
      selectedCategory,
      filteredContacts,
      selectContact,
      clearSearch,
      clearFilters,
    };
  },
  getInitials(name) {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  },

  getCategoryColor(category) {
    const categoryColors = {
      family: "#4f46e5",
      friend: "#16a34a",
      work: "#ea580c",
      other: "#6b7280",
      // Legacy support
      famille: "#4f46e5",
      amis: "#16a34a",
      travail: "#ea580c",
      autres: "#6b7280",
    };
    return categoryColors[category] || categoryColors.other;
  },

  getCategoryLabel(category) {
    const normalizedCategory = this.normalizeCategory(category);
    const labels = {
      family: "Family",
      friend: "Friend",
      work: "Work",
      other: "Other",
    };
    return labels[normalizedCategory] || "Other";
  },

  normalizeCategory(category) {
    if (!category) return "other";

    const mapping = {
      famille: "family",
      amis: "friend",
      travail: "work",
      autres: "other",
    };

    return mapping[category] || category;
  },

  getCardAvatarStyle(contact) {
    if (contact.avatar) return {};

    return {
      backgroundColor: this.getCategoryColor(contact.category),
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.25rem",
    };
  },
};
</script>

<style scoped>
.contact-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
  height: 100%;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  color: #92400e;
  padding: 1.5rem;
  border-radius: 0.375rem;
  margin: 1rem;
}

.empty-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.5rem;
}

.search-container {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.25rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
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

.category-filter {
  display: flex;
  justify-content: flex-end;
}

.category-select {
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #4b5563;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' /%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
  text-align: center;
}

.no-results-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.clear-filters-btn {
  margin-top: 0.75rem;
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background-color: #e5e7eb;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.view-mode-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.view-mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.view-mode-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.view-mode-btn.active {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.view-mode-btn:hover:not(.active) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.contacts-container {
  flex: 1;
  overflow-y: auto;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.contact-card {
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.contact-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.selected-card {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.contact-card-avatar {
  width: 100%;
  height: 6rem;
  overflow: hidden;
  background-color: #f3f4f6;
}

.contact-card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-card-info {
  padding: 1rem;
  flex: 1;
}

.contact-card-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-card-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.contact-card-detail {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-card-detail svg {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.contact-card-actions {
  display: flex;
  border-top: 1px solid #e5e7eb;
}

.card-action-btn {
  flex: 1;
  padding: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.card-action-btn svg {
  width: 1.125rem;
  height: 1.125rem;
}

.card-action-btn:hover {
  background-color: #f9fafb;
}

.card-action-btn.delete-btn:hover {
  color: #ef4444;
  background-color: #fef2f2;
}

.card-action-btn + .card-action-btn {
  border-left: 1px solid #e5e7eb;
}
</style>
