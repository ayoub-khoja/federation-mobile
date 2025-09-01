"use client";

import { useState, useEffect } from 'react';
import { NewsItem, newsService } from '../services/newsService';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async (showRefreshing = false) => {
    try {
      console.log('🔄 Début du chargement des actualités...');
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📡 Appel du service newsService.getPublicNews()...');
      const newsData = await newsService.getPublicNews();
      console.log('✅ Actualités reçues:', newsData);
      
      setNews(newsData);
      console.log('💾 Actualités mises à jour dans le state');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des actualités';
      console.error('❌ Erreur lors du chargement des actualités:', err);
      setError(errorMessage);
    } finally {
      console.log('🏁 Fin du chargement, mise à jour des états loading/refreshing');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshNews = () => {
    console.log('🔄 Rafraîchissement des actualités...');
    loadNews(true);
  };

  const getNewsByStatus = () => {
    const featured = news.filter(item => item.is_featured);
    const regular = news.filter(item => !item.is_featured);
    console.log('📊 Actualités filtrées - À la une:', featured.length, 'Autres:', regular.length);
    return { featured, regular };
  };

  useEffect(() => {
    console.log('🚀 useNews useEffect - Chargement initial des actualités');
    loadNews();
  }, []);

  return {
    news,
    loading,
    error,
    refreshing,
    refreshNews,
    getNewsByStatus,
    retry: () => loadNews(),
  };
}









