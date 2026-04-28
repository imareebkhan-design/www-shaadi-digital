import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageType?: string;
  schemaJson?: Record<string, unknown>;
}

const DEFAULTS = {
  title: "Digital Wedding Invitations India | Shaadi.Digital",
  description: "India's most loved digital wedding invitation platform. 12+ templates, WhatsApp delivery, live RSVP tracking. Starting ₹999.",
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
  ogImageWidth,
  ogImageHeight,
  ogImageType,
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

      <meta name="language" content="en-IN" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <link rel="alternate" hrefLang="en-in" href="https://shaadi.digital/" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogImageWidth && <meta property="og:image:width" content={ogImageWidth} />}
      {ogImageHeight && <meta property="og:image:height" content={ogImageHeight} />}
      {ogImageType && <meta property="og:image:type" content={ogImageType} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={DEFAULTS.ogSiteName} />
      {canonical && <meta property="og:url" content={canonical} />}

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
