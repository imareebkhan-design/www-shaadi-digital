import type { InvitationData } from "./types";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
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

interface BaseTemplateProps {
  data: InvitationData;
  isPreview?: boolean;
  gradient: string;
  motif: string;
  accentColor?: string;
}

const placeholder = (value: string | undefined, fallback: string, isPreview: boolean) =>
  value?.trim() ? value : isPreview ? fallback : value || "";

const BaseTemplate = ({ data, isPreview = false, gradient, motif }: BaseTemplateProps) => {
  const brideName = placeholder(data.bride_name, "Bride's Name", isPreview);
  const groomName = placeholder(data.groom_name, "Groom's Name", isPreview);
  const brideFamily = placeholder(data.bride_family, "Bride's Family", isPreview);
  const groomFamily = placeholder(data.groom_family, "Groom's Family", isPreview);

  const formattedDate = data.wedding_date
    ? new Date(data.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : isPreview ? "15 December 2026" : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Floating music player */}
      <FloatingMusicPlayer musicUrl={data.music_url} />

      {/* 1. HERO */}
      <HeroSection
        brideName={brideName}
        groomName={groomName}
        brideFamily={brideFamily}
        groomFamily={groomFamily}
        formattedDate={formattedDate}
        photoUrl={data.photo_url}
        gradient={gradient}
        motif={motif}
      />

      {/* 2. SAVE THE DATE */}
      <SaveTheDateSection weddingDate={data.wedding_date} isPreview={isPreview} />

      {/* 3. OUR STORY */}
      <OurStorySection story={data.our_story || data.personal_message} isPreview={isPreview} />

      {/* 4. THE COUPLE */}
      <CoupleSection
        brideName={brideName}
        groomName={groomName}
        brideFamily={brideFamily}
        groomFamily={groomFamily}
        photoUrl={data.photo_url}
        gradient={gradient}
      />

      {/* 5. SCHEDULE */}
      <ScheduleSection events={data.events} gradient={gradient} />

      {/* 6. GALLERY */}
      <GallerySection photos={data.gallery_photos} brideName={brideName} groomName={groomName} isPreview={isPreview} />

      {/* 7. DRESSCODE */}
      <DresscodeSection enabled={data.dresscode_enabled} text={data.dresscode_text} colors={data.dresscode_colors} isPreview={isPreview} />

      {/* 8. GIFTS */}
      <GiftsSection upiId={data.upi_id} giftRegistryUrl={data.gift_registry_url} brideName={brideName} groomName={groomName} />

      {/* 9. MAP & VENUE */}
      <VenueMapSection events={data.events} />

      {/* 10. RSVP CTA */}
      <RsvpSection brideName={brideName} groomName={groomName} />

      {/* 11. MUSIC */}
      <MusicSection musicUrl={data.music_url} isPreview={isPreview} />

      {/* 12. FOOTER */}
      <FooterSection brideName={brideName} groomName={groomName} weddingDate={data.wedding_date} events={data.events} />
    </div>
  );
};

export default BaseTemplate;
