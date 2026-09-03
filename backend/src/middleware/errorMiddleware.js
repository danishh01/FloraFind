export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested endpoint does not exist.",
  });
};

// Centralized error handler. Never leaks stack traces, internal messages,
// API keys, or filesystem paths to the client.
//
// Errors thrown intentionally by our own services/controllers set
// `statusCode` and a deliberately safe, user-facing `message` (e.g. "Plant
// identification is not configured on the server"). Those are shown as-is.
// Anything without a statusCode is an unexpected exception, so only a
// generic message is returned and the real error is logged server-side.
export const errorHandler = (err, req, res, _next) => {
  const isKnownError = typeof err.statusCode === "number";
  const statusCode = isKnownError ? err.statusCode : 500;

  if (!isKnownError || statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message: isKnownError
      ? err.message || "Invalid request."
      : "Something went wrong while processing your request.",
  });
};

export default errorHandler;
