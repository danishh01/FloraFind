import { apiRequest } from "./client";

export const register = async ({ name, email, password }) => {
  const { token, user } = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  return { token, user };
};

export const login = async ({ email, password }) => {
  const { token, user } = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return { token, user };
};

export const fetchMe = async (token) => {
  const { user } = await apiRequest("/auth/me", { token });
  return user;
};

export default { register, login, fetchMe };
