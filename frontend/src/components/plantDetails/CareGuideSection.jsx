import VoiceButton from "./VoiceButton";

const CareGuideSection = ({ t, careGuide, speechText, activeSpeech, onToggleSpeech }) => (
  <div className="grid grid-cols-1 gap-6 md:gap-8 w-full">
    <div className="bg-black border-3 border-white backdrop-blur-md rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-4 justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl text-white mb-6">{t("Care Guide", "देखभाल गाइड")}</h2>
        <VoiceButton text={speechText} speechKey="care" activeSpeech={activeSpeech} onToggle={onToggleSpeech} />
      </div>
      <div className="space-y-5 text-base sm:text-lg text-white ">
        <div>
          <span className="font-semibold">{t("Watering:", "सिंचाई:")}</span>{" "}
          {t(careGuide?.watering_en, careGuide?.watering_hi)}
        </div>
        <div>
          <span className="font-semibold">{t("Sunlight:", "धूप:")}</span>{" "}
          {t(careGuide?.sunlight_en, careGuide?.sunlight_hi)}
        </div>
        <div>
          <span className="font-semibold">{t("Soil:", "मिट्टी:")}</span>{" "}
          {t(careGuide?.soil_en, careGuide?.soil_hi)}
        </div>
        <div>
          <span className="font-semibold">{t("Temperature:", "तापमान:")}</span>{" "}
          {t(careGuide?.temperature_en, careGuide?.temperature_hi)}
        </div>
      </div>
    </div>
  </div>
);

export default CareGuideSection;
