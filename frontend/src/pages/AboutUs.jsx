import BackgroundSection from "../components/BackgroundSection";

const AboutUs = () => {
  return (
    <BackgroundSection className="flex items-start justify-center px-4 pt-24 sm:pt-30 pb-8 border-[5px] border-white rounded-3xl">
      <div className="w-full max-w-[1450px] flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 rounded-3xl bg-white p-6 sm:p-8 md:p-12 shadow-2xl backdrop-blur-md">
        <div className="flex-[3] space-y-5 hero-heading">
          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-center md:text-left">
            About <span className="text-green-700">FloraFind</span>
          </h1>

          <p className="text-base sm:text-lg font-semibold leading-7 sm:leading-8">
            At FloraFind, we believe that every plant has a story, and
            discovering that story should be simple, accurate, and enjoyable.
            Our mission is to make plant identification and plant care
            accessible to everyone, whether you're a beginner, a gardening
            enthusiast, or an experienced plant lover.
          </p>

          <p className="text-base sm:text-lg font-semibold leading-7 sm:leading-8">
            Using AI-powered image recognition, FloraFind helps you identify
            plants in seconds. Simply upload a photo, and you'll receive
            detailed information about the plant, including its description,
            benefits, and care guide.
          </p>

          <p className="text-base sm:text-lg font-semibold leading-7 sm:leading-8">
            Beyond identification, FloraFind is growing into a community-driven
            platform where plant lovers can connect, share knowledge, discover
            new species, and explore a curated marketplace for healthy plants
            and gardening essentials.
          </p>

          <p className="text-lg sm:text-xl font-semibold text-green-700 text-center md:text-left">
            FloraFind — Discover, Learn, Grow.
          </p>
        </div>
        <div className="flex-[1] flex justify-center shrink-0">
        <div className="w-[140px] sm:w-[170px] md:w-[200px] rounded-full bg-green-700 p-2">
          <img
            src="/plantAboutUs.png"
            alt="Plant"
            className="w-full object-contain"
          />
        </div>
      </div>
      </div>
    </BackgroundSection>
  );
};

export default AboutUs;