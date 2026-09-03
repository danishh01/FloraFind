import { ShoppingBag } from "lucide-react";
import VoiceButton from "./VoiceButton";

const EVIDENCE_LEVEL_STYLES = {
  "Strong evidence": "bg-green-700 text-white",
  "Moderate evidence": "bg-green-600/80 text-white",
  "Limited evidence": "bg-yellow-600/80 text-white",
  "Insufficient evidence": "bg-gray-500/80 text-white",
  Unclear: "bg-gray-500/80 text-white",
};

// Market product TYPES (never brands/links/prices) plus a conservative
// claim-vs-evidence assessment from the AI.
const MarketProductsSection = ({ t, partLabel, evidenceLabel, marketProducts, speechText, activeSpeech, onToggleSpeech }) => (
  <div className="grid grid-cols-1 gap-6 md:gap-8 w-full">
    <div className="bg-black border-3 border-white backdrop-blur-md rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
      <div className="flex flex-wrap items-center gap-4 justify-between mb-6">
        <div className="flex items-center gap-4">
          <ShoppingBag className="text-white" />
          <h2 className="text-2xl sm:text-3xl text-white">{t("Market Products & Evidence", "बाज़ार उत्पाद और प्रमाण")}</h2>
        </div>
        <VoiceButton text={speechText} speechKey="products" activeSpeech={activeSpeech} onToggle={onToggleSpeech} />
      </div>
      {marketProducts.length ? (
        <div className="space-y-6">
          {marketProducts.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white border-3 border-black p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-lg text-black font-semibold break-words">
                  {t(p.productType, p.productType_hi)}
                  {p.plantPart && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      {t(`(from ${p.plantPart})`, `(${partLabel(p.plantPart)} से)`)}
                    </span>
                  )}
                </p>
                <span
                  className={`self-start sm:self-auto shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                    EVIDENCE_LEVEL_STYLES[p.evidenceLevel] || EVIDENCE_LEVEL_STYLES.Unclear
                  }`}
                >
                  {evidenceLabel(p.evidenceLevel)}
                </span>
              </div>
              <p className="mt-3 text-gray-700">{t(p.claim_en, p.claim_hi)}</p>
              <p className="mt-2 text-gray-600 text-sm">{t(p.scientificAssessment_en, p.scientificAssessment_hi)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">
          {t(
            "No market product types are currently available for this plant.",
            "इस पौधे के लिए अभी कोई बाज़ार उत्पाद उपलब्ध नहीं है।"
          )}
        </p>
      )}
    </div>
  </div>
);

export default MarketProductsSection;
