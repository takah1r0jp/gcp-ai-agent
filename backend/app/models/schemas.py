from pydantic import BaseModel
from typing import List, Optional


class GoalInput(BaseModel):
    goal: str


class SmallGoal(BaseModel):
    id: int
    title: str
    description: str
    tasks: List[str]
    success_criteria: str


class MidGoal(BaseModel):
    id: int
    title: str
    description: str
    estimated_duration: str
    small_goals: List[SmallGoal]


class GoalPlanResponse(BaseModel):
    goal: str
    estimated_period: str
    mid_goals: List[MidGoal]
    tips: List[str]


class ErrorResponse(BaseModel):
    error: str
    message: str
    raw_response: Optional[str] = None


# 後方互換性のため残しておく
class UserInput(BaseModel):
    user_input: str


class GenerateResponse(BaseModel):
    response: str