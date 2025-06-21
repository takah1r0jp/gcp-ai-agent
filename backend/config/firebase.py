import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
import json
from dotenv import load_dotenv

# .envファイルを読み込み
load_dotenv()

def initialize_firebase():
    """Firebase Admin SDKを初期化"""
    if not firebase_admin._apps:
        try:
            # 環境変数からサービスアカウントキーのパスを取得
            service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY', 
                                           'backend/config/serviceAccountKey.json')
            
            # 絶対パスに変換
            if not os.path.isabs(service_account_path):
                current_dir = os.path.dirname(os.path.abspath(__file__))
                # backend/config から backend/ へ移動
                backend_root = os.path.dirname(current_dir)
                # backend/ から プロジェクトルート へ移動
                project_root = os.path.dirname(backend_root)
                service_account_path = os.path.join(project_root, service_account_path)
            
            print(f"🔍 サービスアカウントキーパス: {service_account_path}")
            print(f"🔍 ファイル存在確認: {os.path.exists(service_account_path)}")
            
            if not os.path.exists(service_account_path):
                raise FileNotFoundError(f"サービスアカウントキーファイルが見つかりません: {service_account_path}")
            
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("✓ Firebase Admin SDK initialized successfully")
            
        except Exception as e:
            print(f"❌ Firebase initialization error: {e}")
            raise e
    
    return firestore.client()

def get_auth():
    """Firebase Auth インスタンスを取得"""
    return auth

# Firestoreクライアントの初期化
try:
    db = initialize_firebase()
except Exception as e:
    print(f"Warning: Firebase not initialized - {e}")
    db = None