import { useState } from "react";

// Plant photos (from iNaturalist, possibly re-hosted on ImageKit) can take a
// moment to load since they're not local assets. `loaded` just tracks which
// of the (at most 3) images have finished loading, so each one can fade in
// instead of popping in abruptly - the gray background box already used for
// the wrapper doubles as the "still loading" placeholder, with a simple
// pulse animation while it waits.
const PlantImages = ({ images, fallbackImages, alt }) => {
  const [loaded, setLoaded] = useState({});

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className={`aspect-[4/3] w-full rounded-2xl bg-gray-300 flex items-center justify-center text-gray-600 text-xl overflow-hidden ${
              loaded[i] ? "" : "animate-pulse"
            }`}
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
                loaded[i] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImages[i % fallbackImages.length];
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantImages;
