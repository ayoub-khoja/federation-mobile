"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../hooks/useTranslation';
import { useLoading, useToast } from "../../hooks";
import { FullScreenLoader, ButtonLoader, ToastContainer } from "../../components/ui";
import { authService } from "../../services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t, language, isRtl, toggleLanguage } = useTranslation('forgotPassword');
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const { setLoading, isLoading } = useLoading();
  const { toasts, showError, showSuccess, removeToast } = useToast();
  
  // Cast de type pour corriger l'inférence TypeScript
  const forgotPasswordT = t as {
    title: string;
    subtitle: string;
    email: string;
    sendCode: string;
    backToLogin: string;
    successTitle: string;
    successMessage: string;
    linkExpires: string;
    resendCode: string;
    resendAvailable: string;
    copyright: string;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification du champ
    if (!email) {
      showError(language === 'fr' ? "Veuillez saisir votre adresse email" : "يرجى إدخال عنوان بريدك الإلكتروني");
      return;
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(language === 'fr' ? "Veuillez saisir une adresse email valide" : "يرجى إدخال عنوان بريد إلكتروني صحيح");
      return;
    }

    // Démarrer le chargement
    setLoading('forgotPassword', true);
    
    try {
      console.log('🔍 Récupération mot de passe - Email:', email);
      
      const result = await authService.forgotPassword({ email: email });
      
      if (result.success) {
        showSuccess(language === 'fr' ? "Code de réinitialisation envoyé !" : "تم إرسال رمز إعادة التعيين!");
        setIsEmailSent(true);
        setTimeLeft(result.expires_in_minutes ? result.expires_in_minutes * 60 : 300); // Utiliser la durée du backend ou 5 minutes par défaut
        setCanResend(false);
        
        // Ne pas rediriger automatiquement - laisser l'utilisateur cliquer sur le lien dans l'email
      } else {
        // Afficher l'erreur spécifique retournée par l'API
        const errorMessage = language === 'fr' 
          ? (result.message || "Erreur lors de l'envoi du code")
          : "خطأ في إرسال الرمز";
        showError(errorMessage);
      }
      
    } catch (error) {
      console.error("Forgot password error:", error);
      showError(language === 'fr' ? "Erreur lors de l'envoi du code. Veuillez réessayer." : "خطأ في إرسال الرمز. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading('forgotPassword', false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/');
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setLoading('forgotPassword', true);
    try {
      const result = await authService.forgotPassword({ email: email });
      
      if (result.success) {
        showSuccess(language === 'fr' ? "Nouveau code envoyé !" : "تم إرسال رمز جديد!");
        setTimeLeft(300); // 5 minutes en secondes
        setCanResend(false);
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
      setLoading('forgotPassword', false);
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
        
        {/* Section centrale - Formulaire de récupération */}
        <div className="flex-1 max-w-lg">
          {/* Carte de récupération */}
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
                {forgotPasswordT.title}
              </h1>
              <p className={`text-gray-600 text-sm ${isRtl ? 'font-arabic' : ''}`}>
                {forgotPasswordT.subtitle}
              </p>
            </div>

            {/* Formulaire */}
            <div className="px-6 pb-4">
              {!isEmailSent ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  
                  {/* Champ Email */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                      {language === 'fr' ? 'Adresse email' : 'عنوان البريد الإلكتروني'}
                    </label>
                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                      required
                      dir="ltr"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {language === 'fr' ? 'Saisissez votre adresse email' : 'أدخل عنوان بريدك الإلكتروني'}
                    </p>
                  </div>

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    disabled={isLoading('forgotPassword')}
                    className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {isLoading('forgotPassword') ? (
                      <div className="flex items-center justify-center gap-2">
                        <ButtonLoader />
                        <span>Envoi...</span>
                      </div>
                    ) : (
                      forgotPasswordT.sendCode
                    )}
                  </button>

                  {/* Bouton retour */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className={`text-gray-600 hover:text-red-600 transition-colors text-xs font-medium ${isRtl ? 'font-arabic' : ''}`}
                    >
                      {forgotPasswordT.backToLogin}
                    </button>
                  </div>
                </form>
              ) : (
                /* Interface style email de confirmation */
                <div className="space-y-6">
                  {/* En-tête avec logo FTF */}
                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <img 
                        src="/Logo_federation_tunisienne_de_football.svg.png" 
                        alt="Logo FTF" 
                        className="h-12 w-auto mr-3"
                      />
                    </div>
                    <h2 className="text-white text-xl font-bold">
                      Fédération Tunisienne de Football
                    </h2>
                    <p className="text-red-100 text-sm mt-1">
                      Réinitialisation de mot de passe
                    </p>
                  </div>

                  {/* Message de salutation */}
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold text-gray-800 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                      {language === 'fr' ? `Bonjour ${email.split('@')[0]},` : `مرحباً ${email.split('@')[0]}،`}
                    </h3>
                    <p className={`text-gray-600 text-sm leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                      {language === 'fr' 
                        ? "Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Arbitre."
                        : "لقد طلبت إعادة تعيين كلمة المرور لحساب الحكم الخاص بك."
                      }
                    </p>
                  </div>

                  {/* Section OTP avec style email */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className={`text-amber-800 font-medium text-sm ${isRtl ? 'font-arabic' : ''}`}>
                        {language === 'fr' ? 'Code OTP de sécurité :' : 'رمز OTP الأمني:'}
                      </span>
                    </div>
                    
                    {/* Code OTP stylisé */}
                    <div className="bg-white border-2 border-red-300 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-red-700 tracking-widest">
                        {language === 'fr' ? 'Vérifiez votre email' : 'تحقق من بريدك الإلكتروني'}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className={`font-semibold text-gray-800 mb-3 ${isRtl ? 'font-arabic' : ''}`}>
                      {language === 'fr' 
                        ? 'Pour réinitialiser votre mot de passe, vous devez :'
                        : 'لإعادة تعيين كلمة المرور، يجب عليك:'
                      }
                    </h4>
                    <ol className={`space-y-2 text-sm text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                      <li className="flex items-start">
                        <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                        <span>
                          {language === 'fr' 
                            ? 'Vérifiez votre boîte email et cliquez sur le lien de réinitialisation'
                            : 'تحقق من صندوق البريد الإلكتروني وانقر على رابط إعادة التعيين'
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                        <span>
                          {language === 'fr' 
                            ? 'Entrez le code OTP reçu par email'
                            : 'أدخل رمز OTP المستلم عبر البريد الإلكتروني'
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                        <span>
                          {language === 'fr' 
                            ? 'Définissez votre nouveau mot de passe'
                            : 'حدد كلمة المرور الجديدة'
                          }
                        </span>
                      </li>
                    </ol>
                  </div>

                  {/* Timer et bouton de renvoi */}
                  <div className="space-y-4">
                    {timeLeft > 0 ? (
                      <div className="text-center bg-red-50 rounded-lg p-4">
                        <p className={`text-sm text-gray-700 ${isRtl ? 'font-arabic' : ''}`}>
                          {language === 'fr' ? 'Le lien expire dans :' : 'ينتهي الرابط خلال:'}
                        </p>
                        <div className="text-2xl font-bold text-red-600 font-mono mt-1">
                          {formatTime(timeLeft)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className={`text-sm text-amber-800 ${isRtl ? 'font-arabic' : ''}`}>
                            {language === 'fr' ? 'Le lien a expiré' : 'انتهت صلاحية الرابط'}
                          </p>
                        </div>
                        <button
                          onClick={handleResendCode}
                          disabled={isLoading('forgotPassword')}
                          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                        >
                          {isLoading('forgotPassword') ? (
                            <div className="flex items-center justify-center gap-2">
                              <ButtonLoader />
                              <span>{language === 'fr' ? 'Envoi...' : 'جاري الإرسال...'}</span>
                            </div>
                          ) : (
                            language === 'fr' ? 'Renvoyer le code' : 'إعادة إرسال الرمز'
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bouton retour */}
                  <button
                    onClick={handleBackToLogin}
                    className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {language === 'fr' ? 'Retour à la connexion' : 'العودة إلى تسجيل الدخول'}
                  </button>

                  {/* Message d'information */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`text-blue-800 text-xs ${isRtl ? 'font-arabic' : ''}`}>
                        {language === 'fr' 
                          ? 'Important : Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email.'
                          : 'مهم: إذا لم تطلب إعادة التعيين هذه، تجاهل هذا البريد الإلكتروني.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Copyright */}
              <div className="text-center pt-3 border-t border-gray-100 mt-3">
                <p className={`text-gray-500 text-xs ${isRtl ? 'font-arabic' : ''}`}>
                  {forgotPasswordT.copyright}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loader plein écran */}
        <FullScreenLoader 
          message="Envoi du code..."
          isVisible={isLoading('forgotPassword')}
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
