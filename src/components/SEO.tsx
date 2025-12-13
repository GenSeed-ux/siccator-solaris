import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedAt?: string;
  tags?: string[];
}

const SEO = ({
  title = "Siccator Solaris - Smart Solar Dryer for Agriculture",
  description = "AI-powered solar drying technology reducing post-harvest losses for African farmers. Sustainable, efficient, and IoT-enabled crop drying solutions.",
  image = "/logo-full.png",
  url = "",
  type = "website",
  author,
  publishedAt,
  tags,
}: SEOProps) => {
  const siteName = "Siccator Solaris";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Siccator Solaris",
    description: "AI-powered solar drying technology for sustainable agriculture",
    url: "https://siccatorsolaris.org",
    logo: "/logo-full.png",
    sameAs: [
      "https://twitter.com/siccatorsolaris",
      "https://linkedin.com/company/siccatorsolaris",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233-XX-XXX-XXXX",
      contactType: "customer service",
      areaServed: "Africa",
      availableLanguage: ["English"],
    },
  };

  // Article Schema for blog posts
  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    author: {
      "@type": "Person",
      name: author || "Siccator Solaris Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Siccator Solaris",
      logo: {
        "@type": "ImageObject",
        url: "/logo-full.png",
      },
    },
    datePublished: publishedAt,
    keywords: tags?.join(", "),
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {tags && <meta name="keywords" content={tags.join(", ")} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
