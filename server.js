const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ログインAPI
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 入力のバリデーション
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // パスワードが4桁の数字であることを確認
  if (!/^\d{4}$/.test(password)) {
    return res.status(400).json({ success: false, message: 'Password must be a 4-digit number' });
  }

  // ログイン成功（簡易実装）
  res.status(200).json({ success: true });
});

// Socket.IO 接続処理
io.on('connection', (socket) => {
  console.log('A user connected');

  // ルームに参加
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // メッセージの送受信
  socket.on('chat message', ({ room, message, username }) => {
    io.to(room).emit('chat message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
