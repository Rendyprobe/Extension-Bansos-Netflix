const API_URL = import.meta.env.VITE_API_URL || 'https://bansos-netflix-api.25051204307.workers.dev';

const api = {
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_URL}/api${endpoint}`;

      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Tambahkan auth token jika tersedia
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ─── AUTH ──────────────────────────────────────────────────────────────────

  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getMe() {
    return this.makeRequest('/auth/me');
  },

  // ─── BAHAN ─────────────────────────────────────────────────────────────────

  async getBahanList() {
    return this.makeRequest('/bahan');
  },

  async getBahan(id) {
    return this.makeRequest(`/bahan/${id}`);
  },

  async bulkUploadBahan(bahanArray, duplicateMode = 'merge') {
    return this.makeRequest('/bahan/bulk-upload', {
      method: 'POST',
      body: JSON.stringify({ bahanArray, duplicateMode }),
    });
  },

  async bulkDeleteBahan(ids) {
    return this.makeRequest('/bahan/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  // ─── USERS ─────────────────────────────────────────────────────────────────

  async getUsers() {
    return this.makeRequest('/users');
  },

  async createUser(user) {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async deactivateUser(id) {
    return this.makeRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
