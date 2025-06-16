from fastapi import APIRouter
from backend.app.models.schemas import UserInput, GenerateResponse
from backend.app.core.generator import llm_generator

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
def generate_output(data: UserInput):
    input_text = data.user_input
    output = llm_generator(input_text)
    return GenerateResponse(response=f"LLMはこう言いました：{output}")