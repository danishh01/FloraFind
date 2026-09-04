import { Link } from "react-router-dom";
import { CircleArrowLeft, Languages } from "lucide-react";

const PlantHeader = ({ plant, partial, lang, setLang, languageMenuOpen, setLanguageMenuOpen, stopSpeech, t }) => (
  <div className="mt-4 sm:mt-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="relative flex items-center gap-3 min-w-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white break-words">
          {plant.commonName || plant.scientificName}
        </h1>
        <Languages
          onClick={() => setLanguageMenuOpen((open) => !open)}
          className={`shrink-0 cursor-pointer transition-colors duration-300 ${
            lang === "hi" ? "text-green-500" : "text-white hover:text-green-500"
          }`}
          title="Choose language"
        />
        {languageMenuOpen && (
          <div className="absolute z-10 left-0 top-full mt-2 rounded-xl border border-white bg-black p-2 shadow-xl">
            <button
              onClick={() => { stopSpeech(); setLang("en"); setLanguageMenuOpen(false); }}
              className="block w-full rounded-lg px-4 py-2 text-left text-white hover:bg-green-800"
            >
              English
            </button>
            <button
              onClick={() => { stopSpeech(); setLang("hi"); setLanguageMenuOpen(false); }}
              className="block w-full rounded-lg px-4 py-2 text-left text-white hover:bg-green-800"
            >
              Hindi
            </button>
          </div>
        )}
      </div>
      <Link
        to="/ScanPlant"
        className="flex items-center self-start sm:self-auto shrink-0 border border-white rounded-3xl p-1 gap-2 text-white hover:text-green-800 cursor-pointer transition-colors duration-300 text-sm sm:text-base"
      >
        <CircleArrowLeft />
        Back to Scan Plant
      </Link>
    </div>
    {plant.scientificName && (
      <p className="mt-2 text-lg sm:text-xl italic text-gray-300 break-words">{plant.scientificName}</p>
    )}
    {partial && (
      <p className="mt-2 text-sm text-gray-500">
        {t(
          "Some information sources are temporarily unavailable.",
          "कुछ जानकारी स्रोत अभी अस्थायी रूप से उपलब्ध नहीं हैं।"
        )}
      </p>
    )}
  </div>
);

export default PlantHeader;
