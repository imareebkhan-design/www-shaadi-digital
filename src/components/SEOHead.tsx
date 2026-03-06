import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
}

const DEFAULTS = {
  title: "Shaadi.Digital — Premium Digital Wedding Invitations for India",
  description: "Create stunning digital wedding invitations for Indian weddings — Hindu, Muslim, Sikh & South Indian. Share via WhatsApp. RSVP tracking, music & more.",
  ogImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/90420783-7e49-4f72-8261-fee2b34d3027/id-preview-4ef72066--79578699-4188-4ad4-ba7e-62c60b946282.lovable.app-1772789937634.png",
  ogSiteName: "Shaadi.Digital",
  twitterCard: "summary_large_image" as const,
  robots: "index, follow",
};

const SEOHead = ({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  canonical,
  robots = DEFAULTS.robots,
  ogTitle,
  ogDescription,
  ogImage = DEFAULTS.ogImage,
  ogType = "website",
  ogSiteName = DEFAULTS.ogSiteName,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard = DEFAULTS.twitterCard,
}: SEOHeadProps) => {
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;
  const resolvedTwitterTitle = twitterTitle || resolvedOgTitle;
  const resolvedTwitterDescription = twitterDescription || resolvedOgDescription;
  const resolvedTwitterImage = twitterImage || ogImage;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={ogSiteName} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDescription} />
      <meta name="twitter:image" content={resolvedTwitterImage} />
    </Helmet>
  );
};

export default SEOHead;
