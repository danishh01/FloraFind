import { MapPin } from "lucide-react";

const AddressForm = ({ formData, handleChange }) => (
  <section className="bg-white border-3 border-black flex flex-col gap-3 rounded-3xl p-7">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-green-600 p-2 rounded-full">
        <MapPin size={20} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-black">Delivery Address</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <input
        required
        type="text"
        name="house"
        value={formData.house}
        onChange={handleChange}
        placeholder="House / Flat No."
        className="checkout-input"
      />
      <input
        required
        type="text"
        name="street"
        value={formData.street}
        onChange={handleChange}
        placeholder="Street / Area"
        className="checkout-input"
      />
      <input
        required
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        className="checkout-input"
      />
      <input
        required
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        className="checkout-input"
      />
      <input
        required
        type="text"
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        maxLength="6"
        className="checkout-input"
      />
    </div>
  </section>
);

export default AddressForm;
