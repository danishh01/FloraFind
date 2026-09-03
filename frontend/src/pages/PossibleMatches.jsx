import { Link, useLocation, useNavigate } from "react-router-dom";
import BackgroundSection from "../components/BackgroundSection";

// The backend adds one exact-species iNaturalist image when available.
// Keep the placeholder for species without a suitable observation.
const BACKEND_ASSET_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "");
const PLACEHOLDER_IMAGE = `${BACKEND_ASSET_BASE}/assets/plant-fallback.svg`;

const PossibleMatches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matches = location.state?.matches || [];

  const handleSelect = (plant) => {
    const params = new URLSearchParams();
    if (plant.commonName) params.set("commonName", plant.commonName);
    if (plant.family) params.set("family", plant.family);
    const query = params.toString() ? `?${params.toString()}` : "";
    navigate(`/PlantDetails/${encodeURIComponent(plant.scientificName)}${query}`);
  };

  return (
    <BackgroundSection className="flex border-[5px] border-white rounded-3xl items-center justify-center px-4 pt-24 sm:pt-20 pb-8">
      <div className="w-full max-w-5xl flex flex-col gap-3 rounded-3xl border-[5px] border-white bg-black backdrop-blur-md p-5 sm:p-8 md:p-10">

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="hero-heading text-3xl sm:text-4xl font-black text-white">
            Possible Matches
          </h1>

          <p className="hero-heading mt-2 text-base sm:text-lg text-white/80">
            Select the plant that best matches your scanned or uploaded image.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-white/80 text-lg">
              No matches to show. Please scan or upload a plant image first.
            </p>
            <Link
              to="/"
              className="rounded-full bg-white/80 px-6 py-2 font-semibold text-black hover:bg-white"
            >
              Back to Scan Plant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {matches.map((plant) => (
              <div
                key={plant.scientificName}
                onClick={() => handleSelect(plant)}
                className="overflow-hidden rounded-2xl bg-white border-3 border-black transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Plant Image */}
                <div className="h-36 w-full overflow-hidden bg-gray-300">
                  <img
                    src={plant.image || PLACEHOLDER_IMAGE}
                    alt={plant.commonName || plant.scientificName}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>

                {/* Plant Information */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-800">
                      Match Score
                    </p>

                    <p className="text-sm font-bold text-green-800">
                      {plant.score != null ? `${Math.round(plant.score * 100)}%` : "N/A"}
                    </p>
                  </div>

                  <h2 className="mt-3 text-2xl font-bold">
                    {plant.commonName || plant.scientificName}
                  </h2>

                  <p className="mt-1 text-sm italic text-gray-700">
                    {plant.scientificName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </BackgroundSection>
  );
};

export default PossibleMatches;
