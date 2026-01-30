
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { EngagementPoint } from '../../types';

interface Props {
  data: EngagementPoint[];
}

export const EngagementPatterns: React.FC<Props> = ({ data }) => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12">
        <div className="flex justify-between items-end border-b border-stone-800 pb-8">
          <div className="space-y-2">
            <span className="mono text-[10px] tracking-[0.4em] text-amber-500/70">Dossier 02</span>
            <h2 className="text-4xl font-light text-stone-100">Engagement Drift</h2>
          </div>
          <div className="mono text-[10px] text-stone-500 text-right">
             METRIC: PERSISTENCE_INDEX<br />
             RANGE: 7D_HISTORICAL
          </div>
        </div>

        <div className="h-[450px] w-full glass rounded-sm p-8 relative">
          {/* Overlay grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a8a29e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#a8a29e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1c1917" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716c', fontSize: 10, fontFamily: 'JetBrains Mono'}} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', borderRadius: '4px', fontSize: '12px' }}
                itemStyle={{ color: '#d6d3d1' }}
              />
              <Area 
                type="monotone" 
                dataKey="consistency" 
                stroke="#d97706" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorConsistency)" 
              />
              <Area 
                type="monotone" 
                dataKey="depth" 
                stroke="#78716c" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorDepth)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-12 mono text-[10px] tracking-widest text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-[2px] bg-amber-600" /> CONSISTENCY
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-[2px] bg-stone-600" /> INQUIRY_DEPTH
          </div>
        </div>
      </div>
    </section>
  );
};
