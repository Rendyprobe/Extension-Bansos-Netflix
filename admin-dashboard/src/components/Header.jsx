import '../styles/header.css';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🎬 Bansos Netflix Admin</h1>
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
