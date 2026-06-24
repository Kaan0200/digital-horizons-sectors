import type React from 'react';
import { useEffect, useRef } from 'react';

interface Props {
  /** Orbit speed of the craft around the pointer. */
  speedFactor?: number;
  /** Craft colour — defaults to vellum. */
  color?: string;
}

/**
 * A little craft that trails the cursor, lagging as it circles the pointer.
 * Ported from the original SpaceshipCursor; retinted to the almanac palette and
 * rebuilt as a React-owned canvas. Honours prefers-reduced-motion.
 */
const ShipCursor = ({ speedFactor = 0.02, color = '#ece4d2' }: Props): React.JSX.Element => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf = 0;

    const cursor = { x: w / 2, y: h / 2 };
    const dot = { x: w / 2, y: h / 2 };
    const LAG = 18; // higher = lazier trailing
    const ORBIT = 46; // px the craft circles around the cursor
    const SIZE = 7; // craft size
    let heading = 0; // smoothed facing angle (radians)

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      const tx = cursor.x + Math.sin(time * 0.1 * speedFactor) * ORBIT;
      const ty = cursor.y + Math.cos(time * 0.1 * speedFactor) * ORBIT;

      const px = dot.x;
      const py = dot.y;
      dot.x += (tx - dot.x) / LAG;
      dot.y += (ty - dot.y) / LAG;

      // steer the nose toward the direction of travel (smoothed, shortest turn)
      const vx = dot.x - px;
      const vy = dot.y - py;
      if (vx * vx + vy * vy > 0.0004) {
        const diff = Math.atan2(Math.sin(Math.atan2(vy, vx) - heading), Math.cos(Math.atan2(vy, vx) - heading));
        heading += diff * 0.25;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(dot.x, dot.y);
      ctx.rotate(heading);
      // hull
      ctx.shadowBlur = 14;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(SIZE * 1.5, 0); // nose
      ctx.lineTo(-SIZE * 0.9, SIZE * 0.8); // back-right
      ctx.lineTo(-SIZE * 0.4, 0); // tail notch
      ctx.lineTo(-SIZE * 0.9, -SIZE * 0.8); // back-left
      ctx.closePath();
      ctx.fill();
      // bright cockpit
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fffdf6';
      ctx.beginPath();
      ctx.arc(SIZE * 0.25, 0, SIZE * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [color, speedFactor]);

  return <canvas className="dh-cursor" ref={ref} />;
};

export default ShipCursor;
