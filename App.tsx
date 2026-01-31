
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RealTimeClock } from './components/RealTimeClock';
import { getObservationalInsight } from './services/geminiService';
import { generateSyntheticData, generateAcademicMetrics } from './utils/dataGenerator';
import { AIPerspective, EngagementPoint, Student } from './types';
import { VintageAestheticTile } from './components/VideoVisualizationTile';
import { EngagementPatterns } from './components/Sections/EngagementPatterns';
import { DriftIndicators } from './components/Sections/DriftIndicators';
import { MomentSupport } from './components/Sections/MomentSupport';
import { NextSteps } from './components/Sections/NextSteps';
import { TeacherPortal } from './components/Sections/TeacherPortal';
import { ParentPortal } from './components/Sections/ParentPortal';
import { ProgressPortal } from './components/Sections/ProgressPortal';
import { predictStudentRisk } from './utils/mlEngine';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const STORAGE_KEY_STUDENTS = 'lumina_students_collection';
const STORAGE_KEY_ACTIVE_ID = 'lumina_active_student_id';
const STORAGE_KEY_ROLE = 'lumina_user_role';

type ViewType = 'dashboard' | 'insights' | 'intelligence' | 'progress' | 'actions' | 'teacher' | 'parent';
type UserRole = 'student' | 'teacher' | 'parent';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEY_ROLE) as UserRole) || 'teacher';
  });
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    // Initialize empty as requested - "no name in teachers log not even Julian Vance"
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || '';
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  const activeStudent = useMemo(() => {
    if (students.length === 0) return null;
    return students.find(s => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  const studentRisk = useMemo(() => {
    if (!activeStudent) return null;
    return predictStudentRisk(activeStudent.academicMetrics);
  }, [activeStudent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeStudentId || '');
  }, [activeStudentId]);

  const initInsight = useCallback(async (student: Student, force = false) => {
    if (student.insight && !force) return;
    setIsLoading(true);
    try {
      const result = await getObservationalInsight(
        student.engagementData, 
        student.academicMetrics, 
        student.remarks
      );
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, insight: result } : s));
    } catch (error) {
      console.error("AI Insight error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeStudent && !activeStudent.insight) {
      initInsight(activeStudent);
    }
  }, [activeStudent, initInsight]);

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const updatedStudent = next.find(s => s.id === id);
      if (updatedStudent) {
        setTimeout(() => initInsight(updatedStudent, true), 100);
      }
      return next;
    });
  };

  const addStudent = (name: string) => {
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name,
      remarks: '',
      subjectEmoji: '🌀',
      engagementData: generateSyntheticData(),
      academicMetrics: generateAcademicMetrics(),
      insight: null
    };
    setStudents(prev => [...prev, newStudent]);
    setActiveStudentId(newStudent.id);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      return next;
    });
    
    if (activeStudentId === id) {
      setActiveStudentId('');
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem(STORAGE_KEY_ROLE, role);
    setCurrentView('dashboard');
  };

  const allNavItems: { label: string; id: ViewType; roles: UserRole[] }[] = [
    { label: 'Dashboard', id: 'dashboard', roles: ['student', 'teacher', 'parent'] },
    { label: 'Insights', id: 'insights', roles: ['student', 'teacher'] },
    { label: 'Intelligence', id: 'intelligence', roles: ['student', 'teacher', 'parent'] },
    { label: 'Progress', id: 'progress', roles: ['student', 'teacher', 'parent'] },
    { label: 'Teacher Log', id: 'teacher', roles: ['teacher'] },
    { label: 'Parent Portal', id: 'parent', roles: ['parent', 'teacher'] },
    { label: 'System Actions', id: 'actions', roles: ['teacher'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleNextView = () => {
    const currentIndex = visibleNavItems.findIndex(item => item.id === currentView);
    if (currentIndex < visibleNavItems.length - 1) {
      setCurrentView(visibleNavItems[currentIndex + 1].id);
    } else {
      setCurrentView('dashboard');
    }
  };

  const renderViewContent = () => {
    if (currentView === 'teacher') {
      return (
        <TeacherPortal 
          student={activeStudent}
          students={students}
          onSelectStudent={setActiveStudentId}
          onAddStudent={addStudent}
          onDeleteStudent={deleteStudent}
          onUpdateStudent={(updates) => activeStudent && updateStudent(activeStudent.id, updates)}
        />
      );
    }

    if (!activeStudent) {
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
              <div className="relative text-stone-700 mono text-[10px] tracking-[0.8em] uppercase border border-stone-800 px-8 py-3 rounded-full backdrop-blur-sm">
                SYSTEM_STATE: NULL_REGISTRY
              </div>
           </div>
           <div className="text-center space-y-4">
              <h2 className="serif text-5xl md:text-7xl text-stone-500 italic font-light tracking-tighter opacity-40">No records found.</h2>
              <p className="text-stone-600 mono text-xs uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                Initialize the educator sensing layer to begin monitoring cognitive learning drift.
              </p>
           </div>
           <button 
             onClick={() => setCurrentView('teacher')} 
             className="liquid-button px-12 py-4 bg-stone-100 text-stone-950 font-bold mono text-[10px] tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]"
           >
             Open Teacher Log
           </button>
        </div>
      );
    }

    const themeColor = studentRisk?.risk_label === 1 ? '#ff3366' : '#00bbf9';
    const glowClass = studentRisk?.risk_label === 1 ? 'glow-red' : 'glow-blue';

    switch (currentView) {
      case 'insights':
        return (
          <div className="space-y-12">
            <EngagementPatterns data={activeStudent.engagementData} />
            <DriftIndicators />
          </div>
        );
      case 'intelligence':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-12">
                <MomentSupport insight={activeStudent.insight} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-12 flex justify-center">
                <div className="w-full max-w-4xl">
                  <VintageAestheticTile insight={activeStudent.insight} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <ProgressPortal student={activeStudent} />
        );
      case 'parent':
        return (
          <ParentPortal 
            student={activeStudent}
          />
        );
      case 'actions':
        return (
          <NextSteps insight={activeStudent.insight} />
        );
      case 'dashboard':
      default:
        return (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`tile rgb-border lg:col-span-4 p-6 flex flex-col h-[500px] ${glowClass}`}>
              <div className="tile-header">
                <span className="rgb-text font-bold uppercase tracking-widest">Rhythm Scan</span>
                <span className="mono text-[8px] opacity-40">AUTO_MODE: ON</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-3xl font-light text-stone-100 mb-6 tracking-tight flex items-center gap-4">
                    Analytical Core
                    <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: themeColor }}></div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeStudent.engagementData}>
                      <defs>
                        <linearGradient id="dynamicColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={themeColor} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 10}} />
                      <Area type="monotone" dataKey="consistency" stroke={themeColor} fillOpacity={1} fill="url(#dynamicColor)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-4">
                  {['Consistency', 'Depth', 'Presence'].map((sub, i) => (
                    <div key={sub} className="flex items-center gap-3">
                      <span className="text-[10px] mono text-stone-500 w-28 uppercase tracking-widest">{sub}</span>
                      <div className="flex-1 h-[3px] bg-stone-900 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{
                          width: `${85 - (i*12)}%`, 
                          backgroundColor: i === 0 ? themeColor : i === 1 ? '#ff3366' : '#00f5d4',
                          boxShadow: `0 0 10px ${i === 0 ? themeColor : i === 1 ? '#ff3366' : '#00f5d4'}`
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <VintageAestheticTile insight={activeStudent.insight} />

            <div className={`tile rgb-border lg:col-span-3 p-6 h-[500px] ${glowClass}`}>
              <div className="tile-header">
                <span className="mono text-[10px] tracking-widest uppercase text-stone-400">Markers</span>
              </div>
              
              <div className="flex flex-col h-full">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-4xl animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      {activeStudent.subjectEmoji || '🌀'}
                    </div>
                    <div>
                      <div className="mono text-[8px] text-stone-600 uppercase mb-1">Subject Sigil</div>
                      <div className="text-xl font-light text-stone-200 tracking-tight leading-none uppercase">
                        {activeStudent.focusArea?.split(' ')[0] || 'Flow'}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mono text-[8px] text-stone-600 uppercase mb-1">Academic Decision</div>
                    <div className={`text-2xl font-light italic tracking-tight ${studentRisk?.risk_label === 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {studentRisk?.academic_help_required === "Yes" ? "Assistance Required" : "Steady Flow"}
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex flex-col gap-1 p-3 bg-stone-950/40 border border-white/5 rounded group hover:border-white/10 transition-colors">
                        <span className="mono text-[8px] text-stone-500 uppercase tracking-widest">Grade / Age</span>
                        <span className="text-stone-300 text-xs font-medium">{activeStudent.grade || 'N/A'} — {activeStudent.age || 'N/A'} y/o</span>
                    </div>
                    <div className="p-4 bg-stone-900/60 border border-stone-800/80 rounded flex justify-between items-start transition-all hover:scale-[1.02] cursor-default relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-xs text-stone-100 font-medium mb-1">Attention Trace</div>
                        <div className={`text-[10px] mono uppercase tracking-widest font-bold ${studentRisk?.risk_label === 1 ? 'text-red-500/80' : 'text-cyan-500/80'}`}>
                            {studentRisk?.risk_label === 1 ? 'ALERT_LEVEL_HIGH' : 'NOMINAL_STATE'}
                        </div>
                      </div>
                      <div className={`absolute top-0 right-0 h-full w-1 ${studentRisk?.risk_label === 1 ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                    </div>
                  </div>

                  {activeStudent.remarks && (
                    <div className="mt-8 border-t border-white/5 pt-4">
                      <div className="text-[8px] mono text-stone-500 uppercase tracking-widest mb-2">Latest Educator Remark</div>
                      <p className="text-[10px] text-stone-400 italic line-clamp-4 leading-relaxed bg-stone-950/20 p-2 rounded">
                        "{activeStudent.remarks}"
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <div className={`tile rgb-border lg:col-span-12 p-8 relative overflow-hidden ${glowClass}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="mono text-[10px] text-stone-400 uppercase tracking-widest">Sensing Identity</div>
                    <div className="h-[1px] w-8 bg-stone-800"></div>
                    <div className="mono text-[10px] text-cyan-400 uppercase font-bold">{activeStudent.id.slice(-6)}</div>
                  </div>
                  <div className="text-2xl font-light text-stone-100 italic">"{activeStudent.insight?.observation || 'Synthesizing cognitive patterns...'}"</div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {userRole === 'teacher' && (
                    <button onClick={() => setCurrentView('teacher')} className="liquid-button px-6 py-2 bg-stone-950 border border-magenta-500/30 text-magenta-400 mono text-[10px] tracking-widest hover:bg-magenta-900/20 transition-all uppercase rounded-full glow-red">Config Profile</button>
                  )}
                  {userRole === 'parent' && (
                    <button onClick={() => setCurrentView('parent')} className="liquid-button px-6 py-2 bg-stone-950 border border-cyan-500/30 text-cyan-400 mono text-[10px] tracking-widest hover:bg-cyan-900/20 transition-all uppercase rounded-full glow-blue">Sync Data</button>
                  )}
                  <button onClick={() => setCurrentView('intelligence')} className="liquid-button px-6 py-2 bg-stone-100 text-stone-950 font-bold mono text-[10px] tracking-widest hover:bg-white transition-all uppercase rounded-full">Intel Report</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 via-magenta-500 via-emerald-500 to-transparent opacity-30"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-overlay min-h-screen p-6 md:p-12 overflow-y-auto relative">
      <nav className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/5 pb-6 sticky top-0 bg-stone-950/70 backdrop-blur-3xl z-[100] gap-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mono text-[10px] tracking-[0.2em] uppercase p-2">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`liquid-button px-4 py-2 whitespace-nowrap relative rounded-lg border border-transparent transition-all duration-300 ${
                currentView === item.id 
                  ? 'text-white font-bold bg-white/10 border-white/10' 
                  : 'text-stone-500 hover:text-stone-200 hover:bg-stone-900/40'
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <span className="tab-indicator absolute -bottom-[25px] left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-magenta-500 shadow-[0_0_10px_#00bbf9]"></span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-stone-950 border border-white/10 rounded-full p-1 shadow-inner">
            {(['student', 'teacher', 'parent'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`liquid-button px-4 py-1.5 text-[8px] mono rounded-full transition-all uppercase ${userRole === role ? 'bg-white text-stone-950 font-bold' : 'text-stone-600 hover:text-stone-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="text-center mb-20 space-y-6">
        <h1 className="serif text-6xl md:text-8xl text-stone-50 tracking-tighter font-light uppercase">
          {activeStudent ? activeStudent.name : 'NULL_ENTITY'}
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-stone-800"></div>
          <p className="text-stone-500 mono text-[10px] tracking-[0.6em] uppercase">
            Cognitive Phase: {visibleNavItems.find(i => i.id === currentView)?.label || 'Overview'}
          </p>
          <div className="h-[1px] w-12 bg-stone-800"></div>
        </div>
      </div>

      <main key={currentView} className="pb-32 gravity-shift">
        {renderViewContent()}
      </main>

      {activeStudent && (
        <div className="fixed bottom-8 right-8 flex items-center gap-6 z-[100]">
          <button 
            onClick={handleNextView}
            className="liquid-button group relative flex items-center gap-4 bg-white text-stone-950 px-8 py-4 rounded-full font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95 pointer-events-auto overflow-hidden"
          >
            <span className="relative z-10">Next Phase</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-magenta-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
