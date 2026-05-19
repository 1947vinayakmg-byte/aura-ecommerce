/**
 * Calculates the percentage discount between two prices.
 * @param originalPrice - The initial price.
 * @param currentPrice - The discounted price.
 * @returns The percentage discount as a number.
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};
