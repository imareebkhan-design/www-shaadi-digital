import { useState } from "react";
import type { InvitationData } from "./types";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import NikahEnvelopeIntro from "./sections/NikahEnvelopeIntro";
import TemplateVideoIntro from "./sections/TemplateVideoIntro";
import HeroSection from "./sections/HeroSection";
import SaveTheDateSection from "./sections/SaveTheDateSection";
import OurStorySection from "./sections/OurStorySection";
import CoupleSection from "./sections/CoupleSection";
import ScheduleSection from "./sections/ScheduleSection";
import GallerySection from "./sections/GallerySection";
import DresscodeSection from "./sections/DresscodeSection";
import GiftsSection from "./sections/GiftsSection";
import VenueMapSection from "./sections/VenueMapSection";
import RsvpSection from "./sections/RsvpSection";
import MusicSection from "./sections/MusicSection";
import FooterSection from "./sections/FooterSection";
import { TEMPLATE_THEMES } from "./BaseTemplate";
import type { TemplateProps } from "./types";
import type { CSSProperties } from "react";

const placeholder = (value: string | undefined, fallback: string, isPreview: boolean) =>
  value?.trim() ? value : isPreview ? fallback : value || "";

export default function PearlNikah({ data, isPreview = false }: TemplateProps) {
  const theme = TEMPLATE_THEMES["pearl-nikah"];
  const [envelopeOpened, setEnvelopeOpened] = useState(isPreview);
  const [videoComplete, setVideoComplete] = useState(isPreview);

  const brideName = placeholder(data.bride_name, "Aisha", isPreview);
  const groomName = placeholder(data.groom_name, "Zayan", isPreview);
  const brideFamily = placeholder(data.bride_family, "Daughter of your family", isPreview);
  const groomFamily = placeholder(data.groom_family, "Son of your family", isPreview);

  const formattedDate = data.wedding_date
    ? new Date(data.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : isPreview ? "15 December 2026" : null;

  const gradient = "from-stone-600 to-stone-800";
  const motif = "◆";

  const themeStyles = {
    "--template-bg": theme.bgPrimary,
    "--template-bg-secondary": theme.bgSecondary,
    "--template-text": theme.textPrimary,
    "--template-text-muted": theme.textMuted,
    "--template-accent": theme.accent,
    "--template-accent-light": theme.accentLight,
  } as CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={themeStyles}>
      {/* Custom Nikah Envelope */}
      {!envelopeOpened && (
        <NikahEnvelopeIntro
          brideName={brideName}
          groomName={groomName}
          weddingDate={data.wedding_date}
          onOpen={() => setEnvelopeOpened(true)}
        />
      )}

      {/* Template Video Preview */}
      {envelopeOpened && !videoComplete && (
        <TemplateVideoIntro
          videoUrl={data.hero_media_type === "video" ? data.hero_media_url : undefined}
          brideName={brideName}
          groomName={groomName}
          onComplete={() => setVideoComplete(true)}
        />
      )}

      {videoComplete && <FloatingMusicPlayer musicUrl={data.music_url} />}

      {videoComplete && <HeroSection
        brideName={brideName}
        groomName={groomName}
        brideFamily={brideFamily}
        groomFamily={groomFamily}
        formattedDate={formattedDate}
        weddingCity={data.wedding_city}
        photoUrl={data.photo_url}
        gradient={gradient}
        motif={motif}
        heroMediaType={data.hero_media_type}
        heroMediaUrl={data.hero_media_url}
        isPreview={isPreview}
      />}

      {videoComplete && <SaveTheDateSection weddingDate={data.wedding_date} isPreview={isPreview} />}
      {videoComplete && <OurStorySection story={data.our_story || data.personal_message} isPreview={isPreview} />}

      {videoComplete && <CoupleSection
        brideName={brideName}
        groomName={groomName}
        brideFamily={brideFamily}
        groomFamily={groomFamily}
        brideFullName={data.bride_full_name}
        groomFullName={data.groom_full_name}
        brideBio={data.bride_bio}
        groomBio={data.groom_bio}
        photoUrl={data.photo_url}
        gradient={gradient}
        isPreview={isPreview}
      />}

      {videoComplete && <ScheduleSection events={data.events} gradient={gradient} />}
      {videoComplete && <GallerySection photos={data.gallery_photos} brideName={brideName} groomName={groomName} isPreview={isPreview} />}
      {videoComplete && <DresscodeSection enabled={data.dresscode_enabled} text={data.dresscode_text} colors={data.dresscode_colors} isPreview={isPreview} />}
      {videoComplete && <GiftsSection upiId={data.upi_id} giftRegistryUrl={data.gift_registry_url} brideName={brideName} groomName={groomName} />}
      {videoComplete && <VenueMapSection events={data.events} venueDescription={data.venue_description} venuePhoto={data.venue_photo} isPreview={isPreview} />}
      {videoComplete && <RsvpSection brideName={brideName} groomName={groomName} rsvpDeadline={data.rsvp_deadline} isPreview={isPreview} />}
      {videoComplete && <MusicSection musicUrl={data.music_url} isPreview={isPreview} />}
      {videoComplete && <FooterSection brideName={brideName} groomName={groomName} weddingDate={data.wedding_date} events={data.events} personalMessage={data.personal_message} />}
    </div>
  );
}
