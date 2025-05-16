// src/config/constants.js

/**
 * Application constants
 */

export const CATEGORIES = {
    FAMILY: 'family',
    FRIEND: 'friend',
    WORK: 'work',
    OTHER: 'other'
};

export const CATEGORY_COLORS = {
    [CATEGORIES.FAMILY]: '#4f46e5', // Indigo
    [CATEGORIES.FRIEND]: '#16a34a', // Green
    [CATEGORIES.WORK]: '#ea580c',   // Orange
    [CATEGORIES.OTHER]: '#6b7280'   // Gray
};

export const CATEGORY_LABELS = {
    [CATEGORIES.FAMILY]: 'Family',
    [CATEGORIES.FRIEND]: 'Friend',
    [CATEGORIES.WORK]: 'Work',
    [CATEGORIES.OTHER]: 'Other'
};

// Map old French categories to new English ones (for backwards compatibility)
export const CATEGORY_MAPPING = {
    'famille': CATEGORIES.FAMILY,
    'amis': CATEGORIES.FRIEND,
    'travail': CATEGORIES.WORK,
    'autres': CATEGORIES.OTHER
};

// Get standardized category value (handles both French and English)
export const getStandardCategory = (category) => {
    if (!category) return CATEGORIES.OTHER;

    // Check if it's already a standard category
    if (Object.values(CATEGORIES).includes(category)) {
        return category;
    }

    // Try to map from old French categories
    return CATEGORY_MAPPING[category] || CATEGORIES.OTHER;
};

// Format constants
export const DATE_FORMAT_OPTIONS = {
    short: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    },
    long: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
};

// Validation patterns
export const VALIDATION = {
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^\d{10}$/
};