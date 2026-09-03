import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import BackgroundSection from "../components/BackgroundSection.jsx";
import SectionLoader from "../components/SectionLoader.jsx";
import { CircleArrowLeft } from "lucide-react";
import { getPlantDetails } from "../api/plantApi";
import { ApiError } from "../api/client";
import PlantHeader from "../components/plantDetails/PlantHeader.jsx";
import PlantImages from "../components/plantDetails/PlantImages.jsx";
import DescriptionSection from "../components/plantDetails/DescriptionSection.jsx";
import TraditionalUsesSection from "../components/plantDetails/TraditionalUsesSection.jsx";
import CareGuideSection from "../components/plantDetails/CareGuideSection.jsx";
import MarketProductsSection from "../components/plantDetails/MarketProductsSection.jsx";

const BACKEND_ASSET_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "");
const FALLBACK_IMAGE = `${BACKEND_ASSET_BASE}/assets/plant-fallback.svg`;
const FALLBACK_IMAGES = [FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE];

const EVIDENCE_LEVEL_HI = {
  "Strong evidence": "मजबूत प्रमाण",
  "Moderate evidence": "मध्यम स्तर के प्रमाण",
  "Limited evidence": "सीमित प्रमाण",
  "Insufficient evidence": "पर्याप्त प्रमाण नहीं",
  Unclear: "स्पष्ट नहीं",
};

// IMPPAT's plant-part vocabulary is small and fixed, so it's translated
// here directly rather than round-tripped through the AI.
const PLANT_PART_HI = {
  leaf: "पत्तियाँ",
  leaves: "पत्तियाँ",
  root: "जड़",
  roots: "जड़ें",
  bark: "छाल",
  flower: "फूल",
  flowers: "फूल",
  fruit: "फल",
  fruits: "फल",
  seed: "बीज",
  seeds: "बीज",
  stem: "तना",
  shoot: "नई शाखा/अंकुर",
  rhizome: "भूमिगत तना (राइज़ोम)",
  "whole plant": "पूरा पौधा",
  "aerial part": "पौधे का ज़मीन के ऊपर वाला भाग",
  "apical part": "पौधे का शीर्ष भाग",
  "plant cells/culture": "पौधे की कोशिकाएँ/कल्चर",
  "plant exudate": "पौधे से निकलने वाला रस",
  tuber: "कंद",
  gum: "गोंद",
  resin: "राल",
  latex: "दूधिया रस",
  oil: "तेल",
  wood: "लकड़ी",
};

