import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: inv } = await supabase
      .from("invitations")
      .select("bride_name, groom_name, wedding_date, wedding_city, template_id")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    const brideName = inv?.bride_name || "Bride";
    const groomName = inv?.groom_name || "Groom";
    const weddingDate = inv?.wedding_date
      ? new Date(inv.wedding_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
    const city = (inv as any)?.wedding_city || "";
    const dateCity = [weddingDate, city?.toUpperCase()].filter(Boolean).join(" · ");

    // Generate SVG-based OG image (1200x630)
    const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&amp;family=DM+Sans:wght@400;500&amp;display=swap');
        </style>
        <pattern id="ornament" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(45)">
          <circle cx="30" cy="30" r="1" fill="#E8B84B" opacity="0.15"/>
        </pattern>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4A0E1A"/>
          <stop offset="50%" style="stop-color:#5C1425"/>
          <stop offset="100%" style="stop-color:#3D0B15"/>
        </linearGradient>
        <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:transparent"/>
          <stop offset="30%" style="stop-color:#E8B84B;stop-opacity:0.6"/>
          <stop offset="70%" style="stop-color:#E8B84B;stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:transparent"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#ornament)"/>
      
      <!-- Gold border -->
      <rect x="20" y="20" width="1160" height="590" rx="0" ry="0" fill="none" stroke="#E8B84B" stroke-width="1" opacity="0.3"/>
      <rect x="30" y="30" width="1140" height="570" rx="0" ry="0" fill="none" stroke="#E8B84B" stroke-width="0.5" opacity="0.15"/>
      
      <!-- Top line -->
      <rect x="300" y="140" width="600" height="1" fill="url(#goldLine)"/>
      
      <!-- "You are cordially invited" -->
      <text x="600" y="120" text-anchor="middle" fill="#E8B84B" font-family="'DM Sans', sans-serif" font-size="13" letter-spacing="4" opacity="0.8">YOU ARE CORDIALLY INVITED</text>
      
      <!-- Bride name -->
      <text x="600" y="260" text-anchor="middle" fill="white" font-family="'Cormorant Garamond', serif" font-size="72" font-weight="600">${escapeXml(brideName)}</text>
      
      <!-- & symbol -->
      <text x="600" y="330" text-anchor="middle" fill="#E8B84B" font-family="'Cormorant Garamond', serif" font-size="42" font-weight="400" opacity="0.9">&amp;</text>
      
      <!-- Groom name -->
      <text x="600" y="400" text-anchor="middle" fill="white" font-family="'Cormorant Garamond', serif" font-size="72" font-weight="600">${escapeXml(groomName)}</text>
      
      <!-- Bottom line -->
      <rect x="300" y="440" width="600" height="1" fill="url(#goldLine)"/>
      
      <!-- Date & City -->
      ${dateCity ? `<text x="600" y="490" text-anchor="middle" fill="#E8B84B" font-family="'DM Sans', sans-serif" font-size="14" letter-spacing="3" opacity="0.8">${escapeXml(dateCity)}</text>` : ""}
      
      <!-- Branding -->
      <text x="600" y="575" text-anchor="middle" fill="white" font-family="'DM Sans', sans-serif" font-size="11" opacity="0.3" letter-spacing="2">SHAADI.DIGITAL</text>
    </svg>`;

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("OG Image error:", error);
    return new Response("Error generating image", {
      status: 500,
      headers: corsHeaders,
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
