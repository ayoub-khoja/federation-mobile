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
        
        {/* Première ligne : Logos + Titre */}
        <div className="flex items-center justify-between mb-2">
          
          {/* Section gauche : Cartons */}
          <div className="flex items-center">
            <div className="relative animate-float">
              <Image
                src="/cartons.png"
                alt="Cartons d'arbitre"
                width={60}
                height={60}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Section centrale : Titre */}
          <div className="flex-1 text-center px-1">
            <h1 className={`text-white text-sm font-bold ${isRtl ? 'font-arabic' : ''}`}>
              {homeT.title}
            </h1>
          </div>

          {/* Section droite : Logo FTF */}
          <div className="flex items-center space-x-4">
            {/* Logo FTF */}
            <div className="relative animate-float" style={{animationDelay: '0.5s'}}>
              <Image
                src="/ftf-logo.png"
                alt="Fédération Tunisienne de Football"
                width={60}
                height={60}
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






