"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
  onLoad?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
  onError,
  onLoad,
}: OptimizedImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log('Erreur de chargement de l\'image avec Next.js, passage au fallback');
    setUseFallback(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Si on utilise le fallback, utiliser une balise img standard
  if (useFallback) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => {
          console.error('Erreur de chargement de l\'image même avec fallback');
          onError?.();
        }}
        onLoad={handleLoad}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    );
  }

  // Essayer d'abord avec Next.js Image
  try {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      );
    } else {
      return (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 300}
          className={className}
          sizes={sizes}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Next.js Image:', error);
    // En cas d'erreur, utiliser le fallback immédiatement
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => {
          console.error('Erreur de chargement de l\'image même avec fallback');
          onError?.();
        }}
        onLoad={handleLoad}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    );
  }
}
