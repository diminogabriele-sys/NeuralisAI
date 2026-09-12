import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, lines;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(36, Math.floor(w / 45));
      lines = Array.from({ length: count }, () => ({
        y: Math.random() * h,
        x: Math.random() * w,
        len: Math.random() * 180 + 60,
        speed: Math.random() * 4 + 2,
        opacity: Math.random() * 0.25 + 0.05,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      lines.forEach((l) => {
        l.x -= l.speed;
        if (l.x + l.len < 0) {
          l.x = w + l.len;
          l.y = Math.random() * h;
        }
        const grad = ctx.createLinearGradient(l.x, l.y, l.x + l.len, l.y);
        grad.addColorStop(0, `rgba(179, 16, 31, 0)`);
        grad.addColorStop(0.5, `rgba(179, 16, 31, ${l.opacity})`);
        grad.addColorStop(1, `rgba(229, 225, 216, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + l.len, l.y);
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center carbon">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-obsidian/20 via-obsidian/70 to-obsidian" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(179,16,31,0.14)_0%,_transparent_60%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" />

      <div className="relative z-20 mx-auto max-w-[1600px] px-6 md:px-12 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-mono text-[11px] md:text-xs uppercase tracking-[0.4em] text-brabus mb-8 flex items-center justify-center gap-3"
        >
          <span className="w-8 h-px bg-brabus" />
          <span>Atelier di Personalizzazione — Serie Limitata</span>
          <span className="w-8 h-px bg-brabus" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display uppercase text-[11vw] sm:text-[9vw] md:text-[8vw] leading-[0.92] text-titanium text-balance break-words"
        >
          La tua moto,<br />
          <span className="text-brabus">nessun compromesso</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed text-balance"
        >
          Componenti su misura in <span className="text-titanium">carbonio</span> e{" "}
          <span className="text-titanium">titanio</span>, progettati e lavorati a mano per due
          piattaforme d'eccellenza: <span className="text-titanium">BMW S1000RR</span> e{" "}
          <span className="text-titanium">Kawasaki Z900</span>. Ogni pezzo è unico, numerato e
          costruito per chi non accetta di guidare una moto uguale a tutte le altre.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 bg-brabus text-titanium font-mono text-xs uppercase tracking-[0.2em] overflow-hidden hover:bg-brabuslight transition-colors"
          >
            <span className="relative z-10">Richiedi una consulenza →</span>
          </a>
          <a
            href="#modelli"
            className="px-8 py-4 border border-steel text-titanium font-mono text-xs uppercase tracking-[0.2em] hover:border-brabus hover:text-brabus transition-colors"
          >
            Scopri le piattaforme
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scorri</span>
        <span className="w-px h-12 bg-gradient-to-b from-brabus to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
