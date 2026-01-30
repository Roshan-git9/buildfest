
import React from 'react';
import { Student } from '../../types';

interface Props {
  student: Student;
}

export const ProgressPortal: React.FC<Props> = ({ student }) => {
  const { academicMetrics, name } = student;

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
    }
  ];

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col justify-end p-12 md:px-24 md:pb-32 animate-in fade-in duration-1000">
      {/* Slogan Top Right - Matches Reference Style */}
      <div className="absolute top-12 right-12 text-right hidden md:block">
        <span className="mono text-xs font-bold tracking-[0.6em] text-white/60">WORK FAST. LEARN SLOW.</span>
      </div>

      {/* Columnar Data Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32 mb-24 relative z-10 max-w-7xl">
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
            <button className="liquid-button px-10 py-3 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-[9px] mono tracking-[0.3em] text-stone-300 hover:bg-white/10 hover:border-white/20 transition-all uppercase">
              Send a message
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
        {name.toUpperCase()}
      </div>
    </div>
  );
};
