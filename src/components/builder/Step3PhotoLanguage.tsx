import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = async (file: File) => {
    setUploadError("");
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Only JPG, PNG, and WEBP are accepted");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("couple-photos")
      .upload(path, file, { upsert: true });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("couple-photos")
      .getPublicUrl(path);

    onChange({ photo_url: urlData.publicUrl });
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removePhoto = () => onChange({ photo_url: null });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-primary mb-1">Photo & Language</h2>
        <p className="font-body text-sm text-muted-foreground">Add your couple photo and choose the invitation language</p>
      </div>

      {/* Photo upload */}
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
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border hover:border-secondary cursor-pointer flex flex-col items-center justify-center py-12 px-6 transition-colors"
          >
            {uploading ? (
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
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
        {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
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
    </div>
  );
};

export default Step3PhotoLanguage;
