from fastapi import APIRouter, HTTPException, Header
from backend.app.models.schemas import UserInput, GenerateResponse
from backend.app.core.generator import llm_generator
from backend.app.services.firestore_service import firestore_service
from typing import Optional

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate_output(data: UserInput, authorization: Optional[str] = Header(None)):
    try:
        # IDトークンの検証（オプション）
        user_id = None
        if authorization and authorization.startswith("Bearer "):
            id_token = authorization.split("Bearer ")[1]
            user_info = firestore_service.verify_user_token(id_token)
            if user_info:
                user_id = user_info['uid']
        
        # プラン生成
        input_text = data.user_input
        output = llm_generator(input_text)
        
        # 認証されたユーザーの場合、Firestoreに保存
        if user_id:
            try:
                goal_id = await firestore_service.save_user_goal(user_id, {
                    'goal': input_text,
                    'plan': output,
                    'is_active': True,
                    'has_generated_plan': True
                })
                print(f"Goal saved for user {user_id}: {goal_id}")
            except Exception as e:
                print(f"Failed to save to Firestore: {e}")
                # Firestore保存に失敗しても、プラン生成は続行
        
        return GenerateResponse(response=output)
        
    except Exception as e:
        print(f"Generate endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"プラン生成中にエラーが発生しました: {str(e)}")