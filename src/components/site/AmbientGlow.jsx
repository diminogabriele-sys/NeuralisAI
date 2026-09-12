import React, { useEffect, useRef } from "react";

export default function AmbientGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    let frame = null;

    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty("--x", `${e.clientX}px`);
        ref.current?.style.setProperty("--y", `${e.clientY}px`);
        frame = null;
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[46] hidden md:block"
      style={{
        background:
          "radial-gradient(560px circle at var(--x, 50%) var(--y, -100%), rgba(218,41,28,0.07), transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
