const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("send-location", (data) => {
    const { latitude, longitude } = data;

    // Validate incoming data
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      console.error(`Invalid location data received from ${socket.id}`);
      return;
    }

    // Update user's location
    connectedUsers.set(socket.id, { latitude, longitude });

    // Broadcast the updated location to all clients
    io.emit("receive-location", { id: socket.id, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    connectedUsers.delete(socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

// New route to get all connected users
app.get("/users", (req, res) => {
  const users = Array.from(connectedUsers, ([id, location]) => ({
    id,
    ...location,
  }));
  res.json(users);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
