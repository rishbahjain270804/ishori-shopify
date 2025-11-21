import React, { useState, useEffect } from 'react';

const VideoPlayer = ({ 
  videoId = 'hero-video', 
  fallbackSrc = '/src/assets/bgsaree_video.mp4',
  poster = '/src/assets/collection1.avif',
  className = '',
  ...props 
}) => {
  const [videoSrc, setVideoSrc] = useState(fallbackSrc);
  const [useMongoVideo, setUseMongoVideo] = useState(false);

  useEffect(() => {
    // Try to load video from MongoDB
    const checkMongoVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}`);
        if (response.ok) {
          setVideoSrc(`/api/videos/${videoId}`);
          setUseMongoVideo(true);
          console.log('✅ Loading video from MongoDB');
        } else {
          console.log('ℹ️ MongoDB video not found, using local fallback');
        }
      } catch (error) {
        console.log('ℹ️ Using local video fallback');
      }
    };

    checkMongoVideo();
  }, [videoId]);

  return (
    <video
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      {...props}
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
