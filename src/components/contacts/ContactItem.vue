<template>
  <div
    class="contact-item"
    :class="{ active: isSelected }"
    @click="$emit('select')"
  >
    <div class="avatar" :style="avatarStyle">
      <span v-if="!contact.avatar">{{ initials }}</span>
      <img v-else :src="contact.avatar" :alt="contact.name" />
    </div>
    <div class="contact-details">
      <div class="contact-name">{{ contact.name }}</div>
      <div class="contact-info">{{ contact.email }}</div>
      <div class="contact-info">{{ formatPhone }}</div>
    </div>
    <div class="contact-actions">
      <button
        class="action-btn edit"
        @click.stop="$emit('edit')"
        title="Edit contact"
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
        class="action-btn delete"
        @click.stop="$emit('delete')"
        title="Delete contact"
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
</template>

<script>
import { computed } from "vue";

export default {
  name: "ContactItem",
  props: {
    /**
     * Contact object to display
     */
    contact: {
      type: Object,
      required: true,
    },
    /**
     * Whether this contact is currently selected
     */
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select", "edit", "delete"],
  setup(props) {
    // Category colors
    const categoryColors = {
      family: "#4f46e5", // Indigo
      friend: "#16a34a", // Green
      work: "#ea580c", // Orange
      other: "#6b7280", // Gray
      // Legacy French categories for backwards compatibility
      famille: "#4f46e5",
      amis: "#16a34a",
      travail: "#ea580c",
      autres: "#6b7280",
    };

    // Get the initials from the contact name
    const initials = computed(() => {
      if (!props.contact.name) return "";

      return props.contact.name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    });

    // Format phone number for display
    const formatPhone = computed(() => {
      const phone = props.contact.phone;
      if (!phone) return "";
      
      // Format as (XXX) XXX-XXXX if it's a 10-digit number
      if (/^\d{10}$/.test(phone)) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
      }
      
      return phone;
    });

    // Generate avatar style
    const avatarStyle = computed(() => {
      if (props.contact.avatar) {
        return {}; // No specific style for image avatars
      }

      // Generate a color based on category
      let backgroundColor = categoryColors.other;

      if (props.contact.category && categoryColors[props.contact.category]) {
        backgroundColor = categoryColors[props.contact.category];
      } else {
        // Fallback to generating color from name or id
        const seed = props.contact.id || props.contact.name;
        const colorKeys = Object.keys(categoryColors);
        const colorIndex = seed.toString().charCodeAt(0) % colorKeys.length;
        backgroundColor = categoryColors[colorKeys[colorIndex]];
      }

      return {
        backgroundColor,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    });

    return {
      initials,
      avatarStyle,
      formatPhone
    };
  },
};
</script>

<style scoped>
.contact-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.contact-item:hover {
  background-color: #f9fafb;
}

.contact-item.active {
  background-color: #eff6ff;
  border-left: 3px solid #2563eb;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-right: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-details {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.contact-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-info {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-actions {
  display: none;
  gap: 0.5rem;
}

.contact-item:hover .contact-actions {
  display: flex;
}

.action-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
}

.action-btn.edit {
  color: #3b82f6;
}

.action-btn.edit:hover {
  background-color: #eff6ff;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background-color: #fef2f2;
}
</style>