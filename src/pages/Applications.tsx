import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const Applications = () => {
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);

  useEffect(() => {
    const loadCrops = async () => {
      const { data } = await supabase.from("crop_applications").select("*").order("display_order");
      if (data) {
        setCrops(data.map(c => ({
          name: c.crop_name,
          image: c.image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80",
          dryingTime: c.drying_time,
          temperature: c.temperature_range,
          moisture: c.humidity_range,
          benefits: c.benefits || [],
          roi: `+${c.roi_percentage}% income increase`,
          category: c.category
        })));
      }
    };
    loadCrops();
  }, []);

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
              Versatile Crop Applications
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              From cocoa to cassava, fish to spices – our solar dryer adapts to your agricultural needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Crop Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Optimized for Multiple Crops
            </h2>
            <p className="text-xl text-muted-foreground">
              Click any crop to see detailed specifications and economic benefits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {crops.map((crop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCrop(crop)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${crop.image})` }} />
                  <div className="absolute inset-0 bg-gradient-hero opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{crop.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                          {crop.dryingTime}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                          {crop.temperature}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedCrop} onOpenChange={() => setSelectedCrop(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCrop && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  {selectedCrop.name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  Optimized drying specifications and economic impact
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Image */}
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img src={selectedCrop.image} alt={selectedCrop.name} className="w-full h-full object-cover" />
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Drying Time</div>
                    <div className="text-lg font-bold text-foreground">{selectedCrop.dryingTime}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Temperature</div>
                    <div className="text-lg font-bold text-foreground">{selectedCrop.temperature}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Final Moisture</div>
                    <div className="text-lg font-bold text-foreground">{selectedCrop.moisture}</div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Key Benefits</h3>
                  <div className="space-y-2">
                    {selectedCrop.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full gradient-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI */}
                <div className="gradient-primary rounded-xl p-6 text-center">
                  <div className="text-sm text-primary-foreground/80 mb-2">Economic Impact</div>
                  <div className="text-2xl font-bold text-primary-foreground">{selectedCrop.roi}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
