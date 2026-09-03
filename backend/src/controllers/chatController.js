import { generateChatReply } from "../services/chatService.js";

const ALLOWED_ROLES = new Set(["user", "assistant"]);
const MAX_MESSAGE_LENGTH = 2000;

export const sendMessage = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      const err = new Error("At least one message is required.");
      err.statusCode = 400;
      throw err;
    }

    for (const message of messages) {
      const content = message?.content;
      if (
        !ALLOWED_ROLES.has(message?.role) ||
        typeof content !== "string" ||
        !content.trim()
      ) {
        const err = new Error("Each message must have a valid role and non-empty content.");
        err.statusCode = 400;
        throw err;
      }
      if (content.length > MAX_MESSAGE_LENGTH) {
        const err = new Error("Message is too long.");
        err.statusCode = 400;
        throw err;
      }
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      const err = new Error("The last message must be from the user.");
      err.statusCode = 400;
      throw err;
    }

    const reply = await generateChatReply(messages);
    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};

export default { sendMessage };
