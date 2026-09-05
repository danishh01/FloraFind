import { useState } from 'react';
import { Phone, MapPin, Send } from 'lucide-react';
import BackgroundSection from '../components/BackgroundSection'
import contactApi from '../api/contactApi';
import { ApiError } from '../api/client';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await contactApi.submitContactMessage(formData);
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    }
  };

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
          {status === "sent" ? (
            <p className="text-green-100 font-semibold">
              Thanks! Your message has been sent - we'll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                required
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg p-3 text-black bg-white/60"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="mb-4 w-full rounded-lg p-3 text-black bg-white/60"
              />
              <textarea
                required
                rows="5"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="mb-6 w-full rounded-lg p-3 text-black bg-white/60"
              ></textarea>
              {error && <p className="mb-4 text-red-200 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-lg bg-white py-3 font-semibold text-green-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </BackgroundSection>
  )
}

export default ContactUs
