import { formatIndonesianDate } from './date.utils';

export interface WhatsAppMessageParams {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  guestName: string;
  invitationUrl?: string;
}

/**
 * Returns a personalized invitation URL for a specific guest.
 * Prioritizes customInvitationUrl if provided; otherwise appends ?to=<GuestName> to baseUrl.
 */
export function getPersonalizedInvitationUrl(
  baseUrl: string | undefined,
  customUrl: string | undefined,
  guestName: string
): string | undefined {
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }

  if (!baseUrl || !baseUrl.trim()) {
    return undefined;
  }

  const trimmedBase = baseUrl.trim();
  try {
    const url = new URL(trimmedBase);
    url.searchParams.set('to', guestName.trim());
    return url.toString();
  } catch {
    const separator = trimmedBase.includes('?') ? '&' : '?';
    return `${trimmedBase}${separator}to=${encodeURIComponent(guestName.trim())}`;
  }
}

/**
 * Sanitizes phone numbers for WhatsApp API (e.g., converts 0812... to 62812...).
 */
export function sanitizePhoneNumberForWhatsApp(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly) return '';

  if (digitsOnly.startsWith('0')) {
    return `62${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.startsWith('8')) {
    return `62${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * Generates an elegant and polite Indonesian WhatsApp invitation message.
 */
export function generateWhatsAppInvitationMessage({
  brideName,
  groomName,
  weddingDate,
  guestName,
  invitationUrl,
}: WhatsAppMessageParams): string {
  const formattedDate = weddingDate ? formatIndonesianDate(weddingDate, { showWeekday: true, monthFormat: 'long' }) : null;
  const coupleText = brideName && groomName ? `${brideName} & ${groomName}` : 'Pernikahan Kami';

  const parts = [
    `Kepada Yth.`,
    `Bpk/Ibu/Saudara/i *${guestName.trim()}*`,
    ``,
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada momen bahagia pernikahan kami:`,
    ``,
    `*${coupleText}*`,
  ];

  if (formattedDate) {
    parts.push(`• Hari/Tanggal: ${formattedDate}`);
  }

  if (invitationUrl) {
    parts.push(
      ``,
      `Detail acara, lokasi venue, serta konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan berikut:`,
      `${invitationUrl}`
    );
  }

  parts.push(
    ``,
    `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.`,
    ``,
    `Terima kasih.`
  );

  return parts.join('\n');
}

/**
 * Creates direct WhatsApp link with encoded message avoiding redirect issues.
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumberForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  if (!cleanPhone) {
    return `https://api.whatsapp.com/send?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}
