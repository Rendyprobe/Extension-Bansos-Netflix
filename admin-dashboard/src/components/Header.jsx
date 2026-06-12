import '../styles/header.css';

function Header({ user, activePage, onNavigate, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1>Bansos Netflix Admin</h1>
          <nav className="header-nav" aria-label="Admin navigation">
            <button
              className={activePage === 'files' ? 'nav-button active' : 'nav-button'}
              onClick={() => onNavigate('files')}
            >
              File Management
            </button>
            <button
              className={activePage === 'users' ? 'nav-button active' : 'nav-button'}
              onClick={() => onNavigate('users')}
            >
              Users
            </button>
            <button
              className={activePage === 'extension' ? 'nav-button active' : 'nav-button'}
              onClick={() => onNavigate('extension')}
            >
              Install Extension
            </button>
          </nav>
        </div>
        <div className="header-actions">
          <span className="user-info">{user?.username}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
