import { Server } from "socket.io"; 

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {

  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
    // console.log(onlineUsers,"username")
  
};


const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
console.log(onlineUsers,"onlineusers")
   let result=onlineUsers.find((user) => user.username !== username);
   console.log(result,"result")
   return result
};

io.on("connection", (socket) => {
  console.log("hello")
  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    console.log(receiverName,"recievaer")
    const receiver = getUser(receiverName);
  
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    console.log(receiverName,"reciever")
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
const PORT = process.env.PORT || 5000;
io.listen(PORT);
