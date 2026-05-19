/**
 * Formats a numeric price into a localized currency string.
 * @param price - The price to format.
 * @param currency - The currency code (default: USD).
 * @returns A formatted string (e.g., "₹1,200").
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
