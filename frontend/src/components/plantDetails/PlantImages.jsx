const PlantImages = ({ images, fallbackImages, alt }) => (
  <div className="mt-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="aspect-[4/3] w-full rounded-2xl bg-gray-300 flex items-center justify-center text-gray-600 text-xl overflow-hidden"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-2xl"
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

export default PlantImages;
