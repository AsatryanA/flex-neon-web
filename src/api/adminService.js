import api from './axios';

// Admin endpoints (requires ADMIN role)

// ========== PORTFOLIO ==========

export const getAdminPortfolio = () => api.get('/api/admin/portfolio');
export const getAdminPortfolioItem = (id) => api.get(`/api/admin/portfolio/${id}`);
export const createPortfolioItem = (data) => api.post('/api/admin/portfolio', data);
export const updatePortfolioItem = (id, data) => api.put(`/api/admin/portfolio/${id}`, data);
export const deletePortfolioItem = (id) => api.delete(`/api/admin/portfolio/${id}`);

// ========== FEATURES ==========

export const getAdminFeatures = () => api.get('/api/admin/features');
export const createFeature = (data) => api.post('/api/admin/features', data);
export const updateFeature = (id, data) => api.put(`/api/admin/features/${id}`, data);
export const deleteFeature = (id) => api.delete(`/api/admin/features/${id}`);

// ========== SHOWCASE ==========

export const getAdminShowcase = () => api.get('/api/admin/showcase');
export const createShowcaseItem = (data) => api.post('/api/admin/showcase', data);
export const updateShowcaseItem = (id, data) => api.put(`/api/admin/showcase/${id}`, data);
export const deleteShowcaseItem = (id) => api.delete(`/api/admin/showcase/${id}`);

// ========== STATS ==========

export const getAdminStats = () => api.get('/api/admin/stats');
export const createStat = (data) => api.post('/api/admin/stats', data);
export const updateStat = (id, data) => api.put(`/api/admin/stats/${id}`, data);
export const deleteStat = (id) => api.delete(`/api/admin/stats/${id}`);

// ========== TEAM ==========

export const getAdminTeam = () => api.get('/api/admin/team');
export const createTeamMember = (data) => api.post('/api/admin/team', data);
export const updateTeamMember = (id, data) => api.put(`/api/admin/team/${id}`, data);
export const deleteTeamMember = (id) => api.delete(`/api/admin/team/${id}`);

// ========== COMPANY VALUES ==========

export const getAdminValues = () => api.get('/api/admin/values');
export const createCompanyValue = (data) => api.post('/api/admin/values', data);
export const updateCompanyValue = (id, data) => api.put(`/api/admin/values/${id}`, data);
export const deleteCompanyValue = (id) => api.delete(`/api/admin/values/${id}`);

// ========== STORY ==========

export const getAdminStory = () => api.get('/api/admin/story');
export const createStorySection = (data) => api.post('/api/admin/story', data);
export const updateStorySection = (id, data) => api.put(`/api/admin/story/${id}`, data);
export const deleteStorySection = (id) => api.delete(`/api/admin/story/${id}`);

// ========== CONTACT ==========

export const getAdminContact = () => api.get('/api/admin/contact');
export const createContactInfo = (data) => api.post('/api/admin/contact', data);
export const updateContactInfo = (id, data) => api.put(`/api/admin/contact/${id}`, data);
export const deleteContactInfo = (id) => api.delete(`/api/admin/contact/${id}`);

// ========== FAQ ==========

export const getAdminFAQs = () => api.get('/api/admin/faq');
export const createFAQ = (data) => api.post('/api/admin/faq', data);
export const updateFAQ = (id, data) => api.put(`/api/admin/faq/${id}`, data);
export const deleteFAQ = (id) => api.delete(`/api/admin/faq/${id}`);

// ========== RENTAL PACKAGES ==========

export const getAdminRentalPackages = () => api.get('/api/admin/rental-packages');
export const createRentalPackage = (data) => api.post('/api/admin/rental-packages', data);
export const updateRentalPackage = (id, data) => api.put(`/api/admin/rental-packages/${id}`, data);
export const deleteRentalPackage = (id) => api.delete(`/api/admin/rental-packages/${id}`);

// ========== OCCASIONS ==========

export const getAdminOccasions = () => api.get('/api/admin/occasions');
export const createOccasion = (data) => api.post('/api/admin/occasions', data);
export const updateOccasion = (id, data) => api.put(`/api/admin/occasions/${id}`, data);
export const deleteOccasion = (id) => api.delete(`/api/admin/occasions/${id}`);

// ========== SITE SETTINGS ==========

export const getAdminSettings = () => api.get('/api/admin/settings');
export const getAdminSetting = (id) => api.get(`/api/admin/settings/${id}`);
export const createSetting = (data) => api.post('/api/admin/settings', data);
export const updateSetting = (id, data) => api.put(`/api/admin/settings/${id}`, data);
export const deleteSetting = (id) => api.delete(`/api/admin/settings/${id}`);

const postWithFallback = async (paths, data) => {
  let lastError;

  for (const path of paths) {
    try {
      return await api.post(path, data);
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (status && status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
};

export const changeAdminPassword = (data) => postWithFallback(
  [
    '/api/admin/users/change-password',
    '/api/admin/auth/change-password',
    '/api/admin/change-password',
  ],
  data,
);

export const assignAdminRole = (data) => postWithFallback(
  [
    '/api/admin/users/assign-role',
    '/api/admin/users/promote',
    '/api/admin/roles/assign',
  ],
  data,
);

// ========== IMAGE UPLOAD ==========

export const uploadImage = (file, folder = 'neon') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return api.post('/api/admin/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteImage = (publicId) => {
  return api.delete(`/api/admin/images/${encodeURIComponent(publicId)}`);
};
