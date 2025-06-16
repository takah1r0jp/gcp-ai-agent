from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import GoalInput, GoalPlanResponse, ErrorResponse
from backend.app.core.generator import llm_generator

router = APIRouter()


@router.post("/goal/plan", response_model=GoalPlanResponse)
def create_goal_plan(data: GoalInput):
    """
    ユーザーの目標を受け取り、達成のための具体的なステップを生成します
    
    Args:
        data: ユーザーの目標情報
        
    Returns:
        GoalPlanResponse: 構造化された目標達成プラン
        
    Raises:
        HTTPException: LLM処理でエラーが発生した場合
    """
    try:
        result = llm_generator(data.goal)
        
        # エラーレスポンスの場合
        if "error" in result:
            raise HTTPException(
                status_code=500,
                detail={
                    "error": result["error"],
                    "message": result["message"]
                }
            )
        
        return GoalPlanResponse(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"目標プラン生成中にエラーが発生しました: {str(e)}"
        )