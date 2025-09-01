import { useState } from 'react';
import { translations, Language } from '../translations';

export const useTranslation = (page: keyof typeof translations.fr) => {
  const [language, setLanguage] = useState<Language>('fr');
  
  const t = translations[language][page];
  const isRtl = language === 'ar';
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return {
    t: t as typeof translations.fr[typeof page],
    language,
    isRtl,
    toggleLanguage,
    changeLanguage
  };
};