// Does the actual fetching/rendering for one plant. Mounted fresh (via
// `key={plantName}` below) every time the route param changes, so its
// state naturally resets instead of needing synchronous setState calls
// inside the effect.
const PlantDetailsView = ({ plantName, hints }) => {
  const [plant, setPlant] = useState(null);
  const [partial, setPartial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState(null);
  const utteranceRef = useRef(null);

  const stopSpeech = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setActiveSpeech(null);
  };

  const toggleSpeech = (text, speechKey) => {
    if (!text || !("speechSynthesis" in window)) return;
    if (activeSpeech === speechKey) {
      stopSpeech();
      return;
    }
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setActiveSpeech(null);
      }
    };
    utterance.onerror = utterance.onend;
    utteranceRef.current = utterance;
    setActiveSpeech(speechKey);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    let cancelled = false;

    getPlantDetails(plantName, hints)
      .then(({ plant, partial }) => {
        if (cancelled) return;
        setPlant(plant);
        setPartial(partial);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to retrieve plant information."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <BackgroundSection className="border-[5px] border-white min-h-screen rounded-3xl">
        <section className="flex min-h-screen items-center justify-center px-4 pt-10">
          <SectionLoader message="Loading plant details..." />
        </section>
      </BackgroundSection>
    );
  }

  const t = (en, hi) => {
    if (lang === "hi") return hi || en || "जानकारी उपलब्ध नहीं है";
    return en || "Information unavailable";
  };
  const partLabel = (part) =>
    lang === "hi" ? PLANT_PART_HI[(part || "").toLowerCase()] || part : part;
  const evidenceLabel = (level) =>
    lang === "hi" ? EVIDENCE_LEVEL_HI[level] || EVIDENCE_LEVEL_HI.Unclear : level || "Unclear";

  if (error || !plant) {
    return (
      <BackgroundSection className="border-[5px] border-white min-h-screen rounded-3xl">
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 sm:px-10 pt-10">
          <div className="w-full max-w-xl rounded-3xl border-3 border-white bg-black p-6 sm:p-10 text-center shadow-xl backdrop-blur-md">
            <h1 className="hero-heading text-2xl sm:text-3xl font-black text-white">
              Plant Not Found
            </h1>
            <p className="mt-4 text-gray-400">
              {error || "Unable to retrieve plant information."}
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-3xl border border-white p-2 px-4 text-white transition-colors duration-300 hover:text-green-500"
            >
              <CircleArrowLeft />
              Back to Scan Plant
            </Link>
          </div>
        </section>
      </BackgroundSection>
    );
  }

  const images = plant.images?.length ? plant.images : FALLBACK_IMAGES;
  const traditionalUses = plant.traditionalMedicinalUses || [];
  const marketProducts = plant.marketProducts || [];
  const sources = plant.sources || [];
  const imppatSource = sources.find((s) => s.name === "IMPPAT");

  // Each IMPPAT-derived use term is translated individually, so a Hindi
  // array is only trustworthy when it has a translation for every English
  // term - otherwise fall back to the real English terms rather than show
  // a partial/misaligned list.
  const usesForPart = (u) =>
    lang === "hi" && u.uses_hi?.length === u.uses_en?.length && u.uses_hi.length
      ? u.uses_hi
      : u.uses_en || [];

  const descriptionText = t(plant.generalInfo?.description_en, plant.generalInfo?.description_hi);
  const traditionalUsesSpeech = traditionalUses
    .map((u) => `${partLabel(u.plantPart)}: ${usesForPart(u).join(", ")}`)
    .join(". ");
  const careGuideSpeech = [
    [t("Watering", "सिंचाई"), plant.careGuide?.watering_en, plant.careGuide?.watering_hi],
    [t("Sunlight", "धूप"), plant.careGuide?.sunlight_en, plant.careGuide?.sunlight_hi],
    [t("Soil", "मिट्टी"), plant.careGuide?.soil_en, plant.careGuide?.soil_hi],
    [t("Temperature", "तापमान"), plant.careGuide?.temperature_en, plant.careGuide?.temperature_hi],
  ]
    .map(([label, en, hi]) => `${label}: ${t(en, hi)}`)
    .join(". ");
  const marketProductsSpeech = marketProducts
    .map(
      (p) =>
        `${t(p.productType, p.productType_hi)}. ${t(p.claim_en, p.claim_hi)}. ${t(
          p.scientificAssessment_en,
          p.scientificAssessment_hi
        )}`
    )
    .join(". ");

  return (
    <BackgroundSection className="border-[5px] border-white min-h-screen rounded-3xl ">
      <section className="items-center px-4 sm:px-6 md:px-10 pt-8 sm:pt-10 flex flex-col gap-8 sm:gap-12 pb-8">
        <div className="w-full max-w-7xl hero-heading font-black mx-auto flex items-center flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            <div className="bg-black border-3 border-white flex-col backdrop-blur-md flex gap-3 rounded-3xl p-5 sm:p-6 shadow-xl">
              <PlantHeader
                plant={plant}
                partial={partial}
                lang={lang}
                setLang={setLang}
                languageMenuOpen={languageMenuOpen}
                setLanguageMenuOpen={setLanguageMenuOpen}
                stopSpeech={stopSpeech}
                t={t}
              />
              <PlantImages
                images={images}
                fallbackImages={FALLBACK_IMAGES}
                alt={plant.commonName || plant.scientificName}
              />
              <DescriptionSection
                text={descriptionText}
                t={t}
                activeSpeech={activeSpeech}
                onToggleSpeech={toggleSpeech}
              />
            </div>

            <TraditionalUsesSection
              t={t}
              partLabel={partLabel}
              traditionalUses={traditionalUses}
              usesForPart={usesForPart}
              imppatSource={imppatSource}
              speechText={traditionalUsesSpeech}
              activeSpeech={activeSpeech}
              onToggleSpeech={toggleSpeech}
            />
          </div>

          <CareGuideSection
            t={t}
            careGuide={plant.careGuide}
            speechText={careGuideSpeech}
            activeSpeech={activeSpeech}
            onToggleSpeech={toggleSpeech}
          />

          <MarketProductsSection
            t={t}
            partLabel={partLabel}
            evidenceLabel={evidenceLabel}
            marketProducts={marketProducts}
            speechText={marketProductsSpeech}
            activeSpeech={activeSpeech}
            onToggleSpeech={toggleSpeech}
          />
        </div>
      </section>
    </BackgroundSection>
  );
};

const PlantDetails = () => {
  const { plantName } = useParams();
  const [searchParams] = useSearchParams();

  const hints = {
    commonName: searchParams.get("commonName") || undefined,
    family: searchParams.get("family") || undefined,
  };

  return <PlantDetailsView key={plantName} plantName={plantName} hints={hints} />;
};

export default PlantDetails;
