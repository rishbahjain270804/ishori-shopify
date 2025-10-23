import { useState, useEffect } from 'react';
import { apiGet, getImageUrl } from '../../utils/apiClient';
import VideoUploader from '../../components/VideoUploader';
import ImageUploader from '../../components/ImageUploader';
import './MediaManager.css';

const MediaManager = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing media on mount
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const [imagesRes, videosRes] = await Promise.all([
        apiGet('/api/images'),
        apiGet('/api/videos')
      ]);

      if (imagesRes.success) {
        setUploadedImages(imagesRes.data || []);
      }
      if (videosRes.success) {
        setUploadedVideos(videosRes.data || []);
      }
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = (data) => {
    setUploadedVideos(prev => [data, ...prev]);
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setUploadedImages(prev => [...fileArray, ...prev]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="media-manager">
        <h1>Media Manager</h1>
        <p>Loading media...</p>
      </div>
    );
  }

  return (
    <div className="media-manager">
      <h1>Media Manager</h1>
      <p className="media-subtitle">Upload and manage images and videos for your products</p>

      <section className="upload-section">
        <h2>Upload Images</h2>
        <ImageUploader onUploadSuccess={handleImageUpload} multiple />
        
        {uploadedImages.length > 0 && (
          <div className="uploaded-list">
            <h3>All Images ({uploadedImages.length})</h3>
            <div className="image-grid">
              {uploadedImages.map((img, idx) => (
                <div key={img._id || idx} className="uploaded-image-card">
                  <img src={getImageUrl(img.url || img.fileId || img._id)} alt={img.filename} />
                  <div className="image-actions">
                    <span className="file-name">{img.filename}</span>
                    <span className="file-id">{img.fileId || img._id}</span>
                    <div className="button-group">
                      <button onClick={() => copyToClipboard(img.fileId || img._id)}>
                        Copy ID
                      </button>
                      <button onClick={() => copyToClipboard(getImageUrl(img.url || img.fileId || img._id))}>
                        Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="upload-section">
        <h2>Upload Video</h2>
        <VideoUploader onUploadSuccess={handleVideoUpload} />
        
        {uploadedVideos.length > 0 && (
          <div className="uploaded-list">
            <h3>All Videos ({uploadedVideos.length})</h3>
            {uploadedVideos.map((video, idx) => (
              <div key={video._id || idx} className="uploaded-item">
                <span className="file-name">{video.filename}</span>
                <span className="file-id">{video.fileId || video._id}</span>
                <div className="button-group">
                  <button onClick={() => copyToClipboard(video.fileId || video._id)}>
                    Copy ID
                  </button>
                  <button onClick={() => copyToClipboard(`/api/videos/${video.fileId || video._id}`)}>
                    Copy URL
                  </button>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MediaManager;
