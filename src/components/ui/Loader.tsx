"use client";

import React from 'react';
import Image from 'next/image';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Loader({ 
  message = "Chargement...", 
  size = 'medium',
  className = "" 
}: LoaderProps) {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Animation container */}
      <div className="relative">
        {/* Loader image avec animations */}
        <div className={`${getSizeClasses()} relative animate-loader-bounce`}>
          <div className="w-full h-full animate-loader-pulse">
            <Image
              src="/cartons.png"
              alt="Chargement..."
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
        
        {/* Cercles d'animation autour */}
        <div className="absolute inset-0 -m-2">
          <div className="w-full h-full rounded-full border-2 border-red-500/30 animate-loader-spin-slow"></div>
        </div>
        <div className="absolute inset-0 -m-4">
          <div className="w-full h-full rounded-full border border-red-300/20 animate-loader-spin-reverse"></div>
        </div>
      </div>

      {/* Message de chargement */}
      {message && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 font-medium animate-loader-fade">
            {message}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-loader-dot-1"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-loader-dot-2"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-loader-dot-3"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Loader plein écran avec overlay
export function FullScreenLoader({ 
  message = "Connexion en cours...",
  isVisible = true 
}: { 
  message?: string;
  isVisible?: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
        <Loader message={message} size="large" />
      </div>
    </div>
  );
}

// Composant Loader inline pour boutons
export function ButtonLoader({ 
  className = "" 
}: { 
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="w-5 h-5 relative animate-spin">
        <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full"></div>
      </div>
    </div>
  );
}
