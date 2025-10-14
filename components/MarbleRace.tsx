'use client';

import { useEffect, useRef } from 'react';
import styles from './MarbleRace.module.css';

interface Racer {
  name: string;
}

interface Props {
  racers: Racer[];
  onFinish: (winner: string) => void;
}

export function MarbleRace({ racers, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const positions = racers.map((_, index) => ({
      x: 10,
      y: 20 + index * 30,
      speed: Math.random() * 1.5 + 1
    }));

    let frame = 0;
    let animationFrame: number;

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, 0, width, height);

      let winner: string | null = null;

      positions.forEach((pos, index) => {
        pos.x += pos.speed;
        pos.speed += Math.random() * 0.2;
        if (pos.x >= width - 40 && !winner) {
          winner = racers[index].name;
        }
        ctx.beginPath();
        ctx.fillStyle = '#0fbf6a';
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111827';
        ctx.fillText(racers[index].name, pos.x + 15, pos.y + 4);
      });

      if (winner) {
        cancelAnimationFrame(animationFrame);
        onFinish(winner);
      } else if (frame < 600) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [onFinish, racers]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} width={320} height={200} aria-label="Marble race animation" />
    </div>
  );
}
