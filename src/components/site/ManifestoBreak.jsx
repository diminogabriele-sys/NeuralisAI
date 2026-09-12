import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ManifestoBreak() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    let ready = false;
    let frame = null;

    const scrub = () => {
      if (!ready || !video.duration) return;
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      video.currentTime = progress * video.duration;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        scrub();
        frame = null;
      });
    };

    const onLoaded = () => {
      ready = true;
      // Warm up the decoder so seeking renders a frame immediately (needed on some browsers)
      video.play().then(() => video.pause()).catch(() => {});
      scrub();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen w-full carbon-weave flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.08]"
          muted
          playsInline
          preload="auto"
        >
          <source src={`${import.meta.env.BASE_URL}video/hero-s1000rr.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-obsidian/70" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-display uppercase text-2xl md:text-4xl font-medium tracking-[0.005em] text-titanium leading-[1.35]">
            Niente serie. Niente scarichi. Niente cerchi.
            <br />
            Solo carbonio.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
