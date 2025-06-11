# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# .envファイルから環境変数を読み込むよ
load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

chat_sessions = {}


# ルートURL ("/") にアクセスしたら "Hello from Flask Backend!" を返すAPIだよ
@app.route('/')
def hello_world():
    return "Hello from Flask Backend!"

# 環境変数をテストするためのエンドポイントだよ
@app.route('/test_env')
def test_env():
    # 環境変数の例として、GOOGLE_API_KEY がセットされているか確認してみるよ
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        return f"GOOGLE_API_KEY is set! (Starts with: {api_key[:5]}...)"
    else:
        return "GOOGLE_API_KEY is NOT set."
    

@app.route('/chat', methods=['POST'])
def chat():
    # フロントエンドから送られてきたJSONデータを受け取るよ
    data = request.json
    user_message = data.get('message')
    # ユーザーIDも受け取るよ（今回は適当なものを使うけど、本当は認証で管理するよ）
    user_id = data.get('user_id', 'default_user')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # モデルを設定するよ (今回は 'gemini-pro' を使うよ)
        model = genai.GenerativeModel('gemini-2.0-flash')

        # ユーザーのチャットセッションを取得または新規作成するよ
        if user_id not in chat_sessions:
            chat_sessions[user_id] = model.start_chat(history=[])
            # 履歴に初期のプロンプト（例: AIの役割）を追加することもできるけど、今回はシンプルにするよ

        chat_session = chat_sessions[user_id]

        # Gemini APIにメッセージを送信して応答を受け取るよ
        response = chat_session.send_message(user_message)
        ai_response = response.text

        return jsonify({"response": ai_response})

    except Exception as e:
        # エラーが発生したら、エラーメッセージを返すよ
        return jsonify({"error": str(e)}), 500

# ================================================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

