import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Wifi, Sun, Thermometer, Droplets, Wind, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Technology = () => {
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      const { data } = await supabase.from("technology_content").select("*").order("display_order");
      if (data) setSections(data);
    };
    loadSections();
  }, []);
  const features = [
    {
      icon: Cpu,
      title: "AI Drying Intelligence",
      description: "Machine learning algorithms predict optimal drying times and automatically adjust settings based on crop type, weather conditions, and moisture content.",
      benefits: ["Consistent quality", "Reduced energy waste", "Predictive maintenance"],
    },
    {
      icon: Wifi,
      title: "IoT Cloud Connectivity",
      description: "Real-time data transmission to cloud platform enables remote monitoring, analytics, and control from anywhere using mobile devices.",
      benefits: ["24/7 monitoring", "Data analytics", "Remote alerts"],
    },
    {
      icon: Sun,
      title: "Advanced Solar Collectors",
      description: "High-efficiency photovoltaic panels and thermal collectors harness maximum solar energy for both electrical power and heat generation.",
      benefits: ["Zero operating cost", "100% renewable", "Energy storage"],
    },
    {
      icon: Thermometer,
      title: "Multi-Sensor Array",
      description: "Distributed temperature, humidity, VOC gas, and moisture sensors provide comprehensive environmental monitoring throughout the drying chamber.",
      benefits: ["Precise control", "Quality assurance", "Safety monitoring"],
    },
  ];

  const specs = [
    { label: "Drying Capacity", value: "50-100kg per batch" },
    { label: "Solar Panels", value: "300W polycrystalline" },
    { label: "Battery Storage", value: "12V 100Ah lithium" },
    { label: "Temperature Range", value: "30°C - 70°C" },
    { label: "Humidity Control", value: "20% - 80% RH" },
    { label: "Drying Time", value: "6-24 hours" },
    { label: "Connectivity", value: "4G LTE / Wi-Fi" },
    { label: "Warranty", value: "5 years" },
  ];

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
              Siccator Solaris Intelligentis V2
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Advanced IoT-enabled solar dryer combining artificial intelligence, renewable energy, and precision agriculture for optimal post-harvest processing
            </p>
          </motion.div>
        </div>
      </section>

      {/* System Diagram */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Intelligent system architecture for optimal drying performance
            </p>
          </motion.div>

          <div className="glass rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Solar Collection */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Sun className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">1. Solar Energy</h3>
                <p className="text-muted-foreground">
                  Photovoltaic panels capture sunlight and convert to electrical energy while thermal collectors generate heat
                </p>
              </motion.div>

              {/* Smart Control */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Cpu className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">2. AI Processing</h3>
                <p className="text-muted-foreground">
                  Sensors feed data to AI algorithms that optimize temperature, airflow, and humidity in real-time
                </p>
              </motion.div>

              {/* Cloud Monitoring */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Wifi className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">3. IoT Connectivity</h3>
                <p className="text-muted-foreground">
                  Live data streams to cloud platform for remote monitoring, alerts, and predictive analytics
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="ai">AI Intelligence</TabsTrigger>
              <TabsTrigger value="iot">IoT Sensors</TabsTrigger>
              <TabsTrigger value="solar">Solar Power</TabsTrigger>
              <TabsTrigger value="control">Smart Control</TabsTrigger>
            </TabsList>

            {features.map((feature, index) => (
              <TabsContent key={index} value={["ai", "iot", "solar", "control"][index]}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-8 lg:p-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-6">
                        <feature.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-4">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
                        {feature.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="aspect-video bg-gradient-primary rounded-xl flex items-center justify-center">
                      <feature.icon className="w-32 h-32 text-primary-foreground/30" />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade performance for professional agriculture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 border-2 border-border hover:border-primary hover:shadow-glow transition-all"
              >
                <div className="text-sm text-muted-foreground mb-1">{spec.label}</div>
                <div className="text-xl font-bold text-foreground">{spec.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor Icons */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Advanced Sensor Network
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive monitoring for perfect results every time
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Thermometer, label: "Temperature Sensors", count: "4 zones" },
              { icon: Droplets, label: "Humidity Monitors", count: "Multi-point" },
              { icon: Wind, label: "Airflow Sensors", count: "Variable speed" },
              { icon: Zap, label: "VOC Gas Detectors", count: "Safety alert" },
            ].map((sensor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-xl gradient-secondary flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <sensor.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{sensor.label}</h3>
                <p className="text-sm text-muted-foreground">{sensor.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
