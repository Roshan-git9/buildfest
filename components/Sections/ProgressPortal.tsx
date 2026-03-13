
import React, { useState } from 'react';
import { Student } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface Props {
  student: Student;
}

export const ProgressPortal: React.FC<Props> = ({ student }) => {
  const { academicMetrics, name, messages } = student;
  const [showMessages, setShowMessages] = useState(false);

  const lifestyleData = [
    { name: 'Screen Time', value: academicMetrics.screenTime || 0, color: '#ff3366' },
    { name: 'Sleep', value: academicMetrics.sleepDuration || 0, color: '#00bbf9' },
    { name: 'Activity', value: academicMetrics.physicalActivity || 0, color: '#00f5d4' },
  ];

  const anxietyColor = academicMetrics.anxiousBeforeExams === 'Yes' ? '#ff3366' : '#00f5d4';

  const dataColumns = [
    {
      title: "ACADEMICS",
      items: [
        { label: "Submission Count", value: academicMetrics.assignmentSubmissionCount },
        { label: "Grade Variance", value: `±${academicMetrics.gradeVariance}` },
        { label: "Late Ratio", value: academicMetrics.lateSubmissionRatio.toFixed(2) }
      ]
    },
    {
      title: "ATTENDANCE",
      items: [
        { label: "Drop Percentage", value: `${academicMetrics.attendanceDropPercentage}%` },
        { label: "Trend", value: academicMetrics.attendanceTrend.toUpperCase() },
        { label: "Term Drop", value: academicMetrics.marksDropBetweenTerms }
      ]
    },
    {
      title: "RISK PROFILE",
      items: [
        { label: "Missing Streak", value: academicMetrics.missingAssignmentStreak },
        { label: "System Status", value: academicMetrics.missingAssignmentStreak > 1 ? "ALERT" : "NOMINAL" },
        { label: "Data Integrity", value: "VERIFIED" }
      ]
    },
    {
      title: "LIFESTYLE",
      items: [
        { label: "Screen Time", value: `${academicMetrics.screenTime || 0}h` },
        { label: "Sleep Duration", value: `${academicMetrics.sleepDuration || 0}h` },
        { label: "Exam Anxiety", value: academicMetrics.anxiousBeforeExams || 'No' }
      ]
    }
  ];

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col justify-end p-12 md:px-24 md:pb-32 overflow-hidden">
      {/* Messages Overlay */}
      {showMessages && (
        <div className="absolute inset-0 z-50 bg-stone-950/95 backdrop-blur-3xl animate-in fade-in duration-500 p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-12">
             <div className="flex justify-between items-center border-b border-white/5 pb-8">
               <h2 className="serif text-5xl text-stone-200 italic font-light">Communications Feed</h2>
               <button onClick={() => setShowMessages(false)} className="mono text-[10px] text-stone-500 hover:text-stone-100 uppercase tracking-widest">[ Close_Panel ]</button>
             </div>
             
             <div className="space-y-6">
                {messages.length === 0 ? (
                  <div className="py-20 text-center opacity-20 mono text-sm uppercase tracking-widest">No messages from the educator log yet.</div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-cyan-500/20 transition-all">
                       <div className="flex justify-between items-center">
                          <span className="mono text-[8px] text-cyan-400 uppercase tracking-widest font-bold">Source: {msg.sender}</span>
                          <span className="mono text-[8px] text-stone-600 uppercase tracking-widest">{msg.timestamp}</span>
                       </div>
                       <p className="text-xl text-stone-300 font-light leading-relaxed">{msg.text}</p>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      )}

      {/* Slogan Top Right - Matches Reference Style */}
      <div className="absolute top-12 right-12 text-right hidden md:block">
        <span className="mono text-xs font-bold tracking-[0.6em] text-white/60">WORK FAST. LEARN SLOW.</span>
      </div>

      {/* Lifestyle Visualization Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 relative z-10 max-w-7xl w-full">
        <div className="lg:col-span-8 h-[300px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="mono text-[10px] text-stone-500 uppercase tracking-widest">Lifestyle Balance Matrix</div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#ff3366]"></div>
                 <span className="mono text-[8px] text-stone-400">SCREEN</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#00bbf9]"></div>
                 <span className="mono text-[8px] text-stone-400">SLEEP</span>
               </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lifestyleData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716c', fontSize: 10, fontWeight: 'bold'}} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{backgroundColor: '#0c0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                itemStyle={{fontSize: '10px', fontFamily: 'JetBrains Mono'}}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                {lifestyleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-center items-center text-center space-y-6">
           <div className="mono text-[10px] text-stone-500 uppercase tracking-widest">Exam Anxiety Sensor</div>
           <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                 <div 
                   className="w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-1000"
                   style={{ 
                     backgroundColor: `${anxietyColor}10`, 
                     border: `1px solid ${anxietyColor}40`,
                     boxShadow: `0 0 30px ${anxietyColor}20`
                   }}
                 >
                    <span className="text-xs mono font-bold" style={{ color: anxietyColor }}>
                      {academicMetrics.anxiousBeforeExams === 'Yes' ? 'HIGH' : 'LOW'}
                    </span>
                 </div>
              </div>
              {academicMetrics.anxiousBeforeExams === 'Yes' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-ping"></div>
              )}
           </div>
           <p className="text-[10px] text-stone-500 mono uppercase tracking-tighter leading-tight">
             {academicMetrics.anxiousBeforeExams === 'Yes' 
               ? 'Psychological drift detected prior to assessment cycles.' 
               : 'Emotional stability maintained during testing phases.'}
           </p>
        </div>
      </div>

      {/* Columnar Data Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-24 relative z-10 max-w-7xl">
        {dataColumns.map((col, idx) => (
          <div key={idx} className="space-y-12">
            <div className="border-b border-white/10 pb-6">
              <h3 className="mono text-xs font-bold tracking-[0.5em] text-white/40 uppercase">{col.title}</h3>
            </div>
            <ul className="space-y-10">
              {col.items.map((item, i) => (
                <li key={i} className="group cursor-default">
                  <div className="mono text-[10px] text-stone-600 mb-2 group-hover:text-cyan-500/80 transition-all duration-500 uppercase tracking-[0.3em] font-medium">{item.label}</div>
                  <div className="text-4xl md:text-5xl font-light text-stone-100 tracking-tighter group-hover:scale-[1.02] origin-left transition-transform duration-500">
                    {item.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Interaction Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
        <div className="flex gap-8 items-center">
            <button 
              onClick={() => setShowMessages(true)}
              className="liquid-button px-10 py-3 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-[9px] mono tracking-[0.3em] text-stone-300 hover:bg-white/10 hover:border-white/20 transition-all uppercase relative overflow-hidden"
            >
              View Messages {messages.length > 0 && <span className="ml-2 w-2 h-2 rounded-full bg-cyan-500 inline-block animate-pulse"></span>}
            </button>
            <div className="flex gap-6 mono text-[9px] text-stone-600 tracking-widest uppercase">
                <span className="hover:text-stone-300 cursor-pointer transition-colors">Instagram</span>
                <span className="hover:text-stone-300 cursor-pointer transition-colors">LinkedIn</span>
            </div>
        </div>
        <div className="text-right">
           <span className="mono text-[9px] text-stone-700 tracking-[0.4em] uppercase">Status: Core System Active • Ver 2.5.8</span>
        </div>
      </div>

      {/* Massive Ambient Name Background */}
      <div className="sukoya-text">
        {(name || 'no name').toUpperCase()}
      </div>
    </div>
  );
};
