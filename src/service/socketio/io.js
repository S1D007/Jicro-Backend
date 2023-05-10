const socketIO = require('socket.io');
module.exports = function startSocketServer(server,port) {  
    // Pass the server instance to socket.io
    const io = socketIO(server);
  
    io.on('connection', (socket) => {  
      console.log('Connected')
      socket.on('join room', (room) => {
        socket.join(room);
        
      });
      socket.on('delivery location update', (data) => {
        
        io.to(data.room).emit('delivery location receive', data.location);
      });
  
      socket.on('disconnect', () => {
      });
    });
  }