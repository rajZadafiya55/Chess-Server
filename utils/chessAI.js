import { Chess } from "chess.js";

export const generateBestMove = (moves = []) => {
  const chess = new Chess();

  // Apply existing moves to board
  moves.forEach((move) => {
    try {
      chess.move(move);
    } catch (err) {
      console.error("Invalid move in history:", move, err.message);
    }
  });

  // Get all legal moves
  const possibleMoves = chess.moves();

  if (possibleMoves.length === 0) return null;

  // Pick a random legal move
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};
