<template>
  <div class="contacts-view-page">
    <div class="page-header">
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
      <h1>All Contacts</h1>

      <div class="view-options">
        <button
          class="view-option-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
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
          <span>List</span>
        </button>
        <button
          class="view-option-btn"
          :class="{ active: viewMode === 'cards' }"
          @click="viewMode = 'cards'"
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
          <span>Cards</span>
        </button>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-input-container">
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
          placeholder="Search contacts..."
          v-model="searchTerm"
        />
        <button
          v-show="searchTerm"
          class="clear-search"
          @click="searchTerm = ''"
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

      <div class="filter-container">
        <select v-model="categoryFilter" class="category-filter">
          <option value="">All Categories</option>
          <option value="family">Family</option>
          <option value="friend">Friend</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading contacts...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredContacts.length === 0" class="empty-state">
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
      <h3>No contacts found</h3>
      <p v-if="searchTerm || categoryFilter">
        Try changing your search or filter criteria
      </p>
      <p v-else>Add some contacts to get started</p>
      <button
        v-if="searchTerm || categoryFilter"
        @click="clearFilters"
        class="clear-filters-btn"
      >
        Clear filters
      </button>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="list-view">
      <table class="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in filteredContacts" :key="contact.id">
            <td class="name-cell">
              <div class="contact-avatar" :style="getAvatarStyle(contact)">
                <span v-if="!contact.avatar">{{
                  getInitials(contact.name)
                }}</span>
                <img v-else :src="contact.avatar" :alt="contact.name" />
              </div>
              <span class="contact-name">{{ contact.name }}</span>
            </td>
            <td>
              <span
                class="category-badge"
                :style="{ backgroundColor: getCategoryColor(contact.category) }"
              >
                {{ getCategoryLabel(contact.category) }}
              </span>
            </td>
            <td class="email-cell">{{ contact.email }}</td>
            <td>{{ formatPhone(contact.phone) }}</td>
            <td class="actions-cell">
              <button
                class="action-btn view-btn"
                @click.stop="selectAndClose(contact)"
                title="View Details"
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button
                class="action-btn edit-btn"
                @click.stop="editAndClose(contact)"
                title="Edit Contact"
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
                class="action-btn delete-btn"
                @click.stop="confirmDelete(contact)"
                title="Delete Contact"
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <!-- <div v-else class="card-view">
      <div
        v-for="contact in filteredContacts"
        :key="contact.id"
        class="contact-card"
      >
        <div
          class="card-header"
          :style="{ backgroundColor: getCategoryColor(contact.category) }"
        >
          <div class="card-avatar" :style="getAvatarStyle(contact)">
            <span v-if="!contact.avatar">{{ getInitials(contact.name) }}</span>
            <img v-else :src="contact.avatar" :alt="contact.name" />
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-name">{{ contact.name }}</h3>
          <p class="card-category">{{ getCategoryLabel(contact.category) }}</p>
          <div class="card-details">
            <p class="card-detail">
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
              {{ formatPhone(contact.phone) }}
            </p>
            <p class="card-detail">
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
              {{ contact.email }}
            </p>
          </div>
        </div>
        <div class="card-actions">
          <button class="card-btn view-btn" @click="selectAndClose(contact)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View
          </button>
          <button class="card-btn edit-btn" @click="editAndClose(contact)">
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
            Edit
          </button>
          <button class="card-btn delete-btn" @click="confirmDelete(contact)">
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
            Delete
          </button>
        </div>
      </div>
    </div> -->

    <!-- Improved Card Section Template -->
    <!-- Card View -->
    <div v-else class="card-view">
      <div
        v-for="contact in filteredContacts"
        :key="contact.id"
        class="contact-card"
      >
        <div
          class="card-header"
          :style="{ backgroundColor: getCategoryColor(contact.category) }"
        >
          <div class="card-avatar" :style="getAvatarStyle(contact)">
            <span v-if="!contact.avatar">{{ getInitials(contact.name) }}</span>
            <img v-else :src="contact.avatar" :alt="contact.name" />
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-name">{{ contact.name }}</h3>
          <p class="card-category">{{ getCategoryLabel(contact.category) }}</p>
          <div class="card-details">
            <div class="card-detail" v-if="contact.phone">
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
              <span>{{ formatPhone(contact.phone) }}</span>
            </div>
            <div class="card-detail" v-if="contact.email">
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
            </div>
            <div class="card-detail" v-if="contact.address">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ contact.address }}</span>
            </div>
          </div>
        </div>
        <div class="card-actions">
          <button class="card-btn view-btn" @click="selectAndClose(contact)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View</span>
          </button>
          <button class="card-btn edit-btn" @click="editAndClose(contact)">
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
            <span>Edit</span>
          </button>
          <button class="card-btn delete-btn" @click="confirmDelete(contact)">
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
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="delete-confirmation-overlay">
      <div class="delete-confirmation">
        <div class="delete-icon">
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
        </div>
        <h3 class="delete-title">Delete Contact</h3>
        <p class="delete-message">
          Are you sure you want to delete
          <strong>{{ contactToDelete ? contactToDelete.name : "" }}</strong
          >?
          <br />
          This action cannot be undone.
        </p>
        <div class="delete-actions">
          <button class="delete-cancel-btn" @click="showDeleteConfirm = false">
            Cancel
          </button>
          <button
            class="delete-confirm-btn"
            @click="deleteAndClose"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="btn-spinner"></span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactsViewPage",
  props: {
    contacts: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isDeleting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "view-contact", "edit-contact", "delete-contact"],
  data() {
    return {
      viewMode: localStorage.getItem("contactViewMode") || "list",
      searchTerm: "",
      categoryFilter: "",
      contactToDelete: null,
      showDeleteConfirm: false,
      categoryColors: {
        family: "#4f46e5", // Indigo
        friend: "#16a34a", // Green
        work: "#ea580c", // Orange
        other: "#6b7280", // Gray
        // Legacy support
        famille: "#4f46e5",
        amis: "#16a34a",
        travail: "#ea580c",
        autres: "#6b7280",
      },
      categoryLabels: {
        family: "Family",
        friend: "Friend",
        work: "Work",
        other: "Other",
      },
    };
  },
  computed: {
    filteredContacts() {
      if (!this.contacts) return [];

      let filtered = [...this.contacts];

      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (contact) =>
            contact.name.toLowerCase().includes(term) ||
            (contact.email && contact.email.toLowerCase().includes(term)) ||
            (contact.phone && contact.phone.includes(term)) ||
            (contact.notes && contact.notes.toLowerCase().includes(term))
        );
      }

      // Filter by category
      if (this.categoryFilter) {
        filtered = filtered.filter(
          (contact) =>
            this.normalizeCategory(contact.category) === this.categoryFilter
        );
      }

      return filtered;
    },
  },
  watch: {
    viewMode(newMode) {
      localStorage.setItem("contactViewMode", newMode);
    },
  },
  methods: {
    clearFilters() {
      this.searchTerm = "";
      this.categoryFilter = "";
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

    getAvatarStyle(contact) {
      if (contact.avatar) return {};

      return {
        backgroundColor: this.getCategoryColor(contact.category),
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    },

    getCategoryColor(category) {
      return this.categoryColors[category] || this.categoryColors.other;
    },

    getCategoryLabel(category) {
      const normalizedCategory = this.normalizeCategory(category);
      return this.categoryLabels[normalizedCategory] || "Other";
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

    formatPhone(phone) {
      if (!phone) return "";

      // Format as (XXX) XXX-XXXX if it's a 10-digit number
      if (/^\d{10}$/.test(phone)) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
      }

      return phone;
    },

    selectAndClose(contact) {
      this.$emit("view-contact", contact);
      this.$emit("close");
    },

    editAndClose(contact) {
      this.$emit("edit-contact", contact);
      this.$emit("close");
    },

    confirmDelete(contact) {
      this.contactToDelete = contact;
      this.showDeleteConfirm = true;
    },

    deleteAndClose() {
      if (this.contactToDelete) {
        this.$emit("delete-contact", this.contactToDelete);
        this.showDeleteConfirm = false;
        this.contactToDelete = null;
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.contacts-view-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f3f4f6;
}

.back-button svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.375rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-option-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-option-btn svg {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.375rem;
}

.view-option-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.view-option-btn.active {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.search-bar {
  display: flex;
  padding: 1rem 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.search-input-container {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 9999px;
}

.clear-search:hover {
  background-color: #f3f4f6;
}

.clear-search svg {
  width: 1rem;
  height: 1rem;
}

.filter-container {
  flex-shrink: 0;
}

.category-filter {
  padding: 0.625rem 2rem 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.category-filter:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading State */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.empty-state svg {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  max-width: 20rem;
  margin: 0 0 1rem 0;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
}

/* List View */
.list-view {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
}

.contacts-table th {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
}

.contacts-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.contacts-table tr:last-child td {
  border-bottom: none;
}

.name-cell {
  display: flex;
  align-items: center;
}

.contact-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-right: 0.75rem;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.contact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-name {
  font-weight: 500;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.email-cell {
  max-width: 15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg {
  width: 1.125rem;
  height: 1.125rem;
}

.action-btn.view-btn:hover {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #3b82f6;
}

.action-btn.edit-btn:hover {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.action-btn.delete-btn:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

/************************ Card View ****************/
/* Card View - Completely Redesigned for Better Responsiveness */
.card-view {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.contact-card {
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  height: 4.5rem;
  position: relative;
  display: flex;
  justify-content: center;
}

.card-avatar {
  position: absolute;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  top: 2rem;
  border: 4px solid white;
  overflow: hidden;
  font-size: 1.5rem;
  z-index: 2;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 3rem 1.5rem 1.5rem;
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-category {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.card-details {
  text-align: left;
  overflow: hidden;
  margin-top: auto;
  margin-bottom: 1rem;
}

.card-detail {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  overflow: hidden;
}

.card-detail svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.card-detail span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.card-actions {
  display: flex;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.card-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 0;
  border: none;
  background-color: white;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.card-btn svg {
  width: 1.125rem;
  height: 1.125rem;
}

.card-btn.view-btn:hover {
  background-color: #eff6ff;
  color: #3b82f6;
}

.card-btn.edit-btn:hover {
  background-color: #f0fdf4;
  color: #16a34a;
}

.card-btn.delete-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.card-btn + .card-btn {
  border-left: 1px solid #e5e7eb;
}

/* Responsive Adjustments */
@media (max-width: 1280px) {
  .card-view {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
}

@media (max-width: 1024px) {
  .card-view {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
    flex-wrap: wrap;
  }

  .page-header h1 {
    width: 100%;
    order: -1;
    margin-bottom: 0.75rem;
  }

  .back-button {
    margin-right: 0.5rem;
  }

  .card-view {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.875rem;
    padding: 0.875rem;
  }

  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .category-filter {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .view-option-btn span {
    display: none;
  }

  .view-option-btn svg {
    margin-right: 0;
  }

  .card-view {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .card-avatar {
    width: 4rem;
    height: 4rem;
    top: 1.75rem;
  }

  .card-header {
    height: 3.5rem;
  }

  .card-body {
    padding: 2.5rem 0.75rem 0.75rem;
  }

  .card-name {
    font-size: 1rem;
  }

  .card-detail svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  .card-detail {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .card-btn span {
    display: none;
  }

  .card-btn svg {
    margin-right: 0;
  }

  .card-btn {
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .card-view {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.625rem;
    padding: 0.625rem;
  }

  .card-body {
    padding: 2.5rem 0.5rem 0.5rem;
  }

  .card-details {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 375px) {
  .card-view {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-avatar {
    width: 4.5rem;
    height: 4.5rem;
  }

  .card-body {
    padding: 2.75rem 1rem 1rem;
  }

  /* Restore text for buttons on single column layout */
  .card-btn span {
    display: inline-block;
  }
}

/* Enhanced styles for better overall design */
.search-input {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  height: 2.5rem;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.category-filter {
  height: 2.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.category-filter:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

/* Improve scrolling experience */
.card-view {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.card-view::-webkit-scrollbar {
  width: 8px;
}

.card-view::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.card-view::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

/* Animation for cards */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-card {
  animation: fadeIn 0.3s ease forwards;
}

/* Empty state improvements */
.empty-state {
  padding: 3rem 1.5rem;
}

.empty-state svg {
  width: 5rem;
  height: 5rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

/* Fix table view for mobile */
@media (max-width: 768px) {
  .contacts-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .contacts-table th:nth-child(2),
  .contacts-table td:nth-child(2),
  .contacts-table th:nth-child(3),
  .contacts-table td:nth-child(3) {
    display: none;
  }
} /* Delete Confirmation Dialog */
.delete-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.delete-confirmation {
  background-color: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.delete-icon {
  width: 3rem;
  height: 3rem;
  background-color: #fee2e2;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: #ef4444;
}

.delete-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.delete-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.delete-message {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.delete-cancel-btn {
  padding: 0.625rem 1.25rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-cancel-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.delete-confirm-btn {
  padding: 0.625rem 1.25rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-confirm-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.delete-confirm-btn:disabled {
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

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .category-filter {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .view-option-btn span {
    display: none;
  }

  .view-option-btn svg {
    margin-right: 0;
  }

  .contacts-table th:nth-child(2),
  .contacts-table td:nth-child(2) {
    display: none;
  }

  .card-view {
    grid-template-columns: 1fr;
  }
}
</style>
