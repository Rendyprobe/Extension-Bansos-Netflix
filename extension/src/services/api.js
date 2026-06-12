/**
 * API Service untuk komunikasi dengan backend
 */

const api = {
  async getApiUrl() {
    const result = await chrome.storage.local.get('api_url');
    return result.api_url || 'https://bansos-netflix-api.25051204307.workers.dev';
  },

  async makeRequest(endpoint, options = {}) {
    try {
      const apiUrl = await this.getApiUrl();
      const url = `${apiUrl}/api${endpoint}`;
      
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token jika ada
      if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        const result = await chrome.storage.local.get('auth_token');
        if (result.auth_token) {
          config.headers['Authorization'] = `Bearer ${result.auth_token}`;
        }
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

  // Auth endpoints
  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getCurrentUser() {
    return this.makeRequest('/auth/me');
  },

  // Bahan endpoints
  async getBahanList() {
    return this.makeRequest('/bahan');
  },

  async getBahanDetail(id) {
    return this.makeRequest(`/bahan/${id}`);
  },

  async generateToken(bahanId) {
    // Untuk sekarang, hanya return content dari bahan
    // Nanti bisa extend untuk actual token generation
    return this.makeRequest(`/bahan/${bahanId}`);
  },
};

// Export for global use
window.api = api;
