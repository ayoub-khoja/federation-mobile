"use client";

import React, { useState, useEffect } from 'react';
import { useFCMNotifications } from '../../hooks/useFCMNotifications';
import { PushNotificationManager } from '../PushNotificationManager';

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
  } = useFCMNotifications();

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

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

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

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

        {/* Gestionnaire de notifications push */}
        <div className="mb-6">
          <PushNotificationManager 
            userId={1} // Vous pouvez passer l'ID utilisateur depuis le contexte
            isEnabled={pushNotificationsEnabled}
            onToggleAction={setPushNotificationsEnabled}
          />
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
                  
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">
                      {notification.type === 'designation' && '🏆'}
                      {notification.type === 'reminder' && '⏰'}
                      {notification.type === 'profile' && '👤'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              unreadCount === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Marquer tout comme lu ({unreadCount})
          </button>
          <button 
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              notifications.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            Effacer tout ({notifications.length})
          </button>
        </div>

        {/* Statistiques des notifications */}
        {notifications.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Statistiques</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-lg font-bold text-blue-600">{notifications.length}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{unreadCount}</div>
                <div className="text-gray-600">Non lues</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{notifications.length - unreadCount}</div>
                <div className="text-gray-600">Lues</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
