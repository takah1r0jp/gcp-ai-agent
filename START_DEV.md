# 開発環境起動の手順

#### Python環境
- FastAPIの基本動作確認
- 依存関係のインストール
- `uvicorn backend.app.main:app --reload` でローカル起動

#### Node.js環境  
- React+Viteの基本動作確認
- `npm install` で依存関係インストール
- `npm run dev` で開発サーバー起動

  完成した単体テスト

  1. テスト環境セットアップ
  - Vitest + React Testing Library
  - LocalStorage モック
  - カスタムセットアップファイル

  2. storage.js テスト（17テスト）
  - ✅ 完了タスクの保存・読み込み
  - ✅ プランデータの管理
  - ✅ 目標履歴の管理
  - ✅ エラーハンドリング
  - ✅ データクリア機能
  - ✅ 統計情報取得

  3. api.js テスト（16テスト）
  - ✅ API呼び出し成功・失敗
  - ✅ ヘルスチェック機能
  - ✅ エラーハンドリング
  - ✅ ログ出力確認

  テスト実行コマンド

  # 基本テスト実行
  npm test

  # UI付きテスト実行
  npm run test:ui

  # カバレッジ付きテスト実行  
  npm run test:coverage