"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { useLoading, useToast } from "../hooks";
import { FullScreenLoader, ButtonLoader, ToastContainer } from "../components/ui";
import { authService } from "../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { t, language, isRtl, toggleLanguage } = useTranslation('login');
  const [phone, setPhone] = useState("+216");
  const [password, setPassword] = useState("");
  const { setLoading, isLoading } = useLoading();
  const { toasts, showError, showSuccess, removeToast } = useToast();
  
  // Cast de type pour corriger l'inférence TypeScript
  const loginT = t as {
    title: string;
    subtitle: string;
    phone: string;
    password: string;
    login: string;
    forgotPassword: string;
    noAccount: string;
    register: string;
    copyright: string;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification des champs
    if (!phone || !password) {
      showError(language === 'fr' ? "Veuillez remplir tous les champs" : "يرجى ملء جميع الحقول");
      return;
    }

    // Vérification du format du numéro de téléphone
    if (!/^\+216\d{8}$/.test(phone)) {
      showError(language === 'fr' ? "Le numéro doit être au format +216XXXXXXXX" : "يجب أن يكون الرقم بصيغة +216XXXXXXXX");
      return;
    }

    // Démarrer le chargement
    setLoading('login', true);
    
    try {
      console.log('🔍 Page de connexion - Données envoyées:', {
        phone: phone,
        password: password ? '***' : 'vide'
      });
      
      const result = await authService.login({
        phoneNumber: phone,
        password: password
      });

      if (result.success) {
        showSuccess(language === 'fr' ? "Connexion réussie ! Redirection..." : "تم تسجيل الدخول بنجاح! إعادة توجيه...");
        
        // Petite pause pour montrer le message de succès
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        // Afficher l'erreur spécifique retournée par l'API
        const errorMessage = language === 'fr' 
          ? (result.message || "Numéro de téléphone ou mot de passe incorrect")
          : "رقم الهاتف أو كلمة المرور غير صحيحة";
        showError(errorMessage);
      }
      
    } catch (error) {
      console.error("Login error:", error);
      showError(language === 'fr' ? "Erreur de connexion. Veuillez réessayer." : "خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading('login', false);
    }
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

      {/* Container principal avec disposition en trois colonnes */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex items-center justify-between gap-8">
        
        {/* Section gauche - Texte FTF */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-3">
              {language === 'fr' ? 'Fédération Tunisienne' : 'الاتحاد التونسي'}
            </h2>
            <h3 className="text-white text-xl font-semibold mb-6">
              {language === 'fr' ? 'de Football' : 'لكرة القدم'}
            </h3>
            <p className="text-white/80 text-lg">
              {language === 'fr' ? 'Excellence • Intégrité • Passion' : 'التميز • النزاهة • الشغف'}
            </p>
          </div>
        </div>

        {/* Section centrale - Formulaire de connexion */}
        <div className="flex-1 max-w-lg">
          {/* Carte de login compacte */}
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
                {loginT.title}
              </h1>
              <p className={`text-gray-600 text-sm ${isRtl ? 'font-arabic' : ''}`}>
                {loginT.subtitle}
              </p>
            </div>

            {/* Formulaire */}
            <div className="px-6 pb-4">
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Champ Téléphone */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                    {language === 'fr' ? 'Numéro de téléphone' : 'رقم الهاتف'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+21612345678"
                    value={phone}
                    onChange={(e) => {
                      // Auto-formater le numéro de téléphone (même logique que l'inscription)
                      let formattedValue = e.target.value.replace(/\D/g, ''); // Supprimer tous les non-chiffres
                      
                      if (formattedValue.length > 0 && !formattedValue.startsWith('216')) {
                        if (formattedValue.length <= 8) {
                          formattedValue = '216' + formattedValue;
                        }
                      }
                      
                      if (formattedValue.length > 11) {
                        formattedValue = formattedValue.substring(0, 11);
                      }
                      
                      const finalValue = formattedValue.length > 0 ? '+' + formattedValue : '';
                      setPhone(finalValue);
                    }}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                    required
                    maxLength={12}
                    dir="ltr"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Format: +216XXXXXXXX (numéro tunisien)
                  </p>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRtl ? 'font-arabic text-right' : 'text-left'}`}>
                    {language === 'fr' ? 'Mot de passe' : 'كلمة المرور'}
                  </label>
                  <input
                    type="password"
                    placeholder={loginT.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
                    required
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isLoading('login')}
                  className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isRtl ? 'font-arabic' : ''}`}
                >
                  {isLoading('login') ? (
                    <div className="flex items-center justify-center gap-2">
                      <ButtonLoader />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    loginT.login
                  )}
                </button>

                {/* Lien mot de passe oublié */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className={`text-gray-600 hover:text-red-600 transition-colors text-xs font-medium ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {loginT.forgotPassword}
                  </button>
                </div>
              </form>

              {/* Section d'inscription */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="text-center">
                  <p className={`text-gray-600 text-xs mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                    {loginT.noAccount}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className={`w-full bg-white border-2 border-red-600 text-red-600 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 duration-200 text-sm ${isRtl ? 'font-arabic' : ''}`}
                  >
                    {loginT.register}
                  </button>
                </div>
              </div>

              {/* Copyright à l'intérieur de la carte */}
              <div className="text-center pt-3 border-t border-gray-100 mt-3">
                <p className={`text-gray-500 text-xs ${isRtl ? 'font-arabic' : ''}`}>
                  {loginT.copyright}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Texte Arbitrage */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-3">
              {language === 'fr' ? 'Direction Nationale' : 'الإدارة الوطنية'}
            </h2>
            <h3 className="text-white text-xl font-semibold mb-6">
              {language === 'fr' ? 'de l\'Arbitrage' : 'للتحكيم'}
            </h3>
            <p className="text-white/80 text-lg">
              {language === 'fr' ? 'Justice • Précision • Respect' : 'العدالة • الدقة • الاحترام'}
            </p>
          </div>
        </div>

        {/* Loader plein écran lors de la connexion */}
        <FullScreenLoader 
          message="Connexion en cours..."
          isVisible={isLoading('login')}
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
