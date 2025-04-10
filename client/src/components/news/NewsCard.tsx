import { useNavigate } from "react-router-dom";
import { NYTArticle } from "../../api/nytApi";
import "../../styles/news.scss";
import fallbackImage from "../../assets/images/news.png";
import { slugify } from "../../utils/createSlug";

const NewsCard = ({ article }: { article: NYTArticle }) => {
  const image = article.multimedia?.[1]?.url;
  const author = article.byline.replace(/^By\s+/i, "");

  const navigate = useNavigate();

  const handleClick = () => {
    let category = article.section.toLowerCase();

    if (!category) {
      // Derive category from the current URL path
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split("/");
      category = pathParts[1];
    }

    navigate(`/${category}/article/${slugify(article.title)}`);
  };

  return (
    <a className="news-card" onClick={handleClick}>
      <img src={image || fallbackImage} alt={article.multimedia[1]?.caption} />
      <div className="news-content">
        <div className="heading">
          <p className="category">{article.section}</p>
          <h3>{article.title}</h3>
        </div>
        <p className="author">{author}</p>
      </div>
    </a>
  );
};

export default NewsCard;
