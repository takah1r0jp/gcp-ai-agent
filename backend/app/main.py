from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import logging

from .vertex_ai import generate_text, generate_chat_response
from .models import TextGenerationRequest, ChatRequest, ChatResponse

app = FastAPI(title="GCP AI Agent API", description="Google Cloud Vertex AI APIを利用したAIエージェント")

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ロギングの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": "GCP AI Agent API is running"}

@app.post("/generate-text")
async def text_generation(request: TextGenerationRequest):
    try:
        response = await generate_text(request.prompt, request.max_tokens)
        return {"text": response}
    except Exception as e:
        logger.error(f"Text generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await generate_chat_response(request.messages)
        return response
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)