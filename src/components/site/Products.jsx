import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function ProductCard({ p, priceOnRequest, requestPrice }) {
  return (
    <a
      href="#contact"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-carbonfiber p-8 md:p-10 min-h-[300px] w-[78vw] sm:w-[360px] shrink-0 snap-start transition-transform hover:scale-[1.015]"
    >
      <div className="relative">
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mb-3">{p.fit}</div>
        <h3 className="font-display uppercase text-2xl font-medium tracking-[0.005em] text-titanium leading-tight mb-3">
          {p.name}
        </h3>
        <p className="text-[14px] leading-[1.7] text-fumo max-w-xs">{p.desc}</p>
      </div>
      <div className="relative mt-8 flex flex-col gap-1.5 border-t border-steel pt-6">
        <span className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo">{priceOnRequest}</span>
        <span className="font-body text-[12px] uppercase tracking-[0.083em] text-titanium group-hover:text-brabus transition-colors">
          {requestPrice}
        </span>
      </div>
    </a>
  );
}

export default function Products() {
  const { t } = useLanguage();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("a");
    const amount = (card?.offsetWidth || 360) + 24;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  // Click-and-drag scrolling for mouse users (touch/trackpad already scroll natively)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
      el.style.userSelect = "none";
      el.classList.replace("cursor-grab", "cursor-grabbing");
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.style.scrollSnapType = "";
      el.style.userSelect = "";
      el.classList.replace("cursor-grabbing", "cursor-grab");
      if (moved) {
        const swallowClick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", swallowClick, { capture: true, once: true });
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <section id="prodotti" className="relative py-20 md:py-28 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between text-center sm:text-left mb-10 gap-6">
          <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-md mx-auto sm:mx-0">
            {t.products.heading}
          </h2>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              aria-label={t.products.prevLabel}
              className="w-10 h-10 flex items-center justify-center border border-steel text-titanium hover:border-brabus hover:text-brabus transition-colors disabled:opacity-30 disabled:hover:border-steel disabled:hover:text-titanium"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              aria-label={t.products.nextLabel}
              className="w-10 h-10 flex items-center justify-center border border-steel text-titanium hover:border-brabus hover:text-brabus transition-colors disabled:opacity-30 disabled:hover:border-steel disabled:hover:text-titanium"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 px-6 md:-mx-12 md:px-12 cursor-grab [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {t.products.items.map((p) => (
            <ProductCard key={p.id} p={p} priceOnRequest={t.products.priceOnRequest} requestPrice={t.products.requestPrice} />
          ))}
        </div>
      </div>
    </section>
  );
}
