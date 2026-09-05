import ImageKit from "@imagekit/nodejs";

// Re-hosts one real iNaturalist photo on ImageKit (by URL - ImageKit fetches
// it itself, we just get a URL back) so later visitors load a smaller,
// ImageKit-served copy instead of hitting iNaturalist's server every time.
// The "?tr=..." appended below is what actually resizes/compresses it, on
// every load, no separate step needed.
//
// Not involved in Scan Plant uploads at all - those stay Multer memory
// storage -> PlantNet -> discarded, same as before ImageKit existed.

// w-800 caps the size; q-80 keeps real leaf detail visible instead of
// chasing max compression; f-auto lets ImageKit hand out WebP/AVIF to
// browsers that support it. c-at_max matters more than it looks - without
// it, iNaturalist's own "medium" photos (often already under 800px) get
// UPSCALED to 800px instead of left alone, which made a real test image
// bigger, not smaller. c-at_max just means "shrink to fit, never enlarge".
const IMAGE_TRANSFORMATION = "tr=w-800,c-at_max,q-80,f-auto";

/**
 * Uploads one iNaturalist photo (by URL) to ImageKit. Same degrade-quietly
 * approach as the rest of this file's neighbors (imppatService,
 * iNaturalistService): returns null on any failure instead of throwing, so
 * the caller just falls back to the original iNaturalist URL for that image.
 */
export const uploadPlantImage = async (imageUrl, fileName) => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    // ImageKit isn't configured - this is expected until real credentials
    // are added, and is not an error worth logging on every request.
    return null;
  }

  try {
    const imagekit = new ImageKit({ privateKey });
    const result = await imagekit.files.upload({
      file: imageUrl,
      fileName,
    });
    return result.url ? `${result.url}?${IMAGE_TRANSFORMATION}` : null;
  } catch (error) {
    console.warn(`[imagekitService] Upload failed for ${imageUrl}: ${error.message}`);
    return null;
  }
};

export default { uploadPlantImage };
