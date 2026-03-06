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
  description: "Create stunning digital wedding invitations for Indian weddings — Hindu, Muslim, Sikh & South Indian. Share via WhatsApp. RSVP tracking, music & more.",
  ogImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/90420783-7e49-4f72-8261-fee2b34d3027/id-preview-4ef72066--79578699-4188-4ad4-ba7e-62c60b946282.lovable.app-1772789937634.png",
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
