from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, recommend

app = FastAPI(
    title="EduAnalytics - Analytics Engine",
    description="Learning-gap prediction and personalized resource recommendation service.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "analytics-engine"}


app.include_router(predict.router)
app.include_router(recommend.router)
