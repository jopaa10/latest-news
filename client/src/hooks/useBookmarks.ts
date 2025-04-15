import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getBookmarks } from "../api/bookmarks";

export const useBookmarks = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(token),
    enabled: !!token,
    staleTime: 60 * 1000,
  });
};
