const StoreBackground = ({ children, className = "" }) => {
  return (
    <section
      className={` w-full bg-cover border-[5px] border-white rounded-3xl bg-fixed bg-top bg-no-repeat ${className}`}
      style={{ backgroundImage: "url('/scanBackground.webp')" }}
    >
      {children}
    </section>
  );
};

export default StoreBackground;