import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Image as ImageIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import LazyImage from "@/components/LazyImage";
import GalleryLightbox from "@/components/GalleryLightbox";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  category: string | null;
  location: string | null;
  is_featured: boolean | null;
}

const categories = [
  { value: "all", label: "All" },
  { value: "dryer_in_action", label: "Dryers in Action" },
  { value: "installation", label: "Installation" },
  { value: "farmers", label: "Farmers" },
  { value: "crops", label: "Crops & Produce" },
  { value: "events", label: "Events" },
];

const Gallery = () => {
  const [media, setMedia] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadMedia = async () => {
      const { data } = await supabase
        .from("gallery_media")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("display_order");

      if (data) setMedia(data as GalleryItem[]);
      setLoading(false);
    };
    loadMedia();
  }, []);

  const filteredMedia = activeCategory === "all" 
    ? media 
    : media.filter((item) => item.category === activeCategory);

  // Placeholder data if no media exists
  const placeholderMedia: GalleryItem[] = [
    { id: "1", title: "Solar Dryer Installation", description: "First installation in Northern Ghana", media_type: "image", media_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800", thumbnail_url: null, category: "installation", location: "Ghana", is_featured: true },
    { id: "2", title: "Farmers Training Session", description: "Training local farmers on dryer operation", media_type: "image", media_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800", thumbnail_url: null, category: "farmers", location: "Kenya", is_featured: true },
    { id: "3", title: "Cocoa Drying Process", description: "Premium cocoa beans being dried", media_type: "image", media_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800", thumbnail_url: null, category: "dryer_in_action", location: "Ghana", is_featured: false },
    { id: "4", title: "Maize Harvest", description: "Freshly harvested maize ready for drying", media_type: "image", media_url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800", thumbnail_url: null, category: "crops", location: "Nigeria", is_featured: false },
    { id: "5", title: "Community Event", description: "Launch event with local farmers", media_type: "image", media_url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800", thumbnail_url: null, category: "events", location: "Tanzania", is_featured: false },
    { id: "6", title: "Solar Panels Setup", description: "Solar panels powering the dryer", media_type: "image", media_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800", thumbnail_url: null, category: "installation", location: "Uganda", is_featured: false },
  ];

  const displayMedia = media.length > 0 ? filteredMedia : placeholderMedia.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Gallery & Media"
        description="See our solar dryers in action across Africa - from installation to harvest. Photos and videos of Siccator Solaris technology."
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
              Gallery & Media
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              See our solar dryers in action across Africa - from installation to harvest
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={activeCategory === cat.value ? "gradient-primary text-primary-foreground" : ""}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : displayMedia.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No media found</h3>
              <p className="text-muted-foreground">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMedia.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <LazyImage
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Video indicator */}
                  {item.media_type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    )}
                  </div>

                  {/* Featured badge */}
                  {item.is_featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                      Featured
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox */}
      <GalleryLightbox
        items={displayMedia}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </div>
  );
};

export default Gallery;
