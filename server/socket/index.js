const express = require('express');
const { Server } = require('socket.io')
const http = require('http');
const getUserDetailsFromToken = require('../helper/get-user-details-from-token');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});

const onlineUsers = new Set();

io.on("connection", async (socket) => {
  console.log(`Connected user ${socket.id}`);

  const token = socket.handshake.auth.token;

  const currentUserDetails = await getUserDetailsFromToken(token);
  if(!currentUserDetails.logout) {
    currentUserDetails;
    socket.join(currentUserDetails?._id);
    onlineUsers.add(currentUserDetails?._id)
    io.emit('onlineUser', Array.from(onlineUsers));
  }

  socket.on("disconnect", () => {
    onlineUsers.delete(currentUserDetails?._id);
    console.log(`Disconnected user ${socket.id}`);
  });
});

module.exports = {
  app,
  server,
}
