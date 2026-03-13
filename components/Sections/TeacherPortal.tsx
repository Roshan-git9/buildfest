
import React, { useState, useEffect, useMemo } from 'react';
import { Student, AcademicMetrics, AudioLog } from '../../types';
import { predictStudentRisk, PredictionResult } from '../../utils/mlEngine';
import { generateVocalInstruction } from '../../services/geminiService';

interface Props {
  student: Student | null;
  students: Student[];
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (updates: Partial<Student>) => void;
  onSendMessage: (text: string) => void;
}

const SUBJECT_SIGILS = [
  { label: 'Mathematics', emoji: '📐' },
  { label: 'Science / Physics', emoji: '⚛️' },
  { label: 'Literature / Arts', emoji: '🎨' },
  { label: 'History / Social', emoji: '📜' },
  { label: 'Computer Science', emoji: '💻' },
  { label: 'Biology', emoji: '🌿' },
  { label: 'Music', emoji: '🎼' },
  { label: 'Philosophy', emoji: '🏛️' },
  { label: 'Space / Astro', emoji: '🚀' },
  { label: 'General / Mixed', emoji: '🌀' },
];

const DEFAULT_METRICS: AcademicMetrics = {
  assignmentSubmissionCount: 0,
  attendanceDropPercentage: 0,
  marksDropBetweenTerms: 0,
  lateSubmissionRatio: 0,
  attendanceTrend: 'stable',
  gradeVariance: 0,
  missingAssignmentStreak: 0,
  gender: 'Male',
  screenTime: 0,
  sleepDuration: 0,
  physicalActivity: 0,
  stressLevel: 'Medium',
  anxiousBeforeExams: 'No',
  performanceChange: 'Same'
};

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

