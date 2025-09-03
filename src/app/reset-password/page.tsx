"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../../hooks/useTranslation';
import { useLoading, useToast } from "../../hooks";
import { FullScreenLoader, ButtonLoader, ToastContainer } from "../../components/ui";
import { authService } from "../../services/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language, isRtl, toggleLanguage } = useTranslation('resetPassword');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const { setLoading, isLoading } = useLoading();
  const { toasts, showError, showSuccess, removeToast } = useToast();
  
  // Cast de type pour corriger l'inférence TypeScript
  const resetPasswordT = t as {
    title: string;
    subtitle: string;
    newPassword: string;
    confirmPassword: string;
    resetPassword: string;
    backToLogin: string;
    successTitle: string;
    successMessage: string;
    passwordRequirements: string;
    passwordsMatch: string;
    copyright: string;
  };

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    // Logs de débogage pour production
    console.log('🔍 Reset Password - Environnement:', {
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'server',
      fullUrl: typeof window !== 'undefined' ? window.location.href : 'server',
      email: emailParam,
      token: tokenParam ? '✅ Présent' : '❌ Manquant'
    });
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    // Valider le token au chargement de la page
    if (tokenParam) {
      validateToken(tokenParam);
    }
  }, [searchParams]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      console.log('🔍 Validation du token pour reset password:', tokenToValidate);
      const result = await authService.validateResetToken(tokenToValidate);
      
      console.log('📡 Résultat validation token pour reset:', result);
      
      if (!result.success || !result.valid) {
        showError(language === 'fr' ? "Token invalide ou expiré" : "الرمز غير صالح أو منتهي الصلاحية");
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
        return;
      }

      // Vérifier si l'OTP a été vérifié
      if (result.otp_verified === false) {
        console.log('⚠️ OTP non vérifié, affichage de l\'interface OTP');
        setIsOtpVerified(false);
        setTimeLeft(300); // 5 minutes
        return;
      }

      console.log('✅ Token valide et OTP vérifié, accès autorisé');
      setIsOtpVerified(true);
    } catch (error) {
      console.error("Token validation error:", error);
      showError(language === 'fr' ? "Erreur de validation du token" : "خطأ في التحقق من الرمز");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification des champs
    if (!newPassword || !confirmPassword) {
      showError(language === 'fr' ? "Veuillez remplir tous les champs" : "يرجى ملء جميع الحقول");
      return;
    }

    // Vérification de la longueur du mot de passe
    if (newPassword.length < 8) {
      showError(language === 'fr' ? "Le mot de passe doit contenir au moins 8 caractères" : "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل");
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (newPassword !== confirmPassword) {
      showError(language === 'fr' ? "Les mots de passe ne correspondent pas" : "كلمات المرور غير متطابقة");
      return;
    }

    // Démarrer le chargement
    setLoading('resetPassword', true);
    
    try {
      console.log('🔍 Réinitialisation mot de passe - Token:', token ? '✅ Présent' : '❌ Manquant');
      
      const result = await authService.confirmPasswordReset({
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      if (result.success) {
        showSuccess(language === 'fr' ? "Mot de passe réinitialisé avec succès !" : "تم إعادة تعيين كلمة المرور بنجاح!");
        
        // Rediriger immédiatement vers la page de connexion
        router.push('/');
      } else {
        // Afficher l'erreur spécifique retournée par l'API
        const errorMessage = language === 'fr' 
          ? (result.message || "Erreur lors de la réinitialisation")
          : "خطأ في إعادة التعيين";
        showError(errorMessage);
      }
      
    } catch (error) {
      console.error("Reset password error:", error);
      showError(language === 'fr' ? "Erreur lors de la réinitialisation. Veuillez réessayer." : "خطأ في إعادة التعيين. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading('resetPassword', false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification du champ
    if (!otpCode) {
      showError(language === 'fr' ? "Veuillez saisir le code OTP" : "يرجى إدخال رمز OTP");
      return;
    }

    // Vérification du format du code OTP (6 chiffres)
    if (!/^\d{6}$/.test(otpCode)) {
      showError(language === 'fr' ? "Le code OTP doit contenir 6 chiffres" : "يجب أن يحتوي رمز OTP على 6 أرقام");
      return;
    }

    // Démarrer le chargement
    setLoading('verifyOTP', true);
    
    try {
      console.log('🔍 Vérification OTP - Code:', otpCode, 'Token:', token ? '✅ Présent' : '❌ Manquant');
      
      const result = await authService.verifyOTP({ 
        token: token, 
        otp_code: otpCode 
      });
      
      console.log('📡 Résultat vérification OTP:', result);
      
      if (result.success) {
        showSuccess(language === 'fr' ? "Code OTP vérifié avec succès !" : "تم التحقق من رمز OTP بنجاح!");
        setIsOtpVerified(true);
      } else {
        // Afficher l'erreur spécifique retournée par l'API
        const errorMessage = language === 'fr' 
          ? (result.message || "Code OTP incorrect")
          : "رمز OTP غير صحيح";
        showError(errorMessage);
      }
      
    } catch (error) {
      console.error("Verify OTP error:", error);
      showError(language === 'fr' ? "Erreur lors de la vérification. Veuillez réessayer." : "خطأ في التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading('verifyOTP', false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setLoading('verifyOTP', true);
    try {
      const result = await authService.forgotPassword({ email: email });
      
      if (result.success) {
        showSuccess(language === 'fr' ? "Nouveau code envoyé !" : "تم إرسال رمز جديد!");
        setTimeLeft(300); // 5 minutes en secondes
        setCanResend(false);
        if (result.token) {
          setToken(result.token);
        }
      } else {
        const errorMessage = language === 'fr' 
          ? (result.message || "Erreur lors de l'envoi du code")
          : "خطأ في إرسال الرمز";
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      showError(language === 'fr' ? "Erreur lors de l'envoi du code. Veuillez réessayer." : "خطأ في إرسال الرمز. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading('verifyOTP', false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/');
  };

  // Timer pour le compte à rebours
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft]);

  // Fonction pour formater le temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`h-screen max-h-screen flex items-start justify-center pt-16 relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'} style={{overflow: 'hidden'}}>
      {/* Sélecteur de langue */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-300 border border-white/30 text-sm"
        >
          <span className="font-medium">
            {language === 'fr' ? '🇫🇷 FR' : '🇹🇳 العربية'}
          </span>
        </button>
      </div>

      {/* Arrière-plan avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700">
        {/* Motifs géométriques simples */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-400/20 rounded-full -translate-y-24 translate-x-24 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400/20 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex items-center justify-center">
        
        {/* Section centrale - Formulaire de réinitialisation */}
        <div className="flex-1 max-w-lg">
          {/* Carte de réinitialisation */}
          <div className="glass rounded-2xl shadow-ftf overflow-hidden animate-fadeInUp">
            
            {/* Header avec logos */}
            <div className="px-6 pt-5 pb-4 text-center">
              {/* Logos au-dessus du titre */}
              <div className="flex justify-between items-center mb-4 px-4">
                <div className="relative animate-float">
                  <Image
                    src="/cartons.png"
                    alt="Cartons d'arbitre"
                    width={70}
                    height={70}
                    className="drop-shadow-lg"
                    priority
                  />
                </div>
                <div className="relative animate-float" style={{animationDelay: '0.5s'}}>
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
              
              <h1 className={`text-lg font-bold text-red-600 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                {!isOtpVerified 
                  ? (language === 'fr' ? 'Vérification du code OTP' : 'التحقق من رمز OTP')
                  : resetPasswordT.title
                }
              </h1>
              <p className={`text-gray-600 text-sm ${isRtl ? 'font-arabic' : ''}`}>
                {!isOtpVerified 
                  ? (language === 'fr' ? 'Saisissez le code à 6 chiffres reçu par email' : 'أدخل الرمز المكون من 6 أرقام المستلم عبر البريد الإلكتروني')
                  : resetPasswordT.subtitle
                }
              </p>
              {email && (
                <p className={`text-gray-500 text-xs mt-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {language === 'fr' ? 'Pour :' : 'لـ:'} {email}
                </p>
              )}
            </div>

            {/* Formulaire */}
            <div className="px-6 pb-4">
              {!isOtpVerified ? (
                /* Interface de vérification OTP */
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  
                  {/* Champ Code OTP */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                      {language === 'fr' ? 'Code OTP' : 'رمز OTP'}
                    </label>
                    <input
                      type="text"
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => {
                        // Limiter à 6 chiffres seulement
                        const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                        setOtpCode(value);
                      }}
                      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 text-center text-2xl font-mono tracking-widest ${isRtl ? 'font-arabic' : ''}`}
                      required
                      maxLength={6}
                      dir="ltr"
                    />
                    <p className="text-gray-500 text-xs mt-1 text-center">
                      {language === 'fr' ? 'Saisissez le code à 6 chiffres reçu par email' : 'أدخل الرمز المكون من 6 أرقام المستلم عبر البريد الإلكتروني'}
                    </p>
                  </div>

                  {/* Timer et bouton de renvoi */}
                  <div className="text-center">
                    {timeLeft > 0 ? (
                      <p className={`text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                        {language === 'fr' ? 'Le code expire dans' : 'ينتهي الرمز في'} <span className="font-mono text-red-600 font-bold">{formatTime(timeLeft)}</span>
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className={`text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                          {language === 'fr' ? 'Vous pouvez renvoyer un code' : 'يمكنك إرسال رمز جديد'} <span className="font-mono text-red-600 font-bold">0:00</span>
                        </p>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isLoading('verifyOTP')}
                          className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm ${isRtl ? 'font-arabic' : ''}`}
                        >
                          {isLoading('verifyOTP') ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Envoi...</span>
                            </div>
                          ) : (
                            language === 'fr' ? 'Renvoyer le code' : 'إرسال رمز جديد'
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bouton de vérification */}
                  <button
                    type="submit"
                    disabled={isLoading('verifyOTP')}
                    className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {isLoading('verifyOTP') ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Vérification...</span>
                      </div>
                    ) : (
                      language === 'fr' ? 'Vérifier le code' : 'التحقق من الرمز'
                    )}
                  </button>
                </form>
              ) : (
                /* Interface de réinitialisation de mot de passe */
                <form onSubmit={handleResetPassword} className="space-y-4">
                
                {/* Champ Nouveau mot de passe */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                    {language === 'fr' ? 'Nouveau mot de passe' : 'كلمة المرور الجديدة'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                      required
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'fr' ? 'Minimum 8 caractères' : '8 أحرف على الأقل'}
                  </p>
                </div>

                {/* Champ Confirmation mot de passe */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                    {language === 'fr' ? 'Confirmer le mot de passe' : 'تأكيد كلمة المرور'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                      required
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'كلمات المرور غير متطابقة'}
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                    <p className="text-green-500 text-xs mt-1">
                      {language === 'fr' ? 'Les mots de passe correspondent' : 'كلمات المرور متطابقة'}
                    </p>
                  )}
                </div>

                {/* Bouton de réinitialisation */}
                <button
                  type="submit"
                  disabled={isLoading('resetPassword') || newPassword !== confirmPassword || newPassword.length < 8}
                  className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                >
                  {isLoading('resetPassword') ? (
                    <div className="flex items-center justify-center gap-2">
                      <ButtonLoader />
                      <span>Réinitialisation...</span>
                    </div>
                  ) : (
                    resetPasswordT.resetPassword
                  )}
                </button>

                {/* Bouton retour */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className={`text-gray-600 hover:text-red-600 transition-colors text-xs font-medium ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {resetPasswordT.backToLogin}
                  </button>
                </div>
              </form>
              )}

              {/* Copyright */}
              <div className="text-center pt-3 border-t border-gray-100 mt-3">
                <p className={`text-gray-500 text-xs ${isRtl ? 'font-arabic' : ''}`}>
                  {resetPasswordT.copyright}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loader plein écran */}
        <FullScreenLoader 
          message="Réinitialisation en cours..."
          isVisible={isLoading('resetPassword')}
        />

        {/* Container des toasts */}
        <ToastContainer 
          toasts={toasts}
          onRemoveToast={removeToast}
        />

      </div>
    </div>
  );
}

