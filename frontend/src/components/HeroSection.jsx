import { Store, ScanHeart } from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundSection from "./BackgroundSection";

const HeroSection = () => {
  return (
    <BackgroundSection className="flex flex-col border-[5px] border-white rounded-3xl items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black">
          Bring The <span className="text-green-700">Outside</span> In
        </h1>
        <p className="hero-heading pt-2 text-base sm:text-xl md:text-2xl text-center">From plant discovery to community, your green journey starts here.</p>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full max-w-2xl">
        <Link
          to="/Community"
          className="flex gap-2 items-center justify-center drop-shadow-2xl bg-black transition-all duration-300 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-green-800 w-full sm:w-auto"
        >
          <p>Scan Plants </p> <ScanHeart />
        </Link>
        <Link
          to="/Shop"
          className="flex gap-2 items-center justify-center drop-shadow-2xl bg-white/60 transition-all duration-300 backdrop-blur-md px-6 py-3 rounded-full cursor-pointer hover:bg-white w-full sm:w-auto"
        >
          <p>Explore Shop </p><Store />
        </Link>
      </div>
    </BackgroundSection>
  );
};

export default HeroSection;