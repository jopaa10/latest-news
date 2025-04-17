import { useQuery } from "@tanstack/react-query";
import { getBookmarks } from "../api/bookmarks";
import { useAuth } from "./useAuth";

export const useBookmarks = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(token),
    enabled: !!token,
    staleTime: 60 * 1000,
  });
};
