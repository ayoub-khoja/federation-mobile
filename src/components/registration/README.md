# 📋 Système d'inscription par étapes (Stepper)

## 🎯 Vue d'ensemble

Le système d'inscription utilise un stepper élégant qui guide l'utilisateur à travers 3 étapes pour créer son compte d'arbitre.

## 🔄 Étapes du processus

### 📋 Étape 1 : Informations personnelles
- **Prénom** et **Nom** (obligatoires)
- **Numéro de téléphone** avec auto-format (+216XXXXXXXX)
- **Email** avec validation du format
- **Adresse complète** (obligatoire)

### ⚽ Étape 2 : Informations professionnelles
- **Ligue d'arbitrage** (sélection parmi 4 options)
  - Ligue 1 Professionnelle
  - Ligue 2 Professionnelle
  - Ligue Nationale Amateur
  - Ligue Régionale
- **Grade d'arbitrage** (progression hiérarchique)
  - Candidat (niveau 1)
  - 3ème Série (niveau 2)
  - 2ème Série (niveau 3)
  - 1ère Série (niveau 4)
  - Fédérale (niveau 5)
- **Âge** (entre 16 et 65 ans)

### 🔐 Étape 3 : Sécurité du compte
- **Mot de passe** avec indicateur de force
- **Confirmation du mot de passe** avec validation en temps réel
- Conseils de sécurité

## 🎨 Fonctionnalités du stepper

### ✨ Barre de progression
- Pourcentage de completion
- Animation fluide
- Indicateurs visuels pour chaque étape

### 🔍 Validation intelligente
- Validation en temps réel
- Messages d'erreur contextuels
- Empêche la progression si les données sont invalides

### 📱 Interface responsive
- Optimisé pour mobile et desktop
- Animations fluides
- Design cohérent avec l'application

### 🌐 Support multilingue
- Français / Arabe (RTL)
- Adaptations des layouts selon la langue

## 🔧 Architecture technique

### 📁 Structure des fichiers
```
src/components/registration/
├── Step1PersonalInfo.tsx      # Étape 1 - Infos personnelles
├── Step2ProfessionalInfo.tsx  # Étape 2 - Infos professionnelles
├── Step3SecurityInfo.tsx      # Étape 3 - Sécurité
└── index.ts                   # Exports

src/components/ui/
├── Stepper.tsx                # Composant stepper principal
└── index.ts                   # Exports

src/hooks/
├── useRegistration.ts         # Hook de gestion d'état
└── index.ts                   # Exports

src/app/
└── register/
    └── page.tsx              # Page d'inscription
```

### 🎛️ Hook useRegistration
- Gestion d'état centralisée
- Validation par étape
- Navigation entre étapes
- Soumission finale

### 🎨 Composants UI
- **Stepper** : Barre de progression et indicateurs
- **StepperNavigation** : Boutons de navigation
- **FullScreenLoader** : Chargement lors de l'inscription

## 🚀 Utilisation

### 1. Navigation depuis la page de login
```tsx
// Bouton "S'inscrire" redirige vers /register
onClick={() => window.location.href = '/register'}
```

### 2. Processus d'inscription
1. L'utilisateur remplit les informations de l'étape courante
2. Validation automatique des champs
3. Navigation vers l'étape suivante si valide
4. Récapitulatif et soumission finale

### 3. Intégration avec l'API
```tsx
// Dans useRegistration.ts
const submitRegistration = async () => {
  // Appel API vers le backend Django
  // const response = await apiClient.register(registrationData);
}
```

## 🎯 Fonctionnalités avancées

### 📧 Auto-format du téléphone
- Ajoute automatiquement le préfixe +216
- Limite à 8 chiffres après le préfixe
- Validation du format tunisien

### 🔒 Indicateur de force du mot de passe
- Analyse en temps réel
- Barre de progression visuelle
- Conseils de sécurité

### ✅ Validation dynamique
- Feedback immédiat
- Nettoyage des erreurs lors de la saisie
- Prévention de la progression invalide

## 🎨 Personnalisation

### Couleurs
- Rouge : Couleur principale (étapes, boutons)
- Vert : Validation, étapes complétées
- Bleu : Informations, sélections
- Violet : Sécurité, mot de passe

### Animations
- Transition fluide entre étapes
- Effets hover et focus
- Loader avec animations personnalisées

## 🔄 Flux utilisateur

```
Page Login → Clic "S'inscrire" → Page Register
    ↓
Étape 1: Infos personnelles → Validation → Suivant
    ↓
Étape 2: Infos professionnelles → Validation → Suivant
    ↓
Étape 3: Mot de passe → Validation → Créer compte
    ↓
Loader → Succès → Redirection Login
```

Le système est maintenant prêt et intégré avec le loader que vous avez demandé ! 🎉












