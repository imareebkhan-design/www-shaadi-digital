/**
 * Bilingual WhatsApp share message templates
 */

interface ShareMessageParams {
  brideName: string;
  groomName: string;
  formattedDate?: string;
  venueName?: string;
  city?: string;
  inviteUrl: string;
  language?: string;
}

export function getWhatsAppMessage({
  brideName,
  groomName,
  formattedDate,
  venueName,
  city,
  inviteUrl,
  language = "english",
}: ShareMessageParams): string {
  const location = [venueName, city].filter(Boolean).join(", ");

  if (language === "hindi") {
    return [
      `🪔 *${brideName} & ${groomName}* ke shaadi mein aapka swaagat hai!`,
      "",
      formattedDate ? `📅 ${formattedDate}` : "",
      location ? `📍 ${location}` : "",
      "",
      "Aapka personal invitation yahan hai — tap karke dekhein:",
      `👉 ${inviteUrl}`,
      "",
      "Please RSVP karein jab time mile 🙏",
    ]
      .filter((line) => line !== undefined)
      .join("\n");
  }

  return [
    `🪔 You're invited to *${brideName} & ${groomName}*'s wedding!`,
    "",
    formattedDate ? `📅 ${formattedDate}` : "",
    location ? `📍 ${location}` : "",
    "",
    "Open your personal invitation here:",
    `👉 ${inviteUrl}`,
    "",
    "Kindly RSVP at your earliest convenience 🙏",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function getEmailSubject(brideName: string, groomName: string): string {
  return `${brideName} & ${groomName} — Wedding Invitation`;
}

export function getEmailBody(params: ShareMessageParams): string {
  return getWhatsAppMessage({ ...params, language: "english" }).replace(/\*/g, "");
}
