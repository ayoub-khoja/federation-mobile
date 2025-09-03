/**
 * Hook pour gérer les notifications des arbitres
 */

import { useState, useCallback } from 'react';
import { 
  notifyArbitreDesignation, 
  notifyMultipleArbitres,
  getArbitreNotificationHistory,
  markNotificationAsRead,
  ArbitreNotificationData,
  NotificationResponse
} from '../services/arbitreNotificationService';

interface ArbitreNotificationState {
  isSending: boolean;
  error: string | null;
  lastNotification: NotificationResponse | null;
  history: any[];
}

export const useArbitreNotifications = () => {
  const [state, setState] = useState<ArbitreNotificationState>({
    isSending: false,
    error: null,
    lastNotification: null,
    history: []
  });

  /**
   * Notifier un arbitre lors de l'ajout d'une désignation
   */
  const sendArbitreNotification = useCallback(async (
    notificationData: ArbitreNotificationData
  ): Promise<NotificationResponse> => {
    setState(prev => ({ ...prev, isSending: true, error: null }));

    try {
      const result = await notifyArbitreDesignation(notificationData);
      
      setState(prev => ({
        ...prev,
        isSending: false,
        lastNotification: result,
        error: null
      }));

      console.log('✅ Notification arbitre envoyée:', result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        isSending: false,
        error: errorMessage
      }));

      console.error('❌ Erreur notification arbitre:', error);
      throw error;
    }
  }, []);

  /**
   * Notifier plusieurs arbitres
   */
  const sendMultipleNotifications = useCallback(async (
    notificationsData: ArbitreNotificationData[]
  ): Promise<NotificationResponse[]> => {
    setState(prev => ({ ...prev, isSending: true, error: null }));

    try {
      const results = await notifyMultipleArbitres(notificationsData);
      
      setState(prev => ({
        ...prev,
        isSending: false,
        error: null
      }));

      console.log('✅ Notifications arbitres envoyées:', results);
      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        isSending: false,
        error: errorMessage
      }));

      console.error('❌ Erreur notifications arbitres:', error);
      throw error;
    }
  }, []);

  /**
   * Charger l'historique des notifications d'un arbitre
   */
  const loadNotificationHistory = useCallback(async (arbitreId: number) => {
    try {
      const history = await getArbitreNotificationHistory(arbitreId);
      setState(prev => ({ ...prev, history }));
      return history;
    } catch (error) {
      console.error('❌ Erreur chargement historique:', error);
      throw error;
    }
  }, []);

  /**
   * Marquer une notification comme lue
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = await markNotificationAsRead(notificationId);
      if (success) {
        // Mettre à jour l'historique local
        setState(prev => ({
          ...prev,
          history: prev.history.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true, read_at: new Date().toISOString() }
              : notif
          )
        }));
      }
      return success;
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
      return false;
    }
  }, []);

  /**
   * Effacer l'erreur
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendArbitreNotification,
    sendMultipleNotifications,
    loadNotificationHistory,
    markAsRead,
    clearError
  };
};


