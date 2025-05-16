<template>
  <div class="app-container">
    <!-- Global loading overlay -->
    <div v-if="isInitialLoading" class="loading-overlay">
      <LoadingSpinner
        type="bars"
        color="#2563eb"
        text="Loading application..."
        size="large"
      />
    </div>

    <div class="contact-manager-card">
      <!-- App Header -->
      <AppHeader
        title="Contacts"
        v-model="searchTerm"
        @search="filterContacts"
        @clear-search="clearSearch"
        @add="openAddContactForm"
        @settings="toggleSettings"
        @view-all="toggleContactsView"
      />

      <!-- Success notification -->
      <div v-if="successMessage" class="success-notification">
        <div class="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <span>{{ successMessage }}</span>
        <button class="close-notification" @click="successMessage = ''">
          ×
        </button>
      </div>

      <!-- Error notification -->
      <div v-if="errorMessage" class="error-notification">
        <div class="error-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <span>{{ errorMessage }}</span>
        <button class="close-notification" @click="errorMessage = ''">×</button>
      </div>

      <div class="content-container">
        <!-- Left sidebar - Contact list -->
        <div class="left-sidebar">
          <ContactList
            :contacts="filteredContacts"
            :selectedContactId="selectedContact ? selectedContact.id : null"
            :isLoading="isLoading"
            :viewMode="appSettings.viewMode"
            @select-contact="selectContact"
            @edit-contact="editContact"
            @delete-contact="confirmDeleteContact"
          />
        </div>

        <!-- Center panel - Contact details -->
        <div class="center-panel">
          <ContactDetails :contact="selectedContact" @edit="editContact" />
        </div>

        <!-- Right sidebar for optional future features -->
        <div v-if="selectedContact" class="right-sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-section-title">Tags</h3>
            <div class="tags-container">
              <span
                class="tag"
                :class="{
                  active: isInCategory(selectedContact, 'family'),
                }"
                @click="setCategory('family')"
              >
                Family
              </span>
              <span
                class="tag"
                :class="{
                  active: isInCategory(selectedContact, 'friend'),
                }"
                @click="setCategory('friend')"
              >
                Friend
              </span>
              <span
                class="tag"
                :class="{
                  active: isInCategory(selectedContact, 'work'),
                }"
                @click="setCategory('work')"
              >
                Work
              </span>
              <span
                class="tag"
                :class="{
                  active: isInCategory(selectedContact, 'other'),
                }"
                @click="setCategory('other')"
              >
                Other
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for adding/editing a contact -->
    <div
      class="modal-overlay"
      v-if="showContactForm"
      @click.self="cancelFormAction"
    >
      <div class="modal-container">
        <button class="modal-close-btn" @click="cancelFormAction">×</button>
        <h2 class="modal-title">
          {{ isEditMode ? "Edit Contact" : "Add Contact" }}
        </h2>

        <ContactForm
          :editContact="isEditMode ? selectedContact : null"
          :isSubmitting="isSubmitting"
          @save-contact="saveContact"
          @cancel-edit="cancelFormAction"
        />
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <ConfirmDialog
      v-if="showDeleteConfirmation"
      title="Delete Contact"
      message="Are you sure you want to delete this contact? This action cannot be undone."
      :itemToConfirm="contactToDelete ? contactToDelete.name : ''"
      type="danger"
      confirmText="Delete"
      :isLoading="isDeleting"
      @confirm="deleteContact"
      @cancel="showDeleteConfirmation = false"
    />
    <div v-if="showSettings" class="settings-overlay">
      <SettingsPage
        :initialSettings="appSettings"
        @close="toggleSettings"
        @update:settings="updateSettings"
      />
    </div>
    <!-- Contacts View Page -->
    <div v-if="showContactsView" class="view-overlay">
      <ContactsViewPage
        :contacts="contacts"
        :isLoading="isLoading"
        @close="toggleContactsView"
        @view-contact="selectContact"
        @edit-contact="editContact"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import AppHeader from "./components/layout/AppHeader.vue";
