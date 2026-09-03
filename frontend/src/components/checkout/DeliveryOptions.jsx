import { Truck } from "lucide-react";

const DeliveryOptions = ({ deliveryMethod, setDeliveryMethod }) => (
  <section className="bg-white border-3 border-black flex flex-col gap-3 rounded-3xl p-7">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-green-600 p-2 rounded-full">
        <Truck size={20} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-black">Delivery Method</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <label
        className={`cursor-pointer rounded-2xl border p-5 transition ${
          deliveryMethod === "standard" ? "border-green-500 bg-green-500/20" : "border-black bg-white"
        }`}
      >
        <input
          type="radio"
          name="delivery"
          value="standard"
          checked={deliveryMethod === "standard"}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          className="hidden"
        />
        <div className="text-black">
          <h3 className="font-bold text-lg">Standard Delivery</h3>
          <p className="text-gray-600 mt-1">
            <span className="font-montenegrin">3–5</span> business days
          </p>
          <p className="text-green-600 font-semibold mt-2">FREE</p>
        </div>
      </label>

      <label
        className={`cursor-pointer rounded-2xl border p-5 transition ${
          deliveryMethod === "express" ? "border-green-500 bg-green-500/20" : "border-black bg-white"
        }`}
      >
        <input
          type="radio"
          name="delivery"
          value="express"
          checked={deliveryMethod === "express"}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          className="hidden"
        />
        <div className="text-black">
          <h3 className="font-bold text-lg">Express Delivery</h3>
          <p className="text-gray-600 mt-1">
            <span className="font-montenegrin">3–5</span> business days
          </p>
          <p className="text-green-600 font-semibold mt-2">
            <span className="font-montenegrin">₹99</span>
          </p>
        </div>
      </label>
    </div>
  </section>
);

export default DeliveryOptions;
