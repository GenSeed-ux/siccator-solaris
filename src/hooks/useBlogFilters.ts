import { useState, useMemo, useCallback } from "react";

interface Article {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

const ARTICLES_PER_PAGE = 6;

export const useBlogFilters = (articles: Article[]) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return ["All", ...Array.from(cats)];
  }, [articles]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    articles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.author.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Reset page when filters change
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveCategory("All");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  return {
    activeCategory,
    searchQuery,
    currentPage,
    categories,
    categoryCounts,
    filteredArticles,
    paginatedArticles,
    totalPages,
    setCurrentPage,
    handleCategoryChange,
    handleSearchChange,
    clearFilters,
    hasActiveFilters: activeCategory !== "All" || searchQuery.trim() !== "",
  };
};
