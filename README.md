# GCP AI Agent

Google Cloud Vertex AIを活用したAIアシスタントアプリケーション

## プロジェクト構成

```
gcp-ai-agent/
├── frontend/                      # React + Vite フロントエンド
│   ├── src/
│   │   ├── App.tsx                # メインアプリケーションコンポーネント
│   │   ├── main.tsx               # エントリポイント
│   │   ├── services/
│   │   │   ├── firebase.ts        # Firebase設定
│   │   │   └── api.ts             # Python API との通信
│   │   └── pages/                 # ページコンポーネント
│   ├── public/                    # 静的ファイル
│   ├── index.html                 # HTMLテンプレート
│   ├── vite.config.ts             # Vite設定
│   └── package.json               # パッケージ設定
│
├── backend/                       # Python バックエンド（FastAPI）
│   ├── app/
│   │   ├── main.py                # エントリポイント
│   │   ├── vertex_ai.py           # Vertex AI 呼び出し処理
│   │   └── models.py              # データモデル
│   ├── requirements.txt           # 依存関係
│   └── Dockerfile                 # コンテナ化設定
│
├── .env                           # 環境変数設定
├── firebase.json                  # Firebase Hosting 設定
├── .firebaserc                    # Firebase プロジェクト設定
└── README.md                      # プロジェクト説明
```

## 前提条件

- Node.js 18以上
- Python 3.9以上
- Google Cloud アカウントとプロジェクト
- Firebase プロジェクト

## セットアップ手順

### 1. 環境変数の設定

`.env`ファイルを編集して、必要な環境変数を設定します：

```
# Firebase設定
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# バックエンドAPI設定
VITE_API_URL=http://localhost:8000

# Google Cloud設定
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=us-central1
VERTEX_MODEL_NAME=gemini-1.5-pro
```

### 2. バックエンドのセットアップ

```bash
# 仮想環境の作成と有効化
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate

# 依存関係のインストール
cd backend
pip install -r requirements.txt

# サーバーの起動
uvicorn app.main:app --reload
```

### 3. フロントエンドのセットアップ

```bash
# 依存関係のインストール
cd frontend
npm install

# 開発サーバーの起動
npm run dev
```

### 4. Firebase設定

```bash
# Firebaseツールのインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトの初期化（既に.firebasercがある場合は不要）
firebase use --add

# デプロイ
firebase deploy
```

## 開発環境

### バックエンド

- FastAPI: RESTful APIフレームワーク
- Vertex AI: Google Cloudの生成AIサービス
- Python 3.9+

### フロントエンド

- React: UIライブラリ
- TypeScript: 型付きJavaScript
- Vite: ビルドツール
- Material-UI: UIコンポーネントライブラリ
- Firebase Authentication: 認証
- Firebase Hosting: ホスティング

## デプロイ

### バックエンド

Google Cloud Runにデプロイする場合：

```bash
cd backend
gcloud builds submit --tag gcr.io/your-project-id/gcp-ai-agent-backend
gcloud run deploy gcp-ai-agent-backend --image gcr.io/your-project-id/gcp-ai-agent-backend --platform managed
```

### フロントエンド

Firebase Hostingにデプロイする場合：

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## ライセンス

MIT