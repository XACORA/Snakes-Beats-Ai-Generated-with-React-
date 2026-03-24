import React, { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const dirRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const speedRef = useRef(120);
  const lastTimeRef = useRef(0);
  const reqRef = useRef<number>();

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    foodRef.current = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    speedRef.current = 120;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameOver || !isPlaying)) {
        resetGame();
        return;
      }

      const dir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const update = (time: number) => {
      if (time - lastTimeRef.current > speedRef.current) {
        lastTimeRef.current = time;
        
        dirRef.current = nextDirRef.current;
        const dir = dirRef.current;
        const snake = [...snakeRef.current];
        const head = { ...snake[0] };

        head.x += dir.x;
        head.y += dir.y;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        snake.unshift(head);

        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          const newScore = score + 1;
          setScore(newScore);
          onScoreChange(newScore);
          speedRef.current = Math.max(40, 120 - Math.floor(newScore / 5) * 10);
          
          let newFood;
          while (true) {
            newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          foodRef.current = newFood;
        } else {
          snake.pop();
        }

        snakeRef.current = snake;
      }

      draw();
      reqRef.current = requestAnimationFrame(update);
    };

    reqRef.current = requestAnimationFrame(update);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, gameOver, score, onScoreChange]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / GRID_SIZE;
    const cellH = height / GRID_SIZE;

    // Raw black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Jarring grid
    ctx.strokeStyle = '#0ff';
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(width, i * cellH);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Food (Magenta)
    ctx.fillStyle = '#f0f';
    // Glitchy food drawing (rectangles instead of circle)
    ctx.fillRect(foodRef.current.x * cellW + 2, foodRef.current.y * cellH + 2, cellW - 4, cellH - 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(foodRef.current.x * cellW + 4, foodRef.current.y * cellH + 4, cellW - 8, cellH - 8);

    // Snake (Cyan)
    snakeRef.current.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#fff'; // Head
      } else {
        ctx.fillStyle = index % 2 === 0 ? '#0ff' : '#008888';
      }
      ctx.fillRect(segment.x * cellW, segment.y * cellH, cellW - 1, cellH - 1);
    });
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center bg-black p-4 border-4 border-[#f0f] shadow-[8px_8px_0_#0ff] w-full max-w-[440px]">
      <div className="flex justify-between w-full mb-2 px-2 border-b-2 border-[#0ff] pb-2">
        <div className="text-[#0ff] font-mono text-2xl font-bold tracking-widest uppercase">
          DATA_EXTRACTED: {score}
        </div>
      </div>
      
      <div className="relative w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black border-2 border-[#0ff] w-full h-full object-contain"
        />
        
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 border-4 border-[#f0f] m-4">
            {gameOver ? (
              <>
                <h2 
                  className="text-5xl font-black text-[#f0f] mb-2 uppercase tracking-widest glitch-text text-center"
                  data-text="SUBJECT_TERMINATED"
                >
                  SUBJECT_TERMINATED
                </h2>
                <p className="text-[#0ff] text-2xl mb-6 bg-black px-2 border border-[#0ff]">FINAL_DATA: {score}</p>
              </>
            ) : (
              <h2 
                className="text-5xl font-black text-[#0ff] mb-6 uppercase tracking-widest glitch-text text-center"
                data-text="AWAITING_INPUT"
              >
                AWAITING_INPUT
              </h2>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-[#f0f] text-black text-2xl font-bold uppercase tracking-widest border-4 border-[#0ff] hover:bg-[#0ff] hover:border-[#f0f] transition-colors"
            >
              {gameOver ? 'REBOOT_SYSTEM' : 'EXECUTE_RUN'}
            </button>
            <p className="text-[#f0f] text-lg mt-4 animate-pulse">[ PRESS SPACE ]</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 w-full bg-[#0ff] text-black p-2 text-center font-bold text-lg uppercase tracking-widest">
        <span>INPUT: W_A_S_D // ARROWS</span>
      </div>
    </div>
  );
}
