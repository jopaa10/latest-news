import { ReactNode } from "react";

export type AuthBody = {
  name?: string;
  surname?: string;
  email: string;
  password: string;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  token: string | null;
  isLoggedIn: boolean;
  username: string;
  setToken: (token: string | null) => void;
  handleLogout: () => void;
};

export type DecodedToken = {
  exp: number;
  iat: number;
  id: string;
};
