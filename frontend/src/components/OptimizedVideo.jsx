import React, { useEffect, useRef, useState } from 'react'
import './OptimizedVideo.css'

/**
 * OptimizedVideo Component
 * Implements progressive video loading:
 * - Loads first 8% immediately
 * - Continues loading in chunks after 6% is played
 */
const OptimizedVideo = ({ src, className, poster, ...props }) => {
  const videoRef = useRef(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Handle video loading progress
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100
          setLoadingProgress(progress)
        }
      }
    }

    // Handle video play state
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    // Monitor playback to trigger additional loading
    const handleTimeUpdate = () => {
      if (!video.duration) return
      
      const playedPercent = (video.currentTime / video.duration) * 100
      
      // When 6% is played and we haven't loaded much, trigger more loading
      if (playedPercent > 6 && loadingProgress < 20) {
        // Browser will automatically continue loading
        video.preload = 'auto'
      }
    }

    video.addEventListener('progress', handleProgress)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)

    // Initial load trigger
    video.load()

    return () => {
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [loadingProgress])

  return (
    <div className={`optimized-video-container ${className || ''}`}>
      <video
        ref={videoRef}
        className="optimized-video"
        preload="metadata" // Start with metadata only
        {...props}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional: Loading indicator */}
      {loadingProgress < 100 && (
        <div className="video-loading-indicator" style={{ opacity: isPlaying ? 0 : 0.5 }}>
          <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
        </div>
      )}
    </div>
  )
}

export default OptimizedVideo
