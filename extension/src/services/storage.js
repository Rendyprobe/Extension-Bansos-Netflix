/**
 * Chrome Storage API wrapper
 */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  API_URL: 'api_url',
  PREFERENCES: 'preferences',
};

const storage = {
  // Auth token management
  async getToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.TOKEN, (data) => {
        resolve(data[STORAGE_KEYS.TOKEN] || null);
      });
    });
  },

  async setToken(token) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.TOKEN]: token }, () => {
        resolve();
      });
    });
  },

  async removeToken() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(STORAGE_KEYS.TOKEN, () => {
        resolve();
      });
    });
  },

  // User data management
  async getUser() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.USER, (data) => {
        resolve(data[STORAGE_KEYS.USER] || null);
      });
    });
  },

  async setUser(user) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.USER]: user }, () => {
        resolve();
      });
    });
  },

  async removeUser() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(STORAGE_KEYS.USER, () => {
        resolve();
      });
    });
  },

  // API URL management
  async getApiUrl() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.API_URL, (data) => {
        resolve(data[STORAGE_KEYS.API_URL] || 'https://bansos-netflix-api.25051204307.workers.dev');
      });
    });
  },

  async setApiUrl(url) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.API_URL]: url }, () => {
        resolve();
      });
    });
  },

  // Clear all
  async clearAll() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  },

  // Check if user is logged in
  async isLoggedIn() {
    const token = await this.getToken();
    return !!token;
  },
};

// Export for global use
window.storage = storage;
