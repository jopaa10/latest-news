import { ReactNode } from "react";

export type ButtonProps = {
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  ariaLabel: string;
  children: ReactNode;
  cls?: string;
  type?: "reset" | "button" | "submit" | undefined;
};
