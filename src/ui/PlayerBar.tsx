import { observer } from 'mobx-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useStore } from '../stores/RootStore';
import { warpTo } from '../engine/camera';
import type { Track } from '../engine/worlds';

const fmt = (sec: number): string => {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Best-known total length. Prefers `duration`, but streamed MP3s often report
 * NaN/Infinity until enough is buffered — fall back to the seekable range so
 * scrubbing still works.
 */
const durationOf = (audioEl?: HTMLAudioElement): number => {
    if (!audioEl) return 0;
    if (isFinite(audioEl.duration) && audioEl.duration > 0) return audioEl.duration;
    try {
        if (audioEl.seekable && audioEl.seekable.length)
            return audioEl.seekable.end(audioEl.seekable.length - 1);
    } catch {
        /* seekable not ready */
    }
    return 0;
};

/** The last track whose start time has passed — i.e. what's playing right now. */
const currentTrackOf = (list: Track[], time: number): Track | undefined => {
    let cur: Track | undefined;
    for (const tr of list) {
        if (tr.start <= time) cur = tr;
        else break;
    }
    return cur;
};

/**
 * Bottom transport. Uses RootStore.play() for the actual audio; the scrubber
 * reads/writes the store's HTMLAudioElement directly.
 */
const PlayerBar = observer((): React.JSX.Element => {
    const store = useStore();
    const world = store.selectedId ? store.worldById(store.selectedId) : undefined;
    const fillRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const curRef = useRef<HTMLSpanElement>(null);
    const durRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const scrubbing = useRef(false);
    const reduceMotion = useReducedMotion();
    // current song within the mix — React state so the change can animate.
    // Updated only when it actually changes (rare), so no per-tick re-renders.
    const [trackName, setTrackName] = useState('');
    const trackNameRef = useRef('');

    // progress loop — writes to refs, no per-frame React state.
    useEffect(() => {
        let raf = 0;
        let last = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const now = performance.now();
            if (now - last < 200) return;
            last = now;
            if (scrubbing.current) return; // don't fight the user while they drag
            const a = store.currentAudio;
            const dur = durationOf(a);
            const cur = a?.currentTime ?? 0;
            const pct = dur ? (cur / dur) * 100 : 0;
            if (fillRef.current) fillRef.current.style.width = `${pct}%`;
            if (knobRef.current) knobRef.current.style.left = `${pct}%`;
            // Only touch the DOM when a value actually changes — assigning
            // textContent replaces the text node even when the string is equal,
            // which churns these nodes every tick (and even while paused).
            const curTxt = fmt(cur);
            if (curRef.current && curRef.current.textContent !== curTxt) curRef.current.textContent = curTxt;
            const durTxt = dur ? fmt(dur) : '0:00';
            if (durRef.current && durRef.current.textContent !== durTxt) durRef.current.textContent = durTxt;
            // which song within the mix is playing now, by timecode
            const w = store.selectedId ? store.worldById(store.selectedId) : undefined;
            const nowTrack = w && w.tracks.length ? currentTrackOf(w.tracks, cur) : undefined;
            const name = nowTrack ? nowTrack.n : '';
            if (name !== trackNameRef.current) {
                trackNameRef.current = name;
                setTrackName(name);
            }
        };
        tick();
        return () => cancelAnimationFrame(raf);
    }, [store]);

    const jump = (dir: number) => {
        const list = store.worlds;
        if (!list.length) return;
        const i = list.findIndex((w) => w.id === store.selectedId);
        const start = i < 0 ? 0 : i;
        const next = list[(start + dir + list.length) % list.length];
        store.play(next.id);
        store.focus(next.id);
        warpTo(next.x, next.y);
    };

    // Seek to the clicked/dragged x. Writes the audio AND the visuals immediately
    // so scrubbing feels responsive even though the readout loop is paused.
    const seekTo = (clientX: number): boolean => {
        const a = store.currentAudio;
        const dur = durationOf(a);
        if (!a || !barRef.current || !dur) return false;
        const r = barRef.current.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
        const target = pct * dur;
        a.currentTime = target;
        const p = pct * 100;
        if (fillRef.current) fillRef.current.style.width = `${p}%`;
        if (knobRef.current) knobRef.current.style.left = `${p}%`;
        if (curRef.current) curRef.current.textContent = fmt(target);
        return true;
    };
    const onScrubDown = (e: React.PointerEvent) => {
        scrubbing.current = true;
        barRef.current?.setPointerCapture(e.pointerId);
        seekTo(e.clientX);
    };
    const onScrubMove = (e: React.PointerEvent) => {
        if (scrubbing.current) seekTo(e.clientX);
    };
    const onScrubUp = (e: React.PointerEvent) => {
        scrubbing.current = false;
        try {
            barRef.current?.releasePointerCapture(e.pointerId);
        } catch {
            /* pointer already released */
        }
    };

    return (
        <div
            className="player"
            style={
                world
                    ? ({ ['--c' as string]: world.color } as React.CSSProperties)
                    : undefined
            }
        >
            <div className="row">
                <div className="art" />
                <div className="meta">
                    <div className="t" data-testid="now-playing">
                        {world ? world.name : 'No signal'}
                    </div>
                    <div className="g">
                        {world ? (
                            <>
                                <b>{world.cat}</b> · {world.genre}
                            </>
                        ) : (
                            'Select a world to begin'
                        )}
                    </div>
                </div>
                <div className="transport">
                    <button className="gbtn" title="Previous" onClick={() => jump(-1)}>
                        ⏮
                    </button>
                    <button
                        className="gbtn play"
                        title="Play / Pause"
                        onClick={() => (store.selectedId ? store.play() : jump(0))}
                    >
                        {store.isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="gbtn" title="Next" onClick={() => jump(1)}>
                        ⏭
                    </button>
                </div>
            </div>
            {world && world.tracks.length > 0 && (
                <div className="nowtrack" data-testid="now-track">
                    <span className="ico">♪</span>
                    <span className="nm">
                        <AnimatePresence initial={false}>
                            <motion.span
                                key={trackName}
                                className="roll"
                                initial={{ rotateX: -90, y: '90%', opacity: 0 }}
                                animate={{ rotateX: 0, y: '0%', opacity: 1 }}
                                exit={{ rotateX: 90, y: '-90%', opacity: 0 }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.5,
                                    ease: [0.6, 0, 0.2, 1],
                                }}
                            >
                                {trackName}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </div>
            )}
            <div className="flex items-center gap-2 mt-3">
                <span className="time" ref={curRef}>
                    0:00
                </span>
                <div
                    className="bar"
                    ref={barRef}
                    onPointerDown={onScrubDown}
                    onPointerMove={onScrubMove}
                    onPointerUp={onScrubUp}
                    onPointerCancel={onScrubUp}
                >
                    <div className="fill" ref={fillRef} />
                    <div className="knob" ref={knobRef} />
                </div>
                <span className="time r" ref={durRef}>
                    0:00
                </span>
            </div>
        </div>
    );
});

export default PlayerBar;
