// src/auth/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // <-- named import

export const useAuth = () => {
  return useContext(AuthContext);
};
