import { useNavigate } from "react-router-dom";
import { NYTArticle } from "../../api/nytApi";
import "../../styles/news.scss";
import fallbackImage from "../../assets/images/news.png";

const NewsCard = ({ article }: { article: NYTArticle }) => {
  const image = article.multimedia?.[1]?.url;
  const author = article.byline.replace(/^By\s+/i, "");

  const navigate = useNavigate();

  const handleClick = () => {
    const encodedUrl = encodeURIComponent(article.url);
    const category = article.section || "home";

    navigate(`/${category}/article/${encodedUrl}`);
  };

  return (
    <a className="news-card" onClick={handleClick}>
      <img src={image || fallbackImage} alt={article.title} />
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
