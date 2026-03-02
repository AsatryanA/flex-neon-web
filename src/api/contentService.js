import api from './axios';

// Public content endpoints (no authentication required)

// Portfolio
export const getPortfolio = () => api.get('/api/content/portfolio');
export const getPortfolioByCategory = (category) => api.get(`/api/content/portfolio/category/${category}`);

// Features
export const getFeatures = () => api.get('/api/content/features');

// Showcase
export const getShowcase = () => api.get('/api/content/showcase');

// Stats
export const getStats = () => api.get('/api/content/stats');

// Team
export const getTeam = () => api.get('/api/content/team');

// Company Values
export const getValues = () => api.get('/api/content/values');

// Story
export const getStory = () => api.get('/api/content/story');

// Contact
export const getContactInfo = () => api.get('/api/content/contact');

// FAQ
export const getFAQs = () => api.get('/api/content/faq');

// Rental Packages
export const getRentalPackages = () => api.get('/api/content/rental-packages');

// Occasions
export const getOccasions = () => api.get('/api/content/occasions');

// Site Settings
export const getAllSettings = () => api.get('/api/content/settings');
export const getSetting = (key) => api.get(`/api/content/settings/${key}`);
