# API テストガイド

このガイドでは、バックエンドAPIの動作確認とテスト方法を説明します。

## 🚀 バックエンドサーバーの起動

### 1. 環境構築
```bash
# プロジェクトルートに移動
cd gcp-ai-agent

# 仮想環境の作成（初回のみ）
python -m venv .venv

# 仮想環境のアクティベート
# macOS/Linux:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

# 依存関係のインストール
pip install -r backend/requirements.txt
```

### 2. 環境変数の設定
```bash
# .envファイルを作成（.env.exampleを参考に）
cp .env.example .env

# .envファイルを編集してGCPの設定を追加
# GOOGLE_CLOUD_PROJECT=your_project_id
# GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### 3. サーバー起動
```bash
# プロジェクトルートから実行
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

サーバーが正常に起動すると、以下のメッセージが表示されます：
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## 📖 API仕様確認

### Swagger UI
ブラウザで以下のURLにアクセス：
```
http://localhost:8000/docs
```

### ReDoc
ブラウザで以下のURLにアクセス：
```
http://localhost:8000/redoc
```

## 🧪 API テスト方法

### 1. ヘルスチェック（ブラウザ）

**基本接続確認**
```
http://localhost:8000/
```
期待するレスポンス：
```json
{
  "message": "GCP AI Agent API is running"
}
```

**ヘルスチェック**
```
http://localhost:8000/health
```
期待するレスポンス：
```json
{
  "status": "healthy"
}
```

### 2. 目標プラン生成API（curl）

**基本的なテスト**
```bash
curl -X POST "http://localhost:8000/api/goal/plan" \
     -H "Content-Type: application/json" \
     -d '{
       "goal": "TOEIC 800点を取得する"
     }'
```

**その他のテスト例**
```bash
# プログラミング学習
curl -X POST "http://localhost:8000/api/goal/plan" \
     -H "Content-Type: application/json" \
     -d '{
       "goal": "Pythonでウェブアプリを作れるようになる"
     }'

# 資格取得
curl -X POST "http://localhost:8000/api/goal/plan" \
     -H "Content-Type: application/json" \
     -d '{
       "goal": "基本情報技術者試験に合格する"
     }'

# スポーツ
curl -X POST "http://localhost:8000/api/goal/plan" \
     -H "Content-Type: application/json" \
     -d '{
       "goal": "フルマラソンを完走する"
     }'
```

### 3. レガシーAPI（curl）

**旧形式での動作確認**
```bash
curl -X POST "http://localhost:8000/api/generate" \
     -H "Content-Type: application/json" \
     -d '{
       "user_input": "TOEIC 800点を取得したい"
     }'
```

## 📱 ブラウザでのテスト

### Swagger UIを使った対話的テスト

1. `http://localhost:8000/docs` にアクセス
2. `POST /api/goal/plan` エンドポイントを選択
3. 「Try it out」ボタンをクリック
4. Request bodyに以下を入力：
```json
{
  "goal": "英語を流暢に話せるようになる"
}
```
5. 「Execute」ボタンをクリック
6. レスポンスを確認

## 🔧 Python スクリプトでのテスト

### test_api.py ファイルの作成
```python
# backend/tests/test_api.py
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """ヘルスチェックのテスト"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

def test_goal_plan():
    """目標プラン生成のテスト"""
    goals = [
        "TOEIC 800点を取得する",
        "Pythonでウェブアプリを作れるようになる",
        "基本情報技術者試験に合格する",
        "フルマラソンを完走する"
    ]
    
    for goal in goals:
        print(f"Testing goal: {goal}")
        response = requests.post(
            f"{BASE_URL}/api/goal/plan",
            json={"goal": goal}
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Goal: {result['goal']}")
            print(f"Period: {result['estimated_period']}")
            print(f"Mid Goals: {len(result['mid_goals'])}")
            print(f"Tips: {len(result['tips'])}")
        else:
            print(f"Error: {response.text}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_health_check()
    test_goal_plan()
```

### 実行方法
```bash
# テストスクリプトの実行
python backend/tests/test_api.py
```

## 📊 期待するレスポンス形式

### 成功時のレスポンス例
```json
{
  "goal": "TOEIC 800点を取得する",
  "estimated_period": "6ヶ月",
  "mid_goals": [
    {
      "id": 1,
      "title": "基礎英語力の向上",
      "description": "TOEIC学習の土台となる基礎的な英語力を身につける",
      "estimated_duration": "2ヶ月",
      "small_goals": [
        {
          "id": 1,
          "title": "基本語彙力の強化",
          "description": "TOEIC頻出単語1000語を覚える",
          "tasks": [
            "TOEIC単語帳を購入し、毎日50語ずつ学習する",
            "単語アプリを使って通勤時間に復習する"
          ],
          "success_criteria": "1000語の意味を8割以上正解できる"
        }
      ]
    }
  ],
  "tips": [
    "毎日継続することが最も重要です",
    "模擬試験を定期的に受けて進捗を確認しましょう"
  ]
}
```

### エラー時のレスポンス例
```json
{
  "detail": "目標プラン生成中にエラーが発生しました: [エラー詳細]"
}
```

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. サーバーが起動しない
```bash
# ポートが使用中の場合、別のポートを使用
uvicorn backend.app.main:app --reload --port 8001

# 依存関係の問題の場合、再インストール
pip install -r backend/requirements.txt --force-reinstall
```

#### 2. GCP認証エラー
```bash
# サービスアカウントキーの設定確認
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

# gcloud CLIで認証
gcloud auth application-default login
```

#### 3. JSONパースエラー
- システムプロンプトが正しく設定されているか確認
- Vertex AI APIのレスポンス形式が変更されていないか確認

#### 4. CORS エラー（フロントエンドから接続時）
- `main.py`のCORS設定でフロントエンドのURLが許可されているか確認

## 📝 ログ確認

### サーバーログの確認
サーバー起動時のターミナルで以下の情報を確認：
- リクエストログ（200, 500 ステータス）
- エラーメッセージ
- レスポンス時間

### デバッグモードでの起動
```bash
uvicorn backend.app.main:app --reload --log-level debug
```

## 🎯 次のステップ

APIが正常に動作することを確認できたら：

1. **フロントエンド連携**: React アプリからAPIを呼び出す
2. **エラーハンドリング強化**: より詳細なエラー処理の実装
3. **認証機能**: ユーザー認証の追加
4. **データベース統合**: 目標とプランの永続化
5. **テスト自動化**: pytestを使った自動テストの作成

このガイドを参考に、段階的にAPIの動作確認とテストを進めてください。