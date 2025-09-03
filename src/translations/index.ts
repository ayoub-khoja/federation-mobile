import { loginTranslations as loginFr } from './fr/login';
import { loginTranslations as loginAr } from './ar/login';
import { homeTranslations as homeFr } from './fr/home';
import { homeTranslations as homeAr } from './ar/home';
import { forgotPasswordTranslations as forgotPasswordFr } from './fr/forgotPassword';
import { forgotPasswordTranslations as forgotPasswordAr } from './ar/forgotPassword';
import { verifyOTPTranslations as verifyOTPFr } from './fr/verifyOTP';
import { verifyOTPTranslations as verifyOTPAr } from './ar/verifyOTP';
import { resetPasswordTranslations as resetPasswordFr } from './fr/resetPassword';
import { resetPasswordTranslations as resetPasswordAr } from './ar/resetPassword';

export type Language = 'fr' | 'ar';

export const translations = {
  fr: {
    login: loginFr,
    home: homeFr,
    forgotPassword: forgotPasswordFr,
    verifyOTP: verifyOTPFr,
    resetPassword: resetPasswordFr
  },
  ar: {
    login: loginAr,
    home: homeAr,
    forgotPassword: forgotPasswordAr,
    verifyOTP: verifyOTPAr,
    resetPassword: resetPasswordAr
  }
};

export type TranslationKeys = typeof translations;
