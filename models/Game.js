import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    moves: [{ type: String }], // Stores moves in PGN format
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished"],
      default: "waiting",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Game", GameSchema);
