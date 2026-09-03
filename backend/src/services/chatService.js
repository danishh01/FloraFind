import axios from "axios";

// Talks to Sarvam's Chat Completions API for the FloraFind Assistant chatbot.
// Kept separate from aiService.js, which has its own detailed prompt for
// generating Plant Details content.

const SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions";

const SYSTEM_INSTRUCTION = `You are "FloraFind Assistant", the friendly in-app chat assistant for FloraFind - a plant identification and plant-shopping app.

You help users with:
- General plant questions (what a plant is, how to care for it, common traditional uses).
- How to use FloraFind: Scan Plant (identify a plant from a photo), Plant Details pages, Shop, Cart, Wishlist, and Orders.
- General questions about the FloraFind app itself.

How to behave:
- Be conversational, warm, and concise. Use simple, everyday language.
- Language: by default, always reply in English. Switch to Hindi ONLY when the user's own latest message is itself written in Hindi (Devanagari script). Never reply in Hindi to an English message, even if earlier turns in the conversation were in Hindi - always match the language of the user's most recent message. When you do reply in Hindi, use natural, conversational Hindi in Devanagari script - translate the actual meaning of a word or phrase, never spell an English word out in Devanagari letters just to avoid translating it (e.g. write "जीवाणुरोधी गुण" for "antibacterial properties", not a transliteration). Common technical English terms may stay in English inline where that reads naturally, exactly like an Indian speaker mixing English into Hindi conversation.
- If you don't know something about FloraFind's specific features, data, or a user's account/order, say so honestly instead of guessing or making it up.
- For medicinal or health-related plant questions: clearly separate traditional/folk use from scientifically established evidence, never claim a plant cures or treats a disease, never give a medical diagnosis or personal medical advice, and suggest consulting a qualified professional for actual health concerns.
- Never fabricate scientific studies, statistics, citations, or facts.
- Keep replies focused and reasonably short unless the user asks for more detail.`;

// Sarvam bills/limits by token count, so only the most recent turns are sent
// - a long-running chat should not grow the request without bound.
const MAX_HISTORY_MESSAGES = 20;

/**
 * Sends the conversation so far (an array of {role, content} turns) to
 * Sarvam and returns the assistant's reply text. Throws with a safe
 * statusCode + message if the provider is not configured or the call fails.
 */
export const generateChatReply = async (messages) => {
  const apiKey = process.env.AI_API_KEY || process.env.SARVAM_API_KEY;
  if (!apiKey) {
    const err = new Error("The chat assistant is not configured on the server.");
    err.statusCode = 503;
    throw err;
  }

  const model = process.env.CHAT_AI_MODEL || "sarvam-105b-conversations";

  let response;
  try {
    response = await axios.post(
      SARVAM_URL,
      {
        model,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...messages.slice(-MAX_HISTORY_MESSAGES),
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
  } catch {
    const wrapped = new Error("The chat assistant is currently unavailable. Please try again.");
    wrapped.statusCode = 502;
    throw wrapped;
  }

  const reply = response.data?.choices?.[0]?.message?.content;
  if (!reply || !reply.trim()) {
    const err = new Error("The chat assistant returned an empty response.");
    err.statusCode = 502;
    throw err;
  }

  return reply.trim();
};

export default { generateChatReply };
