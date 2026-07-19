import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCog } from 'react-icons/fa';

export function VideoPlayer({ src, onTimeUpdate, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    // Reset state when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (onTimeUpdate) {
      onTimeUpdate(current, videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-emerald-glow border border-white/10">
      {/* HTML5 Video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full cursor-pointer object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        playsInline
      />

      {/* Controller overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-finance-dark via-finance-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
        {/* Timeline Slider */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-finance-gold cursor-pointer bg-white/20 h-1.5 rounded-lg outline-none"
        />

        {/* Buttons Control Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-finance-gold transition p-1">
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>

            {/* Time Indicators */}
            <span className="text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume Controllers */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="hover:text-finance-gold transition p-1">
                {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-finance-gold h-1 rounded bg-white/20 outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Speed Settings button */}
            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="hover:text-finance-gold transition p-1">
              <FaCog size={18} />
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 right-8 bg-finance-navy border border-white/10 rounded-xl p-2 flex flex-col gap-1 w-24 text-xs font-medium z-10 shadow-lg">
                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`py-1.5 px-2 text-left rounded-lg transition hover:bg-white/10 ${playbackRate === speed ? 'text-finance-gold bg-white/5' : 'text-white'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}

            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="hover:text-finance-gold transition p-1">
              <FaExpand size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
