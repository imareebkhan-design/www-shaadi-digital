import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
  schemaJson?: Record<string, unknown>;
}

const DEFAULTS = {
  title: "Digital Wedding Invitations India | Shaadi.Digital",
  description: "India's most loved digital wedding invitation platform. 200+ templates, WhatsApp delivery, live RSVP tracking. Starting ₹999.",
  ogImage: "https://shaadi.digital/og-image.jpg",
  ogSiteName: "Shaadi.Digital",
};

const SEOHead = ({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  canonical,
  noIndex = false,
  ogImage = DEFAULTS.ogImage,
  ogType = "website",
  schemaJson,
}: SEOHeadProps) => {
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={DEFAULTS.ogSiteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemaJson && (
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
