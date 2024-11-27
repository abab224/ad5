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

// ユーザー情報 (簡易認証用のデータベース)
const users = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
];

// ログインAPI
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Socket.IO 接続処理
io.on('connection', (socket) => {
  console.log('A user connected');

  // ユーザーを特定のルームに参加させる
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // メッセージを同じルームのユーザーに送信
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
