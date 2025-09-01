"use client";

import React from 'react';
import { useNews } from '../../hooks';
import NewsCard from '../NewsCard';

interface HomeModuleProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  language?: 'fr' | 'ar';
}

export default function HomeModule({ isRtl, homeT, language = 'fr' }: HomeModuleProps) {
  const { news, loading, error, refreshNews, getNewsByStatus } = useNews();
  const { featured, regular } = getNewsByStatus();
  
  // Composant de débogage
  

  return (
    <>
      {/* Titre de la page d'accueil */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold text-white mb-2 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          {homeT.pageTitle}
        </h1>
        <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
      </div>

      {/* Debug Info - À retirer après résolution */}

      <div className="space-y-8">
        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className={`text-gray-600 ${isRtl ? 'font-arabic' : ''}`}>
                {language === 'fr' ? 'Chargement des actualités...' : 'تحميل الأخبار...'}
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
            <div className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className={`text-red-600 mb-4 ${isRtl ? 'font-arabic' : ''}`}>
                {language === 'fr' ? 'Erreur lors du chargement des actualités' : 'خطأ في تحميل الأخبار'}
              </p>
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <button
                onClick={refreshNews}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ${isRtl ? 'font-arabic' : ''}`}
              >
                {language === 'fr' ? 'Réessayer' : 'إعادة المحاولة'}
              </button>
            </div>
          </div>
        )}

        {/* Actualités à la une */}
        {!loading && !error && featured.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className={`text-2xl font-bold text-white mb-4 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
                {language === 'fr' ? '⭐ À la une' : '⭐ أهم الأخبار'}
              </h2>
              <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>
            {featured.map((newsItem) => (
              <NewsCard
                key={`featured-${newsItem.id}`}
                news={newsItem}
                language={language}
                isRtl={isRtl}
              />
            ))}
          </div>
        )}

        {/* Autres actualités */}
        {!loading && !error && regular.length > 0 && (
          <div className="space-y-6">
            {featured.length > 0 && (
              <div className="text-center">
                <h2 className={`text-2xl font-bold text-white mb-4 drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
                  {language === 'fr' ? '📰 Autres actualités' : '📰 أخبار أخرى'}
                </h2>
                <div className="w-16 h-1 bg-white/50 mx-auto rounded-full"></div>
              </div>
            )}
            {regular.map((newsItem) => (
              <NewsCard
                key={`regular-${newsItem.id}`}
                news={newsItem}
                language={language}
                isRtl={isRtl}
              />
            ))}
          </div>
        )}

        {/* Message si aucune actualité */}
        {!loading && !error && news.length === 0 && (
          <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className={`text-xl font-semibold text-gray-600 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                {language === 'fr' ? 'Aucune actualité disponible' : 'لا توجد أخبار متاحة'}
              </h3>
              <p className={`text-gray-500 ${isRtl ? 'font-arabic' : ''}`}>
                {language === 'fr' 
                  ? 'Les actualités seront publiées ici prochainement.' 
                  : 'سيتم نشر الأخبار هنا قريباً.'}
              </p>
              <button
                onClick={refreshNews}
                className={`mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ${isRtl ? 'font-arabic' : ''}`}
              >
                {language === 'fr' ? 'Actualiser' : 'تحديث'}
              </button>
            </div>
          </div>
        )}

        {/* Bouton de rafraîchissement */}
        {!loading && !error && news.length > 0 && (
          <div className="text-center">
            <button
              onClick={refreshNews}
              className={`bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg ${isRtl ? 'font-arabic' : ''}`}
            >
              {language === 'fr' ? '🔄 Actualiser les nouvelles' : '🔄 تحديث الأخبار'}
            </button>
          </div>
        )}

        {/* Espace supplémentaire pour assurer le scroll */}
        <div className="h-20"></div>
      </div>
    </>
  );
}
