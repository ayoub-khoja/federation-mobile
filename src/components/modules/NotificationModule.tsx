"use client";

import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface NotificationModuleProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
}

export default function NotificationModule({ isRtl, homeT }: NotificationModuleProps) {
  const { 
    isSupported, 
    isSubscribed, 
    subscribe, 
    unsubscribe, 
    isSubscribing,
    error 
  } = usePushNotifications();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle désignation",
      message: "Vous avez été désigné pour arbitrer le match ES Tunis vs Club Africain",
      time: "Il y a 2 heures",
      read: false,
      type: "designation"
    },
    {
      id: 2,
      title: "Rappel de match",
      message: "Votre match de demain à 15h00 au Stade Olympique",
      time: "Il y a 4 heures",
      read: true,
      type: "reminder"
    },
    {
      id: 3,
      title: "Mise à jour du profil",
      message: "Votre profil a été mis à jour avec succès",
      time: "Il y a 1 jour",
      read: true,
      type: "profile"
    }
  ]);

  const handleSubscribe = async () => {
    try {
      await subscribe();
    } catch (err) {
      console.error('Erreur lors de l\'abonnement:', err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
    } catch (err) {
      console.error('Erreur lors du désabonnement:', err);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold text-blue-600 ${isRtl ? 'font-arabic' : ''}`}>
            🔔 {homeT.notifications}
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Configuration des notifications push */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Notifications Push
          </h3>
          
          {!isSupported && (
            <div className="text-orange-600 text-sm mb-3">
              ⚠️ Les notifications push ne sont pas supportées sur ce navigateur
            </div>
          )}

          {isSupported && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm">
                  {isSubscribed ? '✅ Abonné aux notifications' : '❌ Non abonné'}
                </p>
                <p className="text-gray-600 text-xs">
                  Recevez des alertes pour vos désignations et rappels
                </p>
              </div>
              
              <button
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                disabled={isSubscribing}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSubscribed
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } ${isSubscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubscribing ? '⏳' : isSubscribed ? 'Désabonner' : 'S\'abonner'}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm mt-2">
              ❌ Erreur: {error}
            </div>
          )}
        </div>

        {/* Liste des notifications */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Notifications récentes
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-600">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20 ${
                  !notification.read ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-gray-800 font-medium">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {notification.time}
                    </p>
                  </div>
                  
                  <div className="text-2xl ml-3">
                    {notification.type === 'designation' && '🏆'}
                    {notification.type === 'reminder' && '⏰'}
                    {notification.type === 'profile' && '👤'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-blue-100 text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
            Marquer tout comme lu
          </button>
          <button className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
            Effacer tout
          </button>
        </div>
      </div>
    </div>
  );
}
