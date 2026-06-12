import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/user-management.css';

const EMPTY_FORM = {
  username: '',
  password: '',
  role: 'user',
};

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await api.getUsers());
      setError('');
    } catch (err) {
      setError(`Gagal memuat user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const user = await api.createUser(form);
      setSuccess(`User ${user.username} berhasil dibuat sebagai ${user.role}.`);
      setForm(EMPTY_FORM);
      await loadUsers();
    } catch (err) {
      setError(`Gagal membuat user: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (user) => {
    if (!window.confirm(`Nonaktifkan user ${user.username}?`)) return;

    try {
      setError('');
      setSuccess('');
      await api.deactivateUser(user.id);
      setSuccess(`User ${user.username} berhasil dinonaktifkan.`);
      await loadUsers();
    } catch (err) {
      setError(`Gagal menonaktifkan user: ${err.message}`);
    }
  };

  return (
    <section className="user-management">
      <div className="user-container">
        <div className="create-user-card">
          <div className="section-heading">
            <div>
              <h2>Tambah User</h2>
              <p>Buat akun untuk extension atau administrator lain.</p>
            </div>
          </div>

          <form className="create-user-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                minLength="3"
                maxLength="50"
                autoComplete="off"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength="8"
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">User extension</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <button className="btn-primary create-user-button" type="submit" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Tambah User'}
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="user-list-card">
          <div className="section-heading">
            <div>
              <h2>Daftar User</h2>
              <p>{users.length} akun terdaftar</p>
            </div>
            <button className="btn-secondary" onClick={loadUsers} disabled={loading}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">Memuat user...</div>
          ) : (
            <div className="user-table">
              <div className="user-table-header">
                <span>Username</span>
                <span>Role</span>
                <span>Status</span>
                <span>Aksi</span>
              </div>
              {users.map(user => (
                <div className="user-table-row" key={user.id}>
                  <div>
                    <strong>{user.username}</strong>
                    {user.id === currentUser?.id && <small>Akun Anda</small>}
                  </div>
                  <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  <span className={user.is_active ? 'user-active' : 'user-inactive'}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <button
                    className="deactivate-button"
                    onClick={() => handleDeactivate(user)}
                    disabled={!user.is_active || user.id === currentUser?.id}
                  >
                    Nonaktifkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserManagement;
