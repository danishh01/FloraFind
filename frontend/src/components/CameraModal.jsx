// Full-screen camera capture UI shown while scanning a plant with the device camera.
const CameraModal = ({ cameraError, videoRef, closeCamera, handleUpload, capturePhoto }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
    <div className="w-full max-w-xl rounded-3xl border-3 border-white bg-black p-4 sm:p-6 text-white shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold">Scan Plant</h2>
      {cameraError ? (
        <p className="mt-4 text-gray-300">{cameraError}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="mt-4 aspect-video w-full rounded-2xl bg-gray-900 object-cover"
        />
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button onClick={closeCamera} className="rounded-full border border-white px-5 py-2 hover:text-green-500">
          Cancel
        </button>
        <button onClick={handleUpload} className="rounded-full bg-white px-5 py-2 text-black hover:bg-green-200">
          Upload Image
        </button>
        {!cameraError && (
          <button onClick={capturePhoto} className="rounded-full bg-green-700 px-5 py-2 text-white hover:bg-green-600">
            Capture
          </button>
        )}
      </div>
    </div>
  </div>
);

export default CameraModal;
