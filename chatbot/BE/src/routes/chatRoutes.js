import express from "express";
import { getHistory, getHistoryList, sendMessage } from "../controller/chatController.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.post("/chat/send", verifyToken,sendMessage);
router.get("/chat/history/:chatId" ,verifyToken,getHistory);
router.get("/chat/chat-history",verifyToken,getHistoryList)

export default router;