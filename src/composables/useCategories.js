// src/composables/useCategories.js

/**
 * Composable for managing contact categories
 */
export function useCategories() {
    // Standard category IDs
    const CATEGORIES = {
        FAMILY: 'family',
        FRIEND: 'friend',
        WORK: 'work',
        OTHER: 'other'
    };

    // Legacy category mapping (French to English)
    const CATEGORY_MAPPING = {
        'famille': CATEGORIES.FAMILY,
        'amis': CATEGORIES.FRIEND,
        'travail': CATEGORIES.WORK,
        'autres': CATEGORIES.OTHER
    };

    // Category colors
    const CATEGORY_COLORS = {
        [CATEGORIES.FAMILY]: '#4f46e5',  // Indigo
        [CATEGORIES.FRIEND]: '#16a34a',  // Green
        [CATEGORIES.WORK]: '#ea580c',    // Orange
        [CATEGORIES.OTHER]: '#6b7280'    // Gray
    };

    // Category labels
    const CATEGORY_LABELS = {
        [CATEGORIES.FAMILY]: 'Family',
        [CATEGORIES.FRIEND]: 'Friend',
        [CATEGORIES.WORK]: 'Work',
        [CATEGORIES.OTHER]: 'Other'
    };

    /**
     * Get the standardized category value (handles both French and English)
     * @param {string} category - Category value
     * @returns {string} - Standardized category
     */
    const getStandardCategory = (category) => {
        if (!category) return CATEGORIES.OTHER;

        // Check if it's already a standard category
        if (Object.values(CATEGORIES).includes(category)) {
            return category;
        }

        // Try to map from legacy French categories
        return CATEGORY_MAPPING[category] || CATEGORIES.OTHER;
    };

    /**
     * Get the color for a category
     * @param {string} category - Category value
     * @returns {string} - Hex color code
     */
    const getCategoryColor = (category) => {
        const standardCategory = getStandardCategory(category);
        return CATEGORY_COLORS[standardCategory] || CATEGORY_COLORS[CATEGORIES.OTHER];
    };

    /**
     * Get the display label for a category
     * @param {string} category - Category value
     * @returns {string} - Display label
     */
    const getCategoryLabel = (category) => {
        const standardCategory = getStandardCategory(category);
        return CATEGORY_LABELS[standardCategory] || 'Other';
    };

    /**
     * Get all categories as an array of objects
     * @returns {Array} - Array of category objects with id, name, and color
     */
    const getAllCategories = () => {
        return Object.values(CATEGORIES).map(category => ({
            id: category,
            name: CATEGORY_LABELS[category],
            color: CATEGORY_COLORS[category]
        }));
    };

    /**
     * Check if a contact belongs to a specific category
     * @param {Object} contact - Contact object
     * @param {string} categoryToCheck - Category to check
     * @returns {boolean} - True if contact belongs to category
     */
    const isInCategory = (contact, categoryToCheck) => {
        if (!contact || !contact.category) return categoryToCheck === CATEGORIES.OTHER;
        return getStandardCategory(contact.category) === categoryToCheck;
    };

    return {
        CATEGORIES,
        CATEGORY_COLORS,
        CATEGORY_LABELS,
        getStandardCategory,
        getCategoryColor,
        getCategoryLabel,
        getAllCategories,
        isInCategory
    };
}