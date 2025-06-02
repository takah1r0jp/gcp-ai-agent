from fastapi import FastAPI
from pydantic import BaseModel
from backend.src.generator import llm_generator

app = FastAPI()

# 入力データの形式（リクエストボディ）
class UserInput(BaseModel):
    user_input: str

# POSTエンドポイント：入力を受け取ってレスポンスを返す
@app.post("/generate")
def generate_output(data: UserInput):
    input_text = data.user_input
    output = llm_generator(input_text)
    return {"response": f"LLMはこう言いました：{output}"}

# 実行コマンド uvicorn backend.src.main:app --reload