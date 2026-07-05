import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
const SOCKET_SERVER_URL = 'http://localhost:5000';
function App() {
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);
  useEffect(() => {
    if (!isJoined || !username) return;
    const socket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
      socket.emit('join_room', username);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('message_history', (history) => {
      setMessages(history);
    });
    socket.on('user_list', (users) => {
      setUsersList(users);
    });
    socket.on('typing_status', (data) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (data.isTyping) {
          next.add(data.username);
        } else {
          next.delete(data.username);
        }
        return next;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [isJoined, username]);
  const handleJoin = (e) => {
    e.preventDefault();
    const cleanName = tempUsername.trim();
    if (cleanName.length > 0) {
      setUsername(cleanName);
      setIsJoined(true);
    }
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !socketRef.current) return;
    socketRef.current.emit('send_message', { text: currentMessage });
    handleStopTyping();
    setCurrentMessage('');
  };
  const handleStopTyping = () => {
    if (isTypingRef.current && socketRef.current) {
      socketRef.current.emit('typing', { isTyping: false });
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    if (!socketRef.current) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit('typing', { isTyping: true });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };
  if (!isJoined) {
    return (
      <div className="app-container">
        <div className="gate-card glass-panel">
          <div className="gate-logo">Ping Chat</div>
          <p className="gate-subtitle">Enter your name to connect to the live room</p>
          <form onSubmit={handleJoin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username-input">Choose identity</label>
              <input
                id="username-input"
                type="text"
                className="input-field"
                placeholder="Please enter your name to get connected..."
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                maxLength={20}
                required
                autoComplete="off"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" id="join-btn">
              Connect Room
            </button>
          </form>
        </div>
      </div>
    );
  }
  const typingList = Array.from(typingUsers);
  let typingMessage = '';
  if (typingList.length === 1) {
    typingMessage = `${typingList[0]} is typing`;
  } else if (typingList.length === 2) {
    typingMessage = `${typingList[0]} and ${typingList[1]} are typing`;
  } else if (typingList.length > 2) {
    typingMessage = `Multiple people are typing`;
  }
  return (
    <div className="app-container">
      <div className="chat-dashboard glass-panel">       
        <aside className="users-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title"><span className="pulse-dot"></span>Live Status</h1>
          </div>
          <ul className="users-list">
            {usersList.map((user, idx) => (
              <li key={idx} className="user-item">
                <div className="user-avatar">
                  {user.substring(0, 2).toUpperCase()}
                </div>
                <span className={`user-name ${user === username ? 'self' : ''}`}>  {user} {user === username ? '(You)' : ''} </span>
              </li>
            ))}
          </ul>
        </aside>
        <main className="chat-workspace">
          <header className="chat-header">
            <div className="chat-title-group">
              <h2>Realtime Nexus</h2>
              <p>User Connected : <strong>{username}</strong></p>
            </div>
            <div className={`connection-badge ${!isConnected ? 'disconnected' : ''}`} id="status-badge">
              <span className="pulse-dot" style={{ backgroundColor: isConnected ? '#2ec4b6' : '#e63946', boxShadow: isConnected ? '0 0 8px #2ec4b6' : '0 0 8px #e63946' }}></span>
              {isConnected ? 'LIVE' : 'DISCONNECTED'}
            </div>
          </header>
          <section className="messages-stream">
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="system-msg-card">
                    <span>⚡</span> {msg.text}
                  </div>
                );
              }
              const isSelf = msg.username === username;
              return (
                <div key={msg.id} className={`message-bubble-wrapper ${isSelf ? 'sent' : 'received'}`}>
                  <div className="message-meta">
                    <span className="sender-tag">{isSelf ? 'You' : msg.username}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </section>
          <div className="typing-indicator-bar">
            {typingMessage && (
              <div className="typing-text">
                <span>{typingMessage}</span>
                <span className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
          </div>
          <footer className="chat-footer">
            <form onSubmit={handleSendMessage} className="input-form">
              <input
                id="message-input"
                type="text"
                className="input-field"
                placeholder="Type your message here..."
                value={currentMessage}
                onChange={handleInputChange}
                onBlur={handleStopTyping}
                maxLength={400}
                autoComplete="off"
                required
              />
              <button type="submit" className="btn-send" id="send-btn" aria-label="Send message">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default App;