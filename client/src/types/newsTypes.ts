export type NYTArticleWithId = NYTArticle & {
  articleId?: string;
  image?: string;
  author?: string;
};

export type NewsArticle = {
  abstract: string;
  byline: {
    original: string;
  };
  document_type: string;
  headline: {
    main: string;
    kicker?: string;
    print_headline?: string;
  };
  _id: string;
  keywords: {
    name: string;
    value: string;
    rank: number;
  }[];
  multimedia: {
    caption: string;
    credit: string;
    default: {
      url: string;
      height: number;
      width: number;
    };
    thumbnail: {
      url: string;
      height: number;
      width: number;
    };
  };
  news_desk: string;
  print_page: string;
  print_section: string;
  pub_date: string;
  section_name: string;
  snippet: string;
  source: string;
  subsection_name: string;
  type_of_material: string;
  uri: string;
  web_url: string;
  word_count: number;
};

export type NYTArticle = {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }[];
  short_url: string;
};

export type NewsListProps = {
  articles: (NYTArticle | NYTArticleWithId)[];
  isLoading?: boolean;
  isFetching?: boolean;
  skeletonCount?: number;
  cls?: string;
};
