from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.models.risk_model import compute_risk

router = APIRouter()


class PredictRequest(BaseModel):
    student_id: str
    avg_score: float = Field(ge=0, le=100)
    attendance_rate: float = Field(ge=0, le=100)
    engagement_score: float = Field(ge=0)


class PredictResponse(BaseModel):
    student_id: str
    risk_score: float
    risk_level: str
    reasons: list[str]


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    """
    Given a student's aggregated average score, attendance rate, and
    engagement minutes, returns a risk score/level plus human-readable
    reasons — consumed by the backend to raise faculty alerts.
    """
    result = compute_risk(payload.avg_score, payload.attendance_rate, payload.engagement_score)
    return {"student_id": payload.student_id, **result}
