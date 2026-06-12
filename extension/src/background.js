/**
 * Background Service Worker
 */

// Listen for extension install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open setup page on first install
    chrome.tabs.create({ url: 'src/pages/login.html' });
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getToken') {
    chrome.storage.local.get('auth_token', (data) => {
      sendResponse({ token: data.auth_token });
    });
    return true;
  }

  if (request.action === 'logout') {
    chrome.storage.local.clear(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Context menu untuk copy token
chrome.contextMenus.create({
  id: 'copy-bahan',
  title: 'Bansos Netflix: Copy Content',
  contexts: ['editable'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-bahan') {
    // Notify popup
    chrome.runtime.sendMessage({
      action: 'showBahanSelector',
    });
  }
});
