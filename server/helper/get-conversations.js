const ConversationModel = require("../models/conversation-model");

async function getConversations(userId) {
  if (!userId) return;
  const userConversation = await ConversationModel.find({
    "$or": [
      { sender: userId },
      { receiver: userId },
    ]
  }).populate('messages').populate('sender').populate('receiver').sort({ updatedAt: -1 });

  const conversations = userConversation.map((convo) => {
    const unseenMessages = convo.messages.reduce((total, curr) => total + (!curr.seen && curr.sender.toString() !== userId ? 1 : 0), 0);
    return {
      _id: convo?._id,
      sender: convo?.sender,
      receiver: convo?.receiver,
      unseen: unseenMessages,
      lastMessage: convo.messages[convo?.messages?.length - 1] || '',
    }
  });

  return conversations;
}

module.exports = getConversations;
