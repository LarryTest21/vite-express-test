const socket = require('socket.io');

const chatRouter = (server: any) => {
  let io = socket(server);

  io.on("connect", function (socket: any) {
    socket.broadcast.emit('connectedUser', socket.id);

    socket.on("userConnected", function (data: any) {
      socket.broadcast.emit('userListUpdate', data);
    });

    socket.on("userListInitial", function (data: any) {
      socket.broadcast.emit('userListInitial', data);
    });

    socket.on('disconnect', function (user: any) {
      socket.broadcast.emit('userDisconnected', socket.id);
    });

    socket.on('userListRequest', function () {
      socket.broadcast.emit('userListRequest');
    });

    socket.on('userIsTyping', function (data: any) {
      io.to(data.userSendTo[0].socketID).emit("userIsTyping", data);
      
    });

    socket.on('privateMessage', function (data: any) {
        io.to(data.sendToSocket.socketID).emit("privateMessage", data);
      
    });

    socket.on('messageRead', function (data: any) {
      io.to(data.sendTo).emit("messageRead", data);
    });

    socket.on('userAllRequests', function (data: any) {
      if (data.action === "deny") {
        io.to(data.deniedUserSocketID).emit("userDenied", data);
      }
      if (data.action === "accept") {
        io.to(data.acceptedUserSocketID).emit("userAccepted", data);
      }
      if (data.action === "request") {
        io.to(data.requestedUserSocketID).emit("userRequested", data);
      }
    });
  });
};

export default chatRouter;
