"use client";

import { useTranslation } from "../hooks/useTranslation";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t, isRtl } = useTranslation('home');

  // Cast de type pour les traductions
  const homeT = t as {[key: string]: string};

  const navItems = [
    {
      key: 'home',
      label: homeT.home,
      icon: '🏠'
    },
    {
      key: 'profile',
      label: homeT.profile,
      icon: '👤'
    },
    {
      key: 'matches',
      label: homeT.matches,
      icon: '⚽'
    },
    {
      key: 'designations',
      label: homeT.designations,
      icon: '🏆'
    },
    {
      key: 'logout',
      label: homeT.logout,
      icon: '🚪'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 rounded-t-2xl z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-[60px] ${
              activeTab === item.key 
                ? 'bg-red-500 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-red-500 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <span className="text-base mb-1">{item.icon}</span>
            <span className={`text-xs font-medium ${isRtl ? 'font-arabic' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
