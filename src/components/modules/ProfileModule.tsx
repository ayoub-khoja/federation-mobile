"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../../hooks/useProfile';
import { useLigues } from '../../hooks/useLigues';
import { GRADES } from '../../hooks/useRegistration';
import { PushNotificationManager } from '../PushNotificationManager';
import { getBackendUrl } from '../../config/config';

interface ProfileModuleProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
}

export default function ProfileModule({ isRtl, homeT }: ProfileModuleProps) {
  const router = useRouter();
  const { profile, isLoading, error, updateProfile, logout, getAge, getFormattedJoinDate } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '', 
    email: '',
    address: '',
    birth_place: ''
  });
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

  // Initialiser les données d'édition quand le profil est chargé
  React.useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        address: profile.address || '',
        birth_place: profile.birth_place || ''
      });
      // Reset l'état d'erreur d'image quand le profil change
      setImageError(false);
    }
  }, [profile]);

  const handleSave = async () => {
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        address: profile.address || '',
        birth_place: profile.birth_place || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Non connecté</h3>
          <p className="text-gray-600 mb-4">Veuillez vous connecter pour voir votre profil</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold text-red-600 ${isRtl ? 'font-arabic' : ''}`}>
            {homeT.myProfile}
          </h2>
          <button 
            onClick={logout}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Se déconnecter
          </button>
        </div>
        
        {/* Photo de profil et informations de base */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-red-200 overflow-hidden">
                {profile.profile_photo && !imageError ? (
                  <img 
                    src={profile.profile_photo.startsWith('http') 
                      ? profile.profile_photo 
                      : `${getBackendUrl()}${profile.profile_photo}`
                    } 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error('Erreur de chargement de l\'image de profil');
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log('Image de profil chargée avec succès');
                      setImageError(false);
                    }}
                  />
                ) : (
                  <span className="text-4xl text-gray-400">👤</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                <span className="text-sm">📷</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{profile.full_name}</h3>
            <div className="space-y-1 text-gray-600">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span>📞</span> {profile.phone_number}
              </p>
              {profile.email && (
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>✉️</span> {profile.email}
                </p>
              )}
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span>🏆</span> {GRADES.find(g => g.value === profile.grade)?.label || profile.grade}
              </p>
              {profile.ligue_nom && (
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>📍</span> {profile.ligue_nom} ({profile.ligue_region})
                </p>
              )}
              {profile.license_number && (
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>🆔</span> Licence: {profile.license_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Informations personnelles */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>👤</span> Informations personnelles
            </h4>
            <div className="space-y-2 text-sm">
              {profile.birth_date && (
                <p><strong>Date de naissance:</strong> {new Date(profile.birth_date).toLocaleDateString('fr-FR')}</p>
              )}
              {getAge() && (
                <p><strong>Âge:</strong> {getAge()} ans</p>
              )}
              {profile.birth_place && (
                <p><strong>Lieu de naissance:</strong> {profile.birth_place}</p>
              )}
              {profile.address && (
                <p><strong>Adresse:</strong> {profile.address}</p>
              )}
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚽</span> Informations professionnelles
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Grade:</strong> {GRADES.find(g => g.value === profile.grade)?.label || profile.grade}</p>
              {profile.ligue_nom && (
                <p><strong>Ligue:</strong> {profile.ligue_nom}</p>
              )}
              {profile.ligue_region && (
                <p><strong>Région:</strong> {profile.ligue_region}</p>
              )}
              <p><strong>Niveau:</strong> {profile.niveau_competition}</p>
              <p><strong>Statut:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  profile.is_verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile.is_verified ? 'Vérifié' : 'En attente'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Informations du compte */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📅</span> Informations du compte
          </h4>
          <div className="text-sm text-gray-600">
            <p><strong>Membre depuis:</strong> {getFormattedJoinDate()}</p>
            <p><strong>Dernière connexion:</strong> Maintenant</p>
          </div>
        </div>

        {/* Gestionnaire de notifications push */}
        <PushNotificationManager 
          userId={profile.id || 0}
          isEnabled={pushNotificationsEnabled}
          onToggle={setPushNotificationsEnabled}
        />

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Modifier le profil
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Paramètres
          </button>
        </div>

        {/* Modal d'édition */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Modifier le profil</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editData.first_name}
                    onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editData.last_name}
                    onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    value={editData.birth_place}
                    onChange={(e) => setEditData({...editData, birth_place: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
