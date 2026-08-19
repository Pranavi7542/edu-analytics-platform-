"""
Rule-based learning-gap / at-risk scoring model.

This stands in for a trained ML model (e.g. logistic regression or a
gradient-boosted classifier fit on historical outcome data). The thresholds
below represent the institution's "configurable academic policy" referenced
in the problem statement, and can be swapped for a trained model later
without changing the API contract.
"""

# Configurable academic policy thresholds
SCORE_WEIGHT = 0.5
ATTENDANCE_WEIGHT = 0.3
ENGAGEMENT_WEIGHT = 0.2

HIGH_RISK_THRESHOLD = 40
MEDIUM_RISK_THRESHOLD = 60

# Engagement minutes considered "fully engaged" for normalization purposes
ENGAGEMENT_NORMALIZATION_CAP = 120


def compute_risk(avg_score: float, attendance_rate: float, engagement_score: float):
    """
    Combines average assessment score, attendance rate, and engagement
    (minutes of LMS activity) into a single 0-100 'health score', where a
    LOWER score means HIGHER academic risk.
    """
    normalized_engagement = min(engagement_score / ENGAGEMENT_NORMALIZATION_CAP, 1.0) * 100

    health_score = (
        avg_score * SCORE_WEIGHT
        + attendance_rate * ATTENDANCE_WEIGHT
        + normalized_engagement * ENGAGEMENT_WEIGHT
    )

    if health_score < HIGH_RISK_THRESHOLD:
        risk_level = "high"
    elif health_score < MEDIUM_RISK_THRESHOLD:
        risk_level = "medium"
    else:
        risk_level = "low"

    reasons = []
    if avg_score < 50:
        reasons.append("Average assessment score below 50%.")
    if attendance_rate < 60:
        reasons.append("Attendance rate below 60%.")
    if engagement_score < 30:
        reasons.append("Very low LMS engagement (logins, submissions, forum activity).")
    if not reasons:
        reasons.append("Performance and engagement are within expected ranges.")

    return {
        "risk_score": round(health_score, 1),
        "risk_level": risk_level,
        "reasons": reasons,
    }


# Static mapping of learning gaps to recommended resource types.
# In a fuller implementation this would query a content/resource catalog.
RESOURCE_CATALOG = {
    "low_score": [
        {"title": "Foundational concept review videos", "type": "video"},
        {"title": "Practice problem set with worked solutions", "type": "practice"},
    ],
    "low_attendance": [
        {"title": "Recorded lecture catch-up playlist", "type": "video"},
        {"title": "Weekly study-group session", "type": "peer-support"},
    ],
    "low_engagement": [
        {"title": "Interactive micro-quizzes (5 min/day)", "type": "interactive"},
        {"title": "Gamified concept-mastery tracker", "type": "interactive"},
    ],
}


def recommend_resources(gaps):
    """Maps a list of learning-gap tags to concrete recommended resources."""
    recommendations = []
    for gap in gaps:
        recommendations.extend(RESOURCE_CATALOG.get(gap, []))
    if not recommendations:
        recommendations = [{"title": "General enrichment reading list", "type": "reading"}]
    return recommendations
