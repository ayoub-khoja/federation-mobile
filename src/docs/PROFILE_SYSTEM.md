# Système de Profil Utilisateur

## Vue d'ensemble

Le système de profil utilisateur permet de récupérer, afficher et gérer les informations des arbitres connectés à l'application.

## Architecture

### 1. Types et Interfaces

```typescript
// frontend/src/types/user.ts
export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  grade: string;
  birth_date?: string;
  birth_place?: string;
  ligue?: string;
  ligue_nom?: string;
  ligue_region?: string;
  license_number?: string;
  niveau_competition?: string;
  is_verified?: boolean;
  profile_photo?: string;
  address?: string;
  full_name?: string;
  [key: string]: unknown;
}
```

### 2. Hook personnalisé

```typescript
// frontend/src/hooks/useUserProfile.ts
export const useUserProfile = () => {
  // État du profil
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonctions
  const loadUserProfile = useCallback(async () => { /* ... */ }, []);
  const updateUserProfile = useCallback(async (updateData: Partial<UserProfile>) => { /* ... */ }, []);
  const clearUserProfile = useCallback(() => { /* ... */ }, []);

  return { userProfile, isLoading, error, loadUserProfile, updateUserProfile, clearUserProfile };
};
```

### 3. Composants

#### Header avec menu profil
- **Fichier**: `frontend/src/components/shared/Header.tsx`
- **Fonctionnalités**: 
  - Affichage de la photo de profil
  - Menu déroulant avec informations de base
  - Navigation vers la page profil complète
  - Bouton de déconnexion

#### Page de profil complète
- **Fichier**: `frontend/src/app/profile/page.tsx`
- **Fonctionnalités**:
  - Affichage détaillé de toutes les informations
  - Gestion des erreurs et états de chargement
  - Actions rapides (désignations, accueil, déconnexion)
  - Interface responsive

## Utilisation

### 1. Dans un composant

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

export const MonComposant = () => {
  const { userProfile, isLoading, error, loadUserProfile } = useUserProfile();

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!userProfile) return <div>Aucun profil</div>;

  return (
    <div>
      <h1>Bonjour {userProfile.first_name} {userProfile.last_name}</h1>
      <p>Grade: {userProfile.grade}</p>
    </div>
  );
};
```

### 2. Navigation vers le profil

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigation vers la page profil
router.push('/profile');
```

## API Endpoints

### Récupération du profil
```
GET /api/accounts/arbitres/profile/
Headers: Authorization: Bearer {token}
```

### Mise à jour du profil
```
PUT /api/accounts/arbitres/profile/
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: { /* données à mettre à jour */ }
```

## Gestion des états

### États possibles
1. **Chargement** (`isLoading: true`) - Affichage d'un spinner
2. **Succès** (`userProfile` contient les données) - Affichage du profil
3. **Erreur** (`error` contient le message d'erreur) - Affichage de l'erreur avec bouton de retry
4. **Aucun profil** (`userProfile: null`) - Affichage d'un message approprié

### Cache local
- Les données du profil sont automatiquement sauvegardées dans `localStorage`
- Au redémarrage de l'application, le profil est chargé depuis le cache
- Synchronisation automatique avec l'API lors de `loadUserProfile()`

## Sécurité

- Vérification du token d'authentification à chaque requête
- Gestion automatique des erreurs 401 (token expiré)
- Nettoyage automatique des données lors de la déconnexion

## Personnalisation

### Ajout de nouveaux champs
1. Étendre l'interface `UserProfile` dans `types/user.ts`
2. Mettre à jour l'affichage dans les composants
3. Adapter l'API backend si nécessaire

### Modification du design
- Les composants utilisent Tailwind CSS
- Classes personnalisables dans chaque composant
- Support RTL pour l'arabe

## Dépannage

### Problèmes courants

1. **Profil ne se charge pas**
   - Vérifier que l'utilisateur est connecté
   - Vérifier la validité du token
   - Contrôler les logs de la console

2. **Erreur 401**
   - Token expiré, rediriger vers la connexion
   - Vérifier la configuration de l'API

3. **Données manquantes**
   - Vérifier la structure de la réponse API
   - Adapter l'interface `UserProfile` si nécessaire

### Debug

```typescript
// Dans la console du navigateur
const { userProfile, loadUserProfile } = useUserProfile();
console.log('Profil actuel:', userProfile);
loadUserProfile().then(console.log);
```

## Tests

Le composant `ProfileDemo` peut être utilisé pour tester le système :

```typescript
import { ProfileDemo } from '@/components/ProfileDemo';

// Dans votre composant de test
<ProfileDemo />
```

## Évolutions futures

- [ ] Édition en ligne du profil
- [ ] Upload de photo de profil
- [ ] Historique des modifications
- [ ] Notifications de mise à jour
- [ ] Export des données du profil






