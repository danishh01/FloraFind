import StoreBackground from './StoreBackground'
import { Link } from 'react-router-dom'

const Category = () => {
  return (
    <StoreBackground className="min-h-[400px] w-full bg-cover bg-center bg-no-repeat">
    <div className='py-10 px-4 sm:px-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 items-center text-white justify-center gap-3 sm:gap-4'>
        <Link to="/Shop/ProductsListing/indoor">
            <div className='flex flex-col items-center justify-center gap-2 sm:gap-4 hero-heading text-base sm:text-xl md:text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-300 px-3 sm:px-6 md:px-10 py-3 sm:py-5 rounded-3xl'>
                <img src="/indoor.png" alt="Category" className='w-[120px] sm:w-[180px] md:w-[250px] rounded-3xl'/>
                <h2>Indoor Plants</h2>
            </div>
        </Link>
        <Link to="/Shop/ProductsListing/outdoor">
            <div className='flex flex-col items-center justify-center gap-2 sm:gap-4 hero-heading text-base sm:text-xl md:text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-300 px-3 sm:px-6 md:px-10 py-3 sm:py-5 rounded-3xl'>
                <img src="/outdoor.png" alt="Category" className='w-[120px] sm:w-[180px] md:w-[250px] rounded-3xl'/>
                <h2>Outdoor Plants</h2>
            </div>
        </Link>
        <Link to="/Shop/ProductsListing/seeds-fertilizers">
            <div className='flex flex-col items-center justify-center gap-2 sm:gap-4 hero-heading text-base sm:text-xl md:text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-300 px-3 sm:px-6 md:px-10 py-3 sm:py-5 rounded-3xl'>
                <img src="/seedsandfertilizers.png" alt="Category" className='w-[120px] sm:w-[180px] md:w-[250px] rounded-3xl'/>
                <h2>Seeds and Fertilizers</h2>
            </div>
        </Link>
        <Link to="/Shop/ProductsListing/pots-accessories">
            <div className='flex flex-col items-center justify-center gap-2 sm:gap-4 hero-heading text-base sm:text-xl md:text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-300 px-3 sm:px-6 md:px-10 py-3 sm:py-5 rounded-3xl'>
                <img src="/potsandacc.png" alt="Category" className='w-[120px] sm:w-[180px] md:w-[250px] rounded-3xl'/>
                <h2>Pots and Accessories</h2>
            </div>
        </Link>
        </div>
    </div>
    </StoreBackground>
  )
}

export default Category