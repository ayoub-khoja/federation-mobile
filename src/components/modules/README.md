# Architecture modulaire de l'application

## Structure des modules

Cette application utilise une architecture modulaire pour organiser le code de manière claire et maintenable.

### 📁 Structure des dossiers

```
src/
├── components/
│   ├── modules/           # Modules métier de l'application
│   │   ├── HomeModule.tsx      # Module d'accueil
│   │   ├── ProfileModule.tsx   # Module de profil utilisateur
│   │   ├── MatchModule.tsx     # Module de gestion des matchs
│   │   └── MatchForm.tsx       # Formulaire d'ajout de match
│   ├── shared/            # Composants partagés
│   │   └── Header.tsx          # En-tête de l'application
│   └── ui/                # Composants UI réutilisables
│       ├── BottomNavigation.tsx
│       ├── LanguageSelector.tsx
│       └── FormInput.tsx
├── hooks/                 # Hooks personnalisés
│   ├── useTranslation.ts       # Gestion des traductions
│   ├── useNavigation.ts        # Gestion de la navigation
│   └── useMatchForm.ts         # Gestion du formulaire de match
└── app/
    └── home/
        └── page.tsx            # Page principale refactorisée
```

### 🎯 Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque module a une responsabilité claire
2. **Réutilisabilité** : Les composants peuvent être facilement réutilisés
3. **Maintenabilité** : Le code est plus facile à modifier et à déboguer
4. **Testabilité** : Chaque module peut être testé indépendamment
5. **Lisibilité** : La structure est claire et intuitive

### 🔧 Hooks personnalisés

#### `useNavigation`
- Gère l'état de navigation entre les onglets
- Gère la déconnexion
- Centralise la logique de changement d'onglet

#### `useMatchForm`
- Gère l'état du formulaire de match
- Gère la soumission et validation
- Gère l'upload de fichiers

#### `useTranslation`
- Gère le changement de langue
- Fournit les traductions pour chaque module

### 📱 Modules

#### `HomeModule`
Module d'accueil avec tableau de bord et actions rapides.

#### `ProfileModule`
Module de gestion du profil utilisateur avec formulaire de modification.

#### `MatchModule`
Module de gestion des matchs avec liste et formulaire d'ajout.

#### `MatchForm`
Formulaire détaillé pour l'ajout/modification de matchs.

### 🎨 Composants partagés

#### `Header`
En-tête avec logos, titre et sélecteur de langue.

#### `BottomNavigation`
Menu de navigation fixe en bas de l'écran.

### 💡 Utilisation

Chaque module est autonome et peut être facilement :
- Modifié sans affecter les autres
- Remplacé par une version alternative
- Testé individuellement
- Réutilisé dans d'autres pages

Cette architecture facilite la collaboration en équipe et la maintenance à long terme de l'application.












