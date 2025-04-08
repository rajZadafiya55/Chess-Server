import mongoose from "mongoose";
import Game from "../models/Game.js";
import User from "../models/User.js"; // Make sure to import User model
import { generateBestMove } from "../utils/chessAI.js"; // Your AI move logic

// Start a new game
export const startGame = async (req, res) => {
  try {
    const { player1, mode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(player1)) {
      return res.status(400).json({ message: "Invalid player1 ID" });
    }

    const player1Exists = await User.findById(player1);
    if (!player1Exists) {
      return res.status(404).json({ message: "Player1 not found" });
    }

    const game = new Game({
      player1,
      status: mode === "single" ? "ongoing" : "waiting",
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    console.error("Start Game Error:", error);
    res.status(500).json({ message: "Error starting game", error: error.message });
  }
};

// Join a multiplayer game
export const joinGame = async (req, res) => {
  try {
    const { gameId, player2 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(player2)) {
      return res.status(400).json({ message: "Invalid player2 ID" });
    }

    const game = await Game.findById(gameId);
    if (!game || game.status !== "waiting") {
      return res.status(400).json({ message: "Game not available" });
    }

    game.player2 = player2;
    game.status = "ongoing";
    await game.save();

    res.json(game);
  } catch (error) {
    console.error("Join Game Error:", error);
    res.status(500).json({ message: "Error joining game" });
  }
};

// Make a move
export const makeMove = async (req, res) => {
  try {
    const { gameId, move } = req.body;

    const game = await Game.findById(gameId);
    if (!game ) {
      return res.status(400).json({ message: "Invalid game" });
    }

    game.moves.push(move);
    await game.save();

    res.json(game);
  } catch (error) {
    console.error("Make Move Error:", error);
    res.status(500).json({ message: "Error making move" });
  }
};

// Get AI Move
export const getAIMove = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findById(gameId);
    if (!game ) {
      return res.status(400).json({ message: "Invalid game" });
    }

    const aiMove = generateBestMove(game.moves);
    game.moves.push(aiMove);
    await game.save();

    res.json({ aiMove, game });
  } catch (error) {
    console.error("AI Move Error:", error);
    res.status(500).json({ message: "Error generating AI move" });
  }
};
