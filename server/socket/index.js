const express = require('express');
const { Server } = require('socket.io')
const http = require('http');
const getUserDetailsFromToken = require('../helper/get-user-details-from-token');
const UserModel = require('../models/user-model');
const ConversationModel = require('../models/conversation-model');
const MessageModel = require('../models/message-model');
const getConversations = require('../helper/get-conversations');

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
  if (!currentUserDetails.logout) {
    currentUserDetails;
    socket.join(currentUserDetails?._id.toString());
    onlineUsers.add(currentUserDetails?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUsers));
  }

  socket.on("disconnect", () => {
    onlineUsers.delete(currentUserDetails?._id);
    console.log(`Disconnected user ${socket.id}`);
  });

  socket.on("message-page", async (userId) => {
    try {
      console.log("userId from Message page:", userId)
      const userDetails = await UserModel.findById(userId).select("-password");
      if (!userDetails) {
        socket.emit("message-user", { error: true, message: "User not found" });
        return;
      }
      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUsers.has(userId),
      }

      socket.emit("message-user", payload);

      const sender = currentUserDetails._id.toString(), receiver = userId.toString();
      const getConversation = await ConversationModel.findOne({
        "$or": [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ]
      }).populate('messages')
        .sort({ updatedAt: -1 });

      io.in(sender).emit('message', getConversation);
      io.in(receiver).emit('message', getConversation);

    } catch (error) {
      console.log(error);
      socket.emit("message-user", { error: true, message: "User not found" });
    }
  });

  socket.on("new-message", async (data) => {
    try {
      const { sender, receiver, text, imageUrl, videoUrl } = data;
      let conversation = await ConversationModel.findOne({
        "$or": [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ]
      });
      if (!conversation) {
        const newConversation = await ConversationModel.create({
          sender,
          receiver,
        });
        conversation = newConversation;
      }

      const newMessage = await MessageModel.create({
        text,
        imageUrl,
        videoUrl,
        sender,
      });

      await ConversationModel.updateOne({ _id: conversation._id }, {
        "$push": { messages: newMessage._id }
      });

      const getConversation = await ConversationModel
        .findById(conversation._id)
        .populate('messages')
        .sort({ updatedAt: -1 });

      io.in(sender).emit('message', getConversation);
      io.in(receiver).emit('message', getConversation);

      const senderConversations = await getConversations(sender);
      const receiverConversations = await getConversations(receiver);
      io.in(sender).emit('all-conversation', senderConversations || []);
      io.in(receiver).emit('all-conversation', receiverConversations || []);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('get-all-convo', async (userId) => {
    const conversations = await getConversations(userId);
    socket.emit('all-conversation', conversations || []);
  });

});

module.exports = {
  app,
  server,
}
