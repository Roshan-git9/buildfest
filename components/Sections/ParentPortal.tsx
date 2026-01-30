
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Student } from '../../types';

interface Props {
  student: Student;
}

export const ParentPortal: React.FC<Props> = ({ student }) => {
  const { name, age, grade, focusArea, remarks, engagementData, insight } = student;
  
  const avgConsistency = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.consistency, 0) / engagementData.length : 0;
  const avgDepth = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.depth, 0) / engagementData.length : 0;
  const avgFocus = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.focus, 0) / engagementData.length : 0;

  const chartData = [
    { name: 'Consistency Rhythm', value: avgConsistency, color: '#00bbf9' },
    { name: 'Cognitive Depth', value: avgDepth, color: '#ff3366' },
    { name: 'Active Presence', value: avgFocus, color: '#00f5d4' }
  ];

  const getSyncStatus = (score: number) => {
    if (score > 85) return { label: 'SYNCHRONIZED', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    if (score > 70) return { label: 'FLOW_ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score > 50) return { label: 'OBSERVING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'ALIGNMENT_REQ', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const score = insight?.engagementScore || 0;
  const status = getSyncStatus(score);

  const getParentAdvice = (score: number) => {
    if (score > 85) return "Deep synchronization achieved. Your child is navigating complex learning layers with high rhythmic precision.";
    if (score > 70) return "Active flow detected. Patterns show a healthy balance of exploration and focused inquiry.";
    if (score > 50) return "Slight rhythmic drift observed. This suggests a transition phase where supportive environmental cues might be helpful.";
    return "Alignment is currently low. This is a gentle opportunity for a restorative pause or a shift in learning focus.";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Student', val: name },
           { label: 'Academic Level', val: grade || 'Unassigned' },
           { label: 'Chronological Age', val: age ? `${age} yrs` : 'N/A' },
           { label: 'Primary Focus', val: focusArea || 'Holistic' }
         ].map((item, i) => (
           <div key={i} className="tile p-6 flex flex-col items-center justify-center border-white/5 bg-stone-950/20 text-center transition-transform hover:scale-[1.02]">
              <span className="mono text-[8px] text-stone-600 uppercase tracking-[0.3em] mb-2">{item.label}</span>
              <span className="text-stone-200 font-light text-lg tracking-tight">{item.val}</span>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="tile rgb-border lg:col-span-6 p-12 flex flex-col items-center glow-blue bg-stone-950/40 relative">
          <div className="tile-header w-full border-b border-white/5 pb-4 mb-10">
            <span className="rgb-text font-bold uppercase tracking-[0.2em]">Rhythmic Engagement Matrix</span>
            <span className="text-stone-600 font-mono text-[8px]">SECURE_REPORT: {student.id.slice(-4)}</span>
          </div>

          <div className={`absolute top-28 right-12 px-4 py-1.5 rounded-full border ${status.bg} ${status.border} ${status.color} mono text-[10px] tracking-widest font-bold shadow-lg animate-pulse`}>
            STATUS: {status.label}
          </div>

          <div className="relative w-72 h-72 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={95}
                  outerRadius={125}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#060505', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className={`text-7xl font-light tracking-tighter ${status.color}`}>
                 {score}%
               </span>
               <span className="mono text-[10px] text-stone-500 uppercase tracking-[0.3em] mt-3">Sync Level</span>
            </div>
          </div>

          <div className="text-center space-y-6 max-w-md">
             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
               <h4 className="mono text-[10px] text-stone-400 uppercase tracking-widest mb-3">Guardian Summary</h4>
               <p className="text-stone-200 font-light italic text-xl leading-relaxed">
                 {getParentAdvice(score)}
               </p>
             </div>
             
             <div className="grid grid-cols-3 gap-4 pt-4 w-full">
                {chartData.map((item) => (
                  <div key={item.name} className="flex flex-col items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}` }}></div>
                    <span className="mono text-[8px] text-stone-500 uppercase tracking-widest text-center">{item.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="tile rgb-border lg:col-span-6 p-10 flex flex-col justify-center bg-gradient-to-br from-stone-900/40 to-stone-950/70">
          <div className="tile-header mb-8">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">Supportive Alignment Plan</span>
            <span className="text-stone-500 mono text-[8px]">AI_GUIDE: ENABLED</span>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="mono text-[9px] text-magenta-500 uppercase tracking-widest font-bold">Rhythmic Analysis</span>
              <h3 className="serif text-3xl md:text-4xl text-stone-50 font-light leading-[1.2] italic tracking-tight border-l-2 border-magenta-500/30 pl-8">
                "{insight?.observation || 'Synthesizing the last 168 hours of behavioral patterns...'}"
              </h3>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
            
            <div className="space-y-6">
               <h4 className="mono text-[10px] text-white uppercase tracking-[0.4em] font-bold">AI Recommended Actions</h4>
               <div className="space-y-3">
                  {(insight?.suggestions || ['Synchronizing teacher logs and academic metrics...']).map((s, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-2xl transition-all hover:bg-white/[0.05] group">
                       <span className="text-magenta-500 mono font-bold text-xs">0{i+1}</span>
                       <span className="text-stone-300 text-sm font-light leading-relaxed">{s}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="tile rgb-border lg:col-span-12 p-10 bg-stone-950/60 relative overflow-hidden group">
          <div className="tile-header">
            <span className="rgb-text font-bold uppercase tracking-widest">Educator's Session Reflections</span>
            <span className="text-stone-600 font-mono text-[8px]">ACCESS: SECURE_SYNC</span>
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-12 items-start">
             <div className="w-20 h-20 rounded-3xl border border-white/5 bg-stone-900 flex-shrink-0 flex items-center justify-center glow-red shadow-inner transition-transform group-hover:rotate-3">
                <svg className="w-10 h-10 text-magenta-500 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
             </div>
             <div className="flex-1 space-y-6">
                <p className="text-stone-200 font-light italic leading-relaxed text-2xl md:text-4xl max-w-6xl">
                  {remarks ? `"${remarks}"` : "The educator has not provided qualitative session reflections for this cycle."}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-8 gap-4">
                   <div className="mono text-[9px] text-stone-600 uppercase tracking-widest">Privacy Protocol: Hashed for Confidentiality</div>
                   <button className="liquid-button text-[10px] mono text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-[0.2em] border border-cyan-400/20 px-6 py-2 rounded-full bg-stone-950/40">Request Full Session Log &gt;</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
