'use client';

import { useState, useEffect } from 'react';
import { useArbitreNotifications } from '../hooks/useArbitreNotifications';
import { ArbitreNotificationData } from '../services/arbitreNotificationService';

interface Arbitre {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  fcm_token?: string;
  is_active: boolean;
}

interface Match {
  id: number;
  nom: string;
  date: string;
  lieu: string;
  equipe_domicile: string;
  equipe_exterieur: string;
}

interface ArbitreSelectionProps {
  match: Match;
  onDesignationAdded?: (designation: any) => void;
}

export default function ArbitreSelectionWithNotification({ 
  match, 
  onDesignationAdded 
}: ArbitreSelectionProps) {
  const [arbitres, setArbitres] = useState<Arbitre[]>([]);
  const [selectedArbitres, setSelectedArbitres] = useState<{
    principal?: Arbitre;
    assistant1?: Arbitre;
    assistant2?: Arbitre;
    quatrieme?: Arbitre;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationOptions, setShowNotificationOptions] = useState(true);

  const {
    isSending: isNotificationSending,
    error: notificationError,
    sendArbitreNotification,
    clearError
  } = useArbitreNotifications();

  // Charger la liste des arbitres
  useEffect(() => {
    loadArbitres();
  }, []);

  const loadArbitres = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/arbitres/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setArbitres(data.arbitres || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des arbitres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArbitreSelection = (type: keyof typeof selectedArbitres, arbitre: Arbitre) => {
    setSelectedArbitres(prev => ({
      ...prev,
      [type]: arbitre
    }));
  };

  const handleAddDesignation = async () => {
    try {
      setIsLoading(true);

      // Créer les désignations
      const designations = [];
      const notifications: ArbitreNotificationData[] = [];

      // Arbitre principal
      if (selectedArbitres.principal) {
        designations.push({
          match_id: match.id,
          arbitre_id: selectedArbitres.principal.id,
          type: 'arbitre_principal'
        });

        notifications.push({
          arbitre_id: selectedArbitres.principal.id,
          arbitre_nom: `${selectedArbitres.principal.prenom} ${selectedArbitres.principal.nom}`,
          arbitre_email: selectedArbitres.principal.email,
          match_id: match.id,
          match_nom: match.nom,
          match_date: match.date,
          match_lieu: match.lieu,
          designation_type: 'arbitre_principal',
          message: `Vous avez été désigné comme arbitre principal pour le match ${match.nom}`
        });
      }

      // Arbitre assistant 1
      if (selectedArbitres.assistant1) {
        designations.push({
          match_id: match.id,
          arbitre_id: selectedArbitres.assistant1.id,
          type: 'arbitre_assistant'
        });

        notifications.push({
          arbitre_id: selectedArbitres.assistant1.id,
          arbitre_nom: `${selectedArbitres.assistant1.prenom} ${selectedArbitres.assistant1.nom}`,
          arbitre_email: selectedArbitres.assistant1.email,
          match_id: match.id,
          match_nom: match.nom,
          match_date: match.date,
          match_lieu: match.lieu,
          designation_type: 'arbitre_assistant',
          message: `Vous avez été désigné comme arbitre assistant pour le match ${match.nom}`
        });
      }

      // Arbitre assistant 2
      if (selectedArbitres.assistant2) {
        designations.push({
          match_id: match.id,
          arbitre_id: selectedArbitres.assistant2.id,
          type: 'arbitre_assistant'
        });

        notifications.push({
          arbitre_id: selectedArbitres.assistant2.id,
          arbitre_nom: `${selectedArbitres.assistant2.prenom} ${selectedArbitres.assistant2.nom}`,
          arbitre_email: selectedArbitres.assistant2.email,
          match_id: match.id,
          match_nom: match.nom,
          match_date: match.date,
          match_lieu: match.lieu,
          designation_type: 'arbitre_assistant',
          message: `Vous avez été désigné comme arbitre assistant pour le match ${match.nom}`
        });
      }

      // Arbitre quatrième
      if (selectedArbitres.quatrieme) {
        designations.push({
          match_id: match.id,
          arbitre_id: selectedArbitres.quatrieme.id,
          type: 'arbitre_quatrieme'
        });

        notifications.push({
          arbitre_id: selectedArbitres.quatrieme.id,
          arbitre_nom: `${selectedArbitres.quatrieme.prenom} ${selectedArbitres.quatrieme.nom}`,
          arbitre_email: selectedArbitres.quatrieme.email,
          match_id: match.id,
          match_nom: match.nom,
          match_date: match.date,
          match_lieu: match.lieu,
          designation_type: 'arbitre_quatrieme',
          message: `Vous avez été désigné comme quatrième arbitre pour le match ${match.nom}`
        });
      }

      // Envoyer les désignations au backend
      const response = await fetch('/api/designations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ designations })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout des désignations');
      }

      const designationResult = await response.json();

      // Envoyer les notifications si activées
      if (showNotificationOptions && notifications.length > 0) {
        try {
          for (const notification of notifications) {
            await sendArbitreNotification(notification);
          }
          console.log('✅ Toutes les notifications ont été envoyées');
        } catch (notificationError) {
          console.error('⚠️ Erreur lors de l\'envoi des notifications:', notificationError);
          // Ne pas faire échouer l'opération si les notifications échouent
        }
      }

      // Appeler le callback
      if (onDesignationAdded) {
        onDesignationAdded(designationResult);
      }

      // Réinitialiser la sélection
      setSelectedArbitres({});

      alert('✅ Désignations ajoutées avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout des désignations:', error);
      alert('❌ Erreur lors de l\'ajout des désignations');
    } finally {
      setIsLoading(false);
    }
  };

  const renderArbitreSelector = (
    type: keyof typeof selectedArbitres,
    label: string,
    required: boolean = false
  ) => {
    const selectedArbitre = selectedArbitres[type];
    const availableArbitres = arbitres.filter(arbitre => 
      arbitre.is_active && 
      !Object.values(selectedArbitres).some(selected => 
        selected && selected.id === arbitre.id
      )
    );

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedArbitre?.id || ''}
          onChange={(e) => {
            const arbitreId = parseInt(e.target.value);
            const arbitre = arbitres.find(a => a.id === arbitreId);
            if (arbitre) {
              handleArbitreSelection(type, arbitre);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          <option value="">Sélectionner un arbitre...</option>
          {availableArbitres.map(arbitre => (
            <option key={arbitre.id} value={arbitre.id}>
              {arbitre.prenom} {arbitre.nom} {arbitre.fcm_token ? '📱' : ''}
            </option>
          ))}
        </select>
        {selectedArbitre && (
          <div className="mt-2 text-sm text-gray-600">
            <p>📧 {selectedArbitre.email}</p>
            {selectedArbitre.telephone && <p>📞 {selectedArbitre.telephone}</p>}
            {selectedArbitre.fcm_token && <p>📱 Notifications FCM activées</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">🏟️ Désignation d'arbitres - {match.nom}</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📅 Informations du match</h4>
        <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>
        <p><strong>Lieu:</strong> {match.lieu}</p>
        <p><strong>Équipes:</strong> {match.equipe_domicile} vs {match.equipe_exterieur}</p>
      </div>

      {/* Sélection des arbitres */}
      <div className="space-y-4">
        {renderArbitreSelector('principal', 'Arbitre Principal', true)}
        {renderArbitreSelector('assistant1', 'Arbitre Assistant 1')}
        {renderArbitreSelector('assistant2', 'Arbitre Assistant 2')}
        {renderArbitreSelector('quatrieme', 'Quatrième Arbitre')}
      </div>

      {/* Options de notification */}
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showNotificationOptions}
            onChange={(e) => setShowNotificationOptions(e.target.checked)}
            className="mr-2"
          />
          <span className="text-green-800 font-medium">
            📱 Envoyer des notifications FCM aux arbitres sélectionnés
          </span>
        </label>
        <p className="text-sm text-green-700 mt-1">
          Les arbitres recevront une notification push sur leur appareil mobile
        </p>
      </div>

      {/* Erreurs de notification */}
      {notificationError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-800 text-sm">
            <strong>Erreur notification:</strong> {notificationError}
          </p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Effacer l'erreur
          </button>
        </div>
      )}

      {/* Bouton d'ajout */}
      <button
        onClick={handleAddDesignation}
        disabled={isLoading || !selectedArbitres.principal}
        className={`w-full py-3 px-4 rounded font-medium ${
          isLoading || !selectedArbitres.principal
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isLoading ? '⏳ Ajout en cours...' : '✅ Ajouter les désignations'}
      </button>

      {/* Résumé des sélections */}
      {Object.keys(selectedArbitres).length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">📋 Résumé des sélections:</h4>
          {Object.entries(selectedArbitres).map(([type, arbitre]) => {
            if (!arbitre) return null;
            return (
              <p key={type} className="text-sm text-gray-600">
                <strong>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {arbitre.prenom} {arbitre.nom}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

