import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-6 sm:px-10 md:px-[50px] py-10 md:h-64 bg-white text-center md:text-left">
        <div>
          <img src="/logo.png" alt="FloraFind Logo" className="w-[200px] sm:w-[280px] md:w-[400px] object-contain" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="hero-heading text-3xl sm:text-4xl md:text-6xl">Get <span className="text-green-700">i</span>n Touch</h1>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 pt-6 md:pt-10">
            <Link to="https://www.instagram.com/" target="_blank"><img src="/instagram.png" alt="Instagram" className="w-7 sm:w-8 cursor-pointer" /></Link>
            <Link to="https://www.linkedin.com/in/" target="_blank"><img src="/linkedin.png" alt="LinkedIn" className="w-7 sm:w-8 cursor-pointer" /></Link>
            <Link to="https://www.facebook.com/" target="_blank"><img src="/social.png" alt="Social" className="w-7 sm:w-8 cursor-pointer" /></Link>
            <Link to="https://www.twitter.com/" target="_blank"><img src="/twitter.png" alt="Twitter" className="w-7 sm:w-8 cursor-pointer" /></Link>
          </div>
        </div>
        
      </div>
      <p className="hero-heading text-[15px] font-black text-center p-2 border-t border-green-700">Copyright ©2026 All rights Reserved FloraFind</p>
    </div>
  )
}
export default Footer
