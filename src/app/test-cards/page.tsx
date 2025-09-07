"use client";

import React from 'react';

export default function TestCardsPage() {
  // Données de test avec toutes les informations
  const testProfile = {
    id: 28,
    first_name: "Ayoub Ramez",
    last_name: "Khouja",
    full_name: "Ayoub Ramez Khouja",
    phone_number: "+21699957980",
    email: "nopop32994@mogash.com",
    role: "arbitre",
    grade: "2eme_serie",
    ligue_nom: "Ligue de Monastir",
    ligue_region: "Monastir",
    birth_date: "2003-03-15",
    birth_place: "Sayada",
    address: "Sayada, Monastir",
    cin: "12345678",
    license_number: "ARB-2024-001",
    is_verified: true
  };

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(testProfile.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'arbitre':
        return 'Arbitre Principal';
      case 'assistant':
        return 'Arbitre Assistant';
      default:
        return role || 'Non défini';
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'arbitre':
        return 'bg-blue-100 text-blue-800';
      case 'assistant':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const GRADES = [
    { value: '2eme_serie', label: '2ème Série' },
    { value: '1ere_serie', label: '1ère Série' },
    { value: 'national', label: 'National' },
    { value: 'fifa', label: 'FIFA' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🎨 Test Cartes Profil</h1>
        
        {/* Card principale avec image et infos de base */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image de profil à gauche */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-red-200 overflow-hidden">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
                <button className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <span className="text-sm">📷</span>
                </button>
              </div>
            </div>
            
                         {/* Informations à côté de l'image */}
             <div className="flex-1 text-center md:text-left">
               <h3 className="text-2xl font-bold text-gray-800 mb-3">
                 {testProfile.full_name || `${testProfile.first_name} ${testProfile.last_name}`}
               </h3>
               <div className="space-y-2 text-gray-600">
                 <p className="flex items-center justify-center md:justify-start gap-2">
                   <span>📞</span> {testProfile.phone_number}
                 </p>
                 <p className="flex items-center justify-center md:justify-start gap-2">
                   <span>✉️</span> {testProfile.email}
                 </p>
               </div>
             </div>
          </div>
          
          {/* Cartes d'informations détaillées */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Carte Rôle */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚽</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 text-xs">Rôle</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(testProfile.role)}`}>
                    {getRoleDisplay(testProfile.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Grade */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 text-xs">Grade</h4>
                  <p className="text-purple-700 font-medium text-xs">
                    {GRADES.find(g => g.value === testProfile.grade)?.label || testProfile.grade}
                  </p>
                </div>
              </div>
            </div>

            {/* Carte Ligue */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 text-xs">Ligue</h4>
                  <p className="text-green-700 font-medium text-xs">{testProfile.ligue_nom}</p>
                  <p className="text-green-600 text-xs">{testProfile.ligue_region}</p>
                </div>
              </div>
            </div>

            {/* Carte Date de naissance */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 text-xs">Date de naissance</h4>
                  <p className="text-orange-700 font-medium text-xs">
                    {new Date(testProfile.birth_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Carte Âge */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎂</span>
                </div>
                <div>
                  <h4 className="font-semibold text-pink-800 text-xs">Âge</h4>
                  <p className="text-pink-700 font-medium text-xs">{getAge()} ans</p>
                </div>
              </div>
            </div>

            {/* Carte Lieu de naissance */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🏠</span>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 text-xs">Lieu de naissance</h4>
                  <p className="text-indigo-700 font-medium text-xs">{testProfile.birth_place}</p>
                </div>
              </div>
            </div>

                         {/* Carte Adresse */}
             <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                   <span className="text-white text-sm">📍</span>
                 </div>
                 <div>
                   <h4 className="font-semibold text-teal-800 text-xs">Adresse</h4>
                   <p className="text-teal-700 font-medium text-xs">{testProfile.address}</p>
                 </div>
               </div>
             </div>

            {/* Carte Licence */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🆔</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 text-xs">Licence</h4>
                  <p className="text-amber-700 font-medium text-xs">{testProfile.license_number}</p>
                </div>
              </div>
            </div>

            {/* Carte CIN */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🆔</span>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-800 text-xs">CIN</h4>
                  <p className="text-cyan-700 font-medium text-xs">
                    {testProfile.cin || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur les couleurs */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎨 Palette de Couleurs Utilisées</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Bleu - Rôle</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Violet - Grade</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Vert - Ligue</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Orange - Date</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-pink-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Rose - Âge</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Indigo - Lieu</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-teal-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Teal - Adresse</p>
            </div>
                         <div className="text-center">
               <div className="w-8 h-8 bg-amber-500 rounded-full mx-auto mb-2"></div>
               <p className="font-medium">Ambre - Licence</p>
             </div>
             <div className="text-center">
               <div className="w-8 h-8 bg-cyan-500 rounded-full mx-auto mb-2"></div>
               <p className="font-medium">Cyan - CIN</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
