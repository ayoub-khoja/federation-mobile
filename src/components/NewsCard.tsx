"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { NewsItem } from '../services/newsService';

interface NewsCardProps {
  news: NewsItem;
  language: 'fr' | 'ar';
  isRtl: boolean;
}

export default function NewsCard({ news, language, isRtl }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const title = language === 'ar' ? news.title_ar : news.title_fr;
  const content = language === 'ar' ? news.content_ar : news.content_fr;

  // Validation des URLs de médias
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidVideoUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-TN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const truncateContent = (text: string, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        {/* Header avec statut à la une */}
        {news.is_featured && (
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 text-sm rounded-full border border-yellow-500/30 flex items-center space-x-2">
              <span>⭐</span>
              <span className={isRtl ? 'font-sans' : ''}>
                {language === 'fr' ? 'À la une' : 'أهم الأخبار'}
              </span>
            </span>
          </div>
        )}

        {/* Titre */}
        <h2 className={`text-xl font-bold text-red-600 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
          {title || (language === 'fr' ? 'Titre manquant' : 'عنوان مفقود')}
        </h2>

        {/* Média */}
        {news.has_media && (
          <div className="mb-4">
            {/* Image */}
            {news.media_type === 'image' && news.image && isValidImageUrl(news.image) && !imageError && (
              <div className="relative">
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <img
                    src={news.image}
                    alt={title || 'Image de l\'actualité'}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs flex items-center space-x-1">
                    <span>🖼️</span>
                    <span>{language === 'fr' ? 'Image' : 'صورة'}</span>
                  </span>
                </div>
              </div>
            )}
            
            {/* Vidéo */}
            {news.media_type === 'video' && news.video && isValidVideoUrl(news.video) && !videoError && (
              <div className="relative">
                <video
                  controls
                  className="w-full h-64 object-cover rounded-xl"
                  poster={news.image && isValidImageUrl(news.image) ? news.image : undefined}
                  onError={() => setVideoError(true)}
                  preload="metadata"
                >
                  <source src={news.video} type="video/mp4" />
                  <source src={news.video} type="video/webm" />
                  <source src={news.video} type="video/ogg" />
                  {language === 'fr' 
                    ? 'Votre navigateur ne supporte pas la lecture de vidéos.' 
                    : 'متصفحك لا يدعم تشغيل الفيديو.'
                  }
                </video>
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs flex items-center space-x-1">
                    <span>🎥</span>
                    <span>{language === 'fr' ? 'Vidéo' : 'فيديو'}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Affichage de fallback en cas d'erreur ou d'URL invalide */}
            {((news.media_type === 'image' && (!isValidImageUrl(news.image) || imageError)) || 
              (news.media_type === 'video' && (!isValidVideoUrl(news.video) || videoError))) && (
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl mb-2 block">📷</span>
                  <p className={isRtl ? 'font-sans' : ''}>
                    {language === 'fr' ? 'Média non disponible' : 'الوسائط غير متاحة'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contenu */}
        {content && (
          <div className={`mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className={`text-gray-700 leading-relaxed ${isRtl ? 'font-sans' : ''}`}>
              {isExpanded ? content : truncateContent(content)}
            </p>
            {content.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
                aria-label={isExpanded 
                  ? (language === 'fr' ? 'Réduire le contenu' : 'تقليل المحتوى')
                  : (language === 'fr' ? 'Développer le contenu' : 'توسيع المحتوى')
                }
                className={`text-red-600 hover:text-red-700 text-sm mt-2 transition-colors font-medium ${isRtl ? 'font-sans' : ''}`}
              >
                {isExpanded 
                  ? (language === 'fr' ? 'Voir moins' : 'عرض أقل')
                  : (language === 'fr' ? 'Voir plus' : 'عرض المزيد')
                }
              </button>
            )}
          </div>
        )}

        {/* Footer avec date */}
        <div className={`flex items-center text-sm text-gray-500 border-t border-gray-200 pt-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center space-x-2 ${isRtl ? 'space-x-reverse' : ''}`}>
            <span>��</span>
            <span className={isRtl ? 'font-sans' : ''}>{formatDate(news.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}