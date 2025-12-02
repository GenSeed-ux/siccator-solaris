import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Quote, MapPin, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SuccessStory {
  id: string;
  farmer_name: string;
  location: string;
  farm_size: string | null;
  crop_types: string[] | null;
  story_title: string;
  story_content: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  income_increase_percentage: number | null;
  loss_reduction_percentage: number | null;
  image_url: string | null;
  video_url: string | null;
  quote: string | null;
  is_featured: boolean | null;
}

const SuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      const { data } = await supabase
        .from("success_stories")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("display_order");

      if (data) setStories(data as SuccessStory[]);
      setLoading(false);
    };
    loadStories();
  }, []);

  // Placeholder data
  const placeholderStories: SuccessStory[] = [
    {
      id: "1",
      farmer_name: "Kwame Asante",
      location: "Northern Ghana",
      farm_size: "5 hectares",
      crop_types: ["Maize", "Sorghum"],
      story_title: "From 40% Loss to 5% - Kwame's Journey",
      story_content: "Kwame Asante, a smallholder farmer in Northern Ghana, faced devastating post-harvest losses every season. The unpredictable weather and traditional sun-drying methods meant losing nearly half his harvest to mold and pests. After installing a Siccator Solaris dryer, everything changed. His maize now dries uniformly within 2 days instead of a week, and the quality commands premium prices at the market.",
      challenge: "Losing 40% of harvest annually to mold and pest damage due to slow traditional drying methods.",
      solution: "Installed Siccator Solaris smart solar dryer with IoT monitoring for optimal drying conditions.",
      results: "Reduced post-harvest loss from 40% to 5%, increased annual income by 65%, and now supplies to premium buyers.",
      income_increase_percentage: 65,
      loss_reduction_percentage: 35,
      image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800",
      video_url: null,
      quote: "The dryer has transformed my farming business. I can now plan my finances because I know my harvest will reach the market in perfect condition.",
      is_featured: true,
    },
    {
      id: "2",
      farmer_name: "Amina Mwangi",
      location: "Western Kenya",
      farm_size: "3 hectares",
      crop_types: ["Coffee", "Beans"],
      story_title: "Premium Coffee, Premium Prices",
      story_content: "Amina's specialty coffee used to lose its value during the drying process. Inconsistent drying led to fermentation issues and lower grades. With the smart solar dryer, she can now control the exact moisture content, producing Grade A coffee that sells at 40% higher prices.",
      challenge: "Inconsistent drying causing coffee grade degradation and lower market prices.",
      solution: "Precision drying with real-time moisture monitoring to maintain optimal coffee quality.",
      results: "Achieved consistent Grade A coffee, 40% price premium, and expanded to export markets.",
      income_increase_percentage: 80,
      loss_reduction_percentage: 28,
      image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
      video_url: null,
      quote: "My coffee is now being exported to Europe. Something I never thought possible for a small farmer like me.",
      is_featured: true,
    },
    {
      id: "3",
      farmer_name: "Emmanuel Okonkwo",
      location: "Ogun State, Nigeria",
      farm_size: "8 hectares",
      crop_types: ["Cassava", "Yam"],
      story_title: "Processing Cassava Year-Round",
      story_content: "Emmanuel runs a cassava processing operation that struggled during the rainy season. The solar dryer with backup power mode allows him to continue production throughout the year, doubling his output and creating employment for 12 community members.",
      challenge: "Seasonal limitations on cassava processing due to weather-dependent drying.",
      solution: "Siccator Solaris with hybrid solar-electric mode for all-weather operation.",
      results: "Year-round processing capability, doubled output, created 12 local jobs.",
      income_increase_percentage: 120,
      loss_reduction_percentage: 45,
      image_url: "https://images.unsplash.com/photo-1594735579355-e39eb26ecf7c?w=800",
      video_url: null,
      quote: "We used to close during rains. Now we're the most reliable cassava suppliers in the region.",
      is_featured: false,
    },
  ];

  const displayStories = stories.length > 0 ? stories : placeholderStories;
  const featuredStories = displayStories.filter((s) => s.is_featured);
  const regularStories = displayStories.filter((s) => !s.is_featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Real farmers, real results. Discover how Siccator Solaris is transforming lives across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-glow transition-all cursor-pointer"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="relative h-64">
                    {story.image_url ? (
                      <img src={story.image_url} alt={story.farmer_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-primary" />
                    )}
                    {story.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {story.location}
                      {story.crop_types && (
                        <span className="ml-2">• {story.crop_types.join(", ")}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{story.story_title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{story.story_content}</p>
                    
                    {/* Metrics */}
                    <div className="flex gap-4 mb-4">
                      {story.income_increase_percentage && (
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-bold">+{story.income_increase_percentage}%</span>
                          <span className="text-sm text-muted-foreground">Income</span>
                        </div>
                      )}
                      {story.loss_reduction_percentage && (
                        <div className="flex items-center gap-2 text-accent">
                          <TrendingDown className="w-5 h-5" />
                          <span className="font-bold">-{story.loss_reduction_percentage}%</span>
                          <span className="text-sm text-muted-foreground">Loss</span>
                        </div>
                      )}
                    </div>

                    {story.quote && (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                        "{story.quote.slice(0, 100)}..."
                      </blockquote>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12">All Case Studies</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(regularStories.length > 0 ? regularStories : displayStories).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-glow transition-all cursor-pointer group"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="relative h-48">
                    {story.image_url ? (
                      <img src={story.image_url} alt={story.farmer_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full gradient-primary" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {story.location}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{story.story_title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">By {story.farmer_name}</p>
                    
                    <div className="flex gap-3 text-sm">
                      {story.income_increase_percentage && (
                        <span className="text-primary font-medium">+{story.income_increase_percentage}% income</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of farmers who have transformed their operations with Siccator Solaris
            </p>
            <Link to="/contact">
              <Button size="lg" className="gradient-primary text-primary-foreground">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story Detail Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <div>
              {selectedStory.video_url ? (
                <video src={selectedStory.video_url} controls className="w-full aspect-video rounded-lg mb-6" />
              ) : selectedStory.image_url ? (
                <img src={selectedStory.image_url} alt={selectedStory.farmer_name} className="w-full h-64 object-cover rounded-lg mb-6" />
              ) : null}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    {selectedStory.location}
                    {selectedStory.farm_size && <span>• {selectedStory.farm_size}</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedStory.story_title}</h2>
                  <p className="text-primary font-medium">By {selectedStory.farmer_name}</p>
                </div>

                {selectedStory.crop_types && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedStory.crop_types.map((crop) => (
                      <span key={crop} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedStory.income_increase_percentage && (
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-primary">+{selectedStory.income_increase_percentage}%</div>
                      <div className="text-sm text-muted-foreground">Income Increase</div>
                    </div>
                  )}
                  {selectedStory.loss_reduction_percentage && (
                    <div className="bg-accent/10 rounded-xl p-4 text-center">
                      <TrendingDown className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-3xl font-bold text-accent">-{selectedStory.loss_reduction_percentage}%</div>
                      <div className="text-sm text-muted-foreground">Post-Harvest Loss</div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Story</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedStory.story_content}</p>
                </div>

                {selectedStory.challenge && (
                  <div className="bg-destructive/10 rounded-lg p-4">
                    <h3 className="font-semibold text-destructive mb-2">The Challenge</h3>
                    <p className="text-muted-foreground">{selectedStory.challenge}</p>
                  </div>
                )}

                {selectedStory.solution && (
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold text-primary mb-2">The Solution</h3>
                    <p className="text-muted-foreground">{selectedStory.solution}</p>
                  </div>
                )}

                {selectedStory.results && (
                  <div className="bg-accent/10 rounded-lg p-4">
                    <h3 className="font-semibold text-accent mb-2">The Results</h3>
                    <p className="text-muted-foreground">{selectedStory.results}</p>
                  </div>
                )}

                {selectedStory.quote && (
                  <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted rounded-r-lg">
                    <Quote className="w-8 h-8 text-primary/50 mb-2" />
                    <p className="text-lg italic text-foreground mb-2">"{selectedStory.quote}"</p>
                    <cite className="text-muted-foreground">— {selectedStory.farmer_name}</cite>
                  </blockquote>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessStories;
