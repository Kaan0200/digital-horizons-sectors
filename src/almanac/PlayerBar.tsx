import { observer } from 'mobx-react';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { useStore } from '../stores/RootStore';
import { warpTo } from './camera';

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
            if (curRef.current) curRef.current.textContent = fmt(cur);
            if (durRef.current) durRef.current.textContent = dur ? fmt(dur) : '0:00';
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
                    <div className="t">{world ? world.name : 'No signal'}</div>
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
            <div className="scrub">
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
