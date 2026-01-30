
export interface Observation {
  id: string;
  type: 'participation' | 'tempo' | 'focus';
  description: string;
  intensity: 'subtle' | 'moderate';
}

export interface EngagementPoint {
  time: string;
  consistency: number;
  depth: number;
  focus: number;
}

export interface AIPerspective {
  observation: string;
  rationale: string;
  suggestions: string[];
  isStudying: boolean;
  engagementScore: number;
}

export interface AcademicMetrics {
  assignmentSubmissionCount: number;
  attendanceDropPercentage: number;
  marksDropBetweenTerms: number;
  lateSubmissionRatio: number;
  attendanceTrend: 'rising' | 'falling' | 'stable';
  gradeVariance: number;
  missingAssignmentStreak: number;
}

export interface Student {
  id: string;
  name: string;
  age?: string;
  grade?: string;
  focusArea?: string;
  remarks: string;
  engagementData: EngagementPoint[];
  academicMetrics: AcademicMetrics;
  insight: AIPerspective | null;
}
