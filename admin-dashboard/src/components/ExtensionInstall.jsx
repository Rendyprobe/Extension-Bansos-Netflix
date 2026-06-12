import { useMemo, useState } from 'react';
import '../styles/extension-install.css';

const DOWNLOAD_URL = '/downloads/bansos-netflix-extension.zip';
const STORE_URL = import.meta.env.VITE_EXTENSION_STORE_URL;

function detectBrowser() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('Chrome/')) return 'Chrome';
  return 'browser';
}

function ExtensionInstall() {
  const browser = useMemo(detectBrowser, []);
  const [downloaded, setDownloaded] = useState(false);
  const extensionsUrl = browser === 'Edge' ? 'edge://extensions' : 'chrome://extensions';

  const handleDownload = () => {
    setDownloaded(true);
  };

  const copyExtensionsUrl = async () => {
    await navigator.clipboard.writeText(extensionsUrl);
  };

  return (
    <section className="extension-install">
      <div className="install-container">
        <div className="install-hero">
          <div className="extension-mark" aria-hidden="true">BN</div>
          <div>
            <span className="install-eyebrow">Browser extension</span>
            <h2>Install Bansos Netflix Extension</h2>
            <p>
              Gunakan extension untuk login, melihat bahan, dan menyalin konten
              langsung dari toolbar browser.
            </p>
          </div>
        </div>

        <div className="install-card">
          <div className="install-summary">
            <div>
              <h3>Versi 1.0.1</h3>
              <p>Browser terdeteksi: {browser}</p>
            </div>
            <span className="status-badge">Siap diinstall</span>
          </div>

          {STORE_URL ? (
            <a className="install-primary-button" href={STORE_URL} target="_blank" rel="noreferrer">
              Install dari Web Store
            </a>
          ) : (
            <a
              className="install-primary-button"
              href={DOWNLOAD_URL}
              download
              onClick={handleDownload}
            >
              Download Extension
            </a>
          )}

          {!STORE_URL && (
            <p className="install-notice">
              Browser mewajibkan konfirmasi pengguna. Setelah ZIP selesai diunduh,
              ikuti empat langkah berikut.
            </p>
          )}
        </div>

        {!STORE_URL && (
          <div className="install-steps">
            <h3>Cara install di {browser}</h3>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>Ekstrak file ZIP</strong>
                  <p>Ekstrak ke folder yang tidak akan dipindahkan atau dihapus.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Buka halaman Extensions</strong>
                  <p>
                    Ketik <code>{extensionsUrl}</code> pada address bar.
                    <button className="copy-link-button" onClick={copyExtensionsUrl}>
                      Salin alamat
                    </button>
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Aktifkan Developer mode</strong>
                  <p>Nyalakan toggle Developer mode di halaman Extensions.</p>
                </div>
              </li>
              <li>
                <span>4</span>
                <div>
                  <strong>Pilih Load unpacked</strong>
                  <p>Pilih folder hasil ekstrak yang berisi file manifest.json.</p>
                </div>
              </li>
            </ol>
          </div>
        )}

        {downloaded && (
          <div className="download-confirmation" role="status">
            Download dimulai. Ekstrak ZIP lalu lanjutkan dari langkah pertama.
          </div>
        )}
      </div>
    </section>
  );
}

export default ExtensionInstall;
