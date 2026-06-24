'use client';

import { observer } from 'mobx-react';
import { useEffect } from 'react';

class Dot {
  position: { x: number; y: number };
  width: number;
  lag: number;

  constructor(x: number, y: number, width: number, lag: number) {
    this.position = { x, y };
    this.width = width;
    this.lag = lag;
  }

  moveTowards(x: number, y: number, color: string, context: CanvasRenderingContext2D) {
    this.position.x += (x - this.position.x) / this.lag;
    this.position.y += (y - this.position.y) / this.lag;
    context.fillStyle = color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
}

interface Props {
  speedFactor?: number;
  shipColor?: string;
}

/**
 * A Cursor following component
 *
 * Taken from [Follow-Cursor](https://cursify.vercel.app/components/follow-cursor)
 * by Durgesh
 *
 * Things that i've changed:
 * - Added logic making dot circle the cursor
 */
const SpaceshipCursor = observer((props: Props): null => {
  const { speedFactor = 0.02, shipColor = '#eae3ca' } = props;
  useEffect(() => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let animationFrame: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const cursor = { x: width / 2, y: height / 2 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const dot = new Dot(width / 2, height / 2, 10, 20);

    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };

    const onWindowResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawDot = (time: number) => {
      if (context) {
        const targetX = cursor.x + Math.sin(time * 0.1 * speedFactor) * 50;
        const targetY = cursor.y + Math.cos(time * 0.1 * speedFactor) * 50;

        context.clearRect(0, 0, width, height);
        dot.moveTowards(targetX, targetY, shipColor, context);
      }
    };

    const loop = (time: number) => {
      drawDot(time);
      animationFrame = requestAnimationFrame(loop);
    };

    const init = () => {
      if (prefersReducedMotion.matches) {
        console.log('Reduced motion enabled, cursor effect skipped.');
        return;
      }

      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.width = width;
      canvas.height = height;
      document.body.appendChild(canvas);

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
      requestAnimationFrame(loop);
    };

    const destroy = () => {
      if (canvas) {
        canvas.remove();
      }
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
    };

    prefersReducedMotion.onchange = () => {
      if (prefersReducedMotion.matches) {
        destroy();
      } else {
        init();
      }
    };

    init();

    return () => {
      destroy();
    };
  }, [shipColor]);

  return null; // This component doesn't render any visible JSX
});

export default SpaceshipCursor;
