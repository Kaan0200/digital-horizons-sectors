import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores/RootStore';

interface Props {
  speedFactor?: number;
  backgroundColor?: string;
  /**
   * Changed from original code, this prop now sets the color the stars are when they are not moving
   */
  restColor?: [number, number, number];
  starCount?: number;
  /**
   *  Pass-thru for adding tailwind classes directly to canvas element
   */
  className?: string;
  /**
   * Pass-thru for accessing canvas ref
   */
  ref?: React.Ref<HTMLDivElement>;
}

/** This file was copied from https://github.com/designly1/react-starfield
 * "react-starfield" by designly1
 *
 * I do not claim it as mine, but I am modifying this so that the starfield does additional behavior
 *
 * - pass-thru for tailwindcss
 * - when the stars are moving, they are rainbow colored
 * - Mobx-Store hookup to have the stars move with the music is playing
 * (assistance from https://justinparrtech.com/JustinParr-Tech/spectrum-generating-color-function-using-sine-waves/ )
 */
export const Starfield = observer((props: Props) => {
  const store = useStore();
  const {
    speedFactor = 0.02,
    backgroundColor = 'black',
    restColor = [255, 255, 255],
    starCount = 5000,
  } = props;

  useEffect(() => {
    const canvas = document.getElementById('starfield') as HTMLCanvasElement;
    let width: number, height: number;

    const makeStars = (count: number): { x: number; y: number; z: number }[] => {
      const out = [];
      for (let i = 0; i < count; i++) {
        const s = {
          x: Math.random() * 1600 - 800,
          y: Math.random() * 900 - 450,
          z: Math.random() * 1000,
        };
        out.push(s);
      }
      return out;
    };

    const stars = makeStars(starCount);

    let colorCounter: number = 0;
    const clear = () => {
      const c = canvas.getContext('2d');
      if (c) {
        c.fillStyle = backgroundColor;
        c.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const putPixel = (x: number, y: number, brightness: number) => {
      const rezColor = generateRGB(colorCounter++, 2000000);

      const rgb =
        'rgba(' +
        rezColor[0] +
        ',' +
        rezColor[1] +
        ',' +
        rezColor[2] +
        ',' +
        brightness +
        ')';
      const c = canvas.getContext('2d');
      if (c) {
        c.fillStyle = rgb;
        c.fillRect(x, y, 4, 4);
      }
    };

    const generateRGB = (
      n: number,
      maximum: number,
    ): [r: number, g: number, b: number] => {
      const a = (15.7079 * n) / (3 * maximum) + 1.5708;
      const r = Math.sin(a) * 192 + 128;
      const g = Math.sin(a - 2.0944) * 192 + 128;
      const b = Math.sin(a - 4.1888) * 192 + 128;

      return [r, g, b];
    };

    const moveStars = (distance: number) => {
      const count = stars.length;
      for (let i = 0; i < count; i++) {
        const s = stars[i];
        s.z -= distance;
        while (s.z <= 1) {
          s.z += 1000;
        }
      }
    };

    let prevTime: number;
    const init = (time: number) => {
      prevTime = time;
      requestAnimationFrame(tick);
    };

    // ^^^^ END OF SETUP ^^^^

    // Animation looping function, asks to repeat every time the engine is ready to animate
    const tick = (time: number) => {
      const elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * (store.isPlaying ? 0.1 : speedFactor));

      clear();

      const cx = width / 2;
      const cy = height / 2;

      const count = stars.length;
      for (let i = 0; i < count; i++) {
        const star = stars[i];

        const x = cx + star.x / (star.z * 0.001);
        const y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= width || y < 0 || y >= height) {
          continue;
        }

        const d = star.z / 1000.0;
        const b = 1 - d * d;

        putPixel(x, y, b);
      }

      requestAnimationFrame(tick);
    };

    const destroy = () => {
      window.onresize = null;
    };

    const start = () => {
      requestAnimationFrame(init);

      // add window resize listener:
      window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;
        setCanvasExtents();
      });
      const setCanvasExtents = () => {
        canvas.width = width;
        canvas.height = height;
      };

      if (canvas) {
        width = window.innerWidth;
        height = window.innerHeight;

        setCanvasExtents();

        window.onresize = () => {
          setCanvasExtents();
        };
      } else {
        console.error('Could not get 2d context from canvas element');
      }
    };

    start();

    return () => {
      destroy();
    };
  }, [restColor, backgroundColor, speedFactor, starCount]);

  return (
    <canvas
      className={props.className}
      id="starfield"
      style={{
        padding: 0,
        margin: 0,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 10,
        opacity: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    ></canvas>
  );
});
export default Starfield;
