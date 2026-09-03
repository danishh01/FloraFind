import multer from "multer";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
]);

const maxSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB) || 8;

// Memory storage only - the image buffer is forwarded to PlantNet and then
// discarded. It is never written to disk, so there is nothing to clean up
// and no filesystem path is ever exposed to the frontend.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error(
      "Unsupported image format. PlantNet accepts only JPG or PNG images."
    );
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSizeMb * 1024 * 1024,
    files: 1,
  },
}).single("image");

// Wraps multer so its errors flow into the shared error middleware with a
// consistent, safe response shape instead of leaking multer's raw error.
export const handleUpload = (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: `Image is too large. Maximum size is ${maxSizeMb}MB.`,
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res
        .status(err.statusCode || 400)
        .json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file was provided." });
    }
    next();
  });
};

export default handleUpload;
