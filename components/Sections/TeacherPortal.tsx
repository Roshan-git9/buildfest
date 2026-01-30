
import React, { useState, useEffect } from 'react';
import { Student, AcademicMetrics } from '../../types';

interface Props {
  student: Student;
  students: Student[];
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
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

export const TeacherPortal: React.FC<Props> = ({ student, students, onSelectStudent, onAddStudent, onUpdateStudent }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    age: student.age || '',
    grade: student.grade || '',
    focusArea: student.focusArea || '',
    remarks: student.remarks || '',
    academicMetrics: student.academicMetrics
  });
  
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    setFormData({
      name: student.name,
      age: student.age || '',
      grade: student.grade || '',
      focusArea: student.focusArea || '',
      remarks: student.remarks || '',
      academicMetrics: student.academicMetrics
    });
  }, [student]);

  const handleAdd = () => {
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
    }
  };

  const handleSave = () => {
    onUpdateStudent(formData);
  };

  const updateMetric = (key: keyof AcademicMetrics, value: any) => {
    setFormData({
      ...formData,
      academicMetrics: {
        ...formData.academicMetrics,
        [key]: value
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 tile rgb-border p-8 glow-blue bg-stone-950/20">
          <div className="tile-header mb-6">
            <span className="text-cyan-400 font-bold uppercase tracking-widest">Student Registry</span>
          </div>
          <div className="space-y-6">
             <div className="flex gap-2">
                <div className="flex-1">
                  <FloatingInput 
                    label="Register New Name" 
                    type="text" 
                    value={newStudentName} 
                    onChange={setNewStudentName} 
                  />
                </div>
                <div className="pt-2">
                  <button onClick={handleAdd} className="liquid-button bg-cyan-600 hover:bg-cyan-500 text-stone-950 px-4 py-3 rounded font-bold text-[10px] uppercase transition-all shadow-lg">Add</button>
                </div>
             </div>
             <div className="h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {students.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className={`w-full text-left px-5 py-4 rounded-lg border relative overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${s.id === student.id ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-stone-900/40 border-white/5 text-stone-500 hover:border-cyan-500/30 hover:text-stone-300'}`}
                  >
                    <div className="text-[11px] mono font-bold uppercase tracking-wider transition-colors duration-300 group-hover:text-stone-100">{s.name}</div>
                    <div className="text-[9px] mono opacity-40 uppercase mt-1 transition-opacity duration-300 group-hover:opacity-60">{s.grade || '??'} Grade • {s.age || '??'} yrs</div>
                    {/* Active Indicator Glow */}
                    {s.id === student.id && (
                      <div className="absolute top-1/2 -right-1 w-1 h-6 bg-cyan-500 rounded-full -translate-y-1/2 shadow-[0_0_10px_#06b6d4]"></div>
                    )}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="md:col-span-8 tile rgb-border p-10 glow-red bg-stone-950/40">
          <div className="tile-header mb-8">
            <span className="rgb-text font-bold uppercase tracking-[0.2em]">Profile Configuration: {student.name}</span>
          </div>
          
          <div className="mb-8">
            <FloatingInput 
              label="Legal Full Name" 
              type="text" 
              value={formData.name} 
              onChange={(val) => setFormData({ ...formData, name: val })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
             <FloatingInput 
              label="Assignment Count" 
              type="number" 
              value={formData.academicMetrics.assignmentSubmissionCount} 
              onChange={(val) => updateMetric('assignmentSubmissionCount', val)} 
             />
             <FloatingInput 
              label="Attendance Drop %" 
              type="number" 
              step="0.1" 
              value={formData.academicMetrics.attendanceDropPercentage} 
              onChange={(val) => updateMetric('attendanceDropPercentage', val)} 
             />
             <FloatingInput 
              label="Marks Drop (Pts)" 
              type="number" 
              step="0.1" 
              value={formData.academicMetrics.marksDropBetweenTerms} 
              onChange={(val) => updateMetric('marksDropBetweenTerms', val)} 
             />
             <FloatingInput 
              label="Late Ratio (0-1)" 
              type="number" 
              step="0.01" 
              value={formData.academicMetrics.lateSubmissionRatio} 
              onChange={(val) => updateMetric('lateSubmissionRatio', val)} 
             />
             <FloatingSelect 
              label="Attendance Trend" 
              value={formData.academicMetrics.attendanceTrend} 
              onChange={(val) => updateMetric('attendanceTrend', val)}
              options={[
                {label: 'Stable', value: 'stable'},
                {label: 'Rising', value: 'rising'},
                {label: 'Falling', value: 'falling'}
              ]}
             />
             <FloatingInput 
              label="Grade Variance" 
              type="number" 
              step="0.1" 
              value={formData.academicMetrics.gradeVariance} 
              onChange={(val) => updateMetric('gradeVariance', val)} 
             />
             <FloatingInput 
              label="Missing Streak" 
              type="number" 
              value={formData.academicMetrics.missingAssignmentStreak} 
              onChange={(val) => updateMetric('missingAssignmentStreak', val)} 
             />
             <FloatingInput 
              label="Current Grade" 
              type="text" 
              value={formData.grade} 
              onChange={(val) => setFormData({ ...formData, grade: val })} 
             />
          </div>

          <div className="relative group mb-8">
            <textarea 
              id="remarks-area"
              value={formData.remarks} 
              onChange={(e) => setFormData({...formData, remarks: e.target.value})} 
              placeholder=" "
              className="peer w-full h-32 bg-stone-900/60 border border-white/5 rounded px-4 pt-8 pb-4 text-stone-100 mono text-xs outline-none transition-all focus:border-magenta-500/40 focus:bg-stone-900/70" 
            />
            <label 
              htmlFor="remarks-area"
              className="absolute left-4 top-2 text-[7px] text-magenta-500/70 mono uppercase tracking-[0.2em] font-bold transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-[10px] peer-placeholder-shown:text-stone-600 peer-focus:top-2 peer-focus:text-[7px] peer-focus:text-magenta-500"
            >
              Qualitative Reflections
            </label>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSave} 
              className="liquid-button px-12 py-4 bg-gradient-to-r from-magenta-600 to-red-600 hover:from-magenta-500 hover:to-red-500 text-white font-bold text-[10px] tracking-[0.3em] uppercase rounded-full glow-red transition-all"
            >
              Commit Data Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
