document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
  
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
  
        if (!username || !password) {
          document.getElementById('error-message').innerText = 'Please enter both username and a 4-digit password.';
          return;
        }
  
        if (!/^\d{4}$/.test(password)) {
          document.getElementById('error-message').innerText = 'Password must be a 4-digit number.';
          return;
        }
  
        try {
          const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
  
          if (res.ok) {
            localStorage.setItem('username', username);
            localStorage.setItem('room', password);
            window.location.href = '/chat.html';
          } else {
            const data = await res.json();
            document.getElementById('error-message').innerText = data.message || 'Login failed. Try again.';
          }
        } catch (error) {
          console.error('Error during login:', error);
          document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
        }
      });
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const messagesDiv = document.getElementById('messages');
  
    if (sendBtn) {
      const socket = io();
  
      // ログイン情報を取得
      const username = localStorage.getItem('username');
      const room = localStorage.getItem('room');
  
      // ルームに参加
      socket.emit('join room', room);
  
      // メッセージ送信
      sendBtn.addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim()) {
          socket.emit('chat message', { room, message, username });
          messageInput.value = '';
        }
      });
  
      // メッセージ受信
      socket.on('chat message', ({ username, message }) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${username}: ${message}`;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // 自動スクロール
      });
    }
  });
    