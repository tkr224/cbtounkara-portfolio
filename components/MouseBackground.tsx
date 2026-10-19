"use client";

import { useEffect, useRef } from "react";

type Shape = {
  kind: "blob" | "ring" | "square" | "dot";
  /** Position verticale en px depuis le haut de la page (fixe, pour ne
   *  pas bouger quand la hauteur de la page change pendant le chargement). */
  top: number;
  left: string;
  size: number;
  color: string;
  /** Facteur de parallaxe : négatif = mouvement inverse à la souris. */
  k: number;
  dur: number;
  delay: number;
};

const BLUE = "0, 113, 227";
const TEAL = "52, 199, 189";
const LILAC = "175, 130, 230";

const SHAPES: readonly Shape[] = [
  { kind: "blob", top: -160, left: "-12%", size: 620, color: `rgba(${BLUE}, .16)`, k: -90, dur: 11, delay: 0 },
  { kind: "blob", top: -60, left: "68%", size: 560, color: `rgba(${TEAL}, .18)`, k: 120, dur: 13, delay: -4 },
  { kind: "blob", top: 1250, left: "40%", size: 520, color: `rgba(${LILAC}, .14)`, k: -150, dur: 9, delay: -2 },
  { kind: "blob", top: 2500, left: "-10%", size: 600, color: `rgba(${TEAL}, .14)`, k: 80, dur: 12, delay: -6 },
  { kind: "blob", top: 3500, left: "70%", size: 540, color: `rgba(${BLUE}, .14)`, k: -60, dur: 10, delay: -3 },
  { kind: "ring", top: 420, left: "84%", size: 150, color: `rgba(${BLUE}, .22)`, k: 140, dur: 8, delay: -1 },
  { kind: "ring", top: 1900, left: "6%", size: 96, color: `rgba(${TEAL}, .35)`, k: -110, dur: 7, delay: -5 },
  { kind: "square", top: 760, left: "8%", size: 64, color: `rgba(${LILAC}, .35)`, k: 100, dur: 9, delay: -2 },
  { kind: "square", top: 2900, left: "88%", size: 84, color: `rgba(${BLUE}, .2)`, k: -130, dur: 11, delay: -7 },
  { kind: "dot", top: 300, left: "30%", size: 10, color: `rgba(${BLUE}, .45)`, k: 60, dur: 6, delay: -3 },
  { kind: "dot", top: 1500, left: "92%", size: 8, color: `rgba(${TEAL}, .6)`, k: -70, dur: 7, delay: -1 },
  { kind: "dot", top: 3900, left: "22%", size: 9, color: `rgba(${LILAC}, .55)`, k: 110, dur: 8, delay: -4 },
];

function shapeStyle(shape: Shape): React.CSSProperties {
  const base: React.CSSProperties = { width: shape.size, height: shape.size };
  switch (shape.kind) {
    case "blob":
      return { ...base, borderRadius: "50%", background: `radial-gradient(circle at center, ${shape.color} 0%, transparent 68%)` };
    case "ring":
      return { ...base, borderRadius: "50%", border: `1.5px solid ${shape.color}` };
    case "square":
      return { ...base, borderRadius: Math.round(shape.size * 0.28), border: `1.5px solid ${shape.color}` };
    case "dot":
      return { ...base, borderRadius: "50%", background: shape.color };
  }
}

export function MouseBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const halo = haloRef.current;
    if (!layer || !halo) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || touch) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    // Le halo rattrape le curseur avec un léger retard (interpolation).
    let hx = -1;
    let hy = -1;

    const tick = () => {
      frame = 0;
      layer.style.setProperty("--mx", (x / window.innerWidth - 0.5).toFixed(4));
      layer.style.setProperty("--my", (y / window.innerHeight - 0.5).toFixed(4));

      if (hx < 0) {
        hx = x;
        hy = y;
      }
      hx += (x - hx) * 0.14;
      hy += (y - hy) * 0.14;
      halo.style.transform = `translate3d(${hx - 320}px, ${hy - 320}px, 0)`;
      halo.style.opacity = "1";

      if (Math.abs(x - hx) > 0.5 || Math.abs(y - hy) > 0.5) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      halo.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden [contain:strict]"
      >
        {SHAPES.map((shape, i) => (
          <div
            key={i}
            className="bg-parallax absolute"
            style={{ top: shape.top, left: shape.left, ["--k" as string]: shape.k }}
          >
            <div
              className="bg-float"
              style={{
                ...shapeStyle(shape),
                ["--dur" as string]: `${shape.dur}s`,
                ["--delay" as string]: `${shape.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
      {/* Hors de la couche « contain » pour rester fixé au viewport. */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 h-[640px] w-[640px] rounded-full opacity-0 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle at center, rgba(0, 113, 227, .11) 0%, transparent 65%)" }}
      />
    </>
  );
}
