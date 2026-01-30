# -*- coding: utf-8 -*-
"""Student risk model: dataset generation, training, saving, and prediction helper.

This module can be imported to call `predict_student_risk(...)`, or executed
as a script to (re)train the model and save it to disk.
"""

from __future__ import annotations

import os
from typing import Dict

import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

MODEL_PATH = "student_risk_model.pkl"

_cached_model = None


def _generate_dataset(n: int = 10000, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)

    # Base engagement score (hidden factor)
    engagement = np.random.normal(0.6, 0.2, n)
    engagement = np.clip(engagement, 0, 1)

    assignment_submission_count = (engagement * 20 + np.random.normal(0, 2, n)).astype(int)
    assignment_submission_count = np.clip(assignment_submission_count, 0, 20)

    attendance_drop_percentage = (1 - engagement) * 50 + np.random.normal(0, 5, n)
    attendance_drop_percentage = np.clip(attendance_drop_percentage, 0, 100)

    marks_drop_between_terms = (1 - engagement) * 30 + np.random.normal(0, 4, n)

    late_submission_ratio = (1 - engagement) * 0.6 + np.random.normal(0, 0.05, n)
    late_submission_ratio = np.clip(late_submission_ratio, 0, 1)

    attendance_trend = engagement * 2 - 1 + np.random.normal(0, 0.2, n)
    attendance_trend = np.clip(attendance_trend, -1, 1)

    grade_variance = (1 - engagement) * 25 + np.random.normal(0, 3, n)
    grade_variance = np.clip(grade_variance, 0, 50)

    missing_assignment_streak = ((1 - engagement) * 6 + np.random.normal(0, 1, n)).astype(int)
    missing_assignment_streak = np.clip(missing_assignment_streak, 0, 10)

    # Risk score composition
    risk_score = (
        0.3 * attendance_drop_percentage +
        0.2 * marks_drop_between_terms +
        0.2 * late_submission_ratio * 100 +
        0.1 * grade_variance +
        0.2 * missing_assignment_streak * 5
    )

    # Choose threshold by percentile to avoid extreme imbalance
    threshold = np.percentile(risk_score, 65)  # ~top 35% flagged as risk
    risk_label = (risk_score > threshold).astype(int)

    academic_help_required = np.where(risk_label == 1, "Yes", "No")

    df = pd.DataFrame({
        "assignment_submission_count": assignment_submission_count,
        "attendance_drop_percentage": attendance_drop_percentage,
        "marks_drop_between_terms": marks_drop_between_terms,
        "late_submission_ratio": late_submission_ratio,
        "attendance_trend": attendance_trend,
        "grade_variance": grade_variance,
        "missing_assignment_streak": missing_assignment_streak,
        "risk_label": risk_label,
        "academic_help_required": academic_help_required,
    })

    return df


def train_and_save_model(model_path: str = MODEL_PATH, n: int = 10000, random_state: int = 42) -> None:
    """Generate dataset, train a RandomForest model, evaluate and save it."""
    df = _generate_dataset(n=n, random_state=random_state)

    X = df.drop(["risk_label", "academic_help_required"], axis=1)
    y = df["risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state, stratify=y
    )

    rf_model = RandomForestClassifier(n_estimators=200, random_state=random_state, class_weight="balanced")
    rf_model.fit(X_train, y_train)

    risk_prob = rf_model.predict_proba(X_test)[:, 1]
    thresh = 0.5
    y_pred = (risk_prob >= thresh).astype(int)

    print("Dataset Shape:", df.shape)
    print("Class distribution:\n", df["risk_label"].value_counts())
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

    joblib.dump(rf_model, model_path)
    print(f"Model saved to {model_path}")


def _load_model(model_path: str = MODEL_PATH):
    global _cached_model
    if _cached_model is None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}. Run training first.")
        _cached_model = joblib.load(model_path)
    return _cached_model


def predict_student_risk(
    assignment_submission_count: int,
    attendance_drop_percentage: float,
    marks_drop_between_terms: float,
    late_submission_ratio: float,
    attendance_trend: float,
    grade_variance: float,
    missing_assignment_streak: int,
    model_path: str = MODEL_PATH,
    threshold: float = 0.5,
) -> Dict[str, object]:
    """Predict risk for a single student record.

    Returns a dict with `risk_probability` (float), `risk_label` (0/1) and
    `academic_help_required` ("Yes"/"No").
    """
    model = _load_model(model_path)

    data = pd.DataFrame([
        {
            "assignment_submission_count": assignment_submission_count,
            "attendance_drop_percentage": attendance_drop_percentage,
            "marks_drop_between_terms": marks_drop_between_terms,
            "late_submission_ratio": late_submission_ratio,
            "attendance_trend": attendance_trend,
            "grade_variance": grade_variance,
            "missing_assignment_streak": missing_assignment_streak,
        }
    ])

    prob = float(model.predict_proba(data)[0][1])
    label = 1 if prob >= threshold else 0
    text = "Yes" if label == 1 else "No"

    return {"risk_probability": prob, "risk_label": int(label), "academic_help_required": text}


if __name__ == "__main__":
    # When executed directly, train and save model, then run a sample prediction.
    train_and_save_model()

    sample = predict_student_risk(
        assignment_submission_count=20,
        attendance_drop_percentage=10,
        marks_drop_between_terms=19,
        late_submission_ratio=0.5,
        attendance_trend=-0.4,
        grade_variance=1,
        missing_assignment_streak=2,
    )

    print("\nSample prediction:", sample)