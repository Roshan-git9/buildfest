
export interface Observation {
  id: string;
  type: 'participation' | 'tempo' | 'focus';
  description: string;
  intensity: 'subtle' | 'moderate';
}

export interface AudioLog {
  id: string;
  base64Data: string;
  transcript: string;
  timestamp: string;
  voiceName: string;
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
  // New fields from dataset
  gender?: string;
  screenTime?: number;
  sleepDuration?: number;
  sleepTime?: string;
  physicalActivity?: number;
  stressLevel?: string;
  anxiousBeforeExams?: string;
  performanceChange?: string;
}

export interface Message {
  id: string;
  sender: 'Teacher' | 'System';
  text: string;
  timestamp: string;
}

export interface Student {
  id: string;
  name: string;
  age?: number;
  educationLevel?: string;
  gender?: string;
  subjectEmoji?: string;
  remarks: string;
  engagementData: EngagementPoint[];
  academicMetrics: AcademicMetrics;
  insight: AIPerspective | null;
  messages: Message[];
  audioLogs: AudioLog[];
}
