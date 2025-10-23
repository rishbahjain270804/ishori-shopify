import { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onUploadSuccess, multiple = false }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError(null);
    setUploading(true);

    // Create previews
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);

    try {
      const uploadedFiles = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${BASE_URL}/api/images`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Upload failed with status ${res.status}`);
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!data.success) throw new Error(data.message || 'Upload failed');
        uploadedFiles.push(data);
      }

      if (onUploadSuccess) {
        onUploadSuccess(multiple ? uploadedFiles : uploadedFiles[0]);
      }
      
      // Clear previews after success
      setTimeout(() => setPreviews([]), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.files = e.dataTransfer.files;
      handleFileChange({ target: input });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="image-uploader">
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          id="image-upload-input"
        />
        <label htmlFor="image-upload-input" className="upload-label">
          {uploading ? (
            <div className="uploading-spinner">Uploading...</div>
          ) : (
            <>
              <span className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </span>
              <p>Click or drag images here</p>
              <small>{multiple ? 'Multiple files allowed' : 'Single file'}</small>
            </>
          )}
        </label>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((url, idx) => (
            <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="preview-img" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
