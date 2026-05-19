export const formatImageUrl = (url: string | undefined): string => {
  if (!url) return "https://via.placeholder.com/800";
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Assuming backend is at http://localhost:5000
  const baseUrl = "http://localhost:5000";
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
