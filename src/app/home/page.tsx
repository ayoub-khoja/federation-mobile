"use client";

import React from 'react';
import { useTranslation, useNavigation, useMatchForm } from "../../hooks";
import { HomeModule, ProfileModule, MatchModule, DesignationModule } from "../../components/modules";
import Header from "../../components/shared/Header";
import BottomNavigation from "../../components/BottomNavigation";
import { useAuthEvents } from "../../hooks/useAuthEvents";


import "../../services/tokenRefreshService"; // Démarrer le service de refresh automatique


export default function HomePage() {
  // Hooks personnalisés
  const { t, language, isRtl, toggleLanguage } = useTranslation('home');
  const { activeTab, handleTabChange } = useNavigation();
  const {
    matchForm,
    showAddMatchForm,
    showMatchHistory,
    handleFormInputChange,
    handleFileUpload,
    handleSubmitMatch,
    handleAddMatchClick,
    handleHistoryClick,
    handleCancelForm
  } = useMatchForm();
  
  // Hook d'authentification pour gérer les tokens expirés
  useAuthEvents();

  // Cast de type pour les traductions
  const homeT = t as {[key: string]: string};

  // Gestion de la fermeture du formulaire lors du changement d'onglet
  const handleTabChangeWithFormReset = (tab: string) => {
    if (showAddMatchForm || showMatchHistory) {
      handleCancelForm();
    }
    handleTabChange(tab);
  };

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      

      

      
      {/* Header - TOUJOURS VISIBLE */}
      <Header
        homeT={homeT}
        language={language}
        isRtl={isRtl}
        onToggleLanguage={toggleLanguage}
      />

      {/* Contenu principal scrollable */}
      <main className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-32 min-h-full">
        
          {/* Contenu dynamique selon l'onglet actif */}
          {activeTab === 'home' && (
            <HomeModule 
              isRtl={isRtl} 
              homeT={homeT} 
              language={language}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileModule 
              isRtl={isRtl} 
              homeT={homeT} 
            />
          )}

          {activeTab === 'matches' && (
            <MatchModule
              isRtl={isRtl}
              homeT={homeT}
              showAddMatchForm={showAddMatchForm}
              showMatchHistory={showMatchHistory}
              onAddMatchClick={handleAddMatchClick}
              onHistoryClick={handleHistoryClick}
              onCancelForm={handleCancelForm}
              matchForm={matchForm}
              onFormInputChange={handleFormInputChange}
              onFileUpload={handleFileUpload}
              onSubmitMatch={handleSubmitMatch}
            />
          )}

          {activeTab === 'designations' && (
            <DesignationModule
              isRtl={isRtl}
              homeT={homeT}
            />
          )}
        </div>
      </main>

      {/* Menu de navigation fixe en bas */}
      <div className="flex-shrink-0">
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChangeWithFormReset}
        />
      </div>

      {/* Effets d'arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/20 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/20 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>
    </div>
  );
}
