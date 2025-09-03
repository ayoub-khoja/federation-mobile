"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../../hooks/useTranslation';
import { useLoading, useToast } from "../../hooks";
import { FullScreenLoader, ButtonLoader, ToastContainer } from "../../components/ui";
import { authService } from "../../services/authService";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language, isRtl, toggleLanguage } = useTranslation('verifyOTP');
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { setLoading, isLoading } = useLoading();
  const { toasts, showError, showSuccess, removeToast } = useToast();
  
  // Cast de type pour corriger l'inférence TypeScript
  const verifyOTPT = t as {
    title: string;
    subtitle: string;
    otpCode: string;
    verifyCode: string;
    backToLogin: string;
    successTitle: string;
    successMessage: string;
    linkExpires: string;
    resendCode: string;
    resendAvailable: string;
    copyright: string;
  };

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    console.log('🔍 Paramètres URL reçus:', {
      email: emailParam,
      token: tokenParam ? '✅ Présent' : '❌ Manquant',
      fullUrl: window.location.href
    });
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) {
      setToken(tokenParam);
      // Valider le token immédiatement
      validateToken(tokenParam);
    } else {
      setIsTokenValid(false);
      showError(language === 'fr' 
        ? "Lien invalide ou expiré. Veuillez demander un nouveau code." 
        : "رابط غير صالح أو منتهي الصلاحية. يرجى طلب رمز جديد.");
    }
    
    // Démarrer le timer à 5 minutes
    setTimeLeft(300);
  }, [searchParams, language, showError]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      console.log('🔍 Validation du token:', tokenToValidate);
      const result = await authService.validateResetToken(tokenToValidate);
      
      console.log('📡 Résultat validation token COMPLET:', JSON.stringify(result, null, 2));
      console.log('📡 result.success:', result.success);
      console.log('📡 result.valid:', result.valid);
      console.log('📡 result.message:', result.message);
      
      // Vérifier si le token est valide selon la réponse du backend
      console.log('🔍 Analyse de la réponse:', {
        'result.success': result.success,
        'result.valid': result.valid,
        'result.otp_verified': result.otp_verified,
        'result.message': result.message
      });

      if (result.success && result.valid === true) {
        setIsTokenValid(true);
        console.log('✅ Token valide - Interface activée');
      } else {
        setIsTokenValid(false);
        console.log('❌ Token invalide - success:', result.success, 'valid:', result.valid);
        showError(language === 'fr' 
          ? "Lien expiré ou invalide. Veuillez demander un nouveau code." 
          : "الرابط منتهي الصلاحية أو غير صالح. يرجى طلب رمز جديد.");
      }
    } catch (error) {
      console.error('❌ Erreur validation token:', error);
      setIsTokenValid(false);
      showError(language === 'fr' 
        ? "Erreur lors de la validation du lien. Veuillez réessayer." 
        : "خطأ في التحقق من الرابط. يرجى المحاولة مرة أخرى.");
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

    // Vérification du token
    if (!token || !isTokenValid) {
      showError(language === 'fr' 
        ? "Token manquant ou invalide. Veuillez utiliser le lien reçu par email." 
        : "الرمز المميز مفقود أو غير صالح. يرجى استخدام الرابط المستلم عبر البريد الإلكتروني.");
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
        
        // Rediriger vers la page de confirmation avec le token actuel (qui est maintenant validé)
        // Le backend a marqué l'OTP comme vérifié, donc on peut utiliser le même token
        setTimeout(() => {
          router.push(`/reset-password?token=${token}&email=${email}`);
        }, 1000);
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

  const handleBackToLogin = () => {
    router.push('/');
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
          setIsTokenValid(true);
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
        
        {/* Section centrale - Formulaire de vérification OTP */}
        <div className="flex-1 max-w-lg">
          {/* Carte de vérification */}
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
                {verifyOTPT.title}
              </h1>
              <p className={`text-gray-600 text-sm ${isRtl ? 'font-arabic' : ''}`}>
                {verifyOTPT.subtitle}
              </p>
              {email && (
                <p className={`text-gray-500 text-xs mt-2 ${isRtl ? 'font-arabic' : ''}`}>
                  {language === 'fr' ? 'Envoyé à :' : 'مرسل إلى:'} {email}
                </p>
              )}
              
              {/* Indicateur de statut du token */}
              {isTokenValid === false && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className={`text-red-600 text-sm ${isRtl ? 'font-arabic' : ''}`}>
                    {language === 'fr' 
                      ? '⚠️ Lien expiré ou invalide. Demandez un nouveau code.' 
                      : '⚠️ الرابط منتهي الصلاحية أو غير صالح. اطلب رمز جديد.'}
                  </p>
                </div>
              )}
            </div>

            {/* Formulaire */}
            <div className="px-6 pb-4">
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
                    disabled={isTokenValid === false}
                  />
                  <p className="text-gray-500 text-xs mt-1 text-center">
                    {language === 'fr' ? 'Saisissez le code à 6 chiffres reçu par email' : 'أدخل الرمز المكون من 6 أرقام المستلم عبر البريد الإلكتروني'}
                  </p>
                </div>

                {/* Timer et bouton de renvoi */}
                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className={`text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                      {verifyOTPT.linkExpires} <span className="font-mono text-red-600 font-bold">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className={`text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                        {verifyOTPT.resendAvailable} <span className="font-mono text-red-600 font-bold">0:00</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading('verifyOTP')}
                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm ${isRtl ? 'font-arabic' : ''}`}
                      >
                        {isLoading('verifyOTP') ? (
                          <div className="flex items-center justify-center gap-2">
                            <ButtonLoader />
                            <span>Envoi...</span>
                          </div>
                        ) : (
                          verifyOTPT.resendCode
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bouton de vérification */}
                <button
                  type="submit"
                  disabled={isLoading('verifyOTP') || isTokenValid === false}
                  className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                >
                  {isLoading('verifyOTP') ? (
                    <div className="flex items-center justify-center gap-2">
                      <ButtonLoader />
                      <span>Vérification...</span>
                    </div>
                  ) : (
                    verifyOTPT.verifyCode
                  )}
                </button>

                {/* Bouton retour */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className={`text-gray-600 hover:text-red-600 transition-colors text-xs font-medium ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {verifyOTPT.backToLogin}
                  </button>
                </div>
              </form>

              {/* Copyright */}
              <div className="text-center pt-3 border-t border-gray-100 mt-3">
                <p className={`text-gray-500 text-xs ${isRtl ? 'font-arabic' : ''}`}>
                  {verifyOTPT.copyright}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loader plein écran */}
        <FullScreenLoader 
          message="Vérification en cours..."
          isVisible={isLoading('verifyOTP')}
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
