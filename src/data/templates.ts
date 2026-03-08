export interface TemplateConfig {
  id: string;
  name: string;
  tagline: string;
  previewGradient: string;

  // Filter metadata
  religion: ('Hindu' | 'Muslim' | 'Sikh' | 'Christian' | 'Jain')[];
  region: ('North' | 'South' | 'East' | 'West' | 'Pan-India')[];
  style: ('Traditional' | 'Modern' | 'Minimal' | 'Royal' | 'Floral')[];
  colorFamily: ('Red' | 'Gold' | 'Green' | 'Blue' | 'Pink' | 'Ivory' | 'Purple')[];

  // Badges
  isNew: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  isComingSoon: boolean;

  // Plan availability
  availableOn: ('basic' | 'premium' | 'elite')[];

  // Sample data
  sampleData: {
    brideName: string;
    groomName: string;
    date: string;
    city: string;
  };

  // Legacy compat
  community: string;
  gradient: string;
  motif: string;
}

export const templates: TemplateConfig[] = [
  {
    id: "royal-maroon",
    name: "Royal Maroon",
    tagline: "A cinematic invitation with video background and golden accents",
    previewGradient: "linear-gradient(160deg,#3A0512 0%,#6B1428 50%,#3A0512 100%)",
    religion: ["Hindu"],
    region: ["North", "Pan-India"],
    style: ["Royal", "Traditional"],
    colorFamily: ["Red", "Gold"],
    isNew: false,
    isFeatured: true,
    isPremium: false,
    isComingSoon: false,
    availableOn: ["basic", "premium", "elite"],
    sampleData: { brideName: "Priya", groomName: "Arjun", date: "15 · 12 · 2026", city: "Jaipur" },
    community: "North Indian",
    gradient: "from-[#7B1C2E] to-[#4a1019]",
    motif: "✦",
  },
  {
    id: "emerald-south",
    name: "Emerald South",
    tagline: "Elegant South Indian design with botanical accents",
    previewGradient: "linear-gradient(160deg,#0D2818 0%,#1A5C30 60%,#0D2818 100%)",
    religion: ["Hindu"],
    region: ["South"],
    style: ["Traditional", "Floral"],
    colorFamily: ["Green", "Gold"],
    isNew: true,
    isFeatured: false,
    isPremium: false,
    isComingSoon: true,
    availableOn: ["premium", "elite"],
    sampleData: { brideName: "Kavya", groomName: "Siddharth", date: "20 · 04 · 2026", city: "Bangalore" },
    community: "South Indian",
    gradient: "from-emerald-800 to-emerald-950",
    motif: "❂",
  },
  {
    id: "golden-sehra",
    name: "Golden Sehra",
    tagline: "Vibrant Punjabi design with Gurmukhi script support",
    previewGradient: "linear-gradient(160deg,#2A1800,#6B4000,#2A1800)",
    religion: ["Sikh"],
    region: ["North"],
    style: ["Traditional", "Royal"],
    colorFamily: ["Gold", "Red"],
    isNew: true,
    isFeatured: false,
    isPremium: false,
    isComingSoon: true,
    availableOn: ["premium", "elite"],
    sampleData: { brideName: "Simran", groomName: "Harjeet", date: "22 · 11 · 2026", city: "Amritsar" },
    community: "Sikh",
    gradient: "from-amber-600 to-orange-800",
    motif: "☬",
  },
  {
    id: "pearl-nikah",
    name: "Pearl Nikah",
    tagline: "Graceful Islamic design with Arabic script support",
    previewGradient: "linear-gradient(160deg,#1a0a16 0%,#3a0e2e 50%,#5C1040 100%)",
    religion: ["Muslim"],
    region: ["South", "North"],
    style: ["Traditional", "Minimal"],
    colorFamily: ["Ivory", "Gold"],
    isNew: true,
    isFeatured: false,
    isPremium: true,
    isComingSoon: true,
    availableOn: ["premium", "elite"],
    sampleData: { brideName: "Aisha", groomName: "Zayan", date: "05 · 12 · 2026", city: "Hyderabad" },
    community: "Muslim",
    gradient: "from-stone-600 to-stone-800",
    motif: "◆",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    tagline: "Contemporary minimal design for the modern couple",
    previewGradient: "linear-gradient(160deg,#0a0d1a,#0e1a3a,#1c2d6b)",
    religion: ["Hindu", "Christian"],
    region: ["Pan-India"],
    style: ["Modern", "Minimal"],
    colorFamily: ["Blue", "Gold"],
    isNew: true,
    isFeatured: false,
    isPremium: false,
    isComingSoon: true,
    availableOn: ["basic", "premium", "elite"],
    sampleData: { brideName: "Meera", groomName: "Vivek", date: "10 · 04 · 2026", city: "Mumbai" },
    community: "Modern",
    gradient: "from-slate-800 to-slate-950",
    motif: "◇",
  },
  {
    id: "teal-luxury",
    name: "Teal Luxury",
    tagline: "Regal Maharashtrian design with Sanskrit verse support",
    previewGradient: "linear-gradient(160deg,#0a1a16 0%,#0e3a2e 50%,#1c6b52 100%)",
    religion: ["Hindu"],
    region: ["West"],
    style: ["Royal", "Traditional"],
    colorFamily: ["Green", "Gold"],
    isNew: false,
    isFeatured: false,
    isPremium: true,
    isComingSoon: true,
    availableOn: ["elite"],
    sampleData: { brideName: "Kavya", groomName: "Siddharth", date: "18 · 01 · 2026", city: "Pune" },
    community: "South Indian",
    gradient: "from-teal-700 to-teal-950",
    motif: "❖",
  },
  {
    id: "rose-garden",
    name: "Rose Garden",
    tagline: "Romantic floral design with soft pastel tones",
    previewGradient: "linear-gradient(160deg,#4c0519 0%,#9f1239 50%,#4c0519 100%)",
    religion: ["Hindu", "Christian", "Jain"],
    region: ["Pan-India"],
    style: ["Floral", "Modern"],
    colorFamily: ["Pink", "Gold"],
    isNew: true,
    isFeatured: false,
    isPremium: false,
    isComingSoon: true,
    availableOn: ["basic", "premium", "elite"],
    sampleData: { brideName: "Ananya", groomName: "Rohan", date: "25 · 02 · 2026", city: "Delhi" },
    community: "Muslim",
    gradient: "from-rose-700 to-pink-900",
    motif: "✿",
  },
  {
    id: "chapel-white",
    name: "Chapel White",
    tagline: "Clean, elegant design for Christian weddings",
    previewGradient: "linear-gradient(160deg,#f5f0e8 0%,#e8dfd2 50%,#f5f0e8 100%)",
    religion: ["Christian"],
    region: ["South", "West"],
    style: ["Minimal", "Modern"],
    colorFamily: ["Ivory", "Gold"],
    isNew: true,
    isFeatured: false,
    isPremium: false,
    isComingSoon: true,
    availableOn: ["basic", "premium", "elite"],
    sampleData: { brideName: "Maria", groomName: "Samuel", date: "14 · 02 · 2026", city: "Goa" },
    community: "Christian",
    gradient: "from-stone-200 to-stone-400",
    motif: "✝",
  },
];

export const getTemplateById = (id: string) => templates.find((t) => t.id === id);

export const getTemplateConfigById = (id: string) => templates.find((t) => t.id === id);

export const getCeremonyLabel = (community: string): string => {
  switch (community) {
    case "Muslim": return "Nikah";
    case "Sikh": return "Anand Karaj";
    case "South Indian": return "Kalyanam";
    default: return "Vivah";
  }
};

// Filter options derived from data
export const FILTER_OPTIONS = {
  religion: ["Hindu", "Muslim", "Sikh", "Christian", "Jain"] as const,
  region: ["North", "South", "East", "West", "Pan-India"] as const,
  style: ["Traditional", "Modern", "Minimal", "Royal", "Floral"] as const,
  colorFamily: [
    { label: "Red", dot: "#dc2626" },
    { label: "Gold", dot: "#d97706" },
    { label: "Green", dot: "#16a34a" },
    { label: "Blue", dot: "#2563eb" },
    { label: "Pink", dot: "#ec4899" },
    { label: "Ivory", dot: "#e8dfd2" },
    { label: "Purple", dot: "#9333ea" },
  ] as const,
  badge: ["Featured", "New", "Premium"] as const,
};
