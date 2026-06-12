/**
 * Login Page Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    try {
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      // Call login API
      const response = await window.api.login(username, password);

      // Save token dan user data
      await chrome.storage.local.set({
        auth_token: response.token,
        user_data: response.user,
      });

      // Redirect ke dashboard
      window.location.href = 'dashboard.html';
    } catch (error) {
      errorDiv.textContent = error.message || 'Login failed. Please try again.';
      errorDiv.classList.add('show');

      // Reset button
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';

      console.error('Login error:', error);
    }
  });
});
