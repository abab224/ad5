document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const messagesDiv = document.getElementById('messages');
  
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        if (res.ok) {
          window.location.href = '/chat.html';
        } else {
          document.getElementById('error-message').innerText = 'Login failed. Try again.';
        }
      });
    }
  
    if (sendBtn) {
      const socket = io();
  
      sendBtn.addEventListener('click', () => {
        const msg = messageInput.value;
        if (msg.trim()) {
          socket.emit('chat message', msg);
          messageInput.value = '';
        }
      });
  
      socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // 自動スクロール
      });
    }
  });
  