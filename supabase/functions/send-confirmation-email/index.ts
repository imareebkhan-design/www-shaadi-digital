const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function capitalize(plan: string): string {
  const map: Record<string, string> = { shubh: "Shubh", shaadi: "Shaadi", shaahi: "Shaahi" };
  return map[plan.toLowerCase()] || plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatAmount(amountInRupees: number): string {
  return "₹" + amountInRupees.toLocaleString("en-IN");
}

function buildEmailHtml(data: {
  name: string;
  plan: string;
  amount: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  activated_at: string;
  expires_at: string;
}): string {
  const firstName = data.name.split(" ")[0];
  const planName = capitalize(data.plan);
  const amountStr = formatAmount(data.amount);
  const dateStr = formatDate(data.activated_at);
  const expiryStr = formatDate(data.expires_at);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background-color:#FAF6EF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6EF;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e8e0d6;">

<!-- Header -->
<tr><td style="padding:32px 32px 16px;text-align:center;border-bottom:2px solid #C9941A;">
  <h1 style="margin:0;font-size:24px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">Shaadi<span style="color:#C9941A;">.</span>Digital</h1>
</td></tr>

<!-- Main heading -->
<tr><td style="padding:32px 32px 8px;text-align:center;">
  <h2 style="margin:0;font-size:22px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">Aapka Order Confirm Ho Gaya! ✓</h2>
</td></tr>
<tr><td style="padding:0 32px 24px;text-align:center;">
  <p style="margin:0;font-size:16px;color:#6B5B4E;">Welcome to Shaadi.Digital, ${firstName}</p>
</td></tr>

<!-- Order summary -->
<tr><td style="padding:0 32px 24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF3DC;border:1px solid #e8dcc5;border-radius:4px;">
    <tr><td style="padding:20px;">
      <h3 style="margin:0 0 16px;font-size:14px;color:#7B1C2E;text-transform:uppercase;letter-spacing:1px;">Order Summary</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1C1410;">
        <tr><td style="padding:6px 0;color:#6B5B4E;">Plan</td><td style="padding:6px 0;text-align:right;font-weight:600;">${planName} Plan</td></tr>
        <tr><td style="padding:6px 0;color:#6B5B4E;">Amount Paid</td><td style="padding:6px 0;text-align:right;font-weight:600;">${amountStr}</td></tr>
        <tr><td style="padding:6px 0;color:#6B5B4E;">Payment ID</td><td style="padding:6px 0;text-align:right;font-size:12px;">${data.razorpay_payment_id}</td></tr>
        <tr><td style="padding:6px 0;color:#6B5B4E;">Order ID</td><td style="padding:6px 0;text-align:right;font-size:12px;">${data.razorpay_order_id}</td></tr>
        <tr><td style="padding:6px 0;color:#6B5B4E;">Date</td><td style="padding:6px 0;text-align:right;">${dateStr}</td></tr>
        <tr><td style="padding:6px 0;color:#6B5B4E;">Valid Until</td><td style="padding:6px 0;text-align:right;font-weight:600;color:#C9941A;">${expiryStr}</td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 32px 32px;text-align:center;">
  <a href="https://shaadi.digital/dashboard" style="display:inline-block;padding:14px 32px;background-color:#C9941A;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">Start Building Your Invitation →</a>
</td></tr>

<!-- What's next -->
<tr><td style="padding:0 32px 24px;">
  <h3 style="margin:0 0 12px;font-size:16px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">What happens next?</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1C1410;">
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">1</span> Log in to your dashboard</td></tr>
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">2</span> Choose your wedding template</td></tr>
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">3</span> Add your details and go live</td></tr>
  </table>
</td></tr>

<!-- Support -->
<tr><td style="padding:24px 32px;border-top:1px solid #e8e0d6;text-align:center;">
  <p style="margin:0 0 8px;font-size:14px;color:#6B5B4E;">Need help? <a href="https://wa.me/919999999999" style="color:#7B1C2E;text-decoration:underline;">WhatsApp us</a> or email <a href="mailto:support@shaadi.digital" style="color:#7B1C2E;text-decoration:underline;">support@shaadi.digital</a></p>
</td></tr>

<!-- Footer -->
<tr><td style="padding:16px 32px 24px;text-align:center;">
  <p style="margin:0 0 4px;font-size:12px;color:#6B5B4E;">© 2026 Shaadi.Digital · Crafted with care in India</p>
  <p style="margin:0;font-size:11px;color:#a89b8e;">This is an automated email. Please do not reply.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, plan, amount, razorpay_payment_id, razorpay_order_id, activated_at, expires_at } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Resend key loaded:", !!resendApiKey);

    const html = buildEmailHtml({ name, plan, amount, razorpay_payment_id, razorpay_order_id, activated_at, expires_at });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: "Shaadi.Digital <noreply@shaadi.digital>",
        to: [email],
        subject: "Your Shaadi.Digital invitation is ready ✨ — Order Confirmed",
        html,
      }),
    });

    const result = await res.text();

    if (!res.ok) {
      console.error("Resend API error:", result);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-confirmation-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
