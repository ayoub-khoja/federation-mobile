import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const handleLogout = () => {
    // Nettoyer le localStorage pour une déconnexion immédiate
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Utiliser le router Next.js pour une navigation plus rapide
    router.replace('/');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      handleLogout();
    } else {
      setActiveTab(tab);
    }
  };

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    handleLogout
  };
};



