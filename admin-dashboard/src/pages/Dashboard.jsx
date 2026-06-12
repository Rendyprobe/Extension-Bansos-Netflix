import { useState, useEffect } from 'react';
import FileManagement from '../components/FileManagement';
import Header from '../components/Header';
import '../styles/dashboard.css';

function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      <FileManagement />
    </div>
  );
}

export default Dashboard;
