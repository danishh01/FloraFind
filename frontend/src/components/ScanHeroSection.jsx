import { Scan, Image, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import BackgroundSection from "./BackgroundSection";
import Loading from "./Loading";
import CameraModal from "./CameraModal";
import { identifyPlant } from "../api/plantApi";
import { ApiError } from "../api/client";

const ScanHeroSection = () => {
  const [plantName, setPlantName] = useState("");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const navigate = useNavigate();

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const identifyAndNavigate = async (file) => {
    setIsLoading(true);
    try {
      const matches = await identifyPlant(file);
      navigate("/PossibleMatches", { state: { matches } });
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : "Something went wrong while identifying the plant."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is unavailable on this device. Please upload an image instead.");
      setCameraOpen(true);
      return;
    }

    setCameraError("");
    setCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setCameraError("Camera permission was denied or the camera is unavailable. Please upload an image instead.");
      });
  };
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError("");
  };
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        closeCamera();
        identifyAndNavigate(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }));
      }
    }, "image/jpeg", 0.9);
  };
  const handleUpload = () => {
    if (cameraOpen) closeCamera();
    fileInputRef.current.click();
  };
  const handleSearch = () => {
    if (!plantName.trim()) {
      alert("Please enter a plant name");
      return;
    }
    navigate(`/PlantDetails/${encodeURIComponent(plantName.trim())}`);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    e.target.value = "";
    identifyAndNavigate(file);
  };
  return (
    <BackgroundSection className="flex flex-col border-[5px] border-white rounded-3xl items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black">
          Uncover the <span className="text-green-700">Secrets</span> of{" "}
          <span className="text-green-700">Plants</span>
        </h1>
        <p className="hero-heading pt-2 text-base sm:text-xl md:text-2xl text-center">
          Identify plants easily and explore characteristics, medicinal uses,
          and care.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full max-w-2xl">
        <button
          onClick={handleScan}
          className="flex gap-2 items-center justify-center drop-shadow-2xl bg-black transition-all duration-300 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-green-800 w-full sm:w-auto"
        >
          <h3>Scan Plant</h3>
          <Scan />
        </button>
        <button
          onClick={handleUpload}
          className="flex gap-2 items-center justify-center drop-shadow-2xl bg-white/60 transition-all duration-300 backdrop-blur-md px-6 py-3 rounded-full cursor-pointer hover:bg-white w-full sm:w-auto"
        >
          <p>Upload Image</p>
          <Image />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
        <div className="flex gap-2 drop-shadow-2xl bg-white/60 transition-all duration-300 backdrop-blur-md px-4 py-2 rounded-full cursor-pointer w-full sm:w-auto">
          <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter Plant Name"
              className="flex-1 min-w-0 w-full sm:w-48 p-2 rounded-3xl border transition-all duration-300 hover:bg-white"
            />
            <button
              onClick={handleSearch}
              className="shrink-0 transition-all duration-300 hover:text-green-800 cursor-pointer"
            >
               <Search />
            </button>
        </div>
      </div>
      {cameraOpen && (
        <CameraModal
          cameraError={cameraError}
          videoRef={videoRef}
          closeCamera={closeCamera}
          handleUpload={handleUpload}
          capturePhoto={capturePhoto}
        />
      )}
    </BackgroundSection>
  );
};

export default ScanHeroSection;
