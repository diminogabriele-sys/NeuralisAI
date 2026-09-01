import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Coins, TrendingUp } from "lucide-react";

function Slider({ label, value, min, max, step, unit, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </label>
        <span className="font-display italic text-2xl text-acid">
          {value}
          <span className="font-mono text-xs text-muted-foreground ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none h-px bg-steel cursor-pointer slider-acid"
        style={{ accentColor: "#C5FF4D" }}
      />
      <div className="flex justify-between font-mono text-[9px] text-muted-foreground/60 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, values }) {
  return (
    <div className="border border-steel p-6 hover:border-acid/40 transition-colors group">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-acid" strokeWidth={1.5} />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="space-y-2">
        {values.map((v) => (
          <div key={v.l} className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-muted-foreground">{v.l}</span>
            <motion.span
              key={v.v}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display italic text-2xl text-titanium group-hover:text-acid transition-colors"
            >
              {v.v}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ROI() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(45);
  const [coverage, setCoverage] = useState(70);

  const result = useMemo(() => {
    const weeklyHoursSaved = (hours * coverage) / 100;
    const weeklySaved = weeklyHoursSaved * rate;
    const monthlySaved = weeklySaved * 4.33;
    const yearlySaved = weeklySaved * 52;
    const fmt = (n) =>
      "€" + Math.round(n).toLocaleString("it-IT");
    const hfmt = (n) => {
      const r = Math.round(n);
      return r >= 1000 ? (r / 1000).toFixed(1) + "k" : String(r);
    };
    return {
      time: [
        { l: "/ settimana", v: weeklyHoursSaved.toFixed(1) + "h" },
        { l: "/ mese", v: hfmt(weeklyHoursSaved * 4.33) + "h" },
        { l: "/ anno", v: hfmt(weeklyHoursSaved * 52) + "h" },
      ],
      money: [
        { l: "/ mese", v: fmt(monthlySaved) },
        { l: "/ anno", v: fmt(yearlySaved) },
      ],
      yearlyHours: Math.round(weeklyHoursSaved * 52),
      yearlyMoney: Math.round(yearlySaved),
    };
  }, [hours, rate, coverage]);

  return (
    <section id="roi" className="relative py-24 md:py-32 border-t border-steel">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-acid mb-4">
              // ROI Terminal
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl text-titanium leading-[0.95]">
              Quanto costa<br />il tuo caos.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Regola i parametri dei tuoi processi manuali. Il sistema calcola
              in tempo reale quanto tempo e denaro l'automazione restituirebbe
              alla tua azienda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-px">
          {/* Input panel */}
          <div className="col-span-12 lg:col-span-7 border border-steel p-8 md:p-10 bg-card/30">
            <div className="font-mono text-[10px] uppercase tracking-widest text-acid mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-acid rounded-full animate-pulse" />
              input.run
            </div>
            <div className="space-y-10">
              <Slider
                label="Ore settimanali su compiti manuali"
                value={hours}
                min={1}
                max={120}
                step={1}
                unit="h"
                onChange={setHours}
              />
              <Slider
                label="Costo orario medio (€)"
                value={rate}
                min={15}
                max={150}
                step={5}
                unit="€"
                onChange={setRate}
              />
              <Slider
                label="Copertura automazione"
                value={coverage}
                min={10}
                max={95}
                step={5}
                unit="%"
                onChange={setCoverage}
              />
            </div>

            {/* Coverage bar */}
            <div className="mt-10 pt-8 border-t border-steel">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                // Efficienza stimata
              </div>
              <div className="h-1.5 w-full bg-steel overflow-hidden">
                <motion.div
                  className="h-full bg-acid"
                  animate={{ width: `${coverage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-px">
            <Stat icon={Clock} label="Tempo recuperato" values={result.time} />
            <Stat icon={Coins} label="Denaro recuperato" values={result.money} />

            <div className="border border-steel p-6 bg-acid/5 flex-1 flex flex-col justify-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-acid mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                // Valore annuo totale
              </div>
              <motion.div
                key={result.yearlyMoney}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-display italic text-5xl md:text-6xl text-acid leading-none"
              >
                €{result.yearlyMoney.toLocaleString("it-IT")}
              </motion.div>
              <div className="font-mono text-xs text-muted-foreground mt-2">
                + {result.yearlyHours.toLocaleString("it-IT")}h / anno recuperate
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-acid text-obsidian font-mono text-xs uppercase tracking-[0.2em] hover:bg-acid/80 transition-colors"
          >
            Recupera il tuo tempo →
          </a>
        </div>
      </div>
    </section>
  );
}