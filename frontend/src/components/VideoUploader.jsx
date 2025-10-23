import { useState } from 'react';
import './VideoUploader.css';

const VideoUploader = ({ onUploadSuccess }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const text = xhr.responseText;
          const data = text ? JSON.parse(text) : {};
          if (onUploadSuccess) {
            onUploadSuccess(data);
          }
          setTimeout(() => {
            setPreview(null);
            setProgress(0);
          }, 2000);
        } else {
          const data = JSON.parse(xhr.responseText);
          throw new Error(data.message || 'Upload failed');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Network error during upload');
        setUploading(false);
      });

      xhr.open('POST', `${BASE_URL}/api/videos`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.withCredentials = true;
      xhr.send(formData);

    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="video-uploader">
      <div className="upload-zone">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={uploading}
          id="video-upload-input"
        />
        <label htmlFor="video-upload-input" className="upload-label">
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p>Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <span className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </span>
              <p>Click to upload video</p>
              <small>MP4, WebM (max 100MB)</small>
            </>
          )}
        </label>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {preview && (
        <div className="preview-container">
          <video src={preview} controls className="preview-video" />
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
