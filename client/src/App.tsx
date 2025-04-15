import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CardLayout from "./components/layout/CardLayout";
import CategoryPage from "./pages/CategoryPage";
import NewsDetail from "./components/news/NewsDetail";
import LatestNews from "./pages/LatestNewsPage";
import VerifyEmail from "./components/VerifyEmail";
import FavoritesPage from "./pages/FavoritesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardLayout />}>
          <Route index element={<Home />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/article/:slug" element={<NewsDetail />} />
          <Route path="/see-all-news" element={<LatestNews />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/favorites"
            element={<ProtectedRoute element={<FavoritesPage />} />}
          />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
