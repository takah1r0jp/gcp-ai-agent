from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 入力データの形式（リクエストボディ）
class UserInput(BaseModel):
    user_input: str

# POSTエンドポイント：入力を受け取ってレスポンスを返す
@app.post("/generate")
def generate_output(data: UserInput):
    input_text = data.user_input
    return {"response": f"あなたはこう言いました：{input_text}"}
