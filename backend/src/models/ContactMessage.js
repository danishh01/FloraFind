import mongoose from "mongoose";

// Stores messages submitted from the Contact Us page. Nothing reads these
// back yet (no admin inbox view exists) - this just makes sure a real
// submission is actually saved somewhere instead of the form silently doing
// nothing, the same way Identification.js logs scans for later review.
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
