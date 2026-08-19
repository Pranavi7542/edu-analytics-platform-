from fastapi import APIRouter
from pydantic import BaseModel
from app.models.risk_model import recommend_resources

router = APIRouter()


class RecommendRequest(BaseModel):
    gaps: list[str]  # e.g. ["low_score", "low_attendance"]


class Resource(BaseModel):
    title: str
    type: str


class RecommendResponse(BaseModel):
    recommendations: list[Resource]


@router.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest):
    """Returns personalized learning resources for a set of identified gaps."""
    return {"recommendations": recommend_resources(payload.gaps)}
