import { ShoppingBag } from "lucide-react";

const CustomerForm = ({ formData, handleChange }) => (
  <section className="bg-white border-3 border-black flex flex-col gap-3 rounded-3xl p-7">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-green-600 p-2 rounded-full">
        <ShoppingBag size={20} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-black">Customer Information</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <input
        required
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="checkout-input"
      />
      <input
        required
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="checkout-input"
      />
      <input
        required
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="checkout-input md:col-span-2"
      />
    </div>
  </section>
);

export default CustomerForm;
