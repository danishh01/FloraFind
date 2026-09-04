import { CreditCard } from "lucide-react";

// Razorpay's own Checkout popup already lets the user choose UPI, Card or
// Net Banking inside it - so from FloraFind's side there's just one real
// "online payment" method (razorpay) plus Cash on Delivery.
const PAYMENT_METHODS = [
  ["cod", "Cash on Delivery"],
  ["razorpay", "Online Payment (Razorpay - Test Mode)"],
];

const PaymentOptions = ({ paymentMethod, setPaymentMethod }) => (
  <section className="bg-white border-3 border-black flex flex-col gap-3 rounded-3xl p-7">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-green-600 p-2 rounded-full">
        <CreditCard size={20} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-black">Payment Method</h2>
    </div>

    <div className="flex flex-col gap-3">
      {PAYMENT_METHODS.map(([value, label]) => (
        <label
          key={value}
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
            paymentMethod === value ? "border-green-500 bg-green-500/20" : "border-black"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={value}
            checked={paymentMethod === value}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="text-black font-semibold">{label}</span>
        </label>
      ))}
    </div>
  </section>
);

export default PaymentOptions;
