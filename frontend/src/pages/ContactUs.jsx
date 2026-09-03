import { Phone, MapPin, Send } from 'lucide-react';
import BackgroundSection from '../components/BackgroundSection'

const ContactUs = () => {
  return (
    <BackgroundSection className="flex items-center justify-center px-4 pt-24 sm:pt-8 pb-8 border-[5px] border-white rounded-3xl">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-white hero-heading backdrop-blur-md p-6 sm:p-10">
          <h1 className="hero-heading text-4xl sm:text-5xl mb-8">
            Contact <span className="text-green-700">Us</span>
          </h1>

          <div className="space-y-8 pt-8 items-center justify-center">
            <div className="flex py-4 items-center gap-4">
              <Phone className="text-green-700 shrink-0" size={30} />
              <div>
                <h3 className="font-semibold text-xl">Call Us</h3>
                <p className="font-montenegrin">+91 9876543210</p>
              </div>
            </div>

            <div className="flex py-4 items-center gap-4">
              <MapPin className="text-green-700 shrink-0" size={30} />
              <div>
                <h3 className="font-semibold text-xl">Location</h3>
                <p>Delhi, India</p>
              </div>
            </div>

            <div className="flex py-4 items-center gap-4">
              <Send className="text-green-700 shrink-0" size={30} />
              <div>
                <h3 className="font-semibold text-xl">Social Media</h3>
                <div className="flex gap-4 pt-2">
                  <img src="/instagram.png" alt="Instagram" className="w-8" />
                  <img src="/linkedin.png" alt="LinkedIn" className="w-8" />
                  <img src="/social.png" alt="Social" className="w-8" />
                  <img src="/twitter.png" alt="Twitter" className="w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-green-800 p-6 sm:p-10 text-white flex flex-col justify-center">
          <h2 className="hero-heading text-3xl sm:text-4xl mb-8">Send us a Message</h2>
          <input type="text" placeholder="Your Name" className="mb-4 rounded-lg p-3 text-black bg-white/60" />
          <input type="email" placeholder="Your Email" className="mb-4 rounded-lg p-3 text-black bg-white/60" />
          <textarea rows="5" placeholder="Your Message" className="mb-6 rounded-lg p-3 text-black bg-white/60"></textarea>
          <button className="rounded-lg bg-white py-3 font-semibold text-green-700 hover:bg-gray-100">
            Send Message
          </button>
        </div>
      </div>
    </BackgroundSection>
  )
}

export default ContactUs
