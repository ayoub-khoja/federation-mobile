class NewsService {
  private getBaseURL() {
    // Détecter l'environnement
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      console.log('🌐 Environnement détecté:', { protocol, hostname });
      
      // Si on est sur localhost ou 127.0.0.1, utiliser localhost:8000
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const baseURL = 'http://localhost:8000';
        console.log('🏠 URL de base (localhost):', baseURL);
        return baseURL;
      }
      
      // Sinon, utiliser l'IP du réseau
      const baseURL = 'http://192.168.1.101:8000';
      console.log('🏠 URL de base (IP réseau):', baseURL);
      return baseURL;
    }
    
    // Fallback pour SSR
    const baseURL = 'http://localhost:8000';
    console.log('🏠 URL de base (SSR fallback):', baseURL);
    return baseURL;
  }

  async getPublicNews(): Promise<NewsItem[]> {
    try {
      // Utiliser la méthode getBaseURL pour construire l'URL correcte
      const baseURL = this.getBaseURL();
      const url = `${baseURL}/api/news/`;
      
      console.log('🔍 Récupération des actualités depuis:', url);
      console.log('⏱️ Début de la requête fetch...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('📡 Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', response.status, response.statusText, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('📄 Lecture du corps de la réponse...');
      const data = await response.json();
      console.log('📄 Données reçues de l\'API:', data);
      
      // L'API retourne soit un array directement, soit un objet avec un champ 'results'
      const newsArray = Array.isArray(data) ? data : (data.results || []);
      console.log('📰 Actualités trouvées:', newsArray.length);
      
      if (newsArray.length === 0) {
        console.log('⚠️ Aucune actualité trouvée dans la réponse');
      }
      
      // Construire les URLs complètes pour les médias
      const processedNews = newsArray.map((news: NewsItem) => ({
        ...news,
        image: news.image ? `${baseURL}${news.image}` : null,
        video: news.video ? `${baseURL}${news.video}` : null,
      }));
      
      console.log('✅ Actualités traitées depuis le backend:', processedNews.length);
      return processedNews;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des actualités depuis le backend:', error);
      console.error('❌ Détails de l\'erreur:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }
}

export interface NewsItem {
  id: number;
  title_fr: string;
  title_ar: string;
  content_fr?: string;
  content_ar?: string;
  image?: string | null;
  video?: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_featured: boolean;
  order: number;
  has_media: boolean;
  media_type: 'image' | 'video' | null;
  author_full_name?: string;
  author_phone_number?: string;
}

export const newsService = new NewsService();
