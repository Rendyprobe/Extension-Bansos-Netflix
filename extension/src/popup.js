/**
 * Popup Script - Route ke login atau dashboard
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = await chrome.storage.local.get('auth_token');
    const page = token.auth_token ? 'dashboard.html' : 'login.html';
    window.location.replace(`pages/${page}`);
  } catch (error) {
    console.error('Popup init error:', error);
    window.location.replace('pages/login.html');
  }
});
