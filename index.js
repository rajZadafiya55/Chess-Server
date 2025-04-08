import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// HTTP Server & WebSockets
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

// WebSocket Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    io.to(gameId).emit("message", "A new player joined the game");
  });

  socket.on("move", ({ gameId, move }) => {
    io.to(gameId).emit("updateBoard", move);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
