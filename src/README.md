# Structure du Projet - Direction Nationale de l'Arbitrage

## 📁 Architecture des Dossiers

```
src/
├── app/                    # Pages Next.js App Router
│   ├── page.tsx           # Page de connexion (/)
│   ├── home/              # Page d'accueil après login
│   │   └── page.tsx       # Interface d'accueil (/home)
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   ├── LanguageSelector.tsx  # Sélecteur de langue
│   ├── LogoDisplay.tsx       # Affichage des logos
│   └── FormInput.tsx         # Champ de formulaire
├── hooks/                 # Hooks personnalisés
│   └── useTranslation.ts  # Hook pour les traductions
└── translations/          # Système de traductions
    ├── index.ts          # Point d'entrée
    ├── fr/               # Traductions françaises
    │   ├── login.ts      # Page de connexion
    │   └── home.ts       # Page d'accueil
    └── ar/               # Traductions arabes
        ├── login.ts      # Page de connexion
        └── home.ts       # Page d'accueil
```

## 🚀 Navigation

### Pages Disponibles
- **`/`** : Page de connexion
- **`/home`** : Page d'accueil (après login)

### Flux de Navigation
1. **Connexion** : L'utilisateur saisit téléphone + mot de passe
2. **Redirection** : Après connexion réussie → `/home`
3. **Déconnexion** : Bouton logout → retour à `/`

## 🌐 Système de Traductions

### Structure
```typescript
// Utilisation dans un composant
const { t, language, isRtl, toggleLanguage } = useTranslation('login');
// ou
const { t, language, isRtl, toggleLanguage } = useTranslation('home');
```

### Langues Supportées
- **Français** (`fr`) : Interface LTR
- **Arabe** (`ar`) : Interface RTL avec police Amiri

## 🎨 Composants Réutilisables

### LanguageSelector
```tsx
<LanguageSelector 
  language={language} 
  onToggle={toggleLanguage}
  className="custom-class" 
/>
```

### LogoDisplay
```tsx
<LogoDisplay 
  size={70} 
  showBoth={true} 
  className="mb-4 px-4" 
/>
```

### FormInput
```tsx
<FormInput
  type="tel"
  placeholder={t.phone}
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  isRtl={isRtl}
  required={true}
/>
```

## 🎯 Fonctionnalités

### Page de Connexion (`/`)
- ✅ Logos FTF et cartons d'arbitre
- ✅ Formulaire téléphone + mot de passe
- ✅ Bouton d'inscription
- ✅ Sélecteur de langue
- ✅ Interface responsive
- ✅ Support RTL/LTR

### Page d'Accueil (`/home`)
- ✅ Header avec navigation
- ✅ Message de bienvenue
- ✅ Texte de test
- ✅ Grille d'actions (Dashboard, Profil, Notifications)
- ✅ Bouton de déconnexion
- ✅ Support multilingue

## 🔧 Technologies Utilisées

- **Next.js 15** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS 4** : Styling
- **Google Fonts** : Police Amiri pour l'arabe
- **App Router** : Routing Next.js

## 📱 Responsive Design

- **Mobile** : Interface optimisée tactile
- **Desktop** : Layout avec sections latérales
- **Tablet** : Adaptation automatique

## 🎨 Design System

- **Couleurs** : Rouge FTF (#E31E24)
- **Effets** : Glassmorphism, animations flottantes
- **Typographie** : Responsive avec support arabe
- **Logos** : Vectoriels haute qualité












