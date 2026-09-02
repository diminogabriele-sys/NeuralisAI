import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

const HERO_IMG = "https://media.base44.com/images/public/6a97254d27e8e1fef9e64cf1/05761c458_generated_9c75fe5d.jpg";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, particles;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(80, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: w / 2, y: h / 2 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(197, 255, 77, 0.5)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(197, 255, 77, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt="Rete neurale astratta"
          fittingType="fill"
          className="w-full h-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/70 to-obsidian" />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" />

      <div className="relative z-20 mx-auto max-w-[1600px] px-6 md:px-12 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-mono text-[11px] md:text-xs uppercase tracking-[0.4em] text-acid mb-8 flex items-center justify-center gap-3"
        >
          <span className="w-8 h-px bg-acid" />
          <span>System Online — v.2026</span>
          <span className="w-8 h-px bg-acid" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display italic text-[14vw] md:text-[9vw] leading-[0.95] text-titanium text-balance"
        >
          Architetti di<br />
          <span className="text-acid">Logica Neurale</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed text-balance"
        >
          Automazione AI e <span className="text-acid">creazione di siti web</span> ad alte
          prestazioni. Traduciamo la complessità degli algoritmi in automazioni silenziose
          e interfacce che pensano. Il partner architettonico per chi colonizza il futuro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 bg-acid text-obsidian font-mono text-xs uppercase tracking-[0.2em] overflow-hidden"
          >
            <span className="relative z-10">Inizia l'automazione →</span>
          </a>
          <a
            href="#work"
            className="px-8 py-4 border border-steel text-titanium font-mono text-xs uppercase tracking-[0.2em] hover:border-acid hover:text-acid transition-colors"
          >
            Esplora la logica
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
        <span className="w-px h-12 bg-gradient-to-b from-acid to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}