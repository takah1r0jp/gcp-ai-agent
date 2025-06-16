# バックエンドディレクトリ構造ガイド

このガイドでは、初心者向けにバックエンドの各ディレクトリにどのようなファイルを配置し、どう使い分けるかを説明します。

## 📁 ディレクトリ構造

```
backend/
├── requirements.txt        # Pythonパッケージの依存関係
├── .env                   # 環境変数（非公開）
├── app/                   # メインアプリケーション
│   ├── __init__.py       # Pythonパッケージ識別ファイル
│   ├── main.py           # FastAPIアプリケーションのエントリーポイント
│   ├── api/              # API関連
│   │   ├── __init__.py
│   │   └── routes/       # APIルート定義
│   │       ├── __init__.py
│   │       ├── generate.py    # AI生成関連のエンドポイント
│   │       ├── users.py       # ユーザー関連のエンドポイント（今後追加）
│   │       └── goals.py       # 目標管理関連のエンドポイント（今後追加）
│   ├── core/             # ビジネスロジック
│   │   ├── __init__.py
│   │   ├── generator.py  # AI生成のメインロジック
│   │   ├── config.py     # 設定管理（今後追加）
│   │   └── security.py   # セキュリティ関連（今後追加）
│   ├── models/           # データモデル
│   │   ├── __init__.py
│   │   ├── schemas.py    # Pydanticスキーマ（API入出力）
│   │   └── database.py   # データベースモデル（今後追加）
│   ├── utils/            # ユーティリティ関数
│   │   ├── __init__.py
│   │   ├── helpers.py    # 汎用ヘルパー関数（今後追加）
│   │   └── validators.py # バリデーション関数（今後追加）
│   └── db/              # データベース関連（今後追加）
│       ├── __init__.py
│       ├── database.py   # データベース接続設定
│       └── migrations/   # マイグレーションファイル
├── config/               # 設定ファイル
│   ├── system_prompt.json # AI用システムプロンプト
│   └── settings.json     # アプリケーション設定（今後追加）
└── tests/               # テストファイル
    ├── __init__.py
    ├── test_api.py      # APIテスト
    ├── test_core.py     # コアロジックテスト
    └── fixtures/        # テスト用データ
```

## 🎯 各ディレクトリの役割と使い分け

### 1. `app/main.py` - アプリケーションのエントリーポイント
**役割**: FastAPIアプリケーションの起動設定とルーター登録

```python
# ここに書くもの：
- FastAPIアプリケーションインスタンスの作成
- ルーターの登録
- ミドルウェアの設定
- CORS設定
```

**例**:
```python
from fastapi import FastAPI
from app.api.routes import generate, users, goals

app = FastAPI(title="GCP AI Agent API")
app.include_router(generate.router, prefix="/api")
app.include_router(users.router, prefix="/api")
```

### 2. `app/api/routes/` - APIエンドポイント定義
**役割**: 各機能ごとにAPIエンドポイントを定義

**ファイル作成ルール**:
- 機能ごとに1ファイル作成
- ファイル名は機能名（例: `generate.py`, `users.py`, `goals.py`）

```python
# routes/generate.py の例
from fastapi import APIRouter
from app.models.schemas import UserInput, GenerateResponse
from app.core.generator import llm_generator

router = APIRouter()

@router.post("/generate")
def generate_output(data: UserInput):
    # エンドポイントのロジック
```

**今後追加すべきファイル**:
- `users.py` - ユーザー認証・管理
- `goals.py` - 目標設定・管理
- `progress.py` - 進捗管理

### 3. `app/core/` - ビジネスロジック
**役割**: アプリケーションの核となるロジックを実装

**ファイル作成ルール**:
- 1つの責任につき1ファイル
- 複雑なロジックはここに集約

```python
# core/generator.py の例
def llm_generator(user_text: str) -> str:
    # AI生成のメインロジック
    pass

def analyze_goal(goal: str) -> dict:
    # 目標分析のロジック
    pass
```

**今後追加すべきファイル**:
- `config.py` - 設定管理
- `security.py` - 認証・認可
- `goal_analyzer.py` - 目標分析ロジック
- `task_generator.py` - タスク生成ロジック

### 4. `app/models/` - データモデル定義
**役割**: APIの入出力やデータベースの構造を定義

**ファイル作成ルール**:
- `schemas.py` - API用のPydanticモデル
- `database.py` - データベース用のSQLAlchemyモデル

```python
# models/schemas.py の例
from pydantic import BaseModel

class UserInput(BaseModel):
    user_input: str

class Goal(BaseModel):
    title: str
    deadline: str
    description: str
```

**今後追加すべきモデル**:
- `User` - ユーザー情報
- `Goal` - 目標情報
- `Task` - タスク情報
- `Progress` - 進捗情報

### 5. `app/utils/` - ユーティリティ関数
**役割**: 複数の場所で使われる汎用的な関数

```python
# utils/helpers.py の例
def format_date(date_str: str) -> str:
    # 日付フォーマット関数
    pass

def validate_email(email: str) -> bool:
    # メールアドレス検証
    pass
```

### 6. `config/` - 設定ファイル
**役割**: アプリケーションの設定を外部ファイルで管理

**ファイル作成ルール**:
- JSON形式で設定を保存
- 機能ごとに分割可能

## 🚀 開発の進め方

### Phase 1: 基本API (現在)
1. `app/api/routes/generate.py` - AI生成エンドポイント ✅
2. `app/core/generator.py` - AI生成ロジック ✅
3. `app/models/schemas.py` - 基本スキーマ ✅

### Phase 2: ユーザー管理
1. `app/models/schemas.py` に `User` モデル追加
2. `app/api/routes/users.py` - ユーザー管理API作成
3. `app/core/security.py` - 認証ロジック作成

### Phase 3: 目標・タスク管理
1. `app/models/schemas.py` に `Goal`, `Task` モデル追加
2. `app/api/routes/goals.py` - 目標管理API作成
3. `app/core/goal_analyzer.py` - 目標分析ロジック作成

### Phase 4: データベース導入
1. `app/db/database.py` - データベース接続設定
2. `app/models/database.py` - SQLAlchemyモデル作成
3. データベースマイグレーション実装

## ⚡ 開発tips

### 新しいAPI機能を追加する手順
1. **スキーマ定義**: `app/models/schemas.py` にPydanticモデル追加
2. **ビジネスロジック**: `app/core/` に処理ロジック作成
3. **APIエンドポイント**: `app/api/routes/` に新ファイル作成
4. **ルーター登録**: `app/main.py` でルーター登録

### ファイルの命名規則
- **ファイル名**: スネークケース（例: `goal_analyzer.py`）
- **クラス名**: パスカルケース（例: `GoalAnalyzer`）
- **関数名**: スネークケース（例: `analyze_goal`）
- **変数名**: スネークケース（例: `user_input`）

### インポートの順序
```python
# 1. 標準ライブラリ
import json
from datetime import datetime

# 2. サードパーティライブラリ
from fastapi import APIRouter
from pydantic import BaseModel

# 3. ローカルモジュール
from app.models.schemas import UserInput
from app.core.generator import llm_generator
```

このガイドに従って開発を進めることで、保守性が高く拡張しやすいバックエンドを構築できます。