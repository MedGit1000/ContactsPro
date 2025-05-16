// src/services/api.js

import axios from 'axios';

// Configure the base API client
const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000 // 10 second timeout
});

// Contact API service
const contactService = {
    // Get all contacts
    getAllContacts() {
        return api.get('/contacts');
    },

    // Search contacts by term
    searchContacts(term) {
        return api.get('/contacts', {
            params: { q: term }
        });
    },

    // Get contact by ID
    getContactById(id) {
        return api.get(`/contacts/${id}`);
    },

    // Create a new contact
    createContact(contactData) {
        return api.post('/contacts', contactData);
    },

    // Update an existing contact
    updateContact(id, contactData) {
        return api.put(`/contacts/${id}`, contactData);
    },

    // Delete a contact
    deleteContact(id) {
        return api.delete(`/contacts/${id}`);
    }
};

export default contactService;