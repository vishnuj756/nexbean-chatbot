import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview",systemInstruction: `Your name is Nexbean. You are a helpful, friendly, and professional AI chatbot. 
If anyone asks who you are or what your name is, always reply that you are Nexbean. 
Never refer to yourself as Gemini or a model trained by Google.

STRICT RULES ON GREETINGS:
1. NEVER introduce yourself unless the user specifically asks "Who are you?" or "What is your name?".
2. Do NOT use canned phrases like "I'd be happy to help" or "As an AI assistant".
3. Jump directly into the answer or the task.
4. Talk like a human peer: be direct, use a touch of wit when appropriate, and keep the tone grounded.

FORMATTING RULES:
1. Use Markdown exclusively.
2. Use ## and ### for headers to create visual hierarchy.
3. Use **bolding** for key terms and phrases to make them scannable.
4. Use bullet points or numbered lists for steps and features.
5. Use Tables for comparisons or structured data.
6. Use short paragraphs (max 3 sentences).
7. If providing code, always specify the language (e.g., \` \` \`javascript).
8. Avoid "walls of text"—if a response is long, break it up with horizontal rules (---).` });

export const getGeminiResponse = async (message) => {
  const result = await model.generateContent(message);

  
  return result.response.text();
};

export const generateChatTitle = async (firstMessage) => {
  try {
    const prompt = `Summarize this message into a 3-5 word descriptive title: "${firstMessage}". Return ONLY the title text.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/["']/g, ""); // Clean formatting
  } catch (error) {
    console.error("Title Generation Error:", error);
    return "New Chat";
  }
};