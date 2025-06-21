from typing import List, Dict, Any, Optional
from firebase_admin import firestore
from backend.config.firebase import db

class FirestoreService:
    def __init__(self):
        self.db = db
    
    def verify_user_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """IDトークンを検証してユーザー情報を取得"""
        try:
            from firebase_admin import auth
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            print(f"Token verification error: {e}")
            return None
    
    async def save_user_goal(self, user_id: str, goal_data: Dict[str, Any]) -> str:
        """ユーザーの目標を保存"""
        try:
            if not self.db:
                raise Exception("Firestore not initialized")
                
            goal_data['created_at'] = firestore.SERVER_TIMESTAMP
            goal_data['updated_at'] = firestore.SERVER_TIMESTAMP
            
            doc_ref = self.db.collection('users').document(user_id).collection('goals').add(goal_data)
            return doc_ref[1].id
        except Exception as e:
            print(f"Error saving goal: {e}")
            raise Exception(f"Error saving goal: {str(e)}")
    
    async def get_user_goals(self, user_id: str) -> List[Dict[str, Any]]:
        """ユーザーの目標一覧を取得"""
        try:
            if not self.db:
                raise Exception("Firestore not initialized")
                
            goals_ref = self.db.collection('users').document(user_id).collection('goals')
            docs = goals_ref.order_by('created_at', direction=firestore.Query.DESCENDING).stream()
            
            goals = []
            for doc in docs:
                goal_data = doc.to_dict()
                goal_data['id'] = doc.id
                goals.append(goal_data)
            
            return goals
        except Exception as e:
            print(f"Error fetching goals: {e}")
            raise Exception(f"Error fetching goals: {str(e)}")
    
    async def update_goal_plan(self, user_id: str, goal_id: str, plan_data: Dict[str, Any]) -> None:
        """目標にプランを追加/更新"""
        try:
            if not self.db:
                raise Exception("Firestore not initialized")
                
            goal_ref = self.db.collection('users').document(user_id).collection('goals').document(goal_id)
            goal_ref.update({
                'plan': plan_data,
                'has_generated_plan': True,
                'updated_at': firestore.SERVER_TIMESTAMP
            })
        except Exception as e:
            print(f"Error updating goal plan: {e}")
            raise Exception(f"Error updating goal plan: {str(e)}")

# シングルトンインスタンス
firestore_service = FirestoreService()