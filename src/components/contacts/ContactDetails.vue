<template>
  <div class="contact-details-container">
    <div v-if="contact" class="contact-details">
      <div class="contact-profile">
        <div
          class="contact-avatar"
          :style="getAvatarStyle"
        >
          <span v-if="!contact.avatar">{{ getInitials }}</span>
          <img
            v-else
            :src="contact.avatar"
            :alt="contact.name"
          />
        </div>
        <h2 class="contact-name">{{ contact.name }}</h2>
        <span 
          class="contact-category" 
          :style="{ backgroundColor: getCategoryColor(contact.category) }"
        >
          {{ getCategoryLabel(contact.category) }}
        </span>

        <div class="contact-actions">
          <button class="action-circle call" @click="callContact">
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
          </button>
          <button class="action-circle email" @click="emailContact">
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
          </button>
          <button class="action-circle message" @click="messageContact">
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
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              ></path>
            </svg>
          </button>
          <button class="action-circle video" @click="videoContact">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect
                x="1"
                y="5"
                width="15"
                height="14"
                rx="2"
                ry="2"
              ></rect>
            </svg>
          </button>
        </div>
      </div>

      <div class="contact-info-sections">
        <!-- Contact information section -->
        <div class="info-section">
          <div class="info-item">
            <div class="info-icon phone">
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
            </div>
            <div class="info-content">
              <a :href="`tel:${contact.phone}`" class="info-link">
                {{ formatPhoneNumber(contact.phone) || "No phone number" }}
              </a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon email">
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
            </div>
            <div class="info-content">
              <a :href="`mailto:${contact.email}`" class="info-link">
                {{ contact.email || "No email address" }}
              </a>
            </div>
          </div>

          <div class="info-item" v-if="hasAddress">
            <div class="info-icon location">
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
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                ></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="info-content">
              <div v-if="contact.address.street">
                {{ contact.address.street }}<br />
              </div>
              <div v-if="cityStateZip">
                {{ cityStateZip }}
              </div>
              <div v-if="!hasAddress">
                No address
              </div>
            </div>
          </div>
        </div>

        <!-- Notes section -->
        <div
          class="info-section note-section"
          v-if="contact.notes"
        >
          <h3 class="section-title">Notes</h3>
          <p class="note-content">{{ contact.notes }}</p>
        </div>
        
        <!-- Date information section -->
        <div class="info-section date-section">
          <div class="date-info">
            <span class="date-label">Created:</span>
            <span class="date-value">{{ formatDate(contact.createdAt) }}</span>
          </div>
          <div class="date-info">
            <span class="date-label">Last updated:</span>
            <span class="date-value">{{ formatDate(contact.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="contact-edit">
        <button class="edit-btn" @click="$emit('edit', contact)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="edit-icon"
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
      </div>
    </div>

    <!-- Default state - No contact selected -->
    <div v-else class="no-contact-selected">
      <div class="default-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="default-icon"
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
        <h2>Select a contact</h2>
        <p>Choose a contact from the list or add a new one</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ContactDetails',
  props: {
    /**
     * Contact object to display
     */
    contact: {
      type: Object,
      default: null
    }
  },
  emits: ['edit'],
  setup(props) {
    // Category colors
    const categoryColors = {
      family: "#4f46e5", // Indigo
      friend: "#16a34a", // Green
      work: "#ea580c",   // Orange
      other: "#6b7280"   // Gray
    };
    
    // Category labels
    const categoryLabels = {
      family: "Family",
      friend: "Friend",
      work: "Work",
      other: "Other"
    };
    
    // Map old categories (French) to new ones
    const categoryMapping = {
      famille: "family",
      amis: "friend",
      travail: "work",
      autres: "other"
    };
    
    // Get normalized category
    const getNormalizedCategory = (category) => {
      if (!category) return "other";
      return categoryMapping[category] || category;
    };
    
    // Get category color
    const getCategoryColor = (category) => {
      const normalizedCategory = getNormalizedCategory(category);
      return categoryColors[normalizedCategory] || categoryColors.other;
    };
    
    // Get category label
    const getCategoryLabel = (category) => {
      const normalizedCategory = getNormalizedCategory(category);
      return categoryLabels[normalizedCategory] || normalizedCategory || "Other";
    };
    
    // Get initials from name
    const getInitials = computed(() => {
      if (!props.contact || !props.contact.name) return "";
      
      return props.contact.name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    });
    
    // Get avatar style
    const getAvatarStyle = computed(() => {
      if (!props.contact) return {};
      
      if (props.contact.avatar) {
        return {}; // Use image avatar
      }
      
      // Generate background color from category
      const normalizedCategory = getNormalizedCategory(props.contact.category);
      const backgroundColor = categoryColors[normalizedCategory] || categoryColors.other;
      
      return {
        backgroundColor,
        color: "white",
        fontSize: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      };
    });
    
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "Not specified";
      
      try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        
        return new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(date);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    };
    
    // Format phone number
    const formatPhoneNumber = (phone) => {
      if (!phone) return "";
      
      // Format as (XXX) XXX-XXXX if it's a 10-digit number
      if (/^\d{10}$/.test(phone)) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
      }
      
      return phone;
    };
    
    // Check if contact has address
    const hasAddress = computed(() => {
      if (!props.contact || !props.contact.address) return false;
      
      const address = props.contact.address;
      return Boolean(address.street || address.city || address.state || address.zip);
    });
    
    // Get city, state, zip
    const cityStateZip = computed(() => {
      if (!props.contact || !props.contact.address) return "";
      
      const address = props.contact.address;
      return [address.city, address.state, address.zip]
        .filter(Boolean)
        .join(", ");
    });
    
    // Action methods
    const callContact = () => {
      if (props.contact && props.contact.phone) {
        window.location.href = `tel:${props.contact.phone}`;
      }
    };
    
    const emailContact = () => {
      if (props.contact && props.contact.email) {
        window.location.href = `mailto:${props.contact.email}`;
      }
    };
    
    const messageContact = () => {
      if (props.contact && props.contact.phone) {
        window.location.href = `sms:${props.contact.phone}`;
      }
    };
    
    const videoContact = () => {
      if (props.contact && props.contact.email) {
        // In a real app, this would launch a video call app
        alert(`Video call feature coming soon! Would call ${props.contact.name}`);
      }
    };
    
    return {
      getInitials,
      getAvatarStyle,
      formatDate,
      formatPhoneNumber,
      getCategoryColor,
      getCategoryLabel,
      hasAddress,
      cityStateZip,
      callContact,
      emailContact,
      messageContact,
      videoContact
    };
  }
};
</script>

