require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.json({
        message : "Server is working"
    })
})
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => console.log("Connectedt to Database")
).catch( (err) => console.log(err.message));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "https://varta-chat-app.netlify.app",
        Credentials: true,
    }
});

global.ononlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        ononlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = ononlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
});