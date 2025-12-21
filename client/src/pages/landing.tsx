import { useState } from "react";
import { useLocation } from "wouter";
import StarField from "@/components/starfield";
import { useBackgroundAudio } from "@/hooks/usebackgroundaudio";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isEntering, setIsEntering] = useState(false);
  const { play } = useBackgroundAudio();

  const handleEnter = async () => {
    setIsEntering(true);
    
    // Start the background audio (this will persist across navigation)
    await play();
    
    // Navigate to main site after a brief delay
    setTimeout(() => {
      setLocation("/main");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Starfield Background */}
      <StarField />
      
      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-500 ${isEntering ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
        {/* Logo */}
        <div className="mb-16 text-center flex flex-col items-center">
          <img
            src="https://i.imgur.com/19aPlzV.jpg"
            alt="Trading Core"
            className="max-w-full w-full md:w-[600px] lg:w-[700px] h-auto object-contain mb-6"
          />
          <p className="text-xl md:text-2xl text-gray-400 tracking-widest" style={{ fontFamily: 'Space Mono, monospace' }}>
            Welcome Traders
          </p>
        </div>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="px-20 py-5 bg-transparent border-2 border-white text-white font-mono text-xl tracking-[0.4em] uppercase transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95"
        >
          ENTER
        </button>
      </div>
    </div>
  );
}
