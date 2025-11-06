const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

const messages = [];

// REST endpoint: get history
app.get("/messages", (req, res) => {
  res.json(messages);
});

// REST endpoint: emit a message (Next.js backend will call this)
app.post("/emit", (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ error: "username and text required" });
  }

  const msg = {
    id: Date.now(),
    username,
    text,
    createdAt: new Date().toISOString(),
  };

  messages.push(msg);

  // Emit to all connected socket clients
  io.emit("message", msg);

  res.json({ success: true, msg });
});

const io = new Server(server, {
  // allow CORS from Next dev server
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });

  socket.on("sendMessage", (payload) => {
    const { username, text } = payload;

    const msg = {
      id: Date.now(),
      username,
      text,
      createdAt: new Date().toISOString(),
    };

    messages.push(msg);

    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("Express + Socket.io running on port", PORT);
});
