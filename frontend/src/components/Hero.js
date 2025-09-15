'use client';

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = heroRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ---- Animation state ----
    let fieldMap = [];
    let mapFinish = 0;
    let nodes = [];
    let segments = [];        // each drawn piece fades independently
    let rafId = 0;

    const global = { w: 0, h: 0, s: 10, fW: 0, fH: 0 };
    let alphaScale = 1;       // CSS multiplier for overall brightness (uses --hero-line-alpha)

    const availableMoves = [
      { x: 0, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
      { x: 0, y: 1 },  { x: 1, y: 1 },   { x: 1, y: 0 },  { x: 1, y: -1 },
    ];

    const randInt = (min, max) => min + Math.floor(Math.random() * (max - min));
    const randFloat = (min, max) => min + Math.random() * (max - min);

    function readAlphaFromCSS() {
      const cs = getComputedStyle(host);
      const v = parseFloat(cs.getPropertyValue("--hero-line-alpha"));
      if (!Number.isNaN(v)) alphaScale = Math.min(1, Math.max(0, v));
    }

    function buildNewMap() {
      fieldMap = new Array(global.fH);
      for (let h = 0; h < global.fH; h++) fieldMap[h] = new Array(global.fW).fill(0);
      const size = global.fW * global.fH;
      mapFinish = randInt(size / 3, size / 2);
    }

    function buildNewNode(x, y) {
      return {
        pos: { x, y }, pre: { x, y }, stuckFactor: 0, tailLength: 0, turns: randInt(2, 5),
        move() {
          const moves = this.possibleMoves();
          const curMove = moves[randInt(0, moves.length)];
          const ox = this.pos.x, oy = this.pos.y;
          const nx = this.pos.x + curMove.x, ny = this.pos.y + curMove.y;
          this.stuckFactor -= 1;

          if (nx < 0 || ny < 0 || nx > (global.w / global.s - 1) || ny > (global.h / global.s - 1)) return null;
          if (fieldMap[ny][nx] === 1) return null;
          if (ox !== nx && oy !== ny && fieldMap[ny][ox] === 1 && fieldMap[oy][nx] === 1) return null;

          fieldMap[ny][nx] = 1;
          this.stuckFactor += 2;
          this.tailLength += 1;
          if (curMove.type === "t") this.turns -= 1;
          this.pre = { x: ox, y: oy };
          this.pos = { x: nx, y: ny };
          return this.pos;
        },
        stuck() { return this.stuckFactor < -5; },
        possibleMoves() {
          const ax = this.pos.x - this.pre.x, ay = this.pos.y - this.pre.y;
          if (ax === 0 && ay === 0) return [availableMoves[randInt(0, 7)]];
          const index = availableMoves.findIndex(m => m.x === ax && m.y === ay);
          const result = [availableMoves[index]];
          if (this.turns > 0) {
            const lIndex = index === 0 ? availableMoves.length - 1 : index - 1;
            const rIndex = index === availableMoves.length - 1 ? 0 : index + 1;
            result.push({ ...availableMoves[lIndex], type: "t" });
            result.push({ ...availableMoves[rIndex], type: "t" });
          }
          return result;
        },
      };
    }

    function getNotFilled() {
      const open = [];
      for (let i = 0; i < fieldMap.length; i++)
        for (let j = 0; j < fieldMap[i].length; j++)
          if (fieldMap[i][j] === 0) open.push({ x: j, y: i });
      return open;
    }

    function rebuild(force) {
      const open = getNotFilled();
      if (force || open.length <= mapFinish) {
        // IMPORTANT: no canvas clear — we just reset the field and keep fading segments
        buildNewMap();
        nodes = [];
      }
      // seed new nodes over time
      if (nodes.length < 10) {
        const next = open[randInt(0, open.length)];
        if (next) nodes.push(buildNewNode(next.x, next.y));
      }
    }

    function addSegment(segment) {
      // cap total to avoid unbounded memory (old ones fade out anyway)
      if (segments.length > 8000) segments.splice(0, 1000);
      segments.push(segment);
    }

    function drawFrame() {
      rafId = requestAnimationFrame(drawFrame);

      rebuild(false);

      const now = performance.now() / 1000; // seconds
      const px = v => v * global.s + global.s / 2;

      // 1) Let nodes walk and emit new fading segments (lines + dots)
      for (let i = 0; i < nodes.length; i++) {
        const cur = nodes[i].pos;
        const nxt = nodes[i].move();

        if (nxt) {
          addSegment({
            type: "line",
            ax: px(cur.x), ay: px(cur.y),
            bx: px(nxt.x), by: px(nxt.y),
            born: now,
            life: randFloat(6, 10),   // 6–10s
            a0: 0.7                   // start at 70% opacity
          });
        }

        if (nodes[i].tailLength <= 1 || nodes[i].stuck()) {
          addSegment({
            type: "dot",
            x: px(cur.x), y: px(cur.y),
            r: global.s / 4,
            born: now,
            life: randFloat(6, 10),
            a0: 0.7
          });
        }
      }
      nodes = nodes.filter(n => !n.stuck());

      // 2) Clear canvas and redraw all live segments with decayed alpha
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3060ffff";
      ctx.fillStyle = "#3060ffff";

      const alive = [];
      for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        const age = now - s.born;
        if (age >= s.life) continue;

        // linear decay from a0 → 0 over life, scaled by CSS alphaScale
        const a = Math.max(0, s.a0 * (1 - age / s.life)) * alphaScale;
        if (a <= 0.001) continue;

        ctx.globalAlpha = a;

        if (s.type === "line") {
          ctx.beginPath();
          ctx.moveTo(s.ax, s.ay);
          ctx.lineTo(s.bx, s.by);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }

        alive.push(s);
      }
      segments = alive; // keep only live ones
    }

    function sizeCanvas() {
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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      readAlphaFromCSS();
      buildNewMap();
      nodes = [];
      segments = []; // fresh start on resize only
    }

    // init
    sizeCanvas();
    rafId = requestAnimationFrame(drawFrame);

    // resize & click (click reshuffles field, but keeps current segments fading)
    const onResize = () => sizeCanvas();
    const onClick = () => rebuild(true);
    window.addEventListener("resize", onResize, { passive: true });
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
      {/* animated electronic lines */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true">
        Canvas not supported by your browser
      </canvas>

      <div className="container">
        <span className={styles.srOnly}>Anything Electronic</span>
        <div className={styles.inner}>
          <h1 id="hero-title" className={styles.title}>Anything&apos;s Possible</h1>
          <p className={styles.tagline}>
            Electronic repair & manufacturing in Nelson, NZ for trade customers —
            franchise dealers, garages, and auto electricians.
          </p>
          <div className={styles.ctas}>
            <Link href="/shop" className={`button ${styles.ctaPrimary}`}>
              Explore Products
            </Link>
            <Link href="/contact" className={`button ${styles.ctaSecondary}`}>
              Get in Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
