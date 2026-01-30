
import { EngagementPoint, AcademicMetrics } from '../types';

export const generateSyntheticData = (): EngagementPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    time: day,
    consistency: 60 + Math.random() * 40,
    depth: 40 + Math.random() * 50,
    focus: 50 + Math.random() * 50,
  }));
};

export const generateAcademicMetrics = (): AcademicMetrics => {
  const trends: ('rising' | 'falling' | 'stable')[] = ['rising', 'falling', 'stable'];
  return {
    assignmentSubmissionCount: Math.floor(15 + Math.random() * 20),
    attendanceDropPercentage: parseFloat((Math.random() * 15).toFixed(1)),
    marksDropBetweenTerms: parseFloat((Math.random() * 10 - 2).toFixed(1)), // -2 to 8 range
    lateSubmissionRatio: parseFloat(Math.random().toFixed(2)),
    attendanceTrend: trends[Math.floor(Math.random() * trends.length)],
    gradeVariance: parseFloat((Math.random() * 5).toFixed(1)),
    missingAssignmentStreak: Math.floor(Math.random() * 4),
  };
};
