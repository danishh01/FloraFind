import { Leaf } from "lucide-react";

// Generic loading card for any section that isn't Scan Plant (see Loading.jsx,
// which is the Scan Plant-specific full-screen loader and must stay that way).
// Just the card itself - the caller places it inside whatever background/
// navbar that page already renders, so it never double-nests a background.
const SectionLoader = ({ message = "Loading..." }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 sm:gap-8 border-5 border-black bg-white rounded-3xl p-8 sm:p-12 shadow-2xl">
      <Leaf className="w-16 h-16 sm:w-20 sm:h-20 text-green-700 animate-spin" />
      <h2 className="text-2xl sm:text-3xl font-bold text-black hero-heading text-center">
        {message}
      </h2>
    </div>
  );
};

export default SectionLoader;
