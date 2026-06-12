const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000';

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

      // Add auth token
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

  // Auth
  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Bahan
  async getBahanList() {
    return this.makeRequest('/bahan');
  },

  async bulkUploadBahan(bahanArray) {
    return this.makeRequest('/bahan/bulk-upload', {
      method: 'POST',
      body: JSON.stringify({ bahanArray }),
    });
  },

  async bulkDeleteBahan(ids) {
    return this.makeRequest('/bahan/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },
};

export default api;
