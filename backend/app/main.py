from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes.generate import router as generate_router
from backend.app.api.routes.goal import router as goal_router

app = FastAPI(
    title="GCP AI Agent API", 
    version="1.0.0",
    description="目標達成支援AIのバックエンドAPI"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(generate_router, prefix="/api", tags=["legacy"])
app.include_router(goal_router, prefix="/api", tags=["goals"])

@app.get("/")
def read_root():
    return {"message": "GCP AI Agent API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# 実行コマンド uvicorn backend.app.main:app --reload