const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.request._query.token
    
    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
    } else {
      const session = await Session.findOne({token}).populate('user');
      socket.user = session.user;
      next();
    }
    
    
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const message = new Message({text: msg, chat: socket.user._id, user: socket.user.displayName, date: new Date()});
      await message.save();
    });
  });

  return io;
}

module.exports = socket;
