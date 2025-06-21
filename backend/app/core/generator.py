from google import genai
from google.genai import types
import json
import os
from dotenv import load_dotenv

# .envファイルを読み込み（バックエンドディレクトリから）
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.dirname(os.path.dirname(current_dir))
env_path = os.path.join(backend_root, '.env')
load_dotenv(env_path)
print(f"🔍 .env読み込みパス: {env_path}")
print(f"🔍 .envファイル存在確認: {os.path.exists(env_path)}")

def llm_generator(user_goal: str) -> dict:
    # JSONファイルを開いて読み込む
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_root = os.path.dirname(os.path.dirname(current_dir))
    project_root = os.path.dirname(backend_root)
    system_prompt_path = os.path.join(project_root, "backend/config/system_prompt.json")
    
    with open(system_prompt_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # "system_prompt"の値を取り出す
    system_prompt = data["system_prompt"] 
    
    # 環境変数の確認
    print("🔍 全環境変数確認:")
    for key in ['GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_CLOUD_PROJECT', 'FIREBASE_SERVICE_ACCOUNT_KEY']:
        value = os.getenv(key, 'NOT_SET')
        print(f"  {key}: {value}")
    
    # Vertex AI用の認証情報を強制的に設定
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT', 'gcp-ai-461501')
    
    # 古い値が残っている場合は強制的に正しい値を設定
    vertex_ai_credentials = 'backend/config/vertex-ai-key.json'
    
    print(f"🔍 Vertex AI Project: {project_id}")
    print(f"🔍 Vertex AI Credentials (強制設定): {vertex_ai_credentials}")
    
    # 絶対パスに変換
    if vertex_ai_credentials and not os.path.isabs(vertex_ai_credentials):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_root = os.path.dirname(os.path.dirname(current_dir))
        project_root = os.path.dirname(backend_root)
        vertex_ai_credentials = os.path.join(project_root, vertex_ai_credentials)
        
        # 環境変数を強制的に更新
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = vertex_ai_credentials
        print(f"🔍 Vertex AI絶対パス: {vertex_ai_credentials}")
        print(f"🔍 ファイル存在確認: {os.path.exists(vertex_ai_credentials)}")
        
        if not os.path.exists(vertex_ai_credentials):
            print(f"❌ ファイルが見つかりません: {vertex_ai_credentials}")
            print(f"📁 config ディレクトリの内容:")
            config_dir = os.path.dirname(vertex_ai_credentials)
            if os.path.exists(config_dir):
                for file in os.listdir(config_dir):
                    print(f"  - {file}")
            else:
                print(f"❌ config ディレクトリが存在しません: {config_dir}")
    
    client = genai.Client(
        vertexai=True,
        project=project_id,
        location="us-central1",  # 一般的に利用可能なリージョン
    )

    # ユーザーの目標を適切な形式でプロンプトに組み込む
    user_prompt = f"以下の大目標を達成するための具体的なステップを作成してください。\n\n大目標：{user_goal}"

    model = "gemini-2.5-flash-preview-05-20"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_prompt)
            ]
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature = 0.7,
        top_p = 0.9,
        max_output_tokens = 65535,
        safety_settings = [
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH",
                threshold="OFF"
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="OFF"
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="OFF"
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT",
                threshold="OFF"
            )
        ],
        response_mime_type = "application/json",
        response_schema = {
            "type": "OBJECT",
            "properties": {
                "goal": {"type": "STRING"},
                "estimated_period": {"type": "STRING"},
                "mid_goals": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "id": {"type": "INTEGER"},
                            "title": {"type": "STRING"},
                            "description": {"type": "STRING"},
                            "estimated_duration": {"type": "STRING"},
                            "small_goals": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "id": {"type": "INTEGER"},
                                        "title": {"type": "STRING"},
                                        "description": {"type": "STRING"},
                                        "tasks": {
                                            "type": "ARRAY",
                                            "items": {"type": "STRING"}
                                        },
                                        "success_criteria": {"type": "STRING"}
                                    }
                                }
                            }
                        }
                    }
                },
                "tips": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                }
            }
        },
        system_instruction=[types.Part.from_text(text=system_prompt)],
    )

    result = client.models.generate_content(
        model = model,
        contents = contents,
        config = generate_content_config,
    )
    
    result_text = result.text
    
    try:
        # JSONをパースして構造を確認
        result_json = json.loads(result_text)
        return result_json
    except json.JSONDecodeError as e:
        # JSONパースエラーの場合はエラー情報を含む辞書を返す
        return {
            "error": "JSON parse error",
            "message": str(e),
            "raw_response": result_text
        }


def main():
    user_goal = "TOEIC 800点を取得する"
    result = llm_generator(user_goal)
    print("Result:", json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()