import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, X } from "lucide-react";
import { openAuthModal, selectIsAuthenticated } from "../../features/auth/authSlice";
import ChatWindow from "./ChatWindow";

// Global chat button + window, mounted once in AuthBootstrap so it shows on every page.
const Chatbot = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  // Close chat when the user logs out
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isAuthenticated) setIsOpen(false);
  }, [isAuthenticated]);

  const handleToggle = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close FloraFind Assistant" : "Open FloraFind Assistant"}
        className="fixed bottom-5 right-4 sm:right-6 z-[90] flex p-2 bg-green-700 hero-heading font-black items-center justify-center rounded-full text-white shadow-2xl transition hover:bg-green-800 cursor-pointer"
      >
        {isOpen ? <X /> : <p className="flex gap-2 items-center">Ask FloraFind Assistant<MessageCircle size={20}/></p>}
      </button>
    </>
  );
};

export default Chatbot;
