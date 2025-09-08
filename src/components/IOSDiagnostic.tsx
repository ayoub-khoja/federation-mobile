"use client";

import React, { useState, useEffect } from 'react';

export const IOSDiagnostic: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const isChromeIOS = /CriOS/i.test(userAgent) || (/Chrome/i.test(userAgent) && isIOS);
    const isFirefoxIOS = /FxiOS/i.test(userAgent) || (/Firefox/i.test(userAgent) && isIOS);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true ||
                  localStorage.getItem('pwa_installed') === 'true';

    const info = {
      isIOS,
      isSafari,
      isChromeIOS,
      isFirefoxIOS,
      isPWA,
      userAgent,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasPushManager: 'PushManager' in window || ('serviceWorker' in navigator && 'PushManager' in ServiceWorkerRegistration.prototype),
      hasNotification: 'Notification' in window,
      isSecureContext: window.isSecureContext,
      hostname: window.location.hostname
    };

    setDiagnostic(info);
  }, []);

  if (!diagnostic || !diagnostic.isIOS) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            🍎 Diagnostic iOS - Limitations des notifications
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <p><strong>Navigateur:</strong> {
                  diagnostic.isChromeIOS ? 'Chrome iOS' :
                  diagnostic.isFirefoxIOS ? 'Firefox iOS' :
                  diagnostic.isSafari ? 'Safari iOS' : 'Autre'
                }</p>
                <p><strong>Mode PWA:</strong> {diagnostic.isPWA ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Service Worker:</strong> {diagnostic.hasServiceWorker ? '✅ Oui' : '❌ Non'}</p>
              </div>
              <div>
                <p><strong>Push Manager:</strong> {diagnostic.hasPushManager ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Notifications:</strong> {diagnostic.hasNotification ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Contexte sécurisé:</strong> {diagnostic.isSecureContext ? '✅ Oui' : '❌ Non'}</p>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-orange-100 rounded text-xs">
              <p className="font-medium text-orange-800 mb-1">Pourquoi les notifications ne fonctionnent pas sur iOS ?</p>
              <ul className="list-disc list-inside space-y-1 text-orange-700">
                <li>Apple limite les APIs de notifications push dans tous les navigateurs iOS</li>
                <li>Même Chrome/Firefox sur iOS utilisent le moteur WebKit d'Apple</li>
                <li>Les Service Workers sont restreints sur iOS</li>
                <li>Le mode PWA peut améliorer la compatibilité mais reste limité</li>
              </ul>
            </div>

            <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
              <p className="font-medium text-blue-800 mb-1">Solutions recommandées :</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li><strong>Mode PWA :</strong> Ajoutez l'app à l'écran d'accueil (meilleure compatibilité)</li>
                <li><strong>Android :</strong> Utilisez un appareil Android pour les notifications complètes</li>
                <li><strong>Desktop :</strong> Testez sur un ordinateur avec Chrome/Firefox</li>
                <li><strong>Notifications natives :</strong> Implémentez des notifications push natives iOS</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
