"use client";

import { Language } from "../translations";

interface LanguageSelectorProps {
  language: Language;
  onToggle: () => void;
  className?: string;
}

export default function LanguageSelector({ language, onToggle, className = "" }: LanguageSelectorProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-300 border border-white/30 text-sm ${className}`}
    >
      <span className="font-medium">
        {language === 'fr' ? '🇫🇷 FR' : '🇹🇳 العربية'}
      </span>
    </button>
  );
}












