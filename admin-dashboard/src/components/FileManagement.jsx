import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/file-management.css';

function FileManagement() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await api.getBahanList();
      setFiles(response);
      setError('');
    } catch (err) {
      setError('Failed to load files: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles.length) return;

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const bahanArray = [];
      
      for (let file of uploadedFiles) {
        const content = await file.text();
        bahanArray.push({
          filename: file.name,
          content: content,
        });
      }

      await api.bulkUploadBahan(bahanArray);
      setSuccess(`${bahanArray.length} file(s) uploaded successfully!`);
      
      // Reload files
      await loadFiles();
      
      // Clear input
      event.target.value = '';
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleSelect = (id) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedFiles.size) {
      setError('Please select files to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedFiles.size} file(s)?`)) {
      return;
    }

    try {
      setError('');
      const ids = Array.from(selectedFiles);
      await api.bulkDeleteBahan(ids);
      setSuccess(`${ids.length} file(s) deleted successfully!`);
      setSelectedFiles(new Set());
      await loadFiles();
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="file-management">
      <div className="management-container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>Upload Files</h2>
          <div className="upload-area">
            <label className="upload-label">
              <input
                type="file"
                multiple
                accept=".txt"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <div className="upload-content">
                <span className="upload-icon">📁</span>
                <p>Click to select files or drag and drop</p>
                <small>Only .txt files allowed</small>
              </div>
            </label>
            {uploading && <div className="uploading">Uploading...</div>}
          </div>
        </div>

        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* File List Section */}
        <div className="file-list-section">
          <div className="list-header">
            <h2>Files ({filteredFiles.length})</h2>
            
            <div className="list-actions">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              
              {filteredFiles.length > 0 && (
                <>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </label>

                  {selectedFiles.size > 0 && (
                    <button
                      className="btn-delete-bulk"
                      onClick={handleBulkDelete}
                      disabled={loading}
                    >
                      Delete ({selectedFiles.size})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {loading && <div className="loading">Loading files...</div>}
          
          {!loading && filteredFiles.length === 0 && (
            <div className="empty-state">
              <p>No files found. Upload some files to get started!</p>
            </div>
          )}

          {!loading && filteredFiles.length > 0 && (
            <div className="file-table">
              <div className="file-header">
                <div className="col-checkbox"></div>
                <div className="col-filename">Filename</div>
                <div className="col-date">Uploaded</div>
                <div className="col-size">Size</div>
              </div>
              
              {filteredFiles.map(file => (
                <div key={file.id} className="file-row">
                  <div className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleToggleSelect(file.id)}
                    />
                  </div>
                  <div className="col-filename">
                    <span className="file-icon">📄</span>
                    {file.filename}
                  </div>
                  <div className="col-date">
                    {new Date(file.upload_date).toLocaleDateString()}
                  </div>
                  <div className="col-size">-</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileManagement;
