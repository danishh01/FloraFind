import ContactMessage from "../models/ContactMessage.js";

export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      const err = new Error("Name, email and message are all required.");
      err.statusCode = 400;
      throw err;
    }

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.status(201).json({ success: true, message: "Your message has been sent." });
  } catch (err) {
    next(err);
  }
};

export default { submitMessage };
