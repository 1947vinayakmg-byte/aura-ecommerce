/**
 * Truncates a string to a specified length and adds an ellipsis.
 * @param text - The string to truncate.
 * @param length - The maximum length allowed.
 * @returns The truncated string.
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};
