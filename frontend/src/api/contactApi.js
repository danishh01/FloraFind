import { apiRequest } from "./client";

export const submitContactMessage = async ({ name, email, message }) => {
  await apiRequest("/contact", {
    method: "POST",
    body: { name, email, message },
  });
};

export default { submitContactMessage };
