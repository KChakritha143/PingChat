# Ping Chat Backend

Backend server for **PingChat**, a real-time chat application built using **Node.js**, **Express.js**, and **Socket.IO**. This server manages WebSocket connections, broadcasts messages in real time, and handles user join/leave events.

---

## Features

* Real-time communication using Socket.IO
* User connection and disconnection tracking
* Instant message broadcasting
* CORS support for frontend integration
* Health check API endpoint
* Lightweight and scalable architecture

---

## Tech Stack

* Node.js
* Express.js
* Socket.IO
* CORS

---

## Project Structure

```text
backend/
│
├── server.js
├── package.json
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### Install Dependencies

```bash
npm install
```

---

## Running the Server

### Development

```bash
node server.js
```

Server starts on:

```text
http://localhost:5000
```

---

## API Endpoint

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2025-07-05T10:00:00.000Z"
}
```

---

## Socket Events

### Client → Server

| Event       | Description              |
| ----------- | ------------------------ |
| join        | User joins the chat room |
| sendMessage | Send a chat message      |

### Server → Client

| Event      | Description                      |
| ---------- | -------------------------------- |
| message    | Broadcasts messages to all users |
| userJoined | Notifies when a user joins       |
| userLeft   | Notifies when a user leaves      |

---

## Frontend Integration

Ensure the frontend Socket.IO client connects to:

```javascript
const socket = io("http://localhost:5000");
```

---

## Deployment

The backend can be deployed on:

* Render
* Railway
* Cyclic
* VPS/Cloud Servers

Environment Port:

```javascript
const PORT = process.env.PORT || 5000;
```

## Live URL

 https://ping-chat-tczv.onrender.com

## Screenshots

### Actions done in backend during conversation

In terminal
<img width="956" height="495" alt="image" src="https://github.com/user-attachments/assets/884c7016-c0c1-41a1-a447-8ae42347f1fa" />
In Website
<img width="1917" height="1030" alt="image" src="https://github.com/user-attachments/assets/9bed92b8-6ae5-4d49-b2ba-7243c58adfa2" />

### Health checkpoint
<img width="1911" height="1057" alt="image" src="https://github.com/user-attachments/assets/b387dc09-3663-4db1-b5c6-ce1038e47941" />

Built as part of a Full-Stack Real-Time Communication Project using React, Node.js, Express, and Socket.IO. 🚀
