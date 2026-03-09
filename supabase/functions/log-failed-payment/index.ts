import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildFailedEmailHtml(data: { name: string; plan: string; amount: number }): string {
  const capitalize = (s: string) => {
    const map: Record<string, string> = { shubh: "Shubh", shaadi: "Shaadi", shaahi: "Shaahi" };
    return map[s.toLowerCase()] || s.charAt(0).toUpperCase() + s.slice(1);
  };
  const planName = capitalize(data.plan);
  const amountStr = "₹" + data.amount.toLocaleString("en-IN");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Payment Unsuccessful</title></head>
<body style="margin:0;padding:0;background-color:#FAF6EF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6EF;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e8e0d6;">

<tr><td style="padding:32px 32px 16px;text-align:center;border-bottom:2px solid #C9941A;">
  <h1 style="margin:0;font-size:24px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">Shaadi<span style="color:#C9941A;">.</span>Digital</h1>
</td></tr>

<tr><td style="padding:32px 32px 8px;text-align:center;">
  <div style="display:inline-block;width:48px;height:48px;background-color:#fee2e2;border-radius:50%;line-height:48px;font-size:24px;color:#dc2626;margin-bottom:12px;">✗</div>
  <h2 style="margin:0;font-size:22px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">Uh oh! Payment could not be processed</h2>
</td></tr>
<tr><td style="padding:0 32px 24px;text-align:center;">
  <p style="margin:0;font-size:15px;color:#6B5B4E;">Don't worry, you have not been charged.</p>
  <p style="margin:8px 0 0;font-size:13px;color:#6B5B4E;">Plan: ${planName} · Amount: ${amountStr}</p>
</td></tr>

<tr><td style="padding:0 32px 24px;">
  <h3 style="margin:0 0 12px;font-size:16px;color:#7B1C2E;font-family:Georgia,'Times New Roman',serif;">What to do next</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1C1410;">
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">1</span> Try again with a different payment method</td></tr>
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">2</span> Use UPI for instant, reliable payments</td></tr>
    <tr><td style="padding:8px 0;"><span style="display:inline-block;width:24px;height:24px;background-color:#7B1C2E;color:#fff;text-align:center;line-height:24px;border-radius:50%;font-size:12px;margin-right:10px;">3</span> Contact our support team if problem persists</td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 32px 32px;text-align:center;">
  <a href="https://shaadi.digital/#pricing" style="display:inline-block;padding:14px 32px;background-color:#C9941A;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">Try Again →</a>
</td></tr>

<tr><td style="padding:24px 32px;border-top:1px solid #e8e0d6;text-align:center;">
  <p style="margin:0 0 8px;font-size:14px;color:#6B5B4E;">Need help? <a href="https://wa.me/919999999999" style="color:#7B1C2E;text-decoration:underline;">WhatsApp us</a> or email <a href="mailto:support@shaadi.digital" style="color:#7B1C2E;text-decoration:underline;">support@shaadi.digital</a></p>
</td></tr>

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
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      failure_code,
      failure_reason,
      failure_source,
      failure_step,
      plan,
      amount,
      email,
      phone,
      status = "failed",
    } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert into abandoned_checkouts
    const { error: insertError } = await supabase.from("abandoned_checkouts").insert({
      razorpay_order_id: razorpay_order_id || null,
      plan: plan || "unknown",
      amount: amount || 0,
      email: email || null,
      phone: phone || null,
      failure_reason: failure_reason
        ? `${failure_reason}${failure_source ? ` (source: ${failure_source})` : ""}${failure_step ? ` (step: ${failure_step})` : ""}`
        : null,
      failure_code: failure_code || null,
      status,
    });

    if (insertError) {
      console.error("Failed to insert abandoned_checkout:", insertError);
    }

    // Update payments table if order exists and status is "failed"
    if (razorpay_order_id && status === "failed") {
      const { error: updateError } = await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("razorpay_order_id", razorpay_order_id);
      if (updateError) {
        console.error("Failed to update payment status:", updateError);
      }
    }

    // Send failure email if email available and status is "failed"
    if (email && status === "failed") {
      try {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          const amountRupees = Math.round((amount || 0) / 100);
          const html = buildFailedEmailHtml({
            name: email.split("@")[0],
            plan: plan || "unknown",
            amount: amountRupees,
          });

          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Shaadi.Digital <noreply@shaadi.digital>",
              to: [email],
              subject: "Payment unsuccessful — Shaadi.Digital",
              html,
            }),
          });
          const emailResult = await emailRes.text();
          if (!emailRes.ok) {
            console.error("Failed to send failure email:", emailResult);
          }
        }
      } catch (emailErr) {
        console.error("Failure email error (non-blocking):", emailErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("log-failed-payment error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
