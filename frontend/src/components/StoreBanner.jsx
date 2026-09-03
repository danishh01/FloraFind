const StoreBanner = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden p-">
      <div className="border-[5px] border-white rounded-3xl overflow-hidden">
        <div className="w-full bg-black px-6 py-10 sm:px-10 md:px-14">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
              FloraFind Store
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
              Quality Plants. Better Value.
            </h1>

            <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
              Bring more nature into your space with carefully selected
              plants and gardening essentials at great prices.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 sm:gap-5">
              <div className="px-5 py-3 ">
                <span className="block text-sm font-medium text-white">
                  Quality Products
                </span>
                <span className="text-xs text-white/50">
                  Carefully selected
                </span>
              </div>

              <div className="px-5 py-3 ">
                <span className="block text-sm font-medium text-white">
                  Great Prices
                </span>
                <span className="text-xs text-white/50">
                  More value, less cost
                </span>
              </div>

              <div className="px-5 py-3">
                <span className="block text-sm font-medium text-white">
                  Fresh & Reliable
                </span>
                <span className="text-xs text-white/50">
                  Made for plant lovers
                </span>
              </div>
            </div>

            <p className="mt-6 text-xs sm:text-sm text-white/40">
              Discover something new for your green space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBanner;