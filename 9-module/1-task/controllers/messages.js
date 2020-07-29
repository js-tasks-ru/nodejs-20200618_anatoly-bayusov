const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const user = ctx.user._id;
  const messages = await Message.find({chat: user});
  ctx.body = {messages: messages.map(message => ({
      id: message._id,
      date: message.date,
      text: message.text,
      user: message.user,
    }))};
};
