import { Volume2 } from "lucide-react";

const VoiceButton = ({ text, speechKey, activeSpeech, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(text, speechKey)}
    className={`shrink-0 -m-2 rounded-full p-2 cursor-pointer transition-colors duration-300 hover:text-green-500 ${
      activeSpeech === speechKey ? "text-green-500" : "text-white"
    }`}
    title={activeSpeech === speechKey ? "Stop speaking" : "Play explanation"}
    aria-label={activeSpeech === speechKey ? "Stop speaking" : "Play explanation"}
  >
    <Volume2 />
  </button>
);

export default VoiceButton;
