from google import genai
from google.genai import types
import json


def llm_generator(user_goal: str) -> dict:
    # JSONファイルを開いて読み込む
    with open("backend/config/system_prompt.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # "system_prompt"の値を取り出す
    system_prompt = data["system_prompt"] 
    
    client = genai.Client(
        vertexai=True,
        project="gcp-ai-461501",
        location="global",
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