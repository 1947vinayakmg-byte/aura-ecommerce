/**
 * Generates a high-end, unique order identifier for luxury acquisitions.
 * @returns A string in the format AURA-XXXX-XXXX.
 */
export const generateOrderId = (): string => {
  const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AURA-${segment1}-${segment2}`;
};
