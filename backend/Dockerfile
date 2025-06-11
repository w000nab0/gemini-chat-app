# Dockerfile
# ベースイメージとしてPython 3.11のスリム版を使うよ
FROM python:3.11-slim

# Pythonの出力がバッファリングされないように設定（ログがリアルタイムで見やすくなる）
ENV PYTHONUNBUFFERED 1

# コンテナ内の作業ディレクトリを /app に設定するよ
WORKDIR /app

# ホスト（君のPC）の requirements.txt をコンテナの /app にコピーするよ
COPY requirements.txt .

# requirements.txt に書かれているライブラリをインストールするよ
RUN pip install -r requirements.txt

# ホストの現在のディレクトリ（backendフォルダの中身）をコンテナの /app にコピーするよ
COPY . .

# ポート5000番を公開するよ（Flaskのデフォルトポート）
EXPOSE 5000

# アプリケーションを起動するコマンドだよ
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]