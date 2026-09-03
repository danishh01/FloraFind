import BackgroundSection from './BackgroundSection';
import { Leaf } from 'lucide-react';

const Loading = () => {
    return (
        <BackgroundSection className="border-[5px] border-white min-h-screen rounded-3xl pt-30">
            <div className=" flex items-start justify-center px-4 pt-24 sm:pt-30 pb-8">
                <div className="w-full max-w-md flex flex-col items-center gap-6 sm:gap-8 border-5 border-black bg-white rounded-3xl bg-b p-8 sm:p-12 shadow-2xl ">


                    <Leaf
                        className="w-16 h-16 sm:w-20 sm:h-20 text-green-700 animate-spin"
                    />


                


                    <h2 className="text-2xl sm:text-3xl font-bold text-black hero-heading text-center">
                        Identifying Your Plant..
                    </h2>


                    <p className="text-center text-gray-500">
                        Please wait while FloraFind analyzes your plant.
                    </p>

                </div>
            </div>
        </BackgroundSection>
    );
};

export default Loading;