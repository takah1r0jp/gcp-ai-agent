# Firebase データベース統合ガイド

このガイドでは、本アプリケーション（React + FastAPI）にFirebaseデータベースを統合する方法を説明します。

## 前提条件

- Node.js とnpm がインストールされていること
- Python 3.7以上がインストールされていること
- Firebaseプロジェクトが作成されていること

## 1. Firebaseプロジェクトのセットアップ

### Firebase Consoleでの設定
1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力
4. Google Analyticsの設定（任意）
5. 「プロジェクトを作成」をクリック

### サービスアカウントの作成
1. Firebase Console > 設定 > サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. JSONファイルをダウンロードし、安全な場所に保存

## 2. フロントエンド（React）の設定

### パッケージのインストール
```bash
cd frontend
npm install firebase
```

### Firebase設定ファイルの作成
`frontend/src/config/firebase.js` ファイルを作成：

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// サービスの初期化
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

### Firestoreサービスの使用例
`frontend/src/services/firestore.js` ファイルを作成：

```javascript
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// データの取得
export const getAllGoals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'goals'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

// データの追加
export const addGoal = async (goalData) => {
  try {
    const docRef = await addDoc(collection(db, 'goals'), {
      ...goalData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

// データの更新
export const updateGoal = async (goalId, goalData) => {
  try {
    const goalRef = doc(db, 'goals', goalId);
    await updateDoc(goalRef, {
      ...goalData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// データの削除
export const deleteGoal = async (goalId) => {
  try {
    await deleteDoc(doc(db, 'goals', goalId));
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
```

## 3. バックエンド（FastAPI）の設定

### パッケージのインストール
```bash
cd backend
pip install firebase-admin
```

`requirements.txt` に追加：
```txt
firebase-admin
```

### Firebase Admin SDKの設定
`backend/config/firebase.py` ファイルを作成：

```python
import firebase_admin
from firebase_admin import credentials, firestore
import os

def initialize_firebase():
    """Firebase Admin SDKを初期化"""
    if not firebase_admin._apps:
        # サービスアカウントキーのパスを設定
        service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY', 
                                       'path/to/serviceAccountKey.json')
        
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

# Firestoreクライアントの初期化
db = initialize_firebase()
```

### Firestoreサービスの作成
`backend/app/services/firestore_service.py` ファイルを作成：

```python
from typing import List, Dict, Any, Optional
from firebase_admin import firestore
from backend.config.firebase import db

class FirestoreService:
    def __init__(self):
        self.db = db
    
    async def get_all_goals(self) -> List[Dict[str, Any]]:
        """全ての目標を取得"""
        try:
            goals_ref = self.db.collection('goals')
            docs = goals_ref.stream()
            
            goals = []
            for doc in docs:
                goal_data = doc.to_dict()
                goal_data['id'] = doc.id
                goals.append(goal_data)
            
            return goals
        except Exception as e:
            raise Exception(f"Error fetching goals: {str(e)}")
    
    async def add_goal(self, goal_data: Dict[str, Any]) -> str:
        """目標を追加"""
        try:
            goal_data['created_at'] = firestore.SERVER_TIMESTAMP
            goal_data['updated_at'] = firestore.SERVER_TIMESTAMP
            
            doc_ref = self.db.collection('goals').add(goal_data)
            return doc_ref[1].id
        except Exception as e:
            raise Exception(f"Error adding goal: {str(e)}")
    
    async def update_goal(self, goal_id: str, goal_data: Dict[str, Any]) -> None:
        """目標を更新"""
        try:
            goal_data['updated_at'] = firestore.SERVER_TIMESTAMP
            self.db.collection('goals').document(goal_id).update(goal_data)
        except Exception as e:
            raise Exception(f"Error updating goal: {str(e)}")
    
    async def delete_goal(self, goal_id: str) -> None:
        """目標を削除"""
        try:
            self.db.collection('goals').document(goal_id).delete()
        except Exception as e:
            raise Exception(f"Error deleting goal: {str(e)}")

# シングルトンインスタンス
firestore_service = FirestoreService()
```

### FastAPI ルートの更新
`backend/app/api/routes/goal.py` の更新例：

```python
from fastapi import APIRouter, HTTPException
from backend.app.services.firestore_service import firestore_service
from backend.app.models.schemas import GoalCreate, GoalUpdate

router = APIRouter()

@router.get("/goals")
async def get_goals():
    """全ての目標を取得"""
    try:
        goals = await firestore_service.get_all_goals()
        return {"goals": goals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/goals")
async def create_goal(goal: GoalCreate):
    """目標を作成"""
    try:
        goal_id = await firestore_service.add_goal(goal.dict())
        return {"id": goal_id, "message": "Goal created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/goals/{goal_id}")
async def update_goal(goal_id: str, goal: GoalUpdate):
    """目標を更新"""
    try:
        await firestore_service.update_goal(goal_id, goal.dict(exclude_unset=True))
        return {"message": "Goal updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    """目標を削除"""
    try:
        await firestore_service.delete_goal(goal_id)
        return {"message": "Goal deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 4. 環境変数の設定

### バックエンド環境設定
`.env` ファイルを作成（リポジトリには含めない）：
```env
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
```

### フロントエンド環境設定
`frontend/.env` ファイルを作成（リポジトリには含めない）：
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Firebase設定を環境変数から読み込むように更新：
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 5. セキュリティルール

### Firestore セキュリティルール例
Firebase Console > Firestore Database > ルール：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証されたユーザーのみアクセス可能
    match /goals/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. デプロイメント時の注意事項

1. **環境変数の設定**: 本番環境で適切な環境変数を設定
2. **セキュリティルール**: 本番環境用のFirestoreセキュリティルールを適用
3. **サービスアカウントキー**: セキュアな場所に保存し、適切なアクセス権限を設定
4. **CORS設定**: Firebase設定でWebアプリのドメインを承認

## 7. 利用可能なFirebaseサービス

- **Authentication**: ユーザー認証
- **Firestore**: NoSQLドキュメントデータベース
- **Realtime Database**: リアルタイムデータベース
- **Storage**: ファイルストレージ
- **Functions**: サーバーレス関数
- **Analytics**: アプリ分析

## 8. トラブルシューティング

### よくある問題
1. **認証エラー**: サービスアカウントキーのパスと権限を確認
2. **CORS エラー**: Firebase Consoleでドメインを承認
3. **権限エラー**: Firestoreセキュリティルールを確認
4. **接続エラー**: ネットワーク設定とFirebaseプロジェクト設定を確認

### デバッグ方法
- Firebaseコンソールでログを確認
- ブラウザの開発者ツールでネットワークタブを確認
- バックエンドのログを確認