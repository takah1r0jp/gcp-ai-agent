FROM python:3.11-slim

WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY ./app /app/app

# 環境変数の設定
ENV PYTHONPATH=/app
ENV PORT=8000

# アプリケーションの実行
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}