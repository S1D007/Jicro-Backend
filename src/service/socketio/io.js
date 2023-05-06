const socketIO = require('socket.io');
module.exports = function startSocketServer(server,port) {  
    // Pass the server instance to socket.io
    const io = socketIO(server);
  
    io.on('connection', (socket) => {  
      socket.on('join room', (room) => {
        socket.join(room);
        console.log(room)
      });
      socket.on('delivery location update', (data) => {
        console.log(data.location)
        io.to(data.room).emit('delivery location receive', data.location);
      });
  
      socket.on('disconnect', () => {
      });
    });
  
    server.listen(3000, () => {
      console.log('Socket listening on localhost:3000');
    });
  }
