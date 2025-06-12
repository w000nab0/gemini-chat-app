// frontend/script.js

// バックエンドのURLだよ！
// ローカルで開発中は http://localhost:5001
// Renderにデプロイしたら、RenderのURLに置き換える必要があるから覚えておいてね！
const BACKEND_URL = 'https://gemini-chat-app-backend-nelz.onrender.com';

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// チャット履歴を管理するための変数だよ
// バックエンドが再起動すると履歴は消えるので、このフロントエンドの履歴は参考程度
let chatHistory = [];

// メッセージを表示する関数
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(`${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    // 最新のメッセージが見えるようにスクロールする
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// メッセージを送信する関数
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage === '') {
        return; // 空のメッセージは送らない
    }

    displayMessage(userMessage, 'user'); // ユーザーのメッセージを画面に表示
    messageInput.value = ''; // 入力欄をクリア

    // APIを呼び出し中はボタンを無効にする
    sendButton.disabled = true;
    messageInput.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage, user_id: 'unique_user_id_123' }) // 簡単なユーザーIDを送るよ
        });

        if (!response.ok) {
            // HTTPエラーの場合
            const errorData = await response.json();
            throw new Error(`APIエラー: ${response.status} - ${errorData.error || '不明なエラー'}`);
        }

        const data = await response.json();
        const aiResponse = data.response;
        displayMessage(aiResponse, 'ai'); // AIの返信を画面に表示

    } catch (error) {
        console.error('チャットエラー:', error);
        displayMessage(`エラーが発生しました: ${error.message || 'AIの応答を取得できませんでした。'}`, 'ai');
    } finally {
        // API呼び出しが終わったらボタンを有効にする
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus(); // 入力欄にフォーカスを戻す
    }
}

// 送信ボタンがクリックされたらメッセージを送信
sendButton.addEventListener('click', sendMessage);

// Enterキーが押されたらメッセージを送信
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 初期メッセージを表示
displayMessage("こんにちは！何でも質問してね！", 'ai');