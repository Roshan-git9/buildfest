
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { Student, AcademicMetrics } from '../../types';

interface Props {
  student: Student;
  onUpdateStudent: (updates: Partial<Student>) => void;
}

const FloatingInput = ({ label, type, value, onChange, step }: { label: string, type: string, value: any, onChange: (val: any) => void, step?: string }) => {
  const id = React.useId();
  return (
    <div className="relative group mb-2">
      <input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(type === 'number' ? (step ? parseFloat(e.target.value) : parseInt(e.target.value)) : e.target.value)}
        placeholder=" "
        className="peer w-full bg-stone-900/40 border border-white/5 rounded px-4 pt-6 pb-2 text-stone-100 mono text-xs outline-none transition-all focus:border-cyan-500/40 focus:bg-stone-900/60"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-4 text-stone-500 mono text-[8px] uppercase tracking-widest transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-stone-600 peer-focus:top-1.5 peer-focus:text-[7px] peer-focus:text-cyan-500/80 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[7px] peer-[:not(:placeholder-shown)]:text-stone-400"
      >
        {label}
      </label>
    </div>
  );
};

const FloatingSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (val: string) => void, options: {label: string, value: string}[] }) => {
  const id = React.useId();
  return (
    <div className="relative group mb-2">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full bg-stone-900/40 border border-white/5 rounded px-4 pt-6 pb-2 text-stone-200 mono text-xs outline-none transition-all focus:border-cyan-500/40 focus:bg-stone-900/60 appearance-none"
      >
        {options.map(opt => <option key={opt.value} value={opt.value} className="bg-stone-900">{opt.label}</option>)}
      </select>
      <label
        htmlFor={id}
        className="absolute left-4 top-1.5 text-[7px] text-stone-400 mono uppercase tracking-widest transition-all pointer-events-none peer-focus:text-cyan-500/80"
      >
        {label}
      </label>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
        <svg className="w-2 h-2 text-stone-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
};

export const ParentPortal: React.FC<Props> = ({ student, onUpdateStudent }) => {
  const { name, age, grade, focusArea, remarks, engagementData, insight, academicMetrics } = student;
  
  const [lifestyleForm, setLifestyleForm] = useState<AcademicMetrics>(academicMetrics);

  useEffect(() => {
    setLifestyleForm(academicMetrics);
  }, [academicMetrics]);

  const updateMetric = (key: keyof AcademicMetrics, value: any) => {
    const nextMetrics = {
      ...lifestyleForm,
      [key]: value
    };
    setLifestyleForm(nextMetrics);
    onUpdateStudent({ academicMetrics: nextMetrics });
  };

  const avgConsistency = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.consistency, 0) / engagementData.length : 0;
  const avgDepth = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.depth, 0) / engagementData.length : 0;
  const avgFocus = engagementData.length ? engagementData.reduce((acc, curr) => acc + curr.focus, 0) / engagementData.length : 0;

  const chartData = [
    { name: 'Consistency Rhythm', value: avgConsistency, color: '#00bbf9' },
    { name: 'Cognitive Depth', value: avgDepth, color: '#ff3366' },
    { name: 'Active Presence', value: avgFocus, color: '#00f5d4' }
  ];

  const academicIndicators = [
    { label: 'Submissions', value: academicMetrics.assignmentSubmissionCount, max: 40, color: 'bg-cyan-500' },
    { label: 'Attendance', value: 100 - academicMetrics.attendanceDropPercentage, max: 100, color: 'bg-emerald-500' },
    { label: 'Timeliness', value: (1 - academicMetrics.lateSubmissionRatio) * 100, max: 100, color: 'bg-magenta-500' },
    { label: 'Streak Stability', value: Math.max(0, 5 - academicMetrics.missingAssignmentStreak) * 20, max: 100, color: 'bg-amber-500' }
  ];

  const getSyncStatus = (score: number) => {
    if (score > 85) return { label: 'SYNCHRONIZED', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    if (score > 70) return { label: 'FLOW_ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score > 50) return { label: 'OBSERVING', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'ALIGNMENT_REQ', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const score = insight?.engagementScore || 0;
  const status = getSyncStatus(score);

  const lifestyleData = [
    { name: 'Screen Time', value: academicMetrics.screenTime || 0, color: '#ff3366' },
    { name: 'Sleep', value: academicMetrics.sleepDuration || 0, color: '#00bbf9' },
    { name: 'Activity', value: academicMetrics.physicalActivity || 0, color: '#00f5d4' },
  ];

  const anxietyColor = academicMetrics.anxiousBeforeExams === 'Yes' ? '#ff3366' : '#00f5d4';

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Lifestyle Configuration (Parent Only) */}
      <div className="tile p-10 bg-stone-950/40 border-emerald-500/20 glow-blue">
        <div className="tile-header mb-8">
          <span className="text-emerald-400 font-bold uppercase tracking-widest">Lifestyle Configuration</span>
          <span className="mono text-[8px] text-stone-500 uppercase tracking-widest">Parental Observation Layer</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
          <FloatingInput label="Screen Time (h)" type="number" step="0.1" value={lifestyleForm.screenTime} onChange={(val) => updateMetric('screenTime', val)} />
          <FloatingInput label="Sleep Duration (h)" type="number" step="0.1" value={lifestyleForm.sleepDuration} onChange={(val) => updateMetric('sleepDuration', val)} />
          <FloatingInput label="Sleep Time" type="text" value={lifestyleForm.sleepTime || ''} onChange={(val) => updateMetric('sleepTime', val)} />
          <FloatingInput label="Activity (h)" type="number" step="0.1" value={lifestyleForm.physicalActivity} onChange={(val) => updateMetric('physicalActivity', val)} />
          <FloatingSelect 
            label="Stress Level" 
            value={lifestyleForm.stressLevel || 'Medium'} 
            onChange={(val) => updateMetric('stressLevel', val)} 
            options={[{label: 'Low', value: 'Low'}, {label: 'Medium', value: 'Medium'}, {label: 'High', value: 'High'}]}
          />
          <FloatingSelect 
            label="Exam Anxiety" 
            value={lifestyleForm.anxiousBeforeExams || 'No'} 
            onChange={(val) => updateMetric('anxiousBeforeExams', val)} 
            options={[{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}]}
          />
          <FloatingSelect 
            label="Perf. Change" 
            value={lifestyleForm.performanceChange || 'Same'} 
            onChange={(val) => updateMetric('performanceChange', val)} 
            options={[{label: 'Improved', value: 'Improved'}, {label: 'Same', value: 'Same'}, {label: 'Declined', value: 'Declined'}]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Student', val: name || 'no name' },
           { label: 'Academic Level', val: grade || 'Unassigned' },
           { label: 'Chronological Age', val: age ? `${age} yrs` : 'N/A' },
           { label: 'Primary Focus', val: focusArea || 'Holistic' }
         ].map((item, i) => (
           <div key={i} className="tile p-6 flex flex-col items-center justify-center border-white/5 bg-stone-950/20 text-center transition-transform hover:scale-[1.02]">
              <span className="mono text-[8px] text-stone-600 uppercase tracking-[0.3em] mb-2">{item.label}</span>
              <span className={`tracking-tight ${item.label === 'Student' && !name ? 'text-stone-500 italic lowercase' : 'text-stone-200 font-light text-lg'}`}>{item.val}</span>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="tile rgb-border lg:col-span-7 p-10 flex flex-col glow-blue bg-stone-950/40 relative">
          <div className="tile-header w-full border-b border-white/5 pb-4 mb-8">
            <span className="rgb-text font-bold uppercase tracking-[0.2em]">Rhythmic Engagement Matrix</span>
            <span className="text-stone-600 font-mono text-[8px]">LIVE_FEED: {student.id.slice(-4)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="relative w-64 h-64 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={85}
                      outerRadius={110}
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
                   <span className={`text-6xl font-light tracking-tighter ${status.color}`}>
                     {score}%
                   </span>
                   <span className="mono text-[8px] text-stone-500 uppercase tracking-[0.3em] mt-2">Sync Level</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-2">
                 {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
                          <span className="mono text-[8px] text-stone-400 uppercase tracking-widest">{item.name}</span>
                       </div>
                       <span className="mono text-[10px] text-stone-200 font-bold">{item.value.toFixed(0)}%</span>
                    </div>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <div className={`px-2 py-0.5 rounded-full border ${status.bg} ${status.border} ${status.color} mono text-[7px] tracking-widest font-bold`}>
                    {status.label}
                  </div>
                </div>
                <h4 className="mono text-[9px] text-stone-500 uppercase tracking-widest mb-6">Academic Rhythm Indicators</h4>
                <div className="space-y-5">
                  {academicIndicators.map((indicator, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="mono text-[8px] text-stone-400 uppercase tracking-wider">{indicator.label}</span>
                        <span className="mono text-[9px] text-stone-200 font-bold">
                          {indicator.label === 'Attendance' || indicator.label === 'Timeliness' || indicator.label === 'Streak Stability' 
                            ? `${indicator.value.toFixed(0)}%` 
                            : indicator.value}
                        </span>
                      </div>
                      <div className="h-[2px] w-full bg-stone-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${indicator.color}`} 
                          style={{ width: `${(indicator.value / indicator.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-stone-900/40 border border-white/5 rounded-2xl">
                 <p className="text-stone-400 text-[11px] font-light italic leading-relaxed">
                   "The data matrix above is synthesized from active teacher logs and behavioral sensing layers, refreshed in real-time as educators update the student's profile."
                 </p>
              </div>
            </div>
          </div>
        </div>

        <div className="tile rgb-border lg:col-span-5 p-10 flex flex-col justify-center bg-gradient-to-br from-stone-900/40 to-stone-950/70">
          <div className="tile-header mb-8">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">Supportive Alignment Plan</span>
            <span className="text-stone-500 mono text-[8px]">AI_GUIDE: ENABLED</span>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="mono text-[9px] text-magenta-500 uppercase tracking-widest font-bold">Rhythmic Analysis</span>
              <h3 className="serif text-2xl md:text-3xl text-stone-50 font-light leading-[1.3] italic tracking-tight border-l-2 border-magenta-500/30 pl-8">
                "{insight?.observation || 'Synthesizing the last 168 hours of behavioral patterns...'}"
              </h3>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
            
            <div className="space-y-6">
               <h4 className="mono text-[10px] text-white uppercase tracking-[0.4em] font-bold">AI Recommended Actions</h4>
               <div className="space-y-3">
                  {(insight?.suggestions || ['Synchronizing teacher logs and academic metrics...']).map((s, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl transition-all hover:bg-white/[0.05] group">
                       <span className="text-magenta-500 mono font-bold text-xs">0{i+1}</span>
                       <span className="text-stone-300 text-xs font-light leading-relaxed">{s}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Lifestyle & Anxiety Row */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 tile p-10 bg-stone-950/40 border-white/5 glow-blue">
            <div className="tile-header mb-8">
              <span className="text-emerald-400 font-bold uppercase tracking-widest">Lifestyle Balance Matrix</span>
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
            <div className="h-[300px]">
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
            <div className="mt-6 grid grid-cols-3 gap-4">
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                  <div className="mono text-[8px] text-stone-500 uppercase mb-1">Sleep Time</div>
                  <div className="text-xl text-stone-200 font-light">{academicMetrics.sleepTime || 'N/A'}</div>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                  <div className="mono text-[8px] text-stone-500 uppercase mb-1">Sleep Duration</div>
                  <div className="text-xl text-stone-200 font-light">{academicMetrics.sleepDuration || 0}h</div>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                  <div className="mono text-[8px] text-stone-500 uppercase mb-1">Screen Time</div>
                  <div className="text-xl text-stone-200 font-light">{academicMetrics.screenTime || 0}h</div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 tile p-10 bg-stone-950/40 border-white/5 glow-red flex flex-col items-center justify-center text-center">
            <div className="tile-header mb-8 w-full">
              <span className="text-rose-400 font-bold uppercase tracking-widest">Exam Anxiety Sensor</span>
            </div>
            <div className="relative mb-8">
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                <div 
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000"
                  style={{ 
                    backgroundColor: `${anxietyColor}10`, 
                    border: `1px solid ${anxietyColor}40`,
                    boxShadow: `0 0 40px ${anxietyColor}20`
                  }}
                >
                  <span className="text-lg mono font-bold" style={{ color: anxietyColor }}>
                    {academicMetrics.anxiousBeforeExams === 'Yes' ? 'HIGH' : 'LOW'}
                  </span>
                </div>
              </div>
              {academicMetrics.anxiousBeforeExams === 'Yes' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping"></div>
              )}
            </div>
            <p className="text-xs text-stone-400 mono uppercase tracking-widest leading-relaxed max-w-[200px]">
              {academicMetrics.anxiousBeforeExams === 'Yes' 
                ? 'Psychological drift detected prior to assessment cycles.' 
                : 'Emotional stability maintained during testing phases.'}
            </p>
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
                <p className="text-stone-200 font-light italic leading-relaxed text-2xl md:text-3xl max-w-6xl">
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
