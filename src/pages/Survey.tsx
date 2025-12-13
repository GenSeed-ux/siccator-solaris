import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ClipboardList, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Google Form URLs
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfiD0Qd8EmaOdwB5F0gqwWZnKwg-m3gdKdKexmXsZZuf4by-A/viewform?embedded=true";
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
            className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
          >
            {/* Survey Header */}
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Complete the Survey</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Takes approximately 5-10 minutes to complete
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(GOOGLE_FORM_DIRECT_URL, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>

            {/* Embedded Google Form */}
            <div className="relative w-full" style={{ minHeight: '800px' }}>
              <iframe
                src={GOOGLE_FORM_URL}
                width="100%"
                height="800"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Farmer Feedback Survey"
                className="w-full"
                loading="lazy"
              >
                Loading survey...
              </iframe>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Having trouble with the embedded form?{" "}
              <button
                onClick={() => window.open(GOOGLE_FORM_DIRECT_URL, '_blank')}
                className="text-primary hover:underline cursor-pointer"
              >
                Click here to open in a new tab
              </button>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Survey;
