import { useQuery } from "@tanstack/react-query";
import { searchArticleByTitle } from "../api/nytApi";
import { NewsArticle } from "../types/articleTypes";

export const useSearchArticles = (searchTerm: string) => {
  return useQuery<NewsArticle[], Error>({
    queryKey: ["search-article", searchTerm],
    queryFn: () => searchArticleByTitle(searchTerm),
    enabled: searchTerm.length > 0,
  });
};
