'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  console.log('A client connected');
  // Emit the status event when a new socket client is connected

  // Send a chat messages to all connected sockets when a message is received
  socket.on('eldoEvent', function (message) {
    console.log('received ');
    console.dir(message);
    // Emit the 'chatMessage' event
    io.emit('eldoEvent', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('disconnect ');
    
  });
};
