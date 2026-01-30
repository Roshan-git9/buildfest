
import React from 'react';
import { AIPerspective } from '../../types';

interface Props {
  insight: (AIPerspective & { systemActions?: string[] }) | null;
}

export const NextSteps: React.FC<Props> = ({ insight }) => {
  const defaultActions = [
    {
      title: "SOFT_CHECK_IN",
      desc: "Deploy a non-intrusive wellness query. Priority: LOW.",
      style: "hover:border-stone-500"
    },
    {
      title: "PAUSE_SEQUENCE",
      desc: "Recommend a voluntary 5-minute cognitive reset.",
      style: "hover:border-amber-500/50"
    },
    {
      title: "RESOURCE_SYNC",
      desc: "Surface optional clarifying material on last-interacted topic.",
      style: "hover:border-stone-400"
    },
    {
      title: "PASSIVE_LOG",
      desc: "No intervention. Maintain current sensing protocols.",
      style: "hover:border-stone-600 opacity-60"
    }
  ];

  const actions = insight?.systemActions ? insight.systemActions.map((s, i) => ({
    title: `STRATEGY_0${i + 1}`,
    desc: s,
    style: i === 0 ? "hover:border-cyan-500/50" : i === 1 ? "hover:border-magenta-500/50" : "hover:border-stone-500"
  })) : defaultActions;

  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12">
        <div className="flex justify-between items-end border-b border-stone-800 pb-8">
          <div className="space-y-2">
            <span className="mono text-[10px] tracking-[0.4em] text-cyan-500/70">Dossier 05</span>
            <h2 className="text-4xl font-light text-stone-100 uppercase tracking-tighter">Response Matrix</h2>
          </div>
          <div className="text-right">
             <span className="mono text-[8px] text-stone-600 tracking-widest uppercase">Dynamic Intelligence Protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, i) => (
            <button 
              key={i}
              className={`p-10 bg-stone-950/40 border border-white/5 text-left transition-all duration-300 group relative backdrop-blur-xl ${action.style}`}
            >
              <div className="absolute top-4 right-4 mono text-[8px] text-stone-800 group-hover:text-cyan-500/30 transition-colors uppercase">
                {action.title}
              </div>
              <h3 className="mono text-xs tracking-[0.4em] font-bold text-stone-300 mb-4 group-hover:text-stone-100">SYSTEM_ACTION</h3>
              <p className="text-stone-500 text-sm font-light max-w-sm group-hover:text-stone-400 leading-relaxed italic">
                "{action.desc}"
              </p>
            </button>
          ))}
        </div>

        {!insight?.systemActions && (
          <div className="p-6 bg-cyan-950/10 border border-cyan-500/20 rounded-lg text-center">
             <p className="mono text-[10px] text-cyan-400 animate-pulse tracking-widest uppercase">Synthesizing personalized strategies based on current rhythm...</p>
          </div>
        )}

        <div className="pt-12 flex justify-center">
           <button 
            onClick={() => {
              localStorage.removeItem('lumina_students_collection');
              window.location.reload();
            }}
            className="liquid-button mono text-[9px] tracking-[0.5em] text-stone-700 hover:text-magenta-500 transition-colors uppercase px-6 py-2 rounded-full border border-stone-800 hover:border-magenta-500/30"
          >
            TERMINATE_SESSION_AND_PURGE_CACHE
          </button>
        </div>
      </div>
    </section>
  );
};
