/**
 * Format raw number or string into thousand-separated Indonesian currency format.
 * Example: 15000000 -> "15.000.000"
 */
export function maskCurrency(value: string | number): string {
  if (value === '' || value === null || value === undefined) return '';
  const digits = typeof value === 'number' ? Math.floor(Math.abs(value)).toString() : value.replace(/\D/g, '');
  if (!digits) return '';
  const numeric = parseInt(digits, 10);
  if (isNaN(numeric)) return '';
  return new Intl.NumberFormat('id-ID').format(numeric);
}

/**
 * Extract clean integer from masked currency string.
 * Example: "15.000.000" -> 15000000
 */
export function unmaskCurrency(maskedValue: string): number {
  if (!maskedValue) return 0;
  const digits = maskedValue.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}

/**
 * Format phone / WhatsApp number with readable dash groupings.
 * Example: "081234567890" -> "0812-3456-7890"
 */
export function maskPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}
