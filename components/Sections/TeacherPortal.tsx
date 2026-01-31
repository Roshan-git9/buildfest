
import React, { useState, useEffect, useMemo } from 'react';
import { Student, AcademicMetrics } from '../../types';
import { predictStudentRisk, PredictionResult } from '../../utils/mlEngine';

interface Props {
  student: Student | null;
  students: Student[];
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (updates: Partial<Student>) => void;
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
  missingAssignmentStreak: 0
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

export const TeacherPortal: React.FC<Props> = ({ student, students, onSelectStudent, onAddStudent, onDeleteStudent, onUpdateStudent }) => {
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
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
    }
  };

  const handleSave = () => {
    if (student) {
      onUpdateStudent(formData);
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
                        className={`flex-1 text-left px-5 py-4 rounded-lg border relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.03] ${student && s.id === student.id ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-stone-900/40 border-white/5 text-stone-500 hover:border-cyan-500/30 hover:text-stone-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{s.subjectEmoji || '🌀'}</span>
                          <div>
                            <div className="text-[11px] mono font-bold uppercase tracking-wider">{s.name}</div>
                            <div className="text-[9px] mono opacity-40 uppercase mt-0.5">{s.grade || '??'} Grade</div>
                          </div>
                        </div>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Completely remove profile for ${s.name}?`)) {
                            onDeleteStudent(s.id);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-stone-600 hover:text-red-500 transition-all liquid-button hover:bg-red-500/10 rounded-full z-10"
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
                    <div className="text-4xl serif font-light text-stone-600 italic">Registry Empty</div>
                    <p className="text-stone-700 mono text-[9px] uppercase tracking-widest text-center max-w-xs">Please initialize a student entry in the left panel to begin configuration.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div>
                        <FloatingInput 
                          label="Chronological Age" 
                          type="text" 
                          value={formData.age} 
                          onChange={(val) => setFormData(prev => ({ ...prev, age: val }))} 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FloatingSelect 
                          label="Primary Subject Sigil"
                          value={formData.subjectEmoji}
                          onChange={(val) => {
                            const selected = SUBJECT_SIGILS.find(s => s.emoji === val);
                            setFormData(prev => ({ 
                              ...prev, 
                              subjectEmoji: val,
                              focusArea: selected ? selected.label : prev.focusArea 
                            }));
                          }}
                          options={SUBJECT_SIGILS.map(s => ({ label: `${s.emoji} ${s.label}`, value: s.emoji }))}
                        />
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/5 mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                      <FloatingInput label="Submissions" type="number" value={formData.academicMetrics.assignmentSubmissionCount} onChange={(val) => updateMetric('assignmentSubmissionCount', val)} />
                      <FloatingInput label="Att. Drop %" type="number" step="0.1" value={formData.academicMetrics.attendanceDropPercentage} onChange={(val) => updateMetric('attendanceDropPercentage', val)} />
                      <FloatingInput label="Marks Drop (Pts)" type="number" step="0.1" value={formData.academicMetrics.marksDropBetweenTerms} onChange={(val) => updateMetric('marksDropBetweenTerms', val)} />
                      <FloatingInput label="Late Ratio (0-1)" type="number" step="0.01" value={formData.academicMetrics.lateSubmissionRatio} onChange={(val) => updateMetric('lateSubmissionRatio', val)} />
                      <FloatingInput label="Grade Variance" type="number" step="0.1" value={formData.academicMetrics.gradeVariance} onChange={(val) => updateMetric('gradeVariance', val)} />
                      <FloatingInput label="Missing Streak" type="number" value={formData.academicMetrics.missingAssignmentStreak} onChange={(val) => updateMetric('missingAssignmentStreak', val)} />
                    </div>

                    <div className="relative group mb-8">
                      <textarea 
                        value={formData.remarks} 
                        onChange={(e) => setFormData(prev => ({...prev, remarks: e.target.value}))} 
                        placeholder="Reflective session logs..."
                        className="w-full h-32 bg-stone-900/60 border border-white/5 rounded px-4 py-4 text-stone-100 mono text-xs outline-none transition-all focus:border-magenta-500/40" 
                      />
                      <div className="absolute top-1 left-4 text-[7px] text-stone-500 mono uppercase tracking-widest">Observations</div>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={handleSave} className="liquid-button px-10 py-3 bg-stone-100 text-stone-950 font-bold text-[10px] tracking-[0.2em] uppercase rounded-full glow-red">Commit Profile Update</button>
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
                      {student ? prediction.academic_help_required : 'NULL'}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.02] rounded-3xl">
                     <div className={`text-4xl mb-2 ${student ? 'animate-bounce' : 'opacity-10 grayscale'}`}>{formData.subjectEmoji}</div>
                     <span className="mono text-[8px] text-stone-500 uppercase tracking-[0.4em]">Current Sigil</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="mono text-[9px] text-stone-400 uppercase">Risk Probability</span>
                      <span className="mono text-xs text-cyan-400 font-bold">{student ? (prediction.risk_probability * 100).toFixed(1) : '0.0'}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-stone-900 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-700 ${student && prediction.risk_label === 1 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-cyan-500 shadow-[0_0_10px_cyan]'}`} 
                         style={{ width: student ? `${prediction.risk_probability * 100}%` : '0%' }}
                       />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="mono text-[8px] text-stone-600 uppercase tracking-widest">Data Summary</span>
                      <div className="text-[10px] text-stone-400 font-light space-y-1">
                         <div>Student: <span className="text-stone-200">{formData.name || 'NULL'}</span></div>
                         <div>Age: <span className="text-stone-200">{formData.age || 'NULL'}</span></div>
                         <div>Grade: <span className="text-stone-200">{formData.grade || 'NULL'}</span></div>
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
