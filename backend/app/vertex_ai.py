import os
import asyncio
from typing import List, Dict, Any, Optional
import logging
from google.cloud import aiplatform
from google.oauth2 import service_account
from vertexai.preview.generative_models import GenerativeModel, ChatSession, Content

# ロギングの設定
logger = logging.getLogger(__name__)

# 環境変数から認証情報を取得
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
PROJECT_ID = os.getenv("GCP_PROJECT_ID")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")
MODEL_NAME = os.getenv("VERTEX_MODEL_NAME", "gemini-1.5-pro")

# 認証設定
def get_vertex_ai_client():
    """Vertex AI クライアントを初期化して返す"""
    try:
        if GOOGLE_APPLICATION_CREDENTIALS:
            credentials = service_account.Credentials.from_service_account_file(
                GOOGLE_APPLICATION_CREDENTIALS
            )
            aiplatform.init(
                project=PROJECT_ID,
                location=LOCATION,
                credentials=credentials
            )
        else:
            # デフォルトの認証情報を使用
            aiplatform.init(
                project=PROJECT_ID,
                location=LOCATION
            )
        return True
    except Exception as e:
        logger.error(f"Vertex AI client initialization error: {str(e)}")
        raise e

async def generate_text(prompt: str, max_tokens: int = 1024) -> str:
    """
    Vertex AI Text Generation APIを使用してテキストを生成する
    
    Args:
        prompt: 生成のためのプロンプト
        max_tokens: 生成する最大トークン数
        
    Returns:
        生成されたテキスト
    """
    try:
        get_vertex_ai_client()
        
        # モデルのロード
        model = GenerativeModel(MODEL_NAME)
        
        # テキスト生成
        response = model.generate_content(
            prompt,
            generation_config={"max_output_tokens": max_tokens}
        )
        
        return response.text
    except Exception as e:
        logger.error(f"Text generation error: {str(e)}")
        raise e

async def generate_chat_response(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Vertex AI Chat APIを使用してチャットレスポンスを生成する
    
    Args:
        messages: チャット履歴のリスト。各メッセージは{"role": "user"|"assistant", "content": "メッセージ内容"}の形式
        
    Returns:
        チャットレスポンス
    """
    try:
        get_vertex_ai_client()
        
        # モデルのロード
        model = GenerativeModel(MODEL_NAME)
        chat = ChatSession(model)
        
        # メッセージを変換してチャットセッションに追加
        for message in messages:
            role = message["role"]
            content = message["content"]
            
            if role == "user":
                response = chat.send_message(content)
            # assistantのメッセージは内部的に保持されるため、特に処理は不要
        
        # 最後のレスポンスを取得
        return {
            "message": {
                "role": "assistant",
                "content": response.text
            }
        }
    except Exception as e:
        logger.error(f"Chat generation error: {str(e)}")
        raise e