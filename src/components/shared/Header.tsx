"use client";

import React from 'react';
import Image from 'next/image';
import LanguageSelector from '../LanguageSelector';

interface HeaderProps {
  homeT: {[key: string]: string};
  language: 'fr' | 'ar';
  isRtl: boolean;
  onToggleLanguage: () => void;
}

export default function Header({ homeT, language, isRtl, onToggleLanguage }: HeaderProps) {

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-6 py-3">
        
        {/* Première ligne : Logo FTF + Titre */}
        <div className="flex items-center justify-center mb-2">
          
          {/* Logo FTF à gauche */}
          <div className="flex items-center mr-4">
            <div className="relative animate-float">
              <Image
                src="/ftf-logo.png"
                alt="Fédération Tunisienne de Football"
                width={70}
                height={70}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Section centrale : Titre */}
          <div className="flex-1 text-center px-2">
            <h1 className={`text-white text-lg font-bold ${isRtl ? 'font-arabic' : ''}`}>
              {homeT.title}
            </h1>
            <p className="text-white/80 text-xs mt-1">
              Fédération Tunisienne de Football
            </p>
          </div>

          {/* Cartons à droite */}
          <div className="flex items-center ml-4">
            <div className="relative animate-float" style={{animationDelay: '0.5s'}}>
              <Image
                src="/cartons.png"
                alt="Cartons d'arbitre"
                width={50}
                height={50}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Deuxième ligne : Sélecteur de langue centré */}
        <div className="flex justify-center">
          <LanguageSelector 
            language={language} 
            onToggle={onToggleLanguage}
          />
        </div>
      </div>
    </header>
  );
}






