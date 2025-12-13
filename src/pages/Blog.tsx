import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import LazyImage from "@/components/LazyImage";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Blog = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setArticles(data.map(post => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.summary,
            image: post.featured_image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80",
            category: post.category,
            author: post.author,
            date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            readTime: `${post.read_time || 5} min read`
          })));
        }
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert({ email: newsletterEmail.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully subscribed to our newsletter!");
        setNewsletterEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const fallbackArticles = [
    {
      id: "1",
      slug: "solar-drying-transforming-cocoa-farming",
      title: "How Solar Drying is Transforming Cocoa Farming in Ghana",
      excerpt: "Discover how our smart solar dryers are helping Ghanaian cocoa farmers achieve premium quality and increase their income by over 150%.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80",
      category: "Success Stories",
      author: "Dr. Kwabena Asante",
      date: "March 15, 2024",
      readTime: "5 min read",
    },
    {
      id: "2",
      slug: "science-behind-ai-optimized-drying",
      title: "The Science Behind AI-Optimized Drying",
      excerpt: "Explore the technology and algorithms that power our intelligent drying system and ensure perfect results every time.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
      category: "Technology",
      author: "Yaw Boateng",
      date: "March 10, 2024",
      readTime: "8 min read",
    },
    {
      id: "3",
      slug: "climate-smart-agriculture-solar-technology",
      title: "Climate-Smart Agriculture: The Role of Solar Technology",
      excerpt: "Learn how renewable energy in agriculture is contributing to climate action and sustainable food systems.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80",
      category: "Sustainability",
      author: "Dr. Esi Mensah",
      date: "March 5, 2024",
      readTime: "6 min read",
    },
    {
      id: "4",
      slug: "field-to-market-cassava-processing",
      title: "From Field to Market: Cassava Processing Success",
      excerpt: "A case study on how solar drying is revolutionizing cassava processing and opening new market opportunities.",
      image: "https://images.unsplash.com/photo-1604916287784-c324202b3205?auto=format&fit=crop&q=80",
      category: "Case Studies",
      author: "Akosua Frimpong",
      date: "February 28, 2024",
      readTime: "7 min read",
    },
    {
      id: "5",
      slug: "iot-agriculture-realtime-monitoring",
      title: "IoT in Agriculture: Real-Time Monitoring Benefits",
      excerpt: "How Internet of Things technology is empowering farmers with data-driven decision making.",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80",
      category: "Technology",
      author: "Yaw Boateng",
      date: "February 20, 2024",
      readTime: "5 min read",
    },
    {
      id: "6",
      slug: "reducing-post-harvest-loss-food-security",
      title: "Reducing Post-Harvest Loss: A Path to Food Security",
      excerpt: "Understanding the impact of post-harvest technology on food security in Africa.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80",
      category: "Impact",
      author: "Dr. Kwabena Asante",
      date: "February 15, 2024",
      readTime: "6 min read",
    },
  ];

  const displayArticles = articles.length > 0 ? articles : fallbackArticles;
  
  const {
    activeCategory,
    searchQuery,
    currentPage,
    categories,
    categoryCounts,
    paginatedArticles,
    totalPages,
    setCurrentPage,
    handleCategoryChange,
    handleSearchChange,
    clearFilters,
    hasActiveFilters,
  } = useBlogFilters(displayArticles);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="News & Insights"
        description="Latest updates, success stories, and expert insights from the world of smart agricultural technology and solar drying innovation."
        type="website"
      />

      {/* Hero */}
      <section className="relative py-32 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              News & Insights
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Latest updates, success stories, and expert insights from the world of smart agricultural technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-muted border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === activeCategory ? "default" : "outline"}
                className={category === activeCategory ? "gradient-primary text-primary-foreground" : ""}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
                <span className="ml-2 text-xs opacity-70">
                  ({categoryCounts[category] || 0})
                </span>
              </Button>
            ))}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 text-center">
              <Button variant="link" onClick={clearFilters} className="text-sm">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedArticles.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-glow transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <LazyImage
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{article.excerpt}</p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{article.date}</span>
                            </span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        {/* Author */}
                        <div className="flex items-center space-x-2 mt-4">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{article.author}</span>
                        </div>

                        {/* Read More */}
                        <Link to={`/blog/${article.slug || article.id}`} className="mt-4">
                          <Button variant="ghost" className="w-full group/button">
                            Read Full Article
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 lg:p-12 text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest innovations, success stories, and agricultural insights
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background disabled:opacity-50"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="gradient-primary text-primary-foreground"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
