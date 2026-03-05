export interface TemplateData {
  id: string;
  name: string;
  community: string;
  style: string;
  gradient: string;
  motif: string;
  bride: string;
  groom: string;
  date: string;
}

export const templates: TemplateData[] = [
  { id: "template-01", name: "Royal Maroon", community: "North Indian", style: "Traditional", gradient: "from-[#7B1C2E] to-[#4a1019]", motif: "✦", bride: "Priya", groom: "Arjun", date: "15 Dec 2026" },
  { id: "template-02", name: "Emerald South", community: "South Indian", style: "Elegant", gradient: "from-emerald-800 to-emerald-950", motif: "❂", bride: "Lakshmi", groom: "Karthik", date: "22 Jan 2027" },
  { id: "template-03", name: "Midnight Blue", community: "Modern", style: "Minimal", gradient: "from-slate-800 to-slate-950", motif: "◇", bride: "Anika", groom: "Rohan", date: "8 Mar 2027" },
  { id: "template-04", name: "Golden Punjabi", community: "Sikh", style: "Traditional", gradient: "from-amber-600 to-orange-800", motif: "☬", bride: "Simran", groom: "Harpreet", date: "5 Nov 2026" },
  { id: "template-05", name: "Rose Garden", community: "Muslim", style: "Floral", gradient: "from-rose-700 to-pink-900", motif: "✿", bride: "Ayesha", groom: "Faizan", date: "18 Feb 2027" },
  { id: "template-06", name: "Teal Luxury", community: "South Indian", style: "Luxury", gradient: "from-teal-700 to-teal-950", motif: "❖", bride: "Meera", groom: "Vijay", date: "30 Dec 2026" },
  { id: "template-07", name: "Ivory Classic", community: "North Indian", style: "Luxury", gradient: "from-[#5c4a2f] to-[#3a2e1a]", motif: "❧", bride: "Neha", groom: "Vikram", date: "12 Apr 2027" },
  { id: "template-08", name: "Saffron Fest", community: "North Indian", style: "Playful", gradient: "from-orange-500 to-red-600", motif: "✺", bride: "Riya", groom: "Aarav", date: "20 Oct 2026" },
  { id: "template-09", name: "Pearl Nikah", community: "Muslim", style: "Minimal", gradient: "from-stone-600 to-stone-800", motif: "◆", bride: "Zara", groom: "Imran", date: "9 May 2027" },
  { id: "template-10", name: "Blush Modern", community: "Modern", style: "Minimal", gradient: "from-pink-400 to-fuchsia-600", motif: "△", bride: "Tara", groom: "Dev", date: "1 Jun 2027" },
];

export const getTemplateById = (id: string) => templates.find((t) => t.id === id);

export const getCeremonyLabel = (community: string): string => {
  switch (community) {
    case "Muslim": return "Nikah";
    case "Sikh": return "Anand Karaj";
    case "South Indian": return "Kalyanam";
    default: return "Vivah";
  }
};
