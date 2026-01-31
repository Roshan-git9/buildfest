
import { AcademicMetrics } from '../types';

/**
 * Replicates the logic from the Python code:
 * risk_score = (
 *   0.3 * attendance_drop_percentage +
 *   0.2 * marks_drop_between_terms +
 *   0.2 * late_submission_ratio * 100 +
 *   0.1 * grade_variance +
 *   0.2 * missing_assignment_streak * 5
 * )
 */

const THRESHOLD = 25.0; // Calibrated based on the Python dataset distribution (approx 65th percentile)

export interface PredictionResult {
  risk_probability: number;
  risk_label: number;
  academic_help_required: "Yes" | "No";
  risk_score: number;
}

export function predictStudentRisk(metrics: AcademicMetrics): PredictionResult {
  const {
    attendance_drop_percentage,
    marks_drop_between_terms,
    late_submission_ratio,
    grade_variance,
    missing_assignment_streak
  } = {
    attendance_drop_percentage: metrics.attendanceDropPercentage,
    marks_drop_between_terms: metrics.marksDropBetweenTerms,
    late_submission_ratio: metrics.lateSubmissionRatio,
    grade_variance: metrics.gradeVariance,
    missing_assignment_streak: metrics.missingAssignmentStreak
  };

  // The weighted sum used in the Python logic
  const risk_score = (
    0.3 * attendance_drop_percentage +
    0.2 * marks_drop_between_terms +
    0.2 * (late_submission_ratio * 100) +
    0.1 * grade_variance +
    0.2 * (missing_assignment_streak * 5)
  );

  // Normalize probability (assuming a max expected risk score around 60-70 for the UI gauge)
  const risk_probability = Math.min(risk_score / 60, 1.0);
  const risk_label = risk_score >= THRESHOLD ? 1 : 0;
  const academic_help_required = risk_label === 1 ? "Yes" : "No";

  return {
    risk_probability,
    risk_label,
    academic_help_required,
    risk_score
  };
}
