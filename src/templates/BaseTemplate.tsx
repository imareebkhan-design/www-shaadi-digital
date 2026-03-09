import { useState, type CSSProperties } from "react";
import type { InvitationData } from "./types";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import EnvelopeIntro from "./sections/EnvelopeIntro";
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

export interface TemplateTheme {
  bgPrimary: string;       // Main background (e.g., "340 55% 20%" for burgundy)
  bgSecondary: string;     // Secondary/lighter bg
  textPrimary: string;     // Primary text on dark bg (usually light)
  textMuted: string;       // Muted text
  accent: string;          // Accent color (gold, etc.)
  accentLight: string;     // Light variant of accent
}

// Pre-defined themes for each template
export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  "royal-maroon": {
    bgPrimary: "340 55% 20%",      // burgundy
    bgSecondary: "345 60% 25%",    // maroon
    textPrimary: "40 50% 95%",
    textMuted: "40 50% 70%",
    accent: "40 72% 52%",          // gold
    accentLight: "42 80% 72%",
  },
  "emerald-south": {
    bgPrimary: "152 50% 12%",      // deep emerald
    bgSecondary: "152 45% 18%",    // emerald
    textPrimary: "42 80% 95%",
    textMuted: "42 50% 70%",
    accent: "42 72% 52%",          // gold
    accentLight: "42 80% 72%",
  },
  "midnight-blue": {
    bgPrimary: "222 47% 11%",      // slate-900
    bgSecondary: "217 33% 17%",    // slate-800
    textPrimary: "210 40% 96%",
    textMuted: "215 20% 65%",
    accent: "45 93% 47%",          // amber
    accentLight: "48 96% 70%",
  },
  "golden-punjabi": {
    bgPrimary: "32 100% 10%",      // deep amber/brown
    bgSecondary: "36 90% 18%",
    textPrimary: "42 90% 95%",
    textMuted: "40 60% 70%",
    accent: "40 90% 50%",          // gold
    accentLight: "45 95% 70%",
  },
  "rose-garden": {
    bgPrimary: "345 82% 15%",      // rose-950
    bgSecondary: "345 75% 25%",    // rose-900
    textPrimary: "350 30% 96%",
    textMuted: "350 30% 70%",
    accent: "340 65% 60%",         // rose
    accentLight: "350 80% 80%",
  },
  "teal-luxury": {
    bgPrimary: "25 80% 10%",       // deep saffron-brown
    bgSecondary: "30 70% 18%",     // warm amber
    textPrimary: "42 80% 95%",
    textMuted: "42 40% 70%",
    accent: "42 72% 52%",          // gold
    accentLight: "42 80% 72%",
  },
  "pearl-nikah": {
    bgPrimary: "222 60% 10%",       // midnight navy
    bgSecondary: "222 55% 14%",     // slightly lighter navy
    textPrimary: "210 40% 96%",
    textMuted: "210 20% 65%",
    accent: "40 72% 52%",           // gold
    accentLight: "42 80% 72%",
  },
  "ivory-classic": {
    bgPrimary: "35 30% 15%",       // warm brown
    bgSecondary: "35 25% 22%",
    textPrimary: "35 30% 95%",
    textMuted: "35 20% 70%",
    accent: "40 72% 52%",
    accentLight: "42 80% 72%",
  },
  "saffron-fest": {
    bgPrimary: "20 90% 15%",       // deep orange
    bgSecondary: "24 85% 25%",
    textPrimary: "35 90% 95%",
    textMuted: "30 70% 75%",
    accent: "35 95% 55%",          // saffron/marigold
    accentLight: "40 95% 70%",
  },
  "blush-modern": {
    bgPrimary: "300 60% 20%",      // fuchsia-950
    bgSecondary: "295 55% 28%",
    textPrimary: "330 30% 96%",
    textMuted: "320 25% 70%",
    accent: "330 80% 65%",         // pink
    accentLight: "340 85% 80%",
  },
};

interface BaseTemplateProps {
  data: InvitationData;
  isPreview?: boolean;
  gradient: string;
  motif: string;
  accentColor?: string;
  templateId?: string;
}

const placeholder = (value: string | undefined, fallback: string, isPreview: boolean) =>
  value?.trim() ? value : isPreview ? fallback : value || "";

const BaseTemplate = ({ data, isPreview = false, gradient, motif, templateId = "royal-maroon" }: BaseTemplateProps) => {
  const theme = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES["royal-maroon"];
  const [envelopeOpened, setEnvelopeOpened] = useState(isPreview);
  const [videoComplete, setVideoComplete] = useState(isPreview);

  const brideName = placeholder(data.bride_name, "Priya", isPreview);
  const groomName = placeholder(data.groom_name, "Arjun", isPreview);
  const brideFamily = placeholder(data.bride_family, "Daughter of your family", isPreview);
  const groomFamily = placeholder(data.groom_family, "Son of your family", isPreview);

  const formattedDate = data.wedding_date
    ? new Date(data.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : isPreview ? "15 December 2026" : null;

  // CSS custom properties for template theming
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
      {/* Envelope Intro */}
      {!envelopeOpened && (
        <EnvelopeIntro
          brideName={brideName}
          groomName={groomName}
          onOpen={() => setEnvelopeOpened(true)}
          templateId={templateId}
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

      {/* Floating music player */}
      {videoComplete && <FloatingMusicPlayer musicUrl={data.music_url} />}

      {/* 1. HERO */}
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

      {/* 2. SAVE THE DATE */}
      {videoComplete && <SaveTheDateSection weddingDate={data.wedding_date} isPreview={isPreview} />}

      {/* 3. OUR STORY */}
      {videoComplete && <OurStorySection story={data.our_story || data.personal_message} isPreview={isPreview} />}

      {/* 4. THE COUPLE */}
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

      {/* 5. SCHEDULE */}
      {videoComplete && <ScheduleSection events={data.events} gradient={gradient} />}

      {/* 6. GALLERY */}
      {videoComplete && <GallerySection photos={data.gallery_photos} brideName={brideName} groomName={groomName} isPreview={isPreview} />}

      {/* 7. DRESSCODE */}
      {videoComplete && <DresscodeSection enabled={data.dresscode_enabled} text={data.dresscode_text} colors={data.dresscode_colors} isPreview={isPreview} />}

      {/* 8. GIFTS */}
      {videoComplete && <GiftsSection upiId={data.upi_id} giftRegistryUrl={data.gift_registry_url} brideName={brideName} groomName={groomName} />}

      {/* 9. MAP & VENUE */}
      {videoComplete && <VenueMapSection events={data.events} venueDescription={data.venue_description} venuePhoto={data.venue_photo} isPreview={isPreview} />}

      {/* 10. RSVP CTA */}
      {videoComplete && <RsvpSection brideName={brideName} groomName={groomName} rsvpDeadline={data.rsvp_deadline} isPreview={isPreview} />}

      {/* 11. MUSIC */}
      {videoComplete && <MusicSection musicUrl={data.music_url} isPreview={isPreview} />}

      {/* 12. FOOTER */}
      {videoComplete && <FooterSection brideName={brideName} groomName={groomName} weddingDate={data.wedding_date} events={data.events} personalMessage={data.personal_message} />}
    </div>
  );
};

export default BaseTemplate;
