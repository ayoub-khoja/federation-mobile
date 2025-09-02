"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "../../hooks/useTranslation";
import { useRegistration } from "../../hooks/useRegistration";
import { useLoading } from "../../hooks/useLoading";
import Stepper, { StepperNavigation } from "../../components/ui/Stepper";
import { FullScreenLoader, SuccessModal, ErrorModal } from "../../components/ui";
import Step1PersonalInfo from "../../components/registration/Step1PersonalInfo";
import Step2ProfessionalInfo from "../../components/registration/Step2ProfessionalInfo";
import Step3SecurityInfo from "../../components/registration/Step3SecurityInfo";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { language, isRtl, toggleLanguage } = useTranslation('login');
  const { setLoading, isLoading } = useLoading();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  
  const {
    currentStep,
    registrationData,
    errors,
    isLoading: isRegistering,
    phoneVerification,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateSecurityInfo,
    nextStep,
    previousStep,
    submitRegistration
  } = useRegistration();

  // Configuration des étapes
  const steps = [
    {
      id: 1,
      title: "Informations personnelles",
      description: "Nom, prénom, contact"
    },
    {
      id: 2,
      title: "Informations professionnelles", 
      description: "Ligue, grade, âge"
    },
    {
      id: 3,
      title: "Sécurité",
      description: "Mot de passe"
    }
  ];

  // Gestion de la soumission finale
  const handleSubmit = async () => {
    setLoading('registration', true);
    
    try {
      const success = await submitRegistration();
      if (success) {
        // Afficher le modal de succès
        setShowSuccessModal(true);
      } else {
        // Afficher le modal d'erreur
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setShowErrorModal(true);
    } finally {
      setLoading('registration', false);
    }
  };

  // Fermer le modal et rediriger vers la connexion
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/');
  };

  // Fermer le modal d'erreur
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  // Retour à la page de connexion
  const handleBackToLogin = () => {
    router.replace('/');
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Effets d'arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/20 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/20 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center h-screen px-4 py-8">
        <div className="w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
          
          {/* Header avec logos et titre principal */}
          <div className="flex items-center justify-between mb-6">
            {/* Logo Cartons - Gauche */}
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
            
            {/* Titre principal - Centre */}
            <div className="text-center">
              <h1 className={`text-white text-lg font-bold ${isRtl ? 'font-arabic' : ''}`}>
                Direction Nationale de l&apos;Arbitrage
              </h1>
            </div>
            
            {/* Logo FTF - Droite */}
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

          {/* Carte principale avec scroll */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col">
            
            {/* Header dans la carte avec titre et navigation */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              {/* Bouton retour */}
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-gray-700 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Retour</span>
              </button>

              {/* Titre central */}
              <div className="text-center">
                <h2 className={`text-gray-800 text-xl font-bold ${isRtl ? 'font-arabic' : ''}`}>
                  Créer un compte
                </h2>
              </div>

              {/* Sélecteur de langue */}
              <div className="flex items-center">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-gray-700 transition-all duration-300 text-sm font-medium"
                >
                  <span>
                    {language === 'fr' ? '🇫🇷 FR' : '🇹🇳 العربية'}
                  </span>
                </button>
              </div>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100">
              <div className="p-8">
              
              {/* Stepper */}
              <Stepper 
                steps={steps}
                currentStep={currentStep}
                className="mb-8"
              />

              {/* Contenu des étapes */}
              <div className="min-h-[500px]">
                {currentStep === 1 && (
                  <Step1PersonalInfo
                    data={registrationData.personalInfo}
                    onChange={updatePersonalInfo}
                    errors={errors}
                    phoneVerification={phoneVerification}
                    isRtl={isRtl}
                  />
                )}

                {currentStep === 2 && (
                  <Step2ProfessionalInfo
                    data={registrationData.professionalInfo}
                    onChangeAction={updateProfessionalInfo}
                    errors={errors}
                    isRtl={isRtl}
                  />
                )}

                {currentStep === 3 && (
                  <Step3SecurityInfo
                    data={registrationData.securityInfo}
                    onChange={updateSecurityInfo}
                    errors={errors}
                    isRtl={isRtl}
                  />
                )}
              </div>

              {/* Navigation */}
              <StepperNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={nextStep}
                onPrevious={previousStep}
                onSubmit={handleSubmit}
                nextLabel="Suivant"
                previousLabel="Précédent"
                submitLabel="Créer le compte"
                isLoading={isRegistering || isLoading('registration')}
              />


              </div>
            </div>
          </div>

          {/* Lien vers la connexion en bas */}
          <div className="text-center mt-4 flex-shrink-0">
            <p className={`text-white/80 text-sm ${isRtl ? 'font-arabic' : ''}`}>
              Vous avez déjà un compte ?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-white font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Loader plein écran */}
      <FullScreenLoader 
        message="Création de votre compte..."
        isVisible={isLoading('registration')}
      />

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Compte créé avec succès !"
        message="Votre compte arbitre a été créé. Vous pouvez maintenant vous connecter avec votre numéro de téléphone et votre mot de passe."
        buttonText="Se connecter"
      />

      {/* Modal d'erreur */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title="Erreur lors de l'inscription"
        message={errors.submit || "Une erreur est survenue lors de la création de votre compte. Veuillez vérifier vos informations et réessayer."}
        buttonText="Réessayer"
        errors={errors}
      />
    </div>
  );
}
