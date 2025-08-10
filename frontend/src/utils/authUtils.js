// src/utils/authUtils.js
import {jwtDecode} from "jwt-decode";

export function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded?.id || decoded?.userId || decoded?.sub || null;
  } catch {
    return null;
  }
}
