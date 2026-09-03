import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Send, X } from "lucide-react";
import chatApi from "../../api/chatApi";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm the FloraFind Assistant. Ask me about plants, or how to use Scan Plant, Shop, Cart, Wishlist, or Orders.",
};

// Unmounts when closed, so messages reset each time the chat reopens.
const ChatWindow = ({ onClose }) => {
  const token = useSelector((state) => state.auth.token);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const reply = await chatApi.sendChatMessage(nextMessages, token);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-[95] bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 w-auto max-h-[75vh] sm:max-h-[600px] flex flex-col rounded-3xl border-3 border-white bg-black shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="hero-heading text-xl font-bold text-white">FloraFind Assistant</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="text-white/70 hover:text-green-500 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-green-600 px-4 py-2 text-sm text-white whitespace-pre-wrap"
                : "self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2 text-sm text-white whitespace-pre-wrap"
            }
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="self-start flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2 text-sm text-white/70">
            Typing...
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/10 p-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about plants, Scan, Shop..."
          disabled={isLoading}
          className="checkout-input flex-1"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
