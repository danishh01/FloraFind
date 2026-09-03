import { apiRequest } from "./client";

// messages is the running conversation as [{role: "user"|"assistant", content}]
// - the backend's /api/chat re-sends this whole list to Sarvam on every call
// since chat history isn't persisted server-side.
export const sendChatMessage = async (messages, token) => {
  const { reply } = await apiRequest("/chat", {
    method: "POST",
    body: { messages },
    token,
  });
  return reply;
};

export default { sendChatMessage };
