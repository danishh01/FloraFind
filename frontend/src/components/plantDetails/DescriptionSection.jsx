import VoiceButton from "./VoiceButton";

const DescriptionSection = ({ text, t, activeSpeech, onToggleSpeech }) => (
  <div className="mt-6 rounded-2xl border border-white p-4 sm:p-5">
    <div className="flex items-center justify-between gap-4 mb-3">
      <h2 className="text-2xl sm:text-3xl text-white">{t("Description", "विवरण")}</h2>
      <VoiceButton text={text} speechKey="description" activeSpeech={activeSpeech} onToggle={onToggleSpeech} />
    </div>
    <p className="text-base sm:text-lg text-gray-400">{text}</p>
  </div>
);

export default DescriptionSection;
