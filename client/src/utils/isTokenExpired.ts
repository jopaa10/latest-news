import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/authTypes";

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
