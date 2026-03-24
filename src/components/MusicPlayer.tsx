import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const PLAYLIST = [
  {
    id: 1,
    title: "ERR_01: CORRUPTED_SECTOR",
    artist: "MACHINE_MIND",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/glitch1/200/200?grayscale"
  },
  {
    id: 2,
    title: "SYS.OVERRIDE_PROTOCOL",
    artist: "NEURAL_NET",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/glitch2/200/200?grayscale"
  },
  {
    id: 3,
    title: "VOID_TRANSMISSION",
    artist: "ALGORITHM_X",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch3/200/200?grayscale"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#0ff] p-6 shadow-[-8px_8px_0_#f0f] relative screen-tear">
      <div className="absolute top-0 left-0 bg-[#f0f] text-black px-2 py-1 text-sm font-bold border-b-2 border-r-2 border-[#0ff]">
        AUDIO_STREAM_ACTIVE
      </div>
      
      <audio 
        ref={audioRef} 
        src={track.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center gap-4 mb-6 mt-6 border-2 border-[#f0f] p-2 bg-[#000]">
        <div className="relative w-20 h-20 border-2 border-[#0ff] flex-shrink-0 overflow-hidden">
          <img 
            src={track.cover} 
            alt={track.title} 
            className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : 'grayscale'}`}
            referrerPolicy="no-referrer"
            style={{ filter: isPlaying ? 'contrast(200%) hue-rotate(90deg)' : 'contrast(150%)' }}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#f0f]/30 mix-blend-color-burn"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-mono text-[#f0f] uppercase tracking-widest mb-1 bg-[#0ff] text-black inline-block px-1">
            TRACK_DATA
          </div>
          <h3 className="text-xl font-bold text-[#0ff] truncate uppercase">{track.title}</h3>
          <p className="text-white text-sm truncate uppercase border-b border-[#f0f] pb-1">{track.artist}</p>
        </div>
      </div>

      <div className="mb-6 border-2 border-[#0ff] p-2">
        <input 
          type="range" 
          min={0} 
          max={duration || 100} 
          value={progress} 
          onChange={handleProgressChange}
          className="w-full h-4 bg-black border border-[#f0f] appearance-none cursor-pointer accent-[#0ff] rounded-none"
          style={{
            background: `linear-gradient(to right, #0ff ${(progress / (duration || 1)) * 100}%, #000 ${(progress / (duration || 1)) * 100}%)`
          }}
        />
        <div className="flex justify-between mt-2 text-lg font-bold text-[#f0f]">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t-4 border-[#f0f] pt-4">
        <div className="flex items-center gap-2 text-[#0ff] hover:text-[#f0f] transition-colors cursor-pointer group">
          {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-2 bg-black border border-[#0ff] appearance-none cursor-pointer accent-[#f0f] rounded-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevTrack}
            className="p-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center border-4 border-[#f0f] bg-black text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
