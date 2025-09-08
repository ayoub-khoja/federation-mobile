"use client";

import React, { useState, useEffect } from 'react';

interface DiagnosticInfo {
  userAgent: string;
  isMobile: boolean;
  isSecureContext: boolean;
  serviceWorker: boolean;
  pushManager: boolean;
  notification: boolean;
  firebase: boolean;
  hostname: string;
  browser: string;
  os: string;
  version: string;
}

export const MobileFCMDiagnostic: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runDiagnostic = async () => {
      if (typeof window === 'undefined') return;

      const userAgent = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Détection du navigateur
      let browser = 'Inconnu';
      let version = 'Inconnue';
      
      if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Inconnue';
      } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Inconnue';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Inconnue';
      } else if (userAgent.includes('Edge')) {
        browser = 'Edge';
        const match = userAgent.match(/Edge\/(\d+)/);
        version = match ? match[1] : 'Inconnue';
      }

      // Détection de l'OS
      let os = 'Inconnu';
      if (userAgent.includes('Android')) {
        os = 'Android';
        const match = userAgent.match(/Android (\d+)/);
        if (match) os += ` ${match[1]}`;
      } else if (userAgent.includes('iPhone')) {
        os = 'iOS';
        const match = userAgent.match(/OS (\d+)_/);
        if (match) os += ` ${match[1]}`;
      } else if (userAgent.includes('iPad')) {
        os = 'iPadOS';
        const match = userAgent.match(/OS (\d+)_/);
        if (match) os += ` ${match[1]}`;
      }

      // Vérification des APIs
      const hasPushManager = 'PushManager' in window || 
                            ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype);
      
      const info: DiagnosticInfo = {
        userAgent,
        isMobile,
        isSecureContext: window.isSecureContext,
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: hasPushManager,
        notification: 'Notification' in window,
        firebase: false, // Sera vérifié plus tard
        hostname: window.location.hostname,
        browser,
        os,
        version
      };

      // Vérifier Firebase
      try {
        const { isFCMSupported } = await import('../config/firebase');
        info.firebase = isFCMSupported();
      } catch (error) {
        console.error('Erreur lors de la vérification Firebase:', error);
      }

      setDiagnostic(info);
      setIsLoading(false);
    };

    runDiagnostic();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-blue-800">Diagnostic en cours...</span>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-red-800">Erreur lors du diagnostic</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusColor = (status: boolean) => status ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📱 Diagnostic Mobile FCM
      </h3>
      
      <div className="space-y-4">
        {/* Informations de base */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Informations de l'appareil</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p><strong>Appareil:</strong> {diagnostic.isMobile ? 'Mobile' : 'Desktop'}</p>
            <p><strong>OS:</strong> {diagnostic.os}</p>
            <p><strong>Navigateur:</strong> {diagnostic.browser} {diagnostic.version}</p>
            <p><strong>Hostname:</strong> {diagnostic.hostname}</p>
          </div>
        </div>

        {/* Vérifications techniques */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Vérifications techniques</h4>
          <div className="space-y-1 text-sm">
            <p className="flex items-center">
              <span className="mr-2">{getStatusIcon(diagnostic.serviceWorker)}</span>
              <span>Service Worker</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">{getStatusIcon(diagnostic.pushManager)}</span>
              <span>Push Manager</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">{getStatusIcon(diagnostic.notification)}</span>
              <span>Notifications</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">{getStatusIcon(diagnostic.isSecureContext)}</span>
              <span>Contexte sécurisé (HTTPS)</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">{getStatusIcon(diagnostic.firebase)}</span>
              <span>Firebase FCM</span>
            </p>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Recommandations</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {!diagnostic.serviceWorker && (
              <p>• Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge)</p>
            )}
            {!diagnostic.pushManager && (
              <p>• Sur mobile, essayez Chrome ou Firefox récent</p>
            )}
            {!diagnostic.notification && (
              <p>• Activez les notifications dans les paramètres du navigateur</p>
            )}
            {!diagnostic.isSecureContext && (
              <p>• FCM nécessite HTTPS en production</p>
            )}
            {diagnostic.isMobile && diagnostic.browser === 'Safari' && (
              <p>• Safari sur iOS nécessite iOS 16+ pour FCM</p>
            )}
            {diagnostic.isMobile && diagnostic.browser === 'Chrome' && parseInt(diagnostic.version) < 50 && (
              <p>• Chrome version trop ancienne, mettez à jour</p>
            )}
          </div>
        </div>

        {/* User Agent complet */}
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-gray-900">User Agent complet</summary>
          <p className="text-xs text-gray-600 mt-2 break-all">{diagnostic.userAgent}</p>
        </details>
      </div>
    </div>
  );
};
