from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class TextGenerationRequest(BaseModel):
    """テキスト生成リクエストのモデル"""
    prompt: str = Field(..., description="生成のためのプロンプト")
    max_tokens: int = Field(1024, description="生成する最大トークン数")

class Message(BaseModel):
    """チャットメッセージのモデル"""
    role: str = Field(..., description="メッセージの送信者の役割（'user'または'assistant'）")
    content: str = Field(..., description="メッセージの内容")

class ChatRequest(BaseModel):
    """チャットリクエストのモデル"""
    messages: List[Dict[str, str]] = Field(..., description="チャット履歴のリスト")
    
    class Config:
        schema_extra = {
            "example": {
                "messages": [
                    {"role": "user", "content": "こんにちは、AIアシスタント"},
                    {"role": "assistant", "content": "こんにちは！どのようにお手伝いできますか？"},
                    {"role": "user", "content": "天気予報について教えてください"}
                ]
            }
        }

class ChatResponse(BaseModel):
    """チャットレスポンスのモデル"""
    message: Message = Field(..., description="アシスタントからの応答メッセージ")
    
    class Config:
        schema_extra = {
            "example": {
                "message": {
                    "role": "assistant",
                    "content": "申し訳ありませんが、私は天気予報の情報を持っていません。特定の地域の天気を知りたい場合は、天気予報サービスや気象庁のウェブサイトをご確認ください。"
                }
            }
        }

class VertexAIConfig(BaseModel):
    """Vertex AI設定のモデル"""
    project_id: str
    location: str = "us-central1"
    model_name: str = "gemini-1.5-pro"