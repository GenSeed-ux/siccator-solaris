import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ClipboardList, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Google Form URLs
const GOOGLE_FORM_DIRECT_URL = "https://forms.gle/VuuSnVy1DaERgnxT9";

const Survey = () => {
  return (
    <>
      <SEO
        title="Farmer Feedback Survey | Siccator Solaris"
        description="Share your experience with our smart solar dryer technology. Your feedback helps us improve and better serve farming communities across Africa."
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Farmer Feedback Survey
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your voice matters! Help us understand your needs and improve our smart solar dryer 
              technology by sharing your valuable feedback.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Survey Section */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-xl shadow-lg border border-border p-8 text-center"
          >
            <p className="text-muted-foreground mb-6">
              Takes approximately 5-10 minutes to complete
            </p>
            <Button
              size="lg"
              onClick={() => window.open(GOOGLE_FORM_DIRECT_URL, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Take the Survey
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Survey;
