import { Link } from 'react-router-dom'
import { CircleChevronDown } from "lucide-react";
import StoreBackground from './StoreBackground';
const StoreHeroSection = () => {
  return (
    <StoreBackground className='min-h-screen'>
      

    <div className='flex flex-col items-center justify-center pt-24 sm:pt-[60px] gap-5 min-h-screen px-4 sm:px-6 md:px-10'>
        <div className='flex flex-col md:flex-row px-2 gap-5 md:gap-5 items-center justify-center w-full'>
        <div className='w-full md:w-1/2 text-center md:text-left'>

         <h1 className="hero-heading text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[150px] font-black leading-none ">
          Grow<p>with</p> <span className="text-green-700">Flora</span>Find<span className="text-green-700">.</span>
         </h1>
        </div>

        <div className='flex justify-center w-full md:w-1/2'>
             <Link to="/Shop/ProductsListing">
               <div className='border-3 border-green-700 rounded-3xl cursor-pointer p-4 sm:p-5 transform hover:scale-105 transition-transform duration-300'>
                 <h1 className='text-white hero-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center'>Browse All Products</h1>
               </div>
             </Link>
        </div>
        </div>
        <p className=" hero-heading text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center ">Explore a thoughtfully curated collection of healthy plants, premium seeds, decorative pots, fertilizers, gardening tools, and accessories. Whether you're starting your first plant or growing a full garden, FloraFind has everything you need in one place.</p>

    </div>
    <CircleChevronDown className="absolute bottom-1 animate-bounce left-1/2 transform -translate-x-1/2 text-white" />
    </StoreBackground>
  )
}

export default StoreHeroSection