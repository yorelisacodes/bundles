const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

// SOCKET IO dependencies
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { userJoin, getCurrentUser, userLeave, getRoomUsers, formatMessage } = require('./services/socket')
const server = http.createServer(app)
const io = socketio(server)
const botName = "Virtual Assistant"

// RUN WHEN CLIENT CONNECTS ==========================
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room}) => {
const user = userJoin(socket.id, username, room)


socket.join(user.room)

// WELCOME CURRENT USER =================
  socket.emit('message', formatMessage(botName, 'Welcome to your chat!'))


// BROADCAST WHEN A USER CONNECTS ===================
socket.broadcast
.to(user.room)
.emit(
  'message',  
  formatMessage(botName, `${user.username} has joined the chat`))


  // SEND USERS AND ROOM INFO =======
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  })
})


// LISTEN FOR ChatMessage ===============
socket.on('chatMessage', (msg) => {
  const user = getCurrentUser(socket.id)

io.to(user.room).emit('message',  formatMessage(user.username, msg))
})

// PRIVATE ROOM ============
socket.on('chatInviteRoom', (privateRoom) => {
  const user = getCurrentUser(socket.id)
  console.log(user, privateRoom)
io.to(user.room).emit('inviteRoom',privateRoom)
})


// RUNS WHEN CLIENT DISCONNECTS =============
socket.on("disconnect", () => {
  const user = userLeave(socket.id);

  if (user) {
    io.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} has left the chat`)
    );
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
})     
}
})
})

//Server Running
server.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
