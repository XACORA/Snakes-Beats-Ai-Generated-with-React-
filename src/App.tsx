/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative selection:bg-[#f0f]/50 selection:text-[#0ff]">
      {/* Glitch/Static Overlays */}
      <div className="static-noise"></div>
      <div className="scanlines"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center screen-tear">
        
        <header className="mb-8 text-center border-b-4 border-[#0ff] pb-4 w-full max-w-4xl">
          <h1 
            className="text-6xl md:text-8xl font-black tracking-tighter mb-2 glitch-text uppercase"
            data-text="SYS.ERR_//_NEURAL_LINK"
          >
            SYS.ERR_//_NEURAL_LINK
          </h1>
          <p className="text-[#f0f] text-xl tracking-[0.2em] uppercase bg-[#0ff] text-black inline-block px-2 mt-2 font-bold">
            [ STATUS: INITIALIZING PROTOCOL ]
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          
          {/* Left: Game */}
          <div className="w-full lg:w-2/3 flex flex-col items-center z-20">
            <div className="mb-2 flex justify-between w-full max-w-[400px] px-2 bg-[#f0f] text-black font-bold uppercase border-2 border-[#0ff]">
              <span>MAX_DATA_EXTRACTED:</span>
              <span>{highScore}</span>
            </div>
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>

          {/* Right: Music Player */}
          <div className="w-full lg:w-1/3 flex justify-center z-20">
            <MusicPlayer />
          </div>

        </div>
      </div>
    </div>
  );
}