export const TeacherPortal: React.FC<Props> = ({ student, students, onSelectStudent, onAddStudent, onDeleteStudent, onUpdateStudent, onSendMessage }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    age: student?.age || '',
    grade: student?.grade || '',
    focusArea: student?.focusArea || '',
    subjectEmoji: student?.subjectEmoji || '🌀',
    remarks: student?.remarks || '',
    academicMetrics: student?.academicMetrics || DEFAULT_METRICS
  });
  
  const [newStudentName, setNewStudentName] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [vocalInstructionText, setVocalInstructionText] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const prediction: PredictionResult = useMemo(() => {
    return predictStudentRisk(formData.academicMetrics);
  }, [formData.academicMetrics]);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        age: student.age || '',
        grade: student.grade || '',
        focusArea: student.focusArea || '',
        subjectEmoji: student.subjectEmoji || '🌀',
        remarks: student.remarks || '',
        academicMetrics: student.academicMetrics
      });
    } else {
      setFormData({
        name: '',
        age: '',
        grade: '',
        focusArea: '',
        subjectEmoji: '🌀',
        remarks: '',
        academicMetrics: DEFAULT_METRICS
      });
    }
  }, [student]);

  const handleAdd = () => {
    onAddStudent(newStudentName.trim());
    setNewStudentName('');
  };

  const handleSave = () => {
    if (student) {
      onUpdateStudent(formData);
    }
  };

  const handleSendVocal = async () => {
    if (!student || !vocalInstructionText.trim()) return;
    setIsSynthesizing(true);
    try {
      const audioData = await generateVocalInstruction(vocalInstructionText);
      const newLog: AudioLog = {
        id: `audio-${Date.now()}`,
        base64Data: audioData,
        transcript: vocalInstructionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voiceName: 'Kore'
      };
      
      onUpdateStudent({
        audioLogs: [...(student.audioLogs || []), newLog]
      });
      setVocalInstructionText('');
    } catch (err) {
      console.error("Vocal synthesis failed", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSend = () => {
    if (messageDraft.trim()) {
      onSendMessage(messageDraft.trim());
      setMessageDraft('');
    }
  };

  const updateMetric = (key: keyof AcademicMetrics, value: any) => {
    setFormData(prev => ({
      ...prev,
      academicMetrics: {
        ...prev.academicMetrics,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3 tile rgb-border p-8 glow-blue bg-stone-950/20">
          <div className="tile-header mb-6">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">Registry</span>
          </div>
          <div className="space-y-6">
             <div className="flex gap-2">
                <div className="flex-1">
                  <FloatingInput 
                    label="Initialize Entry" 
                    type="text" 
                    value={newStudentName} 
                    onChange={setNewStudentName} 
                  />
                </div>
                <div className="pt-2">
                  <button onClick={handleAdd} className="liquid-button bg-cyan-600 hover:bg-cyan-500 text-stone-950 px-3 py-3 rounded font-bold text-[8px] uppercase transition-all shadow-lg">New</button>
                </div>
             </div>
             <div className="h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {students.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/5 rounded-lg">
                    <span className="mono text-[8px] text-stone-700 uppercase tracking-widest">No active profiles</span>
                  </div>
                ) : (
                  students.map(s => (
                    <div key={s.id} className="relative group flex items-stretch">
                      <button
                        onClick={() => onSelectStudent(s.id)}
                        className={`flex-1 text-left px-5 py-4 rounded-lg border relative overflow-hidden transition-all duration-300 ${student && s.id === student.id ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-stone-900/40 border-white/5 text-stone-500 hover:border-cyan-500/30 hover:text-stone-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{s.subjectEmoji || '🌀'}</span>
                          <div>
                            <div className={`text-[11px] mono font-bold uppercase tracking-wider truncate max-w-[100px] ${!s.name?.trim() ? 'text-stone-700 italic lowercase' : ''}`}>
                              {s.name?.trim() || 'no name'}
                            </div>
                            <div className="text-[9px] mono opacity-40 uppercase mt-0.5">{s.grade || '??'} Grade</div>
                          </div>
                        </div>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Purge profile for ${s.name?.trim() || 'this nameless profile'}? This action is irreversible.`)) {
                            onDeleteStudent(s.id);
                          }
                        }}
                        className="flex items-center justify-center px-3 text-stone-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-r-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="md:col-span-9 space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 tile rgb-border p-10 glow-red bg-stone-950/40">
                <div className="tile-header mb-8">
                  <span className="rgb-text font-bold uppercase tracking-[0.2em]">Profile Configuration</span>
                </div>
                
                {!student ? (
                  <div className="h-[400px] flex flex-col items-center justify-center space-y-6">
                    <div className="text-4xl serif font-light text-stone-600 italic">No Profile Selected</div>
                    <p className="text-stone-700 mono text-[9px] uppercase tracking-widest text-center max-w-xs">Initialize a new entry or select from the registry to begin monitoring drift.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="md:col-span-2">
                        <FloatingInput 
                          label="Full Student Name" 
                          type="text" 
                          value={formData.name} 
                          onChange={(val) => setFormData(prev => ({ ...prev, name: val }))} 
                        />
                      </div>
                      <div>
                        <FloatingInput 
                          label="Current Grade" 
                          type="text" 
                          value={formData.grade} 
                          onChange={(val) => setFormData(prev => ({ ...prev, grade: val }))} 
                        />
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/5 mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                      <FloatingInput label="Submissions" type="number" value={formData.academicMetrics.assignmentSubmissionCount} onChange={(val) => updateMetric('assignmentSubmissionCount', val)} />
                      <FloatingInput label="Att. Drop %" type="number" step="0.1" value={formData.academicMetrics.attendanceDropPercentage} onChange={(val) => updateMetric('attendanceDropPercentage', val)} />
                      <FloatingInput label="Marks Drop (Pts)" type="number" step="0.1" value={formData.academicMetrics.marksDropBetweenTerms} onChange={(val) => updateMetric('marksDropBetweenTerms', val)} />
                      <FloatingInput label="Late Ratio (0-1)" type="number" step="0.01" value={formData.academicMetrics.lateSubmissionRatio} onChange={(val) => updateMetric('lateSubmissionRatio', val)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       <div className="space-y-4">
                        <div className="relative group">
                          <textarea 
                            value={vocalInstructionText} 
                            onChange={(e) => setVocalInstructionText(e.target.value)} 
                            placeholder="Synthesize a mentor's vocal directive..."
                            className="w-full h-32 bg-stone-900/60 border border-emerald-500/20 rounded px-4 py-6 text-emerald-400 mono text-xs outline-none transition-all focus:border-emerald-500/60" 
                          />
                          <div className="absolute top-1 left-4 text-[7px] text-emerald-500/70 mono uppercase tracking-widest">Echo Instruction Protocol</div>
                        </div>
                        <button 
                          onClick={handleSendVocal}
                          disabled={isSynthesizing || !vocalInstructionText.trim()}
                          className={`w-full py-3 bg-emerald-600 text-stone-950 font-bold mono text-[8px] uppercase rounded tracking-[0.3em] transition-all hover:bg-emerald-500 shadow-lg ${isSynthesizing ? 'opacity-50 animate-pulse' : ''}`}
                        >
                          {isSynthesizing ? 'SYNTHESIZING_VOICE...' : 'GENERATE_VOCAL_ECHO'}
                        </button>
                      </div>
                      
                      <div className="relative group flex flex-col">
                        <textarea 
                          value={messageDraft} 
                          onChange={(e) => setMessageDraft(e.target.value)} 
                          placeholder="Type message for student progress feed..."
                          className="w-full flex-1 bg-stone-900/60 border border-white/5 rounded px-4 py-6 text-cyan-400 mono text-xs outline-none transition-all focus:border-cyan-500/40" 
                        />
                        <div className="absolute top-1 left-4 text-[7px] text-stone-500 mono uppercase tracking-widest">Direct Message Protocol</div>
                        <button 
                          onClick={handleSend}
                          className="mt-2 w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold mono text-[8px] uppercase rounded tracking-widest transition-all"
                        >
                          Broadcast Message
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={handleSave} className="liquid-button px-10 py-3 bg-stone-100 text-stone-950 font-bold text-[10px] tracking-[0.2em] uppercase rounded-full glow-red">Commit Data Sync</button>
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-4 tile p-8 bg-stone-950/60 border-cyan-500/20 glow-blue flex flex-col">
                <div className="tile-header mb-8">
                  <span className="text-cyan-400 font-bold uppercase tracking-widest">Decision Status</span>
                </div>
                
                <div className="flex-1 space-y-10">
                  <div className="text-center space-y-2">
                    <div className="mono text-[8px] text-stone-500 uppercase tracking-widest">Help Required?</div>
                    <div className={`text-6xl font-light tracking-tighter ${student && prediction.risk_label === 1 ? 'text-red-500' : 'text-emerald-500'} ${!student ? 'opacity-10' : ''}`}>
                      {student ? prediction.academic_help_required : '—'}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.02] rounded-3xl">
                     <div className={`text-4xl mb-2 ${student ? 'animate-bounce' : 'opacity-10 grayscale'}`}>{formData.subjectEmoji}</div>
                     <span className="mono text-[8px] text-stone-500 uppercase tracking-[0.4em]">Current Sigil</span>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex flex-col gap-2">
                      <span className="mono text-[8px] text-emerald-500 uppercase tracking-widest font-bold">Vocal Archives</span>
                      <div className="space-y-2">
                         {student?.audioLogs?.length ? student.audioLogs.slice(-2).map(log => (
                           <div key={log.id} className="text-[9px] text-stone-400 bg-stone-950/40 p-2 border border-emerald-500/10 rounded italic truncate">
                             "{log.transcript}"
                           </div>
                         )) : (
                           <span className="text-[8px] text-stone-700 italic">No vocal instructions logged.</span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
