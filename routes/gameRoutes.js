import express from 'express';
import { startGame, joinGame, makeMove, getAIMove } from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', startGame);
router.post('/join', joinGame);
router.post('/move', makeMove);
router.post('/ai-move', getAIMove);

export default router;
