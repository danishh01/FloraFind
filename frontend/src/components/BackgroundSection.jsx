const BackgroundSection = ({ children, className = "" }) => {
  return (
    <section
      className={`min-h-screen w-full bg-cover bg-fixed bg-top bg-no-repeat ${className}`}
      style={{ backgroundImage: "url('/wallpaper.jpeg')" }}
    >
      {children}
    </section>
  );
};

export default BackgroundSection;
