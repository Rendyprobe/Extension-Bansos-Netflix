/**
 * Popup Script - Route ke login atau dashboard
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if user is logged in
    const token = await chrome.storage.local.get('auth_token');
    
    if (token.auth_token) {
      // Load dashboard
      loadPage('dashboard.html');
    } else {
      // Load login page
      loadPage('login.html');
    }
  } catch (error) {
    console.error('Popup init error:', error);
    loadPage('login.html');
  }
});

async function loadPage(pageFile) {
  try {
    const container = document.getElementById('popup-container');
    const response = await fetch(`src/pages/${pageFile}`);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error('Failed to load page:', error);
    document.getElementById('popup-container').innerHTML = 
      '<div style="padding: 20px; color: red;">Error loading page</div>';
  }
}
