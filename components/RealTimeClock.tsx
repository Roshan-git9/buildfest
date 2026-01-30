
import React, { useState, useEffect } from 'react';

export const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mono text-[9px] tracking-[0.2em] text-stone-500 flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-stone-800/50">
      <div className="flex flex-col items-end">
        <span className="text-stone-300 font-medium">{time.toLocaleTimeString([], { hour12: false })}</span>
        <span className="opacity-40 uppercase text-[8px]">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="h-6 w-[1px] bg-stone-800" />
      <div className="text-right">
        <div className="text-amber-500/70 font-bold">SYSTEM_LIVE</div>
        <div className="text-stone-700 text-[8px]">D-LAYER_99</div>
      </div>
    </div>
  );
};
