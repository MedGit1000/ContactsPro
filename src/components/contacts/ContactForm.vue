<template>
  <div class="contact-form-container">
    <div class="form-header">
      <h2 class="form-title">
        {{ editContact ? "Edit Contact" : "Add Contact" }}
      </h2>
      <div v-if="editContact" class="last-updated">
        Last updated: {{ formatDate(editContact.updatedAt) }}
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="message-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ successMessage }}</span>
      <button class="close-message-btn" @click="successMessage = ''">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="close-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <form @submit.prevent="submitForm" class="contact-form">
      <div class="form-sections">
        <!-- Main Information Section -->
        <div class="form-section">
          <h3 class="section-title">Contact Information</h3>

          <!-- Name Field -->
          <div class="form-group">
            <label for="name" class="form-label"
              >Name<span class="required-mark">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="form-input"
              :class="{ 'input-error': errors.name }"
              placeholder="Contact name"
              required
              v-focus
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <!-- Category Field -->
          <div class="form-group">
            <label for="category" class="form-label">Category</label>
            <div class="category-selector">
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
              >
                <option value="">Select a category</option>
                <option
                  v-for="(color, category) in categoryColors"
                  :key="category"
                  :value="category"
                >
                  {{ getCategoryLabel(category) }}
                </option>
              </select>
              <div
                class="color-preview"
                :style="{ backgroundColor: getCategoryColor() }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Contact Details Section -->
        <div class="form-section">
          <h3 class="section-title">Contact Details</h3>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email" class="form-label"
              >Email<span class="required-mark">*</span></label
            >
            <div class="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="input-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-input with-icon"
                :class="{ 'input-error': errors.email }"
                placeholder="email@example.com"
                required
              />
            </div>
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>

          <!-- Phone Field -->
          <div class="form-group">
            <label for="phone" class="form-label"
              >Phone<span class="required-mark">*</span></label
            >
            <div class="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="input-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                class="form-input with-icon"
                :class="{ 'input-error': errors.phone }"
                placeholder="1234567890"
                required
              />
            </div>
            <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
            <p class="input-help">Format: 10 digits without spaces</p>
          </div>
        </div>
      </div>

      <!-- Address Section -->
      <div class="form-section">
        <h3 class="section-title">Address</h3>

        <div class="form-group">
          <label for="street" class="form-label">Street Address</label>
          <input
            type="text"
            id="street"
            v-model="formData.address.street"
            class="form-input"
            placeholder="123 Main St"
          />
        </div>

        <div class="address-row">
          <div class="form-group">
            <label for="city" class="form-label">City</label>
            <input
              type="text"
              id="city"
              v-model="formData.address.city"
              class="form-input"
              placeholder="City"
            />
          </div>

          <div class="form-group">
            <label for="state" class="form-label">State</label>
            <input
              type="text"
              id="state"
              v-model="formData.address.state"
              class="form-input"
              placeholder="State"
            />
          </div>

          <div class="form-group">
            <label for="zip" class="form-label">ZIP</label>
            <input
              type="text"
              id="zip"
              v-model="formData.address.zip"
              class="form-input"
              placeholder="ZIP Code"
            />
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="form-section">
        <h3 class="section-title">Additional Information</h3>

        <div class="form-group">
          <label for="notes" class="form-label">Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            class="form-textarea"
            placeholder="Additional information about this contact..."
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <div class="hint-required">
          <span class="required-mark">*</span> Required fields
        </div>

        <div class="action-buttons">
          <button
            v-if="editContact"
            type="button"
            class="btn-secondary"
            @click="cancelEdit"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="btn-primary"
            :disabled="isSubmitting || !isFormValid"
          >
            <span v-if="isSubmitting" class="spinner-container">
              <span class="spinner"></span>
              <span class="spinner-text">Saving...</span>
            </span>
            <span v-else>
              {{ editContact ? "Update Contact" : "Add Contact" }}
            </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from "vue";

