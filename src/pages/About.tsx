import { motion } from "framer-motion";
import { Target, Eye, Award, Users, Linkedin, Mail, MessageSquare, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { XTwitterIcon } from "@/components/icons/XTwitterIcon";

const About = () => {
  const [content, setContent] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [aboutData, timelineData, teamData] = await Promise.all([
        supabase.from("about_content").select("*").single(),
        supabase.from("timeline_events").select("*").order("display_order"),
        supabase.from("team_members").select("*").order("display_order"),
      ]);

      if (aboutData.data) setContent(aboutData.data);
      if (timelineData.data) setTimeline(timelineData.data);
      if (teamData.data) setTeam(teamData.data);
    };
    loadData();
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
              About Our Mission
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Empowering farmers with innovative solar drying technology to reduce waste, increase income, and build a sustainable agricultural future
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content?.mission || "To revolutionize post-harvest processing in Africa by providing affordable, sustainable, and intelligent solar drying solutions that empower smallholder farmers, reduce food waste, and contribute to food security and climate action."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content?.vision || "A future where every farmer in Africa has access to smart, sustainable technology that enables them to process their harvest efficiently, maximize their income, and contribute to a greener planet through renewable energy adoption."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">From concept to impact</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="bg-card rounded-xl p-6 shadow-md">
                      <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow z-10">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">Experts driving innovation in agricultural technology</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="aspect-square bg-gradient-primary" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                    <div className="text-primary font-medium mb-2">{member.title}</div>
                    {member.bio && <p className="text-sm text-muted-foreground mb-2">{member.bio}</p>}
                    <p className="text-sm text-muted-foreground mb-3">{member.expertise}</p>
                    {(member.linkedin_url || member.email || member.discord_username || member.twitter_url || member.github_url) && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Connect</p>
                        <div className="flex flex-wrap gap-2">
                          {member.linkedin_url && (
                            <a 
                              href={member.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all group"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-4 w-4" />
                              <span className="text-xs font-medium">LinkedIn</span>
                            </a>
                          )}
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`} 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all group"
                              title={member.email}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="text-xs font-medium">Email</span>
                            </a>
                          )}
                          {member.discord_username && (
                            <div 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground cursor-default"
                              title={member.discord_username}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs font-medium">{member.discord_username}</span>
                            </div>
                          )}
                          {member.twitter_url && (
                            <a 
                              href={member.twitter_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all group"
                              title="X (Twitter)"
                            >
                              <XTwitterIcon className="h-4 w-4" />
                              <span className="text-xs font-medium">X</span>
                            </a>
                          )}
                          {member.github_url && (
                            <a 
                              href={member.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all group"
                              title="GitHub"
                            >
                              <Github className="h-4 w-4" />
                              <span className="text-xs font-medium">GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Map Placeholder */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Global Impact</h2>
            <p className="text-xl text-muted-foreground">Operating across 10+ countries in Africa</p>
          </motion.div>

          <div className="bg-card rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              Interactive impact map showing deployment regions, farmer networks, and success stories
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
