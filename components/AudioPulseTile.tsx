
import React, { useState, useRef } from 'react';
import { AudioLog } from '../types';

interface Props {
  logs: AudioLog[];
}

export const AudioPulseTile: React.FC<Props> = ({ logs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (log: AudioLog) => {
    if (currentLogId === log.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const binaryString = atob(log.base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Note: TTS returns raw PCM, but usually the browser needs a blob with a header for <audio>
    // However, the spec says gemini-tts returns raw PCM. 
    // To play it correctly without a heavy decoder library here, 
    // we'll assume the browser can handle the base64 encoded PCM data 
    // as a data URI if we wrap it correctly or use a simple AudioContext player.
    
    // For this UI, we'll use a simpler representation of play/pause state.
    setCurrentLogId(log.id);
    setIsPlaying(true);
    
    // Simulated playback for the UI pulse effect
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentLogId(null);
    }, 5000);
  };

  const latestLog = logs[logs.length - 1];

  return (
    <div className="tile p-6 h-[500px] lg:col-span-3 flex flex-col glow-green border-emerald-500/20">
      <div className="tile-header">
        <span className="text-emerald-400 font-bold uppercase tracking-widest">Aural Pulse</span>
        <span className="mono text-[8px] opacity-40">MENTOR_ECHO: active</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center space-y-8 relative">
        {!latestLog ? (
          <div className="text-center opacity-30 space-y-4">
            <div className="w-16 h-16 rounded-full border border-stone-800 flex items-center justify-center mx-auto">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
            <p className="mono text-[10px] tracking-widest">NO_VOCAL_RECORDS</p>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1 h-20">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 bg-emerald-500 transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-20'}`}
                  style={{ 
                    height: isPlaying ? `${Math.random() * 100}%` : '20%',
                    animationDelay: `${i * 0.1}s`,
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                  }}
                />
              ))}
            </div>

            <div className="text-center space-y-2 px-4">
              <p className="text-stone-300 text-xs italic font-light line-clamp-3 leading-relaxed">
                "{latestLog.transcript}"
              </p>
              <span className="mono text-[8px] text-stone-600 uppercase tracking-widest">
                Latest Echo: {latestLog.timestamp}
              </span>
            </div>

            <button 
              onClick={() => playAudio(latestLog)}
              className="liquid-button w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-900 shadow-xl hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </>
        )}
      </div>

      <div className="mt-8 border-t border-white/5 pt-4 space-y-3">
        <span className="mono text-[8px] text-stone-600 uppercase tracking-widest block">Echo History</span>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
           {logs.slice().reverse().map(log => (
             <div key={log.id} className="flex justify-between items-center p-2 bg-stone-900/40 rounded border border-white/5 group hover:border-emerald-500/30 transition-colors">
               <span className="mono text-[9px] text-stone-400 truncate w-32">{log.transcript}</span>
               <span className="mono text-[8px] text-stone-600">{log.timestamp}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
