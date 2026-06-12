import { useState } from 'react';
import FileManagement from '../components/FileManagement';
import ExtensionInstall from '../components/ExtensionInstall';
import UserManagement from '../components/UserManagement';
import Header from '../components/Header';
import '../styles/dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('files');

  return (
    <div className="dashboard">
      <Header
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />
      <main className="dashboard-content">
        {activePage === 'files' && <FileManagement />}
        {activePage === 'users' && <UserManagement currentUser={user} />}
        {activePage === 'extension' && <ExtensionInstall />}
      </main>
    </div>
  );
}

export default Dashboard;
