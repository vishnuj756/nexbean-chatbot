
import chatSchema from "../modals/chatSchema.js";
import { decrypt, encrypt } from "../services/encryptionService.js";
import { generateChatTitle, getGeminiResponse } from "../services/gemineService.js";

import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  try {
    const { type = "text", message, fileUrl, chatId } = req.body;
    const userId = req.user?.id || null;

    let activeChatId;
    let chatTitle = null;

    // 1. Check if chatId was provided in the payload
    if (chatId) {
      const existingChat = await chatSchema.findOne({ chatId: chatId });

      if (existingChat) {
        activeChatId = existingChat.chatId;
        console.log("Continuing existing chat session:", activeChatId);
        // Note: chatTitle stays null here, so the DB record for this message 
        // won't overwrite the title set in the 'head' document.
      } else {
        activeChatId = new mongoose.Types.ObjectId();
        chatTitle = await generateChatTitle(message); // Generate title for new ID
        console.log("ChatId not found, new title:", chatTitle);
      }
    } else {
      // FIX: Generate both ID and Title when no chatId is provided
      activeChatId = new mongoose.Types.ObjectId();
      chatTitle = await generateChatTitle(message); 
      console.log("New conversation, generated title:", chatTitle);
    }

    // 2. Get AI response
    const botReply = await getGeminiResponse(message || "Analyze this");

    // 3. Save the message
    const savedMessage = await chatSchema.create({
      chatId: activeChatId, 
      userId: userId,
      // If chatTitle is null (existing chat), Mongoose uses the default "New Chat". 
      // To prevent this from cluttering existing chats, we only pass title if it exists.
      ...(chatTitle && { title: chatTitle }), 
      user: encrypt(message), 
      bot: encrypt(botReply),
      type,
      fileUrl: fileUrl || null,
      isConversationHead: !chatId 
    });

    // 4. Response
    res.status(200).json({
      success: true,
      reply: botReply,
      user: message,
      title: chatTitle, // Return title so frontend can update the list
      chatId: activeChatId, 
      messageId: savedMessage._id
    });

  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// Get chat history
export const getHistory = async (req, res) => {
  try {
    const { chatId } = req.params; // or req.query / req.body

    const chats = await chatSchema
      .find({ chatId })   // filter here
      .sort({ createdAt: -1 });

    const result = chats.map((c) => ({
      id: c._id,
      user: decrypt(c.user),
      bot: decrypt(c.bot),
      type: c.type,
      fileUrl: c.fileUrl,
      time: c.createdAt,
    }));

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// getChat History List 

export const getHistoryList = async (req, res) => {
  try {
    const userId = req.user?.id;
console.log(userId);

    // Filter by user and only get the "Head" message of each chat
    const history = await chatSchema.find({ userId, isConversationHead: true })
      .select("chatId title createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};