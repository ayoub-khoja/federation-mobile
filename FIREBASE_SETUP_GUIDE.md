# Guide de Configuration Firebase pour iOS, Android et Web

## 🎯 Objectif
Configurer Firebase Cloud Messaging (FCM) pour fonctionner sur :
- ✅ **iOS** (iPhone/iPad)
- ✅ **Android** (téléphones/tablettes)
- ✅ **Web** (navigateurs)

FCM permet d'envoyer des notifications push sur toutes ces plateformes avec une seule infrastructure.

## 📋 Étapes à suivre

### 1. Accéder à Firebase Console
- Allez sur [console.firebase.google.com](https://console.firebase.google.com)
- Connectez-vous avec votre compte Google
- Sélectionnez le projet **federation-16c7a**

### 2. Vérifier les Applications existantes
- Cliquez sur l'icône ⚙️ (Paramètres du projet)
- Allez dans l'onglet **Général**
- Dans la section **Vos applications**, vous devriez voir :
  - ✅ **iOS** : `com.company.federation` (déjà configuré)
  - ❓ **Android** : À ajouter si nécessaire
  - ❓ **Web** : À ajouter si nécessaire

### 3. Ajouter une Application Android (si nécessaire)
- Cliquez sur **Ajouter une application**
- Choisissez l'icône **Android** (🤖)
- **Nom du package** : `com.company.federation` (même que iOS)
- **Alias d'application** : `Federation Android`
- **Certificat de signature** : Laissez vide pour le moment
- Cliquez sur **Enregistrer l'application**

### 4. Ajouter une Application Web (si nécessaire)
- Cliquez sur **Ajouter une application**
- Choisissez l'icône **Web** (`</>`)
- **Nom de l'application** : `Federation Web App`
- Cliquez sur **Enregistrer l'application**

### 5. Obtenir les App IDs pour chaque plateforme
- Dans la section **Vos applications**, copiez les App IDs :
  - **iOS** : `1:865044602349:ios:cf08150a9a73e787171be4` (déjà connu)
  - **Android** : `1:865044602349:android:xxxxxxxxxx` (à obtenir)
  - **Web** : `1:865044602349:web:xxxxxxxxxx` (à obtenir)

### 6. Obtenir la Clé VAPID
- Dans Firebase Console, allez dans **Paramètres du projet** > **Cloud Messaging**
- Dans la section **Clés de paires de clés Web**
- Copiez la **Clé de paires de clés Web** (VAPID)
- Cette clé est utilisée pour toutes les plateformes

### 7. Mettre à jour la configuration
Remplacez dans vos fichiers :
- `src/config/firebase.ts`
- `public/firebase-messaging-sw.js`
- `.env.local` (à créer)

**App IDs actuels :**
- iOS : `1:865044602349:ios:cf08150a9a73e787171be4` ✅
- Android : `1:865044602349:android:8f4dbc957abdb114171be4` ✅
- Web : `1:865044602349:web:1ca0086e1512f626171be4` ✅

## 🔧 Configuration finale

### Fichier .env.local
```env
# Configuration Firebase pour iOS, Android et Web
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB51FSdFZalgylYq677RlHGDT2o-iS4ifA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=federation-16c7a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=federation-16c7a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=federation-16c7a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=865044602349

# App IDs pour chaque plateforme
NEXT_PUBLIC_FIREBASE_APP_ID_IOS=1:865044602349:ios:cf08150a9a73e787171be4
NEXT_PUBLIC_FIREBASE_APP_ID_ANDROID=1:865044602349:android:8f4dbc957abdb114171be4
NEXT_PUBLIC_FIREBASE_APP_ID_WEB=1:865044602349:web:1ca0086e1512f626171be4

# Clé VAPID (utilisée pour toutes les plateformes)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BIXzfPVhX1sgOYE2ii2L8Yu3odvBet7R7L2iuRzp-MJW8E68ugDaGY7mUtF-tVkvdy8NkRHTr7zDS1MmZulzxCk
```

### Domaine autorisé
- Dans Firebase Console > **Authentication** > **Paramètres**
- Ajoutez `localhost:3000` pour le développement
- Ajoutez votre domaine de production

## ✅ Test
Une fois configuré, testez avec :
```bash
npm run dev
```

Vérifiez dans la console du navigateur que Firebase s'initialise sans erreur.
