'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

  // Emit the status event when a new socket client is connected
  io.emit('eldoEvent', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    username: socket.request.name
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('eldoEvent', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.username = socket.request.name;

    // Emit the 'chatMessage' event
    io.emit('eldoEvent', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disco', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.name
    });
  });
};
