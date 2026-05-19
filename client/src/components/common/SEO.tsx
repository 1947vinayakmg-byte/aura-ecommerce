import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "AURA L'ÉLITE | Modern Luxury Fashion",
  description = "Experience the intersection of architectural structure and fluid elegance. Meticulously crafted luxury apparel for those who command the room.",
  keywords = "luxury fashion, high-end apparel, designer clothing, Aura Elite, Paris fashion",
  image = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000",
  url = "https://aura-elite.com"
}) => {
  const fullTitle = title.includes("AURA") ? title : `${title} | AURA L'ÉLITE`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0F0F0F" />
    </Helmet>
  );
};

export default SEO;
