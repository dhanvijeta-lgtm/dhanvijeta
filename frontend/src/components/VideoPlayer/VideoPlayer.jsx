import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCog } from 'react-icons/fa';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const strUrl = String(url).trim();

  // YouTube match
  const ytMatch = strUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Vimeo match
  const vimeoMatch = strUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
};

export function VideoPlayer({ src, onTimeUpdate, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const embedUrl = getEmbedUrl(src);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current && !embedUrl) {
      videoRef.current.load();
    }
  }, [src, embedUrl]);

  if (embedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-emerald-glow border border-white/10">
        <iframe
          src={embedUrl}
          title="Lesson Video Player"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

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

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-finance-dark via-finance-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-finance-gold cursor-pointer bg-white/20 h-1.5 rounded-lg outline-none"
        />

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-finance-gold transition p-1">
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>

            <span className="text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

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
