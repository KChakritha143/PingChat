# PingChat Frontend

## Overview

PingChat is a real-time chat application frontend built with React and Socket.io Client. It enables users to join a chat room, exchange messages instantly, and view live typing indicators through WebSocket-based communication.

## Features

* Real-time messaging
* Instant message updates
* User identification with usernames
* Live typing indicators
* Responsive user interface
* Socket.io client integration

## Tech Stack

* React.js
* Vite
* Socket.io Client
* CSS

## Installation

### Clone the Repository

```bash
git clone https://github.com/KChakritha143/PingChat.git
```

### Navigate to Frontend Folder

```bash
cd client
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will run on:

```text
http://localhost:5173
```

## Project Structure

```text
client/
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── public/
├── package.json
└── vite.config.js
```

## Usage

1. Enter a username.
2. Join the chat room.
3. Send messages in real time.
4. View messages from connected users instantly.
5. See typing indicators when other users are typing.

## Backend Requirement

This frontend requires the PingChat backend server to be running and connected through Socket.io.

## Live URL 

https://ping-chat-black.vercel.app/

## Screenshots

### Login Page
<img width="1915" height="1032" alt="image" src="https://github.com/user-attachments/assets/281a513d-9f93-4156-8135-09233ef42eec" />

### Live Chat

### When User gets disconnected
<img width="1472" height="927" alt="image" src="https://github.com/user-attachments/assets/669094b7-6c34-4edf-9e41-758f0afe9b8f" />
### When User gets connected and multiple users joined
<img width="1377" height="882" alt="image" src="https://github.com/user-attachments/assets/cd1e9da9-ae5d-453c-af44-7cb609d860f9" />

### Chat conversation between users
User-01
<img width="1382" height="867" alt="image" src="https://github.com/user-attachments/assets/07c4cc0f-b1c5-454a-9c28-9e7b60e7ccc8" />

User-02
<img width="1362" height="837" alt="image" src="https://github.com/user-attachments/assets/176778dc-6447-4405-b74a-660a39731b5a" />

User-03
<img width="1370" height="857" alt="image" src="https://github.com/user-attachments/assets/086f665c-121a-4b20-a0d4-76a964717cec" />

## Future Enhancements

* Private messaging
* Chat rooms
* Online user status
* Message timestamps
* Emoji support
