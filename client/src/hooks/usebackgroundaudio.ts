import { useCallback, useEffect, useRef } from "react";

// Audio URL for the background music
const AUDIO_URL = "https://cmmastery.github.io/audio-host/Twodifferentworlds.mp3";

// Global audio instance that persists across component mounts/unmounts
let globalAudio: HTMLAudioElement | null = null;
let isInitialized = false;

// Initialize the global audio element once
function getOrCreateAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(AUDIO_URL);
    globalAudio.loop = true;
    globalAudio.volume = 0.5;
    globalAudio.preload = "auto";
    
    // Handle errors
    globalAudio.onerror = (e) => {
      console.error("Audio loading error:", e);
    };
    
    // Log when audio is ready
    globalAudio.oncanplaythrough = () => {
      console.log("Audio ready to play");
    };
  }
  return globalAudio;
}

export function useBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(getOrCreateAudio());

  // Start playing the audio (must be called from user interaction)
  const play = useCallback(async () => {
    const audio = audioRef.current;
    
    if (!audio) return false;
    
    try {
      // Reset to beginning if needed
      if (audio.paused && !isInitialized) {
        audio.currentTime = 0;
      }
      
      await audio.play();
      isInitialized = true;
      console.log("Audio playback started successfully");
      return true;
    } catch (error) {
      console.error("Audio playback failed:", error);
      return false;
    }
  }, []);

  // Pause the audio
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    
    if (audio.paused) {
      return await play();
    } else {
      pause();
      return true;
    }
  }, [play, pause]);

  // Set volume (0-1)
  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Check if audio is currently playing
  const isPlaying = useCallback(() => {
    const audio = audioRef.current;
    return audio ? !audio.paused : false;
  }, []);

  // Check if audio has been initialized (user has interacted)
  const hasStarted = useCallback(() => {
    return isInitialized;
  }, []);

  return {
    play,
    pause,
    toggle,
    setVolume,
    isPlaying,
    hasStarted,
    audio: audioRef.current,
  };
}

export default useBackgroundAudio;
