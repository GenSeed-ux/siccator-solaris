import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import CountUp from "react-countup";
import { PilotRequestDialog } from "@/components/PilotRequestDialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [content, setContent] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [heroVideos, setHeroVideos] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [homeData, metricsData, storiesData] = await Promise.all([
        supabase.from("home_content").select("*").single(),
        supabase.from("impact_metrics").select("*").order("display_order"),
        supabase.from("stories_testimonials").select("*").eq("type", "testimonial").eq("is_featured", true).order("display_order").limit(3),
      ]);

      if (homeData.data) {
        setContent(homeData.data);
        // Parse hero videos
        if (homeData.data.hero_video_url) {
          try {
            const parsed = JSON.parse(homeData.data.hero_video_url);
            if (Array.isArray(parsed)) {
              setHeroVideos(parsed);
            } else {
              setHeroVideos([homeData.data.hero_video_url]);
            }
          } catch {
            if (homeData.data.hero_video_url.includes(',')) {
              setHeroVideos(homeData.data.hero_video_url.split(',').map((u: string) => u.trim()).filter(Boolean));
            } else if (homeData.data.hero_video_url) {
              setHeroVideos([homeData.data.hero_video_url]);
            }
          }
        }
      }
      if (metricsData.data) {
        setStats(metricsData.data.map(m => ({
          value: m.metric_value,
          label: m.metric_label,
          suffix: m.metric_unit || ""
        })));
      }
      if (storiesData.data) {
        setTestimonials(storiesData.data.map(s => ({
          name: s.name,
          role: s.role || s.location,
          text: s.quote
        })));
      }
    };
    loadData();
  }, []);

  // Auto-advance video slideshow
  useEffect(() => {
    if (heroVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroVideos.length]);

  const features = [
    {
      icon: Sun,
      title: "100% Solar Powered",
      description: "Zero emissions, completely renewable energy for sustainable drying",
    },
    {
      icon: Leaf,
      title: "AI-Optimized Drying",
      description: "Smart algorithms adjust temperature and humidity for perfect results",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Monitoring",
      description: "IoT sensors provide live data accessible from anywhere",
    },
    {
      icon: Users,
      title: "Farmer-Centric Design",
      description: "Simple operation with comprehensive training and support",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Slideshow or Image */}
        {heroVideos.length > 0 ? (
          <>
            {heroVideos.map((videoUrl, index) => (
              <video
                key={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ))}
            <div className="absolute inset-0 bg-gradient-hero z-10" />
            
            {/* Video Indicators */}
            {heroVideos.length > 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroVideos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentVideoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to video ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-hero z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          </>
        )}
        
        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {content?.headline || "Revolutionizing Agriculture with Intelligent Solar Drying"}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {content?.subtext || "AI-powered IoT solar dryer reducing post-harvest loss, increasing farmer income, and supporting climate-smart sustainable agriculture"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PilotRequestDialog />
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6">
                  Monitor Your Dryer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Smart Technology, Sustainable Future
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The Siccator Solaris Intelligentis V2 combines cutting-edge IoT and AI technology with renewable energy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 h-full hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted by Farmers & NGOs
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories from real farmers making a difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <Award className="w-10 h-10 text-primary mb-4" />
                <p className="text-foreground mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Harvest?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of farmers already benefiting from smart solar drying technology
            </p>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
