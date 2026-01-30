
import React from 'react';

const indicators = [
  {
    code: "TMP-01",
    title: "LATENT RESPONSE",
    description: "Pause duration between cognitive shifts has increased by 22% over baseline.",
    note: "SIGNAL: COGNITIVE_FATIGUE"
  },
  {
    code: "DNS-04",
    title: "GRANULAR SHIFT",
    description: "Movement from broad inquiry to repetitive verification of known constants.",
    note: "SIGNAL: REASSURANCE_LOOP"
  },
  {
    code: "FLX-09",
    title: "CADENCE DRIFT",
    description: "Loss of rhythmic interaction in group environments. Solo focus dominant.",
    note: "SIGNAL: SOCIAL_WITHDRAWAL"
  }
];

export const DriftIndicators: React.FC = () => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12">
        <div className="flex justify-between items-end border-b border-stone-800 pb-8">
          <div className="space-y-2">
            <span className="mono text-[10px] tracking-[0.4em] text-amber-500/70">Dossier 03</span>
            <h2 className="text-4xl font-light text-stone-100">Behavioral Markers</h2>
          </div>
          <div className="mono text-[10px] text-stone-500">
             STATUS: MONITORING_ACTIVE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {indicators.map((indicator, i) => (
            <div 
              key={i}
              className="group p-8 bg-[#141211] border border-stone-800/40 hover:bg-[#1a1817] transition-all duration-500"
            >
              <div className="mono text-[10px] text-amber-600 mb-6">{indicator.code}</div>
              <h3 className="text-xl font-light text-stone-200 tracking-wide mb-4">{indicator.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 opacity-80">{indicator.description}</p>
              <div className="pt-6 border-t border-stone-900 mono text-[9px] text-stone-600 group-hover:text-amber-500/60 transition-colors">
                {indicator.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
