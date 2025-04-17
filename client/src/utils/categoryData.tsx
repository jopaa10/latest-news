import {
  Briefcase,
  Description,
  HealthAndSafety,
  Home,
  Science,
  SportsSoccer,
  Tv,
} from "../assets/icons/index";
import { Category } from "../types/categoryTypes";

export const categories: Category[] = [
  { name: "Home", icon: <Home />, path: "/" },
  { name: "General", icon: <Description />, path: "/general" },
  { name: "Business", icon: <Briefcase />, path: "/business" },
  { name: "Health", icon: <HealthAndSafety />, path: "/health" },
  { name: "Science", icon: <Science />, path: "/science" },
  { name: "Sports", icon: <SportsSoccer />, path: "/sports" },
  { name: "Technology", icon: <Tv />, path: "/technology" },
];
