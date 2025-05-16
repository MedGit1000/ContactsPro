// src/composables/useContacts.js

import { ref, computed } from 'vue';
import contactService from '@/services/api';
import { getStandardCategory } from '@/config/constants';

/**
 * Composable for managing contacts
 */
export function useContacts() {
    const contacts = ref([]);
    const selectedContact = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    /**
     * Load all contacts
     */
    const loadContacts = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            contacts.value = await contactService.getAllContacts();

            // Normalize categories to ensure consistency
            contacts.value.forEach(contact => {
                if (contact.category) {
                    contact.category = getStandardCategory(contact.category);
                }
            });

            // Select first contact if none selected
            if (!selectedContact.value && contacts.value.length > 0) {
                selectedContact.value = contacts.value[0];
            }
        } catch (err) {
            error.value = err.message || 'Failed to load contacts';
            console.error('Error loading contacts:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Search contacts
     * @param {string} term - Search term
     */
    const searchContacts = async (term) => {
        if (!term.trim()) {
            await loadContacts();
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            contacts.value = await contactService.searchContacts(term);
        } catch (err) {
            error.value = err.message || 'Failed to search contacts';
            console.error('Error searching contacts:', err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Create a new contact
     * @param {Object} contactData - Contact data
     */
    const createContact = async (contactData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Set timestamps
            contactData.createdAt = new Date().toISOString();
            contactData.updatedAt = new Date().toISOString();

            // Ensure standard category
            contactData.category = getStandardCategory(contactData.category);

            const newContact = await contactService.createContact(contactData);
            contacts.value.push(newContact);
            selectedContact.value = newContact;

            return { success: true, contact: newContact };
        } catch (err) {
            error.value = err.message || 'Failed to create contact';
            console.error('Error creating contact:', err);
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Update an existing contact
     * @param {Object} contactData - Updated contact data
     */
    const updateContact = async (contactData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Update timestamp
            contactData.updatedAt = new Date().toISOString();

            // Ensure standard category
            contactData.category = getStandardCategory(contactData.category);

            const updatedContact = await contactService.updateContact(contactData.id, contactData);

            // Update in contacts array
            const index = contacts.value.findIndex(c => c.id === updatedContact.id);
            if (index !== -1) {
                contacts.value[index] = updatedContact;
            }

            // Update selected contact if it was updated
            if (selectedContact.value && selectedContact.value.id === updatedContact.id) {
                selectedContact.value = updatedContact;
            }

            return { success: true, contact: updatedContact };
        } catch (err) {
            error.value = err.message || 'Failed to update contact';
            console.error('Error updating contact:', err);
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Delete a contact
     * @param {number} id - Contact ID
     */
    const deleteContact = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            await contactService.deleteContact(id);

            // Remove from contacts array
            contacts.value = contacts.value.filter(c => c.id !== id);

            // Reset selected contact if it was deleted
            if (selectedContact.value && selectedContact.value.id === id) {
                selectedContact.value = contacts.value.length > 0 ? contacts.value[0] : null;
            }

            return { success: true };
        } catch (err) {
            error.value = err.message || 'Failed to delete contact';
            console.error('Error deleting contact:', err);
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Select a contact
     * @param {Object} contact - Contact to select
     */
    const selectContact = (contact) => {
        selectedContact.value = contact;
    };

    /**
     * Filter contacts by category
     * @param {string} category - Category to filter by
     */
    const filterByCategory = (category) => {
        if (!category) {
            return contacts.value;
        }

        const standardCategory = getStandardCategory(category);
        return contacts.value.filter(contact =>
            getStandardCategory(contact.category) === standardCategory
        );
    };

    // Return all functions and reactive variables
    return {
        contacts,
        selectedContact,
        isLoading,
        error,
        loadContacts,
        searchContacts,
        createContact,
        updateContact,
        deleteContact,
        selectContact,
        filterByCategory
    };
}