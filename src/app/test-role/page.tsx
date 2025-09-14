"use client";

import React from 'react';

export default function TestRolePage() {
  // Données de test pour différents rôles
  const testProfiles = [
    {
      id: 1,
      full_name: "Ahmed Ben Ali",
      role: "arbitre",
      grade: "FIFA",
      phone_number: "+216 98 765 432",
      email: "ahmed.benali@example.com"
    },
    {
      id: 2,
      full_name: "Fatma Trabelsi",
      role: "assistant",
      grade: "National",
      phone_number: "+216 12 345 678",
      email: "fatma.trabelsi@example.com"
    },
    {
      id: 3,
      full_name: "Mohamed Khelil",
      role: undefined,
      grade: "Régional",
      phone_number: "+216 55 123 456",
      email: "mohamed.khelil@example.com"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Test Affichage des Rôles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{profile.full_name}</h3>
              
              <div className="space-y-3">
                <div>
                  <strong>⚽ Rôle:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
                    {getRoleDisplay(profile.role)}
                  </span>
                </div>
                
                <div>
                  <strong>🏆 Grade:</strong> {profile.grade}
                </div>
                
                <div>
                  <strong>📞 Téléphone:</strong> {profile.phone_number}
                </div>
                
                <div>
                  <strong>✉️ Email:</strong> {profile.email}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">📋 Codes de Rôles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Code:</strong> "arbitre" → <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Arbitre Principal</span>
            </div>
            <div>
              <strong>Code:</strong> "assistant" → <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Arbitre Assistant</span>
            </div>
            <div>
              <strong>Code:</strong> undefined/null → <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Non défini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









