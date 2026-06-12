/**
 * Dashboard Page Script
 */

let allBahan = [];
let filteredBahan = [];

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();
});

async function initDashboard() {
  try {
    // Check if user is logged in
    const token = await chrome.storage.local.get('auth_token');
    if (!token.auth_token) {
      window.location.href = 'login.html';
      return;
    }

    // Get current user
    await loadUserInfo();

    // Load bahan list
    await loadBahanList();

    // Setup event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Dashboard init error:', error);
    showError('Failed to load dashboard');
  }
}

async function loadUserInfo() {
  try {
    const user = await chrome.storage.local.get('user_data');
    if (user.user_data) {
      document.getElementById('username-display').textContent = user.user_data.username;
    }
  } catch (error) {
    console.error('Failed to load user info:', error);
  }
}

async function loadBahanList() {
  try {
    const bahanListDiv = document.getElementById('bahan-list');
    bahanListDiv.innerHTML = '<div class="loading">Loading bahan...</div>';

    const response = await window.api.getBahanList();
    allBahan = response;
    filteredBahan = response;

    renderBahanList();
  } catch (error) {
    console.error('Failed to load bahan:', error);
    showError(error.message || 'Failed to load bahan list');
    document.getElementById('bahan-list').innerHTML = '';
  }
}

function renderBahanList() {
  const bahanListDiv = document.getElementById('bahan-list');

  if (filteredBahan.length === 0) {
    bahanListDiv.innerHTML = '<div class="loading">No bahan found</div>';
    return;
  }

  bahanListDiv.innerHTML = filteredBahan.map(bahan => `
    <div class="bahan-item">
      <div class="bahan-item-header">
        <div>
          <div class="bahan-item-title">${escapeHtml(bahan.filename)}</div>
          <div class="bahan-item-date">${new Date(bahan.upload_date).toLocaleDateString()}</div>
        </div>
      </div>
      <div class="bahan-item-actions">
        <button class="btn-generate" onclick="generateToken(${bahan.id})">
          Generate Token
        </button>
      </div>
    </div>
  `).join('');
}

async function generateToken(bahanId) {
  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Generating...';

    const response = await window.api.generateToken(bahanId);
    
    // Show modal dengan token/content
    const modal = document.getElementById('token-modal');
    const tokenContent = document.getElementById('token-content');
    tokenContent.value = response.content;
    
    modal.classList.remove('hidden');
    modal.classList.add('show');

    btn.disabled = false;
    btn.textContent = 'Generate Token';
  } catch (error) {
    console.error('Generate token error:', error);
    showError(error.message || 'Failed to generate token');
    event.target.disabled = false;
    event.target.textContent = 'Generate Token';
  }
}

function setupEventListeners() {
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Search input
  document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredBahan = allBahan.filter(bahan => 
      bahan.filename.toLowerCase().includes(query)
    );
    renderBahanList();
  });

  // Modal close button
  document.getElementById('modal-close').addEventListener('click', closeModal);

  // Copy token button
  document.getElementById('copy-token-btn').addEventListener('click', copyToken);

  // Close modal when clicking outside
  document.getElementById('token-modal').addEventListener('click', (e) => {
    if (e.target.id === 'token-modal') {
      closeModal();
    }
  });
}

async function logout() {
  try {
    await chrome.storage.local.clear();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

function closeModal() {
  const modal = document.getElementById('token-modal');
  modal.classList.add('hidden');
  modal.classList.remove('show');
}

async function copyToken() {
  try {
    const tokenContent = document.getElementById('token-content');
    await navigator.clipboard.writeText(tokenContent.value);
    
    const btn = document.getElementById('copy-token-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('Copy error:', error);
    showError('Failed to copy to clipboard');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  
  setTimeout(() => {
    errorDiv.classList.remove('show');
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally
window.generateToken = generateToken;
