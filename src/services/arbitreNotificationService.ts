/**
 * Service de notification pour les arbitres
 * Gère l'envoi de notifications FCM aux arbitres lors de l'ajout de désignations
 */

import { FCM_ENDPOINTS } from '../config/fcm-endpoints';

export interface ArbitreNotificationData {
  arbitre_id: number;
  arbitre_nom: string;
  arbitre_email: string;
  match_id: number;
  match_nom: string;
  match_date: string;
  match_lieu: string;
  designation_type: 'arbitre_principal' | 'arbitre_assistant' | 'arbitre_quatrieme';
  message?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  notification_id?: string;
  sent_at: string;
}

/**
 * Envoyer une notification à un arbitre lors de l'ajout d'une désignation
 */
export const notifyArbitreDesignation = async (
  notificationData: ArbitreNotificationData
): Promise<NotificationResponse> => {
  try {
    const response = await fetch('/api/arbitres/notify-designation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi de la notification');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Erreur lors de la notification arbitre:', error);
    throw error;
  }
};

/**
 * Envoyer des notifications à plusieurs arbitres
 */
export const notifyMultipleArbitres = async (
  notificationsData: ArbitreNotificationData[]
): Promise<NotificationResponse[]> => {
  try {
    const response = await fetch('/api/arbitres/notify-multiple/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ notifications: notificationsData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi des notifications');
    }

    const data = await response.json();
    return data.results;

  } catch (error) {
    console.error('❌ Erreur lors des notifications arbitres:', error);
    throw error;
  }
};

/**
 * Obtenir l'historique des notifications d'un arbitre
 */
export const getArbitreNotificationHistory = async (
  arbitreId: number
): Promise<any[]> => {
  try {
    const response = await fetch(`/api/arbitres/${arbitreId}/notifications/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération de l\'historique');
    }

    const data = await response.json();
    return data.notifications;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    throw error;
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.ok;

  } catch (error) {
    console.error('❌ Erreur lors du marquage de la notification:', error);
    return false;
  }
};
