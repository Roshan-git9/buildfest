# ================= IMPORTS =================
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

# ================= DATASET GENERATION =================
np.random.seed(42)

n = 10000

# Base engagement score (hidden factor)
engagement = np.random.normal(0.6, 0.2, n)
engagement = np.clip(engagement, 0, 1)

# Assignment submissions
assignment_submission_count = (engagement * 20 + np.random.normal(0, 2, n)).astype(int)
assignment_submission_count = np.clip(assignment_submission_count, 0, 20)

# Attendance drop
attendance_drop_percentage = (1 - engagement) * 50 + np.random.normal(0, 5, n)
attendance_drop_percentage = np.clip(attendance_drop_percentage, 0, 100)

# Marks drop
marks_drop_between_terms = (1 - engagement) * 30 + np.random.normal(0, 4, n)

# Late submission ratio
late_submission_ratio = (1 - engagement) * 0.6 + np.random.normal(0, 0.05, n)
late_submission_ratio = np.clip(late_submission_ratio, 0, 1)

# Attendance trend
attendance_trend = engagement * 2 - 1 + np.random.normal(0, 0.2, n)
attendance_trend = np.clip(attendance_trend, -1, 1)

# Grade variance
grade_variance = (1 - engagement) * 25 + np.random.normal(0, 3, n)
grade_variance = np.clip(grade_variance, 0, 50)

# Missing assignment streak
missing_assignment_streak = ((1 - engagement) * 6 + np.random.normal(0, 1, n)).astype(int)
missing_assignment_streak = np.clip(missing_assignment_streak, 0, 10)

# ================= RISK SCORE =================
risk_score = (
    0.3 * attendance_drop_percentage +
    0.2 * marks_drop_between_terms +
    0.2 * late_submission_ratio * 100 +
    0.1 * grade_variance +
    0.2 * missing_assignment_streak * 5
)

# ================= ⭐ BALANCED TARGET FIX =================
# Instead of fixed threshold (like > 40), use percentile threshold

threshold = np.percentile(risk_score, 65)   # Top 35% become Risk = Yes
risk_label = (risk_score > threshold).astype(int)

academic_help_required = np.where(risk_label == 1, "Yes", "No")

# ================= CREATE DATAFRAME =================
df = pd.DataFrame({
    "assignment_submission_count": assignment_submission_count,
    "attendance_drop_percentage": attendance_drop_percentage,
    "marks_drop_between_terms": marks_drop_between_terms,
    "late_submission_ratio": late_submission_ratio,
    "attendance_trend": attendance_trend,
    "grade_variance": grade_variance,
    "missing_assignment_streak": missing_assignment_streak,
    "risk_label": risk_label,
    "academic_help_required": academic_help_required
})

print("\nDataset Shape:", df.shape)

# ================= CHECK CLASS BALANCE =================
print("\nClass Distribution:")
print(df["risk_label"].value_counts())
print(df["risk_label"].value_counts(normalize=True))

# ================= FEATURE / TARGET =================
X = df.drop(["risk_label", "academic_help_required"], axis=1)
y = df["risk_label"]

# ================= TRAIN TEST SPLIT =================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ================= MODEL TRAINING =================
rf_model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

rf_model.fit(X_train, y_train)

# ================= PROBABILITY PREDICTIONS =================
risk_prob = rf_model.predict_proba(X_test)[:, 1]

print("\nRisk Probability Stats:")
print("Min:", risk_prob.min())
print("Max:", risk_prob.max())
print("Mean:", risk_prob.mean())

# ================= FINAL PREDICTION =================
THRESHOLD = 0.5   # Now 0.5 should work because dataset is balanced

y_pred = (risk_prob >= THRESHOLD).astype(int)
prediction_text = ["Yes" if p >= THRESHOLD else "No" for p in risk_prob]

# ================= EVALUATION =================
print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# ================= SAMPLE OUTPUT =================
print("\nSample Predictions (Yes/No):")
print(prediction_text[:10])

# ================= RESULT TABLE =================
results = X_test.copy()
results["Risk_Probability"] = risk_prob
results["Prediction_Label"] = y_pred
results["Prediction_Text"] = prediction_text

print("\nSample Result Table:")
print(results.head())



# ================= SAVE MODEL =================
joblib.dump(rf_model, "student_risk_model.pkl")

print("Model saved as student_risk_model.pkl")

import joblib
import pandas as pd

# Load model once when file is imported
model = joblib.load("student_risk_model.pkl")

THRESHOLD = 0.5

def predict_student_risk(
    assignment_submission_count,
    attendance_drop_percentage,
    marks_drop_between_terms,
    late_submission_ratio,
    attendance_trend,
    grade_variance,
    missing_assignment_streak
):

    data = pd.DataFrame([{
        "assignment_submission_count": assignment_submission_count,
        "attendance_drop_percentage": attendance_drop_percentage,
        "marks_drop_between_terms": marks_drop_between_terms,
        "late_submission_ratio": late_submission_ratio,
        "attendance_trend": attendance_trend,
        "grade_variance": grade_variance,
        "missing_assignment_streak": missing_assignment_streak
    }])

    prob = model.predict_proba(data)[0][1]
    label = 1 if prob >= THRESHOLD else 0
    text = "Yes" if label == 1 else "No"

    return {
        "risk_probability": float(prob),
        "risk_label": int(label),
        "academic_help_required": text
    }

"""##Actual result section

"""

result = predict_student_risk(
    assignment_submission_count=20,
    attendance_drop_percentage=10,
    marks_drop_between_terms=19,
    late_submission_ratio=0.5,
    attendance_trend=-0.4,
    grade_variance=1,
    missing_assignment_streak=2
)

print(result)
