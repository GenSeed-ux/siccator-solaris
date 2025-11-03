import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Target, Users, TrendingUp, Leaf, DollarSign, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Impact = () => {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
      const { data } = await supabase.from("impact_metrics").select("*").order("display_order");
      if (data) setMetrics(data);
    };
    loadMetrics();
  }, []);
  const sdgGoals = [
    { number: 1, title: "No Poverty", description: "Increasing farmer income by 60%+ through reduced losses" },
    { number: 2, title: "Zero Hunger", description: "Reducing post-harvest loss by 85% ensures food security" },
    { number: 7, title: "Clean Energy", description: "100% renewable solar energy for sustainable processing" },
    { number: 8, title: "Economic Growth", description: "Creating jobs and supporting rural economies" },
    { number: 12, title: "Responsible Production", description: "Sustainable agriculture and reduced waste" },
    { number: 13, title: "Climate Action", description: "Zero emissions technology combating climate change" },
  ];

  const incomeData = [
    { year: "2019", traditional: 1500, withSiccator: 1800 },
    { year: "2020", traditional: 1600, withSiccator: 2400 },
    { year: "2021", traditional: 1550, withSiccator: 2900 },
    { year: "2022", traditional: 1700, withSiccator: 3400 },
    { year: "2023", traditional: 1650, withSiccator: 3800 },
    { year: "2024", traditional: 1750, withSiccator: 4200 },
  ];

  const lossReduction = [
    { name: "Traditional", value: 35, color: "#ef4444" },
    { name: "Siccator Solaris", value: 5, color: "#2E8B57" },
  ];

  const countries = [
    { name: "Ghana", farmers: 450 },
    { name: "Nigeria", farmers: 280 },
    { name: "Kenya", farmers: 190 },
    { name: "Tanzania", farmers: 145 },
    { name: "Uganda", farmers: 95 },
    { name: "Others", farmers: 40 },
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
              Measurable Global Impact
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Creating sustainable change through technology, empowering communities, and contributing to global development goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.length > 0 ? metrics.slice(0, 4).map((metric, index) => {
              const icons = [Users, DollarSign, Leaf, Award];
              const colors = ["text-primary", "text-energy", "text-accent", "text-primary"];
              const Icon = icons[index % icons.length];
              
              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 text-center hover:shadow-glow transition-all"
                >
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${colors[index % colors.length]}`} />
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {metric.metric_value}{metric.metric_unit || ""}
                  </div>
                  <div className="text-muted-foreground">{metric.metric_label}</div>
                </motion.div>
              );
            }) : (
              <>
                {[
                  { icon: Users, value: "1,200+", label: "Farmers Empowered", color: "text-primary" },
                  { icon: DollarSign, value: "$4.2M", label: "Additional Income Generated", color: "text-energy" },
                  { icon: Leaf, value: "2,400", label: "Tons CO₂ Saved Annually", color: "text-accent" },
                  { icon: Award, value: "85%", label: "Post-Harvest Loss Reduction", color: "text-primary" },
                ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center hover:shadow-glow transition-all"
              >
                <metric.icon className={`w-12 h-12 mx-auto mb-4 ${metric.color}`} />
                <div className="text-4xl font-bold text-foreground mb-2">{metric.value}</div>
              <div className="text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}</>
          )}
          </div>
        </div>
      </section>

      {/* Income Comparison Chart */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Farmer Income Growth
            </h2>
            <p className="text-xl text-muted-foreground">
              Annual income comparison: Traditional vs Siccator Solaris (USD)
            </p>
          </motion.div>

          <div className="bg-card rounded-2xl p-8 shadow-md">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="traditional" stroke="#94a3b8" strokeWidth={2} name="Traditional Drying" />
                <Line type="monotone" dataKey="withSiccator" stroke="hsl(var(--primary))" strokeWidth={3} name="With Siccator Solaris" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Loss Reduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Post-Harvest Loss Reduction
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our smart solar dryer reduces post-harvest losses from 35% (traditional methods) to just 5%, saving tons of food and increasing farmer profitability dramatically.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">Traditional Drying</span>
                    <span className="font-bold text-destructive">35% Loss</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: "35%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">Siccator Solaris</span>
                    <span className="font-bold text-primary">5% Loss</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary" style={{ width: "5%" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-md"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lossReduction}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {lossReduction.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SDG Goals */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              UN Sustainable Development Goals
            </h2>
            <p className="text-xl text-muted-foreground">
              Contributing to global sustainability targets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sdgGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border-2 border-border hover:border-primary hover:shadow-glow transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 text-xl font-bold text-primary-foreground">
                    {goal.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Distribution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Regional Adoption
            </h2>
            <p className="text-xl text-muted-foreground">
              Farmers using Siccator Solaris by country
            </p>
          </motion.div>

          <div className="bg-card rounded-2xl p-8 shadow-md">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="farmers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
