const socketIO = require('socket.io');
const connectedUsers = [];
const playerController = require('./controllers/player');

module.exports = (server) => {
  const io = socketIO(server);

  try {
    io.on('connection', (socket) => {
      console.log('A user connected');
      
      // Gather user information
      const user = {
        id: socket.id,
        userAgent: socket.handshake.headers['user-agent'],
        ip: socket.handshake.address,
      };
      
      // Add the user to the list of connected users
      connectedUsers.push(user);
      
      // Send the list of connected users to all clients
      try {
        io.emit('connectedUsers', connectedUsers);
      } catch (error) {
        console.log("Could not emit connectedUsers: ", error);
      }

      // Add the player to the database
      playerController.addPlayer(user)
        .then((addedPlayer) => {
          console.log('Player added to the database:', addedPlayer.id);
        })
        .catch((error) => {
          console.error('Error adding player to the database:', error);
        });

      try {
        socket.on('disconnect', () => {
          console.log('A user disconnected');
            
          // Remove the user from the list of connected users
          const userIndex = connectedUsers.findIndex((u) => u.id === socket.id);
          if (userIndex !== -1) {
            connectedUsers.splice(userIndex, 1);
          }
            
          // Send the updated list of connected users to all clients
          io.emit('connectedUsers', connectedUsers);
              
          // Remove the player from the database
          playerController.removePlayer(user)
            .then((removedPlayer) => {
              console.log('Player removed from the database:', removedPlayer.id);
            })
            .catch((error) => {
              console.error('Error removing player from the database:', error);
            });
        });
      } catch (error) {
        console.log("Could not disconnect: ", error);
      }
    });
  } catch (error) {
    console.log("Could not connect to socket: ", error);
  }
};