<style scoped>
.contact-details-container {
  height: 100%;
  overflow-y: auto;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
}

.contact-avatar {
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.contact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.contact-category {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
}

.contact-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.action-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f3f4f6;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.action-circle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.action-circle.call:hover {
  background-color: #ecfdf5;
  color: #10b981;
}

.action-circle.email:hover {
  background-color: #eff6ff;
  color: #3b82f6;
}

.action-circle.message:hover {
  background-color: #f3e8ff;
  color: #8b5cf6;
}

.action-circle.video:hover {
  background-color: #fef2f2;
  color: #ef4444;
}

.contact-info-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.info-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.info-icon.phone {
  background-color: #ecfdf5;
  color: #10b981;
}

.info-icon.email {
  background-color: #eff6ff;
  color: #3b82f6;
}

.info-icon.location {
  background-color: #fff7ed;
  color: #f97316;
}

.info-content {
  flex: 1;
  font-size: 0.9375rem;
  color: #4b5563;
}

.info-link {
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s;
}

.info-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.note-section {
  background-color: white;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.note-content {
  font-size: 0.9375rem;
  color: #4b5563;
  margin: 0;
  white-space: pre-line;
}

.date-section {
  background-color: white;
  border: 1px solid #e5e7eb;
}

.date-info {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.date-info:last-child {
  margin-bottom: 0;
}

.date-label {
  color: #6b7280;
  display: inline-block;
  width: 6rem;
}

.date-value {
  color: #4b5563;
}

.contact-edit {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.edit-icon {
  width: 1rem;
  height: 1rem;
}

.no-contact-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.default-state {
  text-align: center;
  padding: 3rem;
}

.default-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.default-state h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.default-state p {
  color: #6b7280;
  margin: 0;
}
</style>