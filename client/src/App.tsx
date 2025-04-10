import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CardLayout from "./components/CardLayout";
import CategoryPage from "./pages/CategoryPage";
import NewsDetail from "./components/news/NewsDetail";
import LatestNews from "./pages/LatestNews";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardLayout />}>
          <Route index element={<Home />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/article/:slug" element={<NewsDetail />} />
          <Route path="/see-all-news" element={<LatestNews />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
