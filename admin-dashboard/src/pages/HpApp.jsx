import { useEffect, useMemo, useState } from 'react';
import hpApi, {
  clearHpSession,
  getStoredHpUser,
  HP_STORAGE_KEYS,
  saveHpSession,
} from '../services/hpApi';
import '../styles/hp-app.css';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function HpLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await hpApi.login(username.trim(), password);
      saveHpSession(response.token, response.user);
      onLogin(response.user);
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hp-app-shell hp-login-screen">
      <section className="hp-login-panel" aria-labelledby="hp-login-title">
        <div className="hp-brand-mark" aria-hidden="true">BN</div>
        <h1 id="hp-login-title">Bansos Netflix</h1>

        <form className="hp-login-form" onSubmit={handleSubmit}>
          <label htmlFor="hp-username">Username</label>
          <input
            autoComplete="username"
            id="hp-username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            required
            type="text"
            value={username}
          />

          <label htmlFor="hp-password">Password</label>
          <input
            autoComplete="current-password"
            id="hp-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />

          {error && <div className="hp-alert hp-alert-error">{error}</div>}

          <button className="hp-primary-button" disabled={loading} type="submit">
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

function HpDashboard({ user, onLogout }) {
  const [currentBahan, setCurrentBahan] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');

  const bahanName = useMemo(() => {
    if (!currentBahan) return '';
    return currentBahan.filename || currentBahan.name || `Bahan #${currentBahan.id}`;
  }, [currentBahan]);

  const handleApiError = (err, fallback) => {
    if (err.message === 'Invalid or expired token') {
      clearHpSession();
      onLogout();
      return;
    }

    setError(err.message || fallback);
  };

  const handleAmbilBahan = async () => {
    setLoadingAction('ambil');
    setError('');
    setResultUrl('');
    setCopied(false);

    try {
      const bahanList = await hpApi.getBahanList();
      if (!Array.isArray(bahanList) || bahanList.length === 0) {
        setError('Tidak ada bahan tersedia di database.');
        return;
      }

      const picked = bahanList[Math.floor(Math.random() * bahanList.length)];
      setCurrentBahan(picked);
    } catch (err) {
      handleApiError(err, 'Gagal mengambil bahan dari database.');
    } finally {
      setLoadingAction('');
    }
  };

  const handleGenerateUrl = async () => {
    if (!currentBahan) {
      setError('Ambil bahan dulu sebelum generate URL.');
      return;
    }

    setLoadingAction('generate');
    setError('');
    setCopied(false);

    try {
      const response = await hpApi.generateToken(currentBahan.id);
      if (!response.url) {
        throw new Error('URL tidak berhasil digenerate.');
      }
      setResultUrl(response.url);
    } catch (err) {
      handleApiError(err, 'Gagal generate URL.');
    } finally {
      setLoadingAction('');
    }
  };

  const handleCopy = async () => {
    if (!resultUrl) return;

    try {
      await copyText(resultUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Gagal copy URL.');
    }
  };

  return (
    <main className="hp-app-shell">
      <section className="hp-dashboard-panel" aria-label="Bansos Netflix web HP">
        <header className="hp-dashboard-header">
          <div>
            <span className="hp-eyebrow">Versi HP</span>
            <h1>Bansos Netflix</h1>
          </div>
          <div className="hp-account-actions">
            <span>{user?.username}</span>
            <button className="hp-ghost-button" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        </header>

        <div className="hp-status-card">
          <span className="hp-status-label">{currentBahan ? 'Bahan aktif' : 'Status'}</span>
          <strong>{currentBahan ? bahanName : 'Belum ada bahan dipilih'}</strong>
        </div>

        <div className="hp-action-grid">
          <button
            className="hp-action-button hp-action-pick"
            disabled={Boolean(loadingAction)}
            onClick={handleAmbilBahan}
            type="button"
          >
            <span aria-hidden="true">A</span>
            <strong>{loadingAction === 'ambil' ? 'Mengambil...' : 'Ambil Bahan'}</strong>
          </button>

          <button
            className="hp-action-button hp-action-generate"
            disabled={!currentBahan || Boolean(loadingAction)}
            onClick={handleGenerateUrl}
            type="button"
          >
            <span aria-hidden="true">G</span>
            <strong>{loadingAction === 'generate' ? 'Generating...' : 'Generate URL'}</strong>
          </button>
        </div>

        {resultUrl && (
          <div className="hp-result-box">
            <div className="hp-result-header">
              <span>URL Generated</span>
              <button
                className={copied ? 'hp-copy-button copied' : 'hp-copy-button'}
                onClick={handleCopy}
                type="button"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p>{resultUrl}</p>
          </div>
        )}

        {error && <div className="hp-alert hp-alert-error">{error}</div>}
      </section>
    </main>
  );
}

function HpApp() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    clearHpSession();
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem(HP_STORAGE_KEYS.TOKEN);
    const storedUser = getStoredHpUser();

    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    hpApi
      .getCurrentUser()
      .then((freshUser) => {
        saveHpSession(token, freshUser);
        setUser(freshUser);
      })
      .catch(() => {
        clearHpSession();
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="hp-loading-screen">Loading...</main>;
  }

  if (!user) {
    return <HpLogin onLogin={setUser} />;
  }

  return <HpDashboard user={user} onLogout={handleLogout} />;
}

export default HpApp;
