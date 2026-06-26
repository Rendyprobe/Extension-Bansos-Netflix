const DEFAULT_API_URL = 'https://bansos-netflix-api.25051204307.workers.dev';
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export const HP_STORAGE_KEYS = {
  TOKEN: 'hp_auth_token',
  USER: 'hp_user_data',
  API_URL: 'hp_api_url',
};

export function getStoredHpUser() {
  const rawUser = localStorage.getItem(HP_STORAGE_KEYS.USER);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(HP_STORAGE_KEYS.USER);
    return null;
  }
}

export function saveHpSession(token, user) {
  localStorage.setItem(HP_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(HP_STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearHpSession() {
  localStorage.removeItem(HP_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(HP_STORAGE_KEYS.USER);
}

async function getApiUrl() {
  return localStorage.getItem(HP_STORAGE_KEYS.API_URL) || API_URL;
}

const hpApi = {
  async makeRequest(endpoint, options = {}) {
    try {
      const apiUrl = await getApiUrl();
      const config = {
        method: options.method || 'GET',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...this.getAuthHeader(endpoint),
        },
      };

      const response = await fetch(`${apiUrl}/api${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('HP API error:', error);
      throw error;
    }
  },

  getAuthHeader(endpoint) {
    if (endpoint.includes('/auth/login')) return {};

    const token = localStorage.getItem(HP_STORAGE_KEYS.TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(username, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getCurrentUser() {
    return this.makeRequest('/auth/me');
  },

  async getBahanList() {
    return this.makeRequest('/bahan');
  },

  async generateToken(bahanId) {
    return this.makeRequest(`/bahan/${bahanId}/generate-url`, {
      method: 'POST',
    });
  },
};

export default hpApi;
