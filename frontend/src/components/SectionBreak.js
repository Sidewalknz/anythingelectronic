'use client';

import { useEffect, useRef, useId, useMemo, useState } from 'react';
import styles from './SectionBreak.module.css';

export default function SectionBreak({
  topColor = '#f8fafc',
  bottomColor = '#f8fafc',
  height = 260,
  waveHeight = 72,
}) {
  const canvasRef = useRef(null);
  const hostRef = useRef(null);

  // unique pattern ids so multiple instances don’t clash
  const uid = useId();
  const topPatternId = `sb-wave-top-${uid}`;
  const bottomPatternId = `sb-wave-bottom-${uid}`;

  // authoring size for the tile; we scale to waveHeight later
  const TILE_W = 700;      // one full sine period
  const TILE_H = 120;      // authoring height
  const waveScale = waveHeight / TILE_H;

  // random horizontal offsets (SSR-safe: applied after mount)
  const [offsetTopX, setOffsetTopX] = useState(0);
  const [offsetBottomX, setOffsetBottomX] = useState(0);
  useEffect(() => {
    setOffsetTopX(Math.floor(Math.random() * TILE_W));
    setOffsetBottomX(Math.floor(Math.random() * TILE_W));
  }, []);

  // build a *seamless* sine wave path as a filled strip
  const wavePathD = useMemo(() => {
    const steps = 72;            // more steps = smoother (and still tiny)
    const A = 28;                // amplitude (in authoring units)
    const baseline = TILE_H / 2; // 60 for TILE_H=120
    const twoPiOverW = (Math.PI * 2) / TILE_W;

    // polyline across exactly one full period [0..TILE_W]
    let d = `M0,${baseline}`;
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * TILE_W;
      const y = baseline + A * Math.sin(twoPiOverW * x);
      d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
    }

    // close the shape to the bottom of the tile (filled wave “cap”)
    d += ` L${TILE_W},${TILE_H} L0,${TILE_H} Z`;
    return d;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let fieldMap = [];
    let mapFinish = 0;
    let nodes = [];
    let segments = [];
    let rafId = 0;

    const global = { w: 0, h: 0, s: 10, fW: 0, fH: 0 };
    let alphaScale = 1;

    const moves = [
      { x: 0, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
      { x: 0, y: 1 },  { x: 1, y: 1 },   { x: 1, y: 0 },  { x: 1, y: -1 },
    ];

    const ri = (min, max) => min + Math.floor(Math.random() * (max - min));
    const rf = (min, max) => min + Math.random() * (max - min);

    function readAlpha() {
      const v = parseFloat(getComputedStyle(host).getPropertyValue('--break-line-alpha'));
      if (!Number.isNaN(v)) alphaScale = Math.min(1, Math.max(0, v));
    }

    function buildMap() {
      fieldMap = new Array(global.fH);
      for (let y = 0; y < global.fH; y++) fieldMap[y] = new Array(global.fW).fill(0);
      const size = global.fW * global.fH;
      mapFinish = ri(size / 3, size / 2);
    }

    function buildNode(x, y) {
      return {
        pos: { x, y }, pre: { x, y }, stuckFactor: 0, tailLength: 0, turns: ri(2, 5),
        move() {
          const opts = this.possible();
          const step = opts[ri(0, opts.length)];
          const ox = this.pos.x, oy = this.pos.y;
          const nx = this.pos.x + step.x, ny = this.pos.y + step.y;
          this.stuckFactor -= 1;

          if (nx < 0 || ny < 0 || nx > (global.w / global.s - 1) || ny > (global.h / global.s - 1)) return null;
          if (fieldMap[ny][nx] === 1) return null;
          if (ox !== nx && oy !== ny && fieldMap[ny][ox] === 1 && fieldMap[oy][nx] === 1) return null;

          fieldMap[ny][nx] = 1;
          this.stuckFactor += 2;
          this.tailLength += 1;
          if (step.type === 't') this.turns -= 1;
          this.pre = { x: ox, y: oy };
          this.pos = { x: nx, y: ny };
          return this.pos;
        },
        stuck() { return this.stuckFactor < -5; },
        possible() {
          const ax = this.pos.x - this.pre.x, ay = this.pos.y - this.pre.y;
          if (ax === 0 && ay === 0) return [moves[ri(0, 7)]];
          const idx = moves.findIndex(m => m.x === ax && m.y === ay);
          const out = [moves[idx]];
          if (this.turns > 0) {
            const l = idx === 0 ? moves.length - 1 : idx - 1;
            const r = idx === moves.length - 1 ? 0 : idx + 1;
            out.push({ ...moves[l], type: 't' }, { ...moves[r], type: 't' });
          }
          return out;
        },
      };
    }

    function openCells() {
      const out = [];
      for (let y = 0; y < fieldMap.length; y++)
        for (let x = 0; x < fieldMap[y].length; x++)
          if (fieldMap[y][x] === 0) out.push({ x, y });
      return out;
    }

    function maybeRebuild(force) {
      const open = openCells();
      if (force || open.length <= mapFinish) {
        buildMap();
        nodes = [];
      }
      if (nodes.length < 10 && open.length) {
        const next = open[ri(0, open.length)];
        if (next) nodes.push(buildNode(next.x, next.y));
      }
    }

    function pushSeg(s) {
      if (segments.length > 8000) segments.splice(0, 1000);
      segments.push(s);
    }

    function draw() {
      rafId = requestAnimationFrame(draw);
      maybeRebuild(false);

      const now = performance.now() / 1000;
      const px = v => v * global.s + global.s / 2;

      for (let i = 0; i < nodes.length; i++) {
        const cur = nodes[i].pos;
        const nxt = nodes[i].move();
        if (nxt) {
          pushSeg({ type: 'line', ax: px(cur.x), ay: px(cur.y), bx: px(nxt.x), by: px(nxt.y), born: now, life: rf(6, 10), a0: 0.7 });
        }
        if (nodes[i].tailLength <= 1 || nodes[i].stuck()) {
          pushSeg({ type: 'dot', x: px(cur.x), y: px(cur.y), r: global.s / 4, born: now, life: rf(6, 10), a0: 0.7 });
        }
      }
      nodes = nodes.filter(n => !n.stuck());

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3060ffff';
      ctx.fillStyle = '#3060ffff';

      const alive = [];
      for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        const age = now - s.born;
        if (age >= s.life) continue;
        const a = Math.max(0, s.a0 * (1 - age / s.life)) * alphaScale;
        if (a <= 0.001) continue;

        ctx.globalAlpha = a;
        if (s.type === 'line') {
          ctx.beginPath(); ctx.moveTo(s.ax, s.ay); ctx.lineTo(s.bx, s.by); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        }
        alive.push(s);
      }
      segments = alive;
    }

    function size() {
      const host = hostRef.current;
      const canvas = canvasRef.current;
      if (!host || !canvas) return;

      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      global.w = Math.floor(rect.width);
      global.h = Math.floor(rect.height);
      global.fW = Math.floor(global.w / global.s);
      global.fH = Math.floor(global.h / global.s);

      canvas.width = Math.floor(global.w * dpr);
      canvas.height = Math.floor(global.h * dpr);
      canvas.style.width = `${global.w}px`;
      canvas.style.height = `${global.h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      readAlpha();
      buildMap();
      nodes = [];
      segments = [];
    }

    size();
    rafId = requestAnimationFrame(draw);

    const onResize = () => size();
    const onClick = () => maybeRebuild(true);
    window.addEventListener('resize', onResize, { passive: true });
    hostRef.current?.addEventListener('click', onClick); // canvas has pointer-events: none

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      hostRef.current?.removeEventListener('click', onClick);
    };
  }, [wavePathD]);

  return (
    <section
      ref={hostRef}
      className={styles.break}
      style={{
        '--top-blend': topColor,
        '--bottom-blend': bottomColor,
        '--break-height': `${height}px`,
        '--wave-h': `${waveHeight}px`,
      }}
      aria-hidden="true"
    >
      {/* TOP (flipped in CSS) */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg className={styles.waveSvg} width="100%" height="100%" aria-hidden="true">
          <defs>
            <pattern
              id={topPatternId}
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
              width={TILE_W}
              height={TILE_H}
              /* randomize X offset, then scale Y to desired height */
              patternTransform={`translate(${-offsetTopX} 0) scale(1 ${waveScale})`}
            >
              <path d={wavePathD} className={styles.waveTopFill} />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${topPatternId})`} />
        </svg>
      </div>

      {/* Blue circuit animation */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* BOTTOM */}
      <div className={styles.waveBottom} aria-hidden="true">
        <svg className={styles.waveSvg} width="100%" height="100%" aria-hidden="true">
          <defs>
            <pattern
              id={bottomPatternId}
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
              width={TILE_W}
              height={TILE_H}
              /* independent random X offset for the bottom wave */
              patternTransform={`translate(${-offsetBottomX} 0) scale(1 ${waveScale})`}
            >
              <path d={wavePathD} className={styles.waveBottomFill} />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${bottomPatternId})`} />
        </svg>
      </div>
    </section>
  );
}
