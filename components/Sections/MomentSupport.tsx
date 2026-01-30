
import React, { useState } from 'react';
import { AIPerspective } from '../../types';

interface Props {
  insight: AIPerspective | null;
  isLoading: boolean;
}

export const MomentSupport: React.FC<Props> = ({ insight, isLoading }) => {
  const [showIntel, setShowIntel] = useState(false);

  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="flex justify-between items-end border-b border-stone-800 pb-8">
          <div className="space-y-2">
            <span className="mono text-[10px] tracking-[0.4em] text-amber-500/70">Dossier 04</span>
            <h2 className="text-4xl font-light text-stone-100">Intelligence Brief</h2>
          </div>
          <button 
            onClick={() => setShowIntel(!showIntel)}
            className={`liquid-button px-4 py-2 border mono text-[10px] tracking-widest transition-all duration-300 rounded-lg ${showIntel ? 'bg-amber-500 border-amber-500 text-stone-900' : 'border-stone-700 text-stone-400 hover:text-stone-100 hover:border-stone-500'}`}
          >
            {showIntel ? 'HIDE_INTELLIGENCE' : 'VIEW_INTELLIGENCE'}
          </button>
        </div>

        <div className="min-h-[400px] flex flex-col p-12 glass rounded-sm relative overflow-hidden">
          {isLoading ? (
            <div className="m-auto flex flex-col items-center space-y-4">
               <div className="w-12 h-[1px] bg-stone-800 relative overflow-hidden">
                 <div className="absolute inset-0 bg-amber-500 animate-[loading_1.5s_infinite]" />
               </div>
               <span className="mono text-[10px] text-stone-600 tracking-widest">DECRYPTING_PATTERNS</span>
            </div>
          ) : showIntel ? (
             <div className="animate-in fade-in zoom-in-95 duration-700 space-y-12">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col gap-2">
                     <span className="mono text-[10px] text-stone-500">ENGAGEMENT_SCORE</span>
                     <span className="text-5xl font-light text-amber-500">{insight?.engagementScore || 0}%</span>
                  </div>
                  <div className="h-16 w-[1px] bg-stone-800" />
                  <div className="flex flex-col gap-2">
                     <span className="mono text-[10px] text-stone-500">LEARNING_STATUS</span>
                     <span className={`text-2xl font-light tracking-widest uppercase ${insight?.isStudying ? 'text-emerald-500' : 'text-stone-400 opacity-60'}`}>
                       {insight?.isStudying ? 'Actively Studying' : 'Potential Drift'}
                     </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="mono text-[10px] tracking-widest text-amber-500/70 uppercase">Behavioral Synthesis</h3>
                  <p className="text-2xl font-light text-stone-200 leading-relaxed italic border-l-2 border-amber-500/30 pl-8">
                    "{insight?.observation}"
                  </p>
                </div>
             </div>
          ) : (
            <div className="m-auto text-center space-y-6">
              <p className="text-stone-500 font-light max-w-sm">Detailed student behavior analysis is locked for privacy. Select VIEW_INTELLIGENCE to decrypt the sensing layer.</p>
              <div className="inline-block p-4 rounded-full border border-stone-800 opacity-20">
                <div className="w-8 h-8 border-2 border-stone-700 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-stone-700 rounded-full" />
                </div>
              </div>
            </div>
          )}
          
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};
