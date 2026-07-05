import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
const logs = [];
const MAX_LOGS = 200;
function addLog(message) {
  console.log(message);
  logs.push({
    time: new Date().toLocaleString(),
    event: message
  });
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
}
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date()
  });
});
app.get('/logs', (req, res) => {
  res.json(logs);
});
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Live Communication Server</title>
        <style>
          body{
            font-family: Arial, sans-serif;
            margin:20px;
          }
          h1{
            color:#333;
          }
          table{
            width:100%;
            border-collapse:collapse;
          }
          th,td{
            border:1px solid #ccc;
            padding:8px;
            text-align:left;
          }
          th{
            background:#f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Live Communication Backend Dashboard</h1>
        <p>Refresh page to see latest logs.</p>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody id="logs"></tbody>
        </table>
        <script>
          async function loadLogs(){
            const res = await fetch('/logs');
            const data = await res.json();

            document.getElementById('logs').innerHTML =
              data.slice().reverse().map(log => \`
                <tr>
                  <td>\${log.time}</td>
                  <td>\${log.event}</td>
                </tr>
              \`).join('');
          }
          loadLogs();
          setInterval(loadLogs, 2000);
        </script>
      </body>
    </html>
  `);
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const activeUsers = new Map();
const messageHistory = [];
const MAX_HISTORY = 100;
io.on('connection', (socket) => {
  addLog(`[Handshake] Client connected. Socket ID: ${socket.id}`);
  socket.on('join_room', (username) => {
    if (!username || typeof username !== 'string') return;
    const sanitizedUsername = username.trim();
    if (sanitizedUsername.length === 0) return;
    activeUsers.set(socket.id, sanitizedUsername);
    addLog( `[User Joined] ${sanitizedUsername} associated with Socket ID: ${socket.id}`);
    socket.emit('message_history', messageHistory);
    const joinMsg = {
      id: `sys-${Date.now()}`,
      username: 'System',
      text: `${sanitizedUsername} has joined the room.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isSystem: true
    };
    messageHistory.push(joinMsg);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }
    io.emit('message', joinMsg);
    io.emit('user_list', Array.from(activeUsers.values()));
  });
  socket.on('send_message', (payload) => {
    const username =
      activeUsers.get(socket.id) || 'Anonymous';
    if (!payload || !payload.text || typeof payload.text !== 'string')
      return;
    const text = payload.text.trim();
    if (text.length === 0) return;
    addLog(`[Message] From ${username}: ${text}`);
    const messageData = {
      id: `${socket.id}-${Date.now()}`,
      username,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isSystem: false
    };
    messageHistory.push(messageData);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }
    io.emit('message', messageData);
  });
  socket.on('typing', (data) => {
    const username = activeUsers.get(socket.id);
    if (!username) return;
    socket.broadcast.emit('typing_status', {
      username,
      isTyping: data.isTyping
    });
  });
  socket.on('disconnect', () => {
    const username = activeUsers.get(socket.id);
    addLog( `[Disconnect] Client disconnected. Socket ID: ${socket.id} (User: ${username || 'Unknown'})`);
    if (username) {
      activeUsers.delete(socket.id);
      const leaveMsg = {
        id: `sys-${Date.now()}`,
        username: 'System',
        text: `${username} has left the room.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isSystem: true
      };
      messageHistory.push(leaveMsg);
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }
      io.emit('message', leaveMsg);
      io.emit('user_list', Array.from(activeUsers.values()));
    }
  });
});
httpServer.listen(PORT, () => {
  addLog(`Live Communication Server running on:`);
  addLog(`http://localhost:${PORT}`);
});