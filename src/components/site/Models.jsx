import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function WorkRecord({ record, make, model, tag, specs, workRecordLabel, recordPrefix }) {
  return (
    <div className="bg-carbonfiber p-8 md:p-10">
      <div className="flex items-baseline justify-between font-body text-[11px] uppercase tracking-[0.083em] text-fumo">
        <span>{workRecordLabel}</span>
        <span>{recordPrefix} {record}</span>
      </div>
      <div className="mt-8">
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo">{make}</div>
        <h3 className="font-display uppercase text-2xl font-medium tracking-[0.005em] text-titanium mt-1">{model}</h3>
        <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo mt-1">{tag}</div>
      </div>
      <div className="mt-8 pt-6 border-t border-steel grid grid-cols-2 gap-x-6 gap-y-5">
        {specs.map((s) => (
          <div key={s.l}>
            <div className="font-body text-[11px] uppercase tracking-[0.083em] text-fumo">{s.l}</div>
            <div className="text-[15px] text-titanium mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BikeBlock({ data, index, workRecordLabel, recordPrefix, ctaPrefix }) {
  const reverse = index % 2 === 1;
  return (
    <div className="py-16 md:py-20 border-t border-steel">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-14 items-center">
          <div className={`min-w-0 col-span-12 md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
            <WorkRecord
              record={data.record}
              make={data.make}
              model={data.model}
              tag={data.tag}
              specs={data.specs}
              workRecordLabel={workRecordLabel}
              recordPrefix={recordPrefix}
            />
          </div>

          <div className={`min-w-0 col-span-12 md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
            <p className="text-[15px] leading-[1.8] text-fumo max-w-lg mb-8">{data.desc}</p>

            <ul className="space-y-3 mb-9">
              {data.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[14px] text-titanium">
                  <span className="w-1 h-1 mt-2 bg-fumo shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="font-body text-[14px] text-titanium underline decoration-brabus/50 underline-offset-4 hover:decoration-brabus transition-colors"
            >
              {ctaPrefix} {data.model}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Models() {
  const { t } = useLanguage();

  return (
    <section id="modelli" className="relative">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12 pt-24 md:pt-28 text-center">
        <h2 className="font-display uppercase text-xl md:text-2xl font-medium tracking-[0.01em] text-titanium leading-[1.3] max-w-xl mx-auto">
          {t.models.heading}
        </h2>
      </div>
      {t.models.bikes.map((b, i) => (
        <BikeBlock
          key={b.record}
          data={b}
          index={i}
          workRecordLabel={t.models.workRecordLabel}
          recordPrefix={t.models.recordPrefix}
          ctaPrefix={t.models.ctaPrefix}
        />
      ))}
    </section>
  );
}
