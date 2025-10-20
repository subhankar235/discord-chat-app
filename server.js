const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = new Set();

io.on("connection", (socket) => {
  console.log(`A user connected`);

  // When a user joins
  socket.on('join', (userName) => {
    users.add(userName);
   socket.userName=userName;
    // Broadcast to all clients that a new user has joined
    io.emit('user joined', userName);

    // Send the updated user list to all clients
    io.emit("userList", Array.from(users)); // <-- match front-end event name
  });


  //handle incoming msg--
socket.on("chatMessage",(message)=>{
  //now again same emiting this to frontend side for all client--
  io.emit("chatMessage",message)

});

  // handle on removing user on disconnect
  socket.on('disconnect', () => {
    console.log('an user is disconnected')
  
    users.forEach(user=>{
      if(user===socket.userName){
        users.delete(user);

        io.emit('userLeft',user);

        io.emit('userList',Array.from(users));
      }
    })
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
