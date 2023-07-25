const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = [];
const onlineUsers = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'user') {
      onlineUsers.add(data.user);
      broadcastUserList();
    } else {
      messages.push(data);
      broadcastMessages();
    }
  });

  ws.on('close', () => {
    // Remove the user from the onlineUsers set on disconnection
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws && client.userName) {
        onlineUsers.delete(client.userName);
        broadcastUserList();
      }
    });
  });

  // Send existing messages to newly connected clients
  ws.send(JSON.stringify(messages));
  // Send the list of online users to the newly connected client
  broadcastUserList();
});

function broadcastMessages() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messages));
    }
  });
}

function broadcastUserList() {
  const userListMessage = JSON.stringify({ type: 'userList', users: Array.from(onlineUsers) });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(userListMessage);
    }
  });
}

server.listen(5000, () => {
  console.log('WebSocket server started on port 5000');
});
