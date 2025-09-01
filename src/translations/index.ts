import { loginTranslations as loginFr } from './fr/login';
import { loginTranslations as loginAr } from './ar/login';
import { homeTranslations as homeFr } from './fr/home';
import { homeTranslations as homeAr } from './ar/home';

export type Language = 'fr' | 'ar';

export const translations = {
  fr: {
    login: loginFr,
    home: homeFr
  },
  ar: {
    login: loginAr,
    home: homeAr
  }
};

export type TranslationKeys = typeof translations;
