/**
 * Dashboard Page Script
 * Flow: Ambil Bahan → tampil info exp → Generate URL → tampil URL
 */

let currentBahan = null; // bahan yang sedang aktif

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();
});

async function initDashboard() {
  try {
    const token = await chrome.storage.local.get('auth_token');
    if (!token.auth_token) {
      window.location.href = 'login.html';
      return;
    }

    await loadUserInfo();
    setupEventListeners();
  } catch (error) {
    console.error('Dashboard init error:', error);
    showError('Gagal memuat dashboard');
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

// ─── Ambil Bahan ─────────────────────────────────────────────────────────────

async function ambilBahan() {
  const btn = document.getElementById('btn-ambil');
  setButtonLoading(btn, '⏳ Mengambil...');
  hideResult();
  hideError();

  try {
    // Ambil semua bahan dari database, pilih random satu yang valid
    const bahanList = await window.api.getBahanList();

    if (!bahanList || bahanList.length === 0) {
      showError('Tidak ada bahan tersedia di database.');
      return;
    }

    // Filter bahan yang masih aktif (exp setelah hari ini)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validBahan = bahanList.filter(b => {
      if (!b.exp_date) return true; // jika tidak ada exp_date, anggap valid
      const exp = new Date(b.exp_date);
      return exp >= today;
    });

    if (validBahan.length === 0) {
      showError('Semua bahan sudah expired. Hubungi admin.');
      return;
    }

    // Pilih secara random
    const picked = validBahan[Math.floor(Math.random() * validBahan.length)];
    currentBahan = picked;

    // Tampilkan info bahan
    showBahanInfo(picked);

    // Aktifkan tombol Generate URL
    document.getElementById('btn-generate').disabled = false;

  } catch (error) {
    console.error('Ambil bahan error:', error);
    showError(error.message || 'Gagal mengambil bahan dari database.');
  } finally {
    setButtonNormal(btn, '🎲', 'Ambil Bahan');
  }
}

function showBahanInfo(bahan) {
  document.getElementById('status-idle').classList.add('hidden');
  document.getElementById('status-loaded').classList.remove('hidden');

  // Nama bahan
  const nameEl = document.getElementById('bahan-name');
  nameEl.textContent = bahan.filename || bahan.name || `Bahan #${bahan.id}`;

  // Tanggal exp
  const expEl = document.getElementById('exp-text');
  const badgeEl = document.getElementById('exp-badge');

  if (bahan.exp_date) {
    const expDate = new Date(bahan.exp_date);
    const diffDays = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));

    const formattedDate = expDate.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    expEl.textContent = `Exp: ${formattedDate}`;

    // Warnai badge berdasarkan sisa hari
    badgeEl.className = 'exp-badge';
    if (diffDays <= 3) badgeEl.classList.add('exp-critical');
    else if (diffDays <= 7) badgeEl.classList.add('exp-warning');
    else badgeEl.classList.add('exp-ok');

  } else {
    expEl.textContent = 'Exp: Tidak diketahui';
    badgeEl.className = 'exp-badge exp-unknown';
  }
}

// ─── Generate URL ─────────────────────────────────────────────────────────────

async function generateUrl() {
  if (!currentBahan) {
    showError('Ambil bahan dulu sebelum generate URL.');
    return;
  }

  const btn = document.getElementById('btn-generate');
  setButtonLoading(btn, '⏳ Generating...');
  hideResult();
  hideError();

  try {
    const response = await window.api.generateToken(currentBahan.id);

    // response.content berisi URL / token yang dihasilkan
    const urlContent = response.content || response.url || response.token || JSON.stringify(response);

    showResult('🔗 URL Generated', urlContent);

  } catch (error) {
    console.error('Generate URL error:', error);
    showError(error.message || 'Gagal generate URL.');
  } finally {
    setButtonNormal(btn, '🔗', 'Generate URL');
  }
}

// ─── Result Display ───────────────────────────────────────────────────────────

function showResult(title, content) {
  const box = document.getElementById('result-box');
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-content').textContent = content;
  box.classList.remove('hidden');
}

function hideResult() {
  document.getElementById('result-box').classList.add('hidden');
}

async function copyResult() {
  try {
    const content = document.getElementById('result-content').textContent;
    await navigator.clipboard.writeText(content);

    const btn = document.getElementById('btn-copy');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    showError('Gagal copy ke clipboard.');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setButtonLoading(btn, label) {
  btn.disabled = true;
  btn.querySelector('.btn-label').textContent = label;
}

function setButtonNormal(btn, icon, label) {
  btn.disabled = false;
  btn.querySelector('.btn-icon').textContent = icon;
  btn.querySelector('.btn-label').textContent = label;
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
  setTimeout(() => errorDiv.classList.remove('show'), 6000);
}

function hideError() {
  document.getElementById('error-message').classList.remove('show');
}

async function logout() {
  await chrome.storage.local.clear();
  window.location.href = 'login.html';
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

function setupEventListeners() {
  document.getElementById('btn-ambil').addEventListener('click', ambilBahan);
  document.getElementById('btn-generate').addEventListener('click', generateUrl);
  document.getElementById('btn-copy').addEventListener('click', copyResult);
  document.getElementById('logout-btn').addEventListener('click', logout);
}