import ContactForm from "./components/contacts/ContactForm.vue";
import ContactList from "./components/contacts/ContactList.vue";
import ContactDetails from "./components/contacts/ContactDetails.vue";
import LoadingSpinner from "./components/common/LoadingSpinner.vue";
import ConfirmDialog from "./components/common/ConfirmDialog.vue";
import SettingsPage from "./components/pages/SettingsPage.vue";
import ContactsViewPage from "./components/pages/ContactsViewPage.vue";

import contactService from "./services/api";
import { useCategories } from "./composables/useCategories";

export default {
  name: "App",
  components: {
    AppHeader,
    ContactForm,
    ContactList,
    ContactDetails,
    LoadingSpinner,
    SettingsPage,
    ContactsViewPage,
    ConfirmDialog,
  },
  setup() {
    // Contact state
    const contacts = ref([]);
    const filteredContacts = ref([]);
    const selectedContact = ref(null);
    const searchTerm = ref("");

    // Loading and error states
    const isInitialLoading = ref(true);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const isDeleting = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    // Modal states
    const showContactForm = ref(false);
    const isEditMode = ref(false);
    const showDeleteConfirmation = ref(false);
    const contactToDelete = ref(null);

    // Use categories composable
    const { getStandardCategory, getCategoryColor, isInCategory } =
      useCategories();

    // Load contacts on startup
    onMounted(async () => {
      try {
        console.log("App mounted, loading contacts...");
        isInitialLoading.value = true;

        const response = await contactService.getAllContacts();
        console.log("API response received:", response);

        // Handle different response formats
        if (Array.isArray(response)) {
          contacts.value = response;
        } else if (response && response.data) {
          contacts.value = response.data;
        } else {
          contacts.value = [];
          console.warn("Unexpected response format:", response);
        }

        filteredContacts.value = [...contacts.value];
        console.log("Contacts loaded:", contacts.value.length);

        // Select the first contact by default if available
        if (contacts.value.length > 0) {
          selectedContact.value = contacts.value[0];
        }
      } catch (err) {
        console.error("Error loading contacts:", err);
        errorMessage.value = "Unable to load contacts. Please try again later.";
      } finally {
        isInitialLoading.value = false;
      }
    });

    // Filter contacts based on search term
    const filterContacts = () => {
      if (!searchTerm.value.trim()) {
        filteredContacts.value = [...contacts.value];
        return;
      }

      const term = searchTerm.value.toLowerCase();
      filteredContacts.value = contacts.value.filter((contact) => {
        return (
          contact.name.toLowerCase().includes(term) ||
          (contact.email && contact.email.toLowerCase().includes(term)) ||
          (contact.phone && contact.phone.includes(term)) ||
          (contact.notes && contact.notes.toLowerCase().includes(term))
        );
      });
    };

    // Clear search
    const clearSearch = () => {
      searchTerm.value = "";
      filteredContacts.value = [...contacts.value];
    };

    // Select a contact
    const selectContact = (contact) => {
      selectedContact.value = contact;
    };

    // Open add contact form
    const openAddContactForm = () => {
      isEditMode.value = false;
      showContactForm.value = true;
    };

    // Edit a contact
    const editContact = (contact) => {
      isEditMode.value = true;
      selectedContact.value = contact;
      showContactForm.value = true;
    };

    // Cancel form action
    const cancelFormAction = () => {
      showContactForm.value = false;
      // Reset edit mode after a delay for animation
      setTimeout(() => {
        isEditMode.value = false;
      }, 300);
    };

    // Save a contact
    const saveContact = async (contactData) => {
      try {
        isSubmitting.value = true;

        // Normalize category
        contactData.category = getStandardCategory(contactData.category);

        if (contactData.id) {
          // Update existing contact
          console.log("Updating contact:", contactData.id);
          const response = await contactService.updateContact(
            contactData.id,
            contactData
          );

          // Handle different response formats
          const updatedContact =
            response && response.data ? response.data : response;

          // Update the contact in the array
          const index = contacts.value.findIndex(
            (c) => c.id === contactData.id
          );
          if (index !== -1) {
            contacts.value[index] = updatedContact;
            selectedContact.value = updatedContact;
          }

          successMessage.value = "Contact updated successfully!";
        } else {
          // Create new contact
          console.log("Creating new contact");
          const response = await contactService.createContact(contactData);

          // Handle different response formats
          const newContact =
            response && response.data ? response.data : response;

          contacts.value.push(newContact);
          selectedContact.value = newContact;

          successMessage.value = "Contact added successfully!";
        }

        // Update filtered contacts
        filterContacts();

        // Close the form
        showContactForm.value = false;
        isEditMode.value = false;

        // Clear the message after a delay
        setTimeout(() => {
          successMessage.value = "";
        }, 5000);
      } catch (err) {
        console.error("Error saving contact:", err);
        errorMessage.value = "Error saving contact. Please try again.";

        // Clear the error message after a delay
        setTimeout(() => {
          errorMessage.value = "";
        }, 5000);
      } finally {
        isSubmitting.value = false;
      }
    };

    // Confirm delete contact
    const confirmDeleteContact = (contact) => {
      contactToDelete.value = contact;
      showDeleteConfirmation.value = true;
    };

    // Delete a contact
    const deleteContact = async () => {
      if (!contactToDelete.value) return;

      try {
        isDeleting.value = true;
        console.log("Deleting contact:", contactToDelete.value.id);

        await contactService.deleteContact(contactToDelete.value.id);

        // Remove the contact from the list
        contacts.value = contacts.value.filter(
          (c) => c.id !== contactToDelete.value.id
        );

        // If the deleted contact was selected, select another one
        if (
          selectedContact.value &&
          selectedContact.value.id === contactToDelete.value.id
        ) {
          selectedContact.value =
            contacts.value.length > 0 ? contacts.value[0] : null;
        }

        // Update filtered contacts
        filterContacts();

        successMessage.value = "Contact deleted successfully!";

        // Clear the message after a delay
        setTimeout(() => {
          successMessage.value = "";
        }, 5000);
      } catch (err) {
        console.error("Error deleting contact:", err);
        errorMessage.value = "Error deleting contact. Please try again.";

        // Clear the error message after a delay
        setTimeout(() => {
          errorMessage.value = "";
        }, 5000);
      } finally {
        isDeleting.value = false;
        showDeleteConfirmation.value = false;
        contactToDelete.value = null;
      }
    };

    // Set category for a contact
    const setCategory = async (category) => {
      if (!selectedContact.value) return;

      try {
        console.log(
          "Updating category for contact:",
          selectedContact.value.id,
          "to",
          category
        );
        const contactData = { ...selectedContact.value, category };
        const response = await contactService.updateContact(
          contactData.id,
          contactData
        );

        // Handle different response formats
        const updatedContact =
          response && response.data ? response.data : response;

        // Update the contact in the array
        const index = contacts.value.findIndex((c) => c.id === contactData.id);
        if (index !== -1) {
          contacts.value[index] = updatedContact;
          selectedContact.value = updatedContact;
        }

        successMessage.value = "Contact category updated!";
        setTimeout(() => {
          successMessage.value = "";
        }, 3000);
      } catch (err) {
        console.error("Error updating category:", err);
        errorMessage.value = "Failed to update category.";
        setTimeout(() => {
          errorMessage.value = "";
        }, 3000);
      }
    };
    const showSettings = ref(false);
    const appSettings = ref({
      viewMode: localStorage.getItem("contactManagerSettings")
        ? JSON.parse(localStorage.getItem("contactManagerSettings")).viewMode
        : "list",
      theme: localStorage.getItem("contactManagerSettings")
        ? JSON.parse(localStorage.getItem("contactManagerSettings")).theme
        : "light",
      defaultCategory: localStorage.getItem("contactManagerSettings")
        ? JSON.parse(localStorage.getItem("contactManagerSettings"))
            .defaultCategory
        : "other",
    });

    // Toggle settings page
    const toggleSettings = () => {
      showSettings.value = !showSettings.value;
    };

    // Update settings
    const updateSettings = (newSettings) => {
      appSettings.value = newSettings;

      // Apply theme if changed
      if (newSettings.theme === "dark") {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    };

    // View all contacts page state
    const showContactsView = ref(false);

    // Toggle contacts view page
    const toggleContactsView = () => {
      showContactsView.value = !showContactsView.value;
    };

    return {
      // Data
      contacts,
      filteredContacts,
      selectedContact,
      searchTerm,

      // Loading states
      isInitialLoading,
      isLoading,
      isSubmitting,
      isDeleting,
      errorMessage,
      successMessage,

      // Modal states
      showContactForm,
      isEditMode,
      showDeleteConfirmation,
      contactToDelete,

      // Methods
      filterContacts,
      clearSearch,
      selectContact,
      openAddContactForm,
      editContact,
      cancelFormAction,
      saveContact,
      confirmDeleteContact,
      deleteContact,
      setCategory,
      isInCategory,
      showSettings,
      appSettings,
      toggleSettings,
      updateSettings,
      showContactsView,
      toggleContactsView,
    };
  },
};
</script>

<style>
/* Import base styles and CSS variables */
@import "./assets/styles/base.css";

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #526d7a;
  background-image: linear-gradient(180deg, #526d7a 0%, #435864 100%);
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.contact-manager-card {
  width: 100%;
  /* max-width: 1200px; */
  background: #f0f4f7;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.success-notification,
.error-notification {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  margin: 0.75rem;
  border-radius: 0.5rem;
  position: relative;
}

.success-notification {
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.error-notification {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.success-icon,
.error-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #10b981;
}

.error-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #ef4444;
}

.close-notification {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
}

.content-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  flex: 1;
  overflow: hidden;
}

/* Left sidebar styles */
.left-sidebar {
  background-color: #f0f4f7;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Center panel styles */
.center-panel {
  background-color: white;
  overflow-y: auto;
  padding: 2rem;
}

/* Right sidebar styles */
.right-sidebar {
  background-color: #f0f4f7;
  border-left: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f6;
  color: #6b7280;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.tag:hover {
  background-color: #e5e7eb;
}

.tag.active {
  background-color: #eff6ff;
  color: #3b82f6;
  font-weight: 600;
}

/* Modal styles */
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
}

.modal-container {
  background-color: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
}

.modal-close-btn:hover {
  background-color: #f3f4f6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 250px 1fr;
  }

  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .left-sidebar {
    display: none;
  }
}

.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #f9fafb;
}

/* Dark theme styles - add this to your <style> section but without 'scoped' */
.dark-theme {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #e5e7eb;
  --border-color: #374151;
}

.dark-theme .app-container {
  background-color: #111827;
  background-image: linear-gradient(180deg, #111827 0%, #1f2937 100%);
}

.dark-theme .contact-manager-card {
  background: #1f2937;
}

.dark-theme .app-header {
  background-color: #111827;
  border-color: #374151;
}

.dark-theme .app-title {
  color: #f9fafb;
}

.dark-theme .search-input {
  background-color: #374151;
  color: #f9fafb;
}

.dark-theme .center-panel {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark-theme .left-sidebar {
  background-color: #1f2937;
  border-color: #374151;
}

.dark-theme .right-sidebar {
  background-color: #1f2937;
  border-color: #374151;
}

.view-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background-color: #f9fafb;
}
</style>