export default {
  name: "ContactForm",
  props: {
    editContact: {
      type: Object,
      default: null,
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["save-contact", "cancel-edit"],
  setup(props, { emit }) {
    // Form state
    const formData = reactive({
      name: "",
      email: "",
      phone: "",
      category: "",
      notes: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    });

    // Category colors
    const categoryColors = {
      family: "#4f46e5", // Indigo
      friend: "#16a34a", // Green
      work: "#ea580c", // Orange
      other: "#6b7280", // Gray
    };

    // Category labels
    const categoryLabels = {
      family: "Family",
      friend: "Friend",
      work: "Work",
      other: "Other",
    };

    // Error state
    const errors = reactive({
      name: "",
      email: "",
      phone: "",
    });

    // Additional state
    const successMessage = ref("");

    // Check if form is valid
    const isFormValid = computed(() => {
      return (
        formData.name.trim() !== "" &&
        isValidEmail(formData.email) &&
        isValidPhone(formData.phone)
      );
    });

    // Fill form when editing a contact
    watch(
      () => props.editContact,
      (newContact) => {
        if (newContact) {
          formData.name = newContact.name || "";
          formData.email = newContact.email || "";
          formData.phone = newContact.phone || "";
          formData.category = normalizeCategory(newContact.category) || "";
          formData.notes = newContact.notes || "";

          // Handle address
          if (newContact.address) {
            formData.address = {
              street: newContact.address.street || "",
              city: newContact.address.city || "",
              state: newContact.address.state || "",
              zip: newContact.address.zip || "",
            };
          } else {
            resetAddress();
          }
        } else {
          resetForm();
        }
      },
      { immediate: true }
    );

    // Get category color
    const getCategoryColor = () => {
      return categoryColors[formData.category] || "#e5e7eb";
    };

    // Get category label
    const getCategoryLabel = (category) => {
      return categoryLabels[category] || category;
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "Never";

      try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    };

    // Normalize category (handle old French categories)
    const normalizeCategory = (category) => {
      if (!category) return "";
      
      // Map old French categories to new English ones
      const categoryMap = {
        famille: "family",
        amis: "friend",
        travail: "work",
        autres: "other",
      };
      
      return categoryMap[category] || category;
    };

    // Form validation
    const validateForm = () => {
      let isValid = true;

      // Reset errors
      errors.name = "";
      errors.email = "";
      errors.phone = "";

      // Validate name
      if (!formData.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      }

      // Validate email
      if (!formData.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email";
        isValid = false;
      }

      // Validate phone
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
        isValid = false;
      } else if (!isValidPhone(formData.phone)) {
        errors.phone = "Please enter a valid phone number (10 digits)";
        isValid = false;
      }

      return isValid;
    };

    // Validate email
    const isValidEmail = (email) => {
      if (!email) return false;
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    // Validate phone
    const isValidPhone = (phone) => {
      if (!phone) return false;
      // Simple format: 10 digits
      const re = /^\d{10}$/;
      return re.test(phone);
    };

    // Submit form
    const submitForm = async () => {
      if (!validateForm()) return;

      try {
        // Prepare data
        const contactData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category || "other", // Default value
          notes: formData.notes,
          updatedAt: new Date().toISOString(),
          address: {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            zip: formData.address.zip,
          },
        };

        // If editing a contact, add ID and preserve creation date
        if (props.editContact) {
          contactData.id = props.editContact.id;
          contactData.createdAt = props.editContact.createdAt;
        } else {
          // For new contact, set creation date
          contactData.createdAt = new Date().toISOString();
        }

        // Emit save event
        emit("save-contact", contactData);

        // Show success message
        successMessage.value = props.editContact
          ? "Contact updated successfully!"
          : "Contact added successfully!";

        // Clear message after delay
        setTimeout(() => {
          successMessage.value = "";
        }, 5000);

        // Reset form if not editing
        if (!props.editContact) {
          resetForm();
        }
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    };

    // Reset form
    const resetForm = () => {
      formData.name = "";
      formData.email = "";
      formData.phone = "";
      formData.category = "";
      formData.notes = "";
      resetAddress();

      // Reset errors
      errors.name = "";
      errors.email = "";
      errors.phone = "";
    };

    // Reset address fields
    const resetAddress = () => {
      formData.address = {
        street: "",
        city: "",
        state: "",
        zip: "",
      };
    };

    // Cancel edit
    const cancelEdit = () => {
      emit("cancel-edit");
      resetForm();
    };

    return {
      formData,
      errors,
      successMessage,
      isFormValid,
      categoryColors,
      submitForm,
      cancelEdit,
      getCategoryColor,
      getCategoryLabel,
      formatDate,
    };
  },
};
</script>

<style scoped>
.contact-form-container {
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.last-updated {
  font-size: 0.75rem;
  color: #6b7280;
}

.success-message {
  display: flex;
  align-items: center;
  background-color: #d1fae5;
  border-left: 4px solid #10b981;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.message-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #10b981;
  margin-right: 0.75rem;
}

.close-message-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
}

.close-message-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.close-icon {
  width: 1rem;
  height: 1rem;
}

.contact-form {
  width: 100%;
}

.form-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .form-sections {
    grid-template-columns: 1fr 1fr;
  }
}

.form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required-mark {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #1f2937;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.address-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.form-input.with-icon {
  padding-left: 2.5rem;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input-help {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' /%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.category-selector {
  display: flex;
  align-items: center;
}

.category-selector .form-select {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.color-preview {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-left: none;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.hint-required {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.spinner-container {
  display: flex;
  align-items: center;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.spinner-text {
  font-size: 0.875rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .form-sections {
    grid-template-columns: 1fr;
  }

  .address-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .hint-required {
    order: 2;
  }

  .action-buttons {
    order: 1;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
  }
}
</style>