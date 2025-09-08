"use client";

import React, { useState, useEffect } from 'react';

interface PWAInstallGuideProps {
  isVisible: boolean;
  onCloseAction: () => void;
}

export const PWAInstallGuide: React.FC<PWAInstallGuideProps> = ({ isVisible, onCloseAction }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    setIsIOS(/iPhone|iPad|iPod/i.test(userAgent));
    setIsAndroid(/Android/i.test(userAgent));
    
    const pwaMode = window.matchMedia('(display-mode: standalone)').matches || 
                   (window.navigator as any).standalone === true ||
                   document.referrer.includes('android-app://');
    setIsPWA(pwaMode);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            📱 Installer l'application
          </h2>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {isPWA ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-medium">
              Application déjà installée !
            </p>
            <p className="text-gray-600 text-sm mt-2">
              L'application est déjà ajoutée à votre écran d'accueil.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {isIOS ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  📱 Sur iPhone/iPad (Safari)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Appuyez sur le bouton <strong>Partager</strong> (📤) en bas de l'écran</li>
                  <li>Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong></li>
                  <li>Appuyez sur <strong>"Ajouter"</strong> en haut à droite</li>
                  <li>L'icône de l'app apparaîtra sur votre écran d'accueil</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    💡 <strong>Astuce :</strong> Une fois installée, ouvrez l'app depuis l'écran d'accueil pour activer les notifications.
                  </p>
                </div>
              </div>
            ) : isAndroid ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  🤖 Sur Android (Chrome)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Appuyez sur le menu (⋮) en haut à droite</li>
                  <li>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong> ou <strong>"Installer l'application"</strong></li>
                  <li>Appuyez sur <strong>"Ajouter"</strong> ou <strong>"Installer"</strong></li>
                  <li>L'icône de l'app apparaîtra sur votre écran d'accueil</li>
                </ol>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-xs">
                    ✅ <strong>Android :</strong> Les notifications push fonctionnent parfaitement en mode PWA.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  💻 Sur ordinateur
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Chrome : Cliquez sur l'icône d'installation (⬇️) dans la barre d'adresse</li>
                  <li>Edge : Cliquez sur "Installer" dans le menu</li>
                  <li>Firefox : Cliquez sur "Installer" dans la barre d'adresse</li>
                </ol>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                🔔 Notifications
              </h4>
              <p className="text-yellow-700 text-sm">
                {isIOS 
                  ? "Sur iOS, les notifications peuvent être limitées en mode PWA. Pour une expérience optimale, utilisez Chrome ou Firefox."
                  : "Une fois l'application installée, vous pourrez activer les notifications push pour recevoir des alertes instantanées."
                }
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCloseAction}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
          {!isPWA && (
            <button
              onClick={() => {
                // Déclencher l'événement d'installation PWA si disponible
                if ('serviceWorker' in navigator) {
                  window.dispatchEvent(new Event('beforeinstallprompt'));
                }
                onCloseAction();
              }}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Installer maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
