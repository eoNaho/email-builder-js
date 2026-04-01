export type EmailWeightResult = {
  bytes: number;
  kb: number;
  /** 'ok' = under 60KB, 'warning' = 60-102KB, 'danger' = over 102KB */
  status: 'ok' | 'warning' | 'danger';
};

/**
 * Calculates the byte size of an HTML string and returns a weight result.
 *
 * Gmail clips emails over ~102KB. Most ESPs recommend keeping emails under 60KB
 * for reliable deliverability.
 */
export default function calculateEmailWeight(html: string): EmailWeightResult {
  const bytes = new TextEncoder().encode(html).length;
  const kb = Math.round((bytes / 1024) * 10) / 10;
  const status = bytes < 60 * 1024 ? 'ok' : bytes < 102 * 1024 ? 'warning' : 'danger';
  return { bytes, kb, status };
}
