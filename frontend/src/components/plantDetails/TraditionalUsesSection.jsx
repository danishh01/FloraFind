import VoiceButton from "./VoiceButton";
import SourceTag from "./SourceTag";

const TraditionalUsesSection = ({
  t,
  partLabel,
  traditionalUses,
  usesForPart,
  imppatSource,
  speechText,
  activeSpeech,
  onToggleSpeech,
}) => (
  <div className="bg-black border-3 border-white backdrop-blur-md overflow rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
    <div className="flex items-center gap-6 justify-between mb-2">
      <h2 className="text-2xl sm:text-3xl text-white">
        {t("Traditional & Medicinal Uses", "पारंपरिक और औषधीय उपयोग")}
      </h2>
      <VoiceButton text={speechText} speechKey="traditional" activeSpeech={activeSpeech} onToggle={onToggleSpeech} />
    </div>
    <div className="mb-6 p-2">
      <SourceTag source={imppatSource} />
    </div>
    <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
      {traditionalUses.length ? (
        traditionalUses.map((u, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-white capitalize">{partLabel(u.plantPart)}</h3>
            <ul className="mt-1 space-y-1 text-gray-400 list-disc pl-6 text-base">
              {usesForPart(u).map((use, j) => (
                <li key={j}>{use}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="italic text-gray-400">
          {t(
            "Traditional/medicinal use information is currently unavailable.",
            "पारंपरिक और औषधीय उपयोग की जानकारी अभी उपलब्ध नहीं है।"
          )}
        </p>
      )}
    </div>
  </div>
);

export default TraditionalUsesSection;
