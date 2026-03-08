import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon, Video, Camera, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BuilderFormData } from "@/types/builder";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
}

const STORAGE_BASE = `https://yqrwvrbhaxkkytsqtvlw.supabase.co/storage/v1/object/public/music-tracks`;

const musicPresets = [
  { label: "Soft Piano", emoji: "🎹", url: `${STORAGE_BASE}/soft-piano.mp3` },
  { label: "Classical Sitar", emoji: "🪕", url: `${STORAGE_BASE}/classical-sitar.mp3` },
  { label: "Acoustic Guitar", emoji: "🎸", url: `${STORAGE_BASE}/acoustic-guitar.mp3` },
  { label: "Shehnai", emoji: "🎺", url: `${STORAGE_BASE}/shehnai.mp3` },
  { label: "Violin Romance", emoji: "🎻", url: `${STORAGE_BASE}/violin-romance.mp3` },
];

const languages = [
  { value: "english" as const, label: "English" },
  { value: "hindi" as const, label: "हिन्दी" },
  { value: "tamil" as const, label: "தமிழ்" },
  { value: "punjabi" as const, label: "ਪੰਜਾਬੀ" },
  { value: "urdu" as const, label: "اردو" },
];

const Step3PhotoLanguage = ({ data, onChange, errors }: Props) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const venuePhotoRef = useRef<HTMLInputElement>(null);
  const galleryRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [uploading, setUploading] = useState("");
  const [uploadError, setUploadError] = useState("");

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) { setUploadError("File must be under 5MB"); return null; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setUploadError("Only JPG, PNG, WEBP"); return null; }
    setUploadError("");
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { setUploadError(error.message); return null; }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleCouplePhoto = async (file: File) => {
    setUploading("couple");
    const url = await uploadFile(file, "couple-photos");
    if (url) onChange({ photo_url: url });
    setUploading("");
  };

  const handleVenuePhoto = async (file: File) => {
    setUploading("venue");
    const url = await uploadFile(file, "couple-photos");
    if (url) onChange({ venue_photo: url });
    setUploading("");
  };

  const handleGalleryPhoto = async (file: File, index: number) => {
    setUploading(`gallery-${index}`);
    const url = await uploadFile(file, "couple-photos");
    if (url) {
      const photos = [...(data.gallery_photos || [])];
      photos[index] = url;
      onChange({ gallery_photos: photos });
    }
    setUploading("");
  };

  const removePhoto = () => onChange({ photo_url: null });
  const removeVenuePhoto = () => onChange({ venue_photo: "" });
  const removeGalleryPhoto = (index: number) => {
    const photos = [...(data.gallery_photos || [])];
    photos.splice(index, 1);
    onChange({ gallery_photos: photos });
  };

  const handleDrop = (e: React.DragEvent, handler: (f: File) => void) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handler(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-primary mb-1">Photos, Venue & Details</h2>
        <p className="font-body text-sm text-muted-foreground">Add photos, venue info, and customise your invitation</p>
      </div>

      {/* Hero Media Type */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-2">Hero Background</label>
        <p className="font-body text-xs text-muted-foreground mb-3">This appears as the full-screen background on your invitation</p>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => onChange({ hero_media_type: "photo" })}
            className={`flex items-center gap-2 px-4 py-2.5 border font-body text-sm transition-colors ${
              (data.hero_media_type || "photo") === "photo"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-secondary"
            }`}
          >
            <Camera className="w-4 h-4" /> Use Photo
          </button>
          <button
            type="button"
            onClick={() => onChange({ hero_media_type: "video" })}
            className={`flex items-center gap-2 px-4 py-2.5 border font-body text-sm transition-colors ${
              data.hero_media_type === "video"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-secondary"
            }`}
          >
            <Video className="w-4 h-4" /> Use Video
          </button>
        </div>
        {data.hero_media_type === "video" ? (
          <Input
            placeholder="Paste YouTube, Vimeo, or direct MP4 URL"
            value={data.hero_media_url || ""}
            onChange={(e) => onChange({ hero_media_url: e.target.value })}
          />
        ) : null}
      </div>

      {/* Couple Photo upload */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-2">Couple Photo</label>
        {data.photo_url ? (
          <div className="relative w-48 h-48 border border-border overflow-hidden group">
            <img src={data.photo_url} alt="Couple" className="w-full h-full object-cover" />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => handleDrop(e, handleCouplePhoto)}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border hover:border-secondary cursor-pointer flex flex-col items-center justify-center py-12 px-6 transition-colors"
          >
            {uploading === "couple" ? (
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="font-body text-sm text-muted-foreground">Drag & drop or click to upload</p>
                <p className="font-body text-xs text-muted-foreground mt-1">JPG, PNG, WEBP • Max 5MB</p>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCouplePhoto(f); }} />
      </div>

      {/* Wedding City */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Wedding City <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          placeholder="e.g. Jaipur, Rajasthan"
          value={data.wedding_city || ""}
          onChange={(e) => onChange({ wedding_city: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">City shown on your invitation hero</p>
      </div>

      {/* Venue Details */}
      <div className="space-y-4 p-4 border border-border bg-card">
        <h3 className="font-display text-lg text-primary">Main Venue</h3>
        <div>
          <label className="font-body text-xs text-muted-foreground mb-1 block">Venue Photo</label>
          {data.venue_photo ? (
            <div className="relative w-full h-40 border border-border overflow-hidden group">
              <img src={data.venue_photo} alt="Venue" className="w-full h-full object-cover" />
              <button onClick={removeVenuePhoto} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => venuePhotoRef.current?.click()}
              onDrop={(e) => handleDrop(e, handleVenuePhoto)}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border hover:border-secondary cursor-pointer flex items-center justify-center py-8 transition-colors"
            >
              {uploading === "venue" ? (
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <p className="font-body text-xs text-muted-foreground">Click to upload venue photo</p>
              )}
            </div>
          )}
          <input ref={venuePhotoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVenuePhoto(f); }} />
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground mb-1 block">Venue Description</label>
          <Textarea
            placeholder="e.g. A 475-year-old royal heritage palace nestled in the hills…"
            value={data.venue_description || ""}
            onChange={(e) => { if (e.target.value.length <= 200) onChange({ venue_description: e.target.value }); }}
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      {/* Gallery Photos (2x2 grid) */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1">
          Gallery Photos <span className="text-muted-foreground">(up to 4)</span>
        </label>
        <p className="font-body text-xs text-muted-foreground mb-3">These appear in your invitation's photo gallery</p>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => {
            const photo = data.gallery_photos?.[i];
            return (
              <div key={i} className="aspect-square border border-border overflow-hidden relative group">
                {photo ? (
                  <>
                    <img src={photo} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeGalleryPhoto(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => galleryRefs.current[i]?.click()}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {uploading === `gallery-${i}` ? (
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Photo {i + 1}</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={(el) => { galleryRefs.current[i] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleGalleryPhoto(f, i); }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* RSVP Deadline */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          RSVP Deadline <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          type="date"
          value={data.rsvp_deadline || ""}
          onChange={(e) => onChange({ rsvp_deadline: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">Guests will be asked to respond by this date</p>
      </div>

      {/* Language selector */}
      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-3">Invitation Language</label>
        <div className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => onChange({ language: lang.value })}
              className={`px-5 py-2.5 border font-body text-sm transition-colors ${
                data.language === lang.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-secondary"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div className="space-y-4 pt-2">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Dress Code <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Traditional Indian, Pastels, Formal Western"
            value={data.dresscode_text || ""}
            onChange={(e) => onChange({ dresscode_text: e.target.value, dresscode_enabled: !!e.target.value.trim() })}
          />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            UPI ID for Gifts <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="e.g. yourname@upi"
            value={data.upi_id}
            onChange={(e) => onChange({ upi_id: e.target.value })}
          />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Gift Registry Link <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="https://..."
            value={data.gift_registry_url}
            onChange={(e) => onChange({ gift_registry_url: e.target.value })}
          />
        </div>

        {/* Background Music */}
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1">
            Background Music <span className="text-muted-foreground">(optional)</span>
          </label>
          <p className="font-body text-xs text-muted-foreground mb-3">
            Paste a direct MP3 link, or choose from our curated tracks below
          </p>
          <Input
            placeholder="https://example.com/track.mp3"
            value={data.music_url || ""}
            onChange={(e) => onChange({ music_url: e.target.value })}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {musicPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange({ music_url: preset.url })}
                className={`px-3.5 py-1.5 text-xs font-body font-medium border transition-colors ${
                  data.music_url === preset.url
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-secondary"
                }`}
              >
                {preset.emoji} {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
    </div>
  );
};

export default Step3PhotoLanguage;
