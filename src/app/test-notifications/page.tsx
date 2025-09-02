import ArbitreSelectionWithNotification from '../../components/ArbitreSelectionWithNotification';

export default function TestNotificationsPage() {
  // Données de test pour un match
  const testMatch = {
    id: 1,
    nom: "ES Tunis vs Club Africain",
    date: "2024-01-15T15:00:00Z",
    lieu: "Stade Olympique de Radès",
    equipe_domicile: "ES Tunis",
    equipe_exterieur: "Club Africain"
  };

  const handleDesignationAdded = (result: any) => {
    console.log('Désignation ajoutée:', result);
    alert('Désignation ajoutée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Test Notifications Arbitres</h1>
        <ArbitreSelectionWithNotification 
          match={testMatch}
          onDesignationAdded={handleDesignationAdded}
        />
      </div>
    </div>
  );
}
