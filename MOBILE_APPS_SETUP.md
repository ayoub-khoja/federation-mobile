# Configuration des Applications Mobiles iOS et Android

## 🎯 Objectif
Configurer les applications mobiles iOS et Android pour recevoir des notifications push via Firebase Cloud Messaging.

## 📱 Applications à configurer

### iOS (iPhone/iPad)
- **Bundle ID** : `com.company.federation`
- **App ID** : `1:865044602349:ios:cf08150a9a73e787171be4` ✅ (déjà configuré)

### Android (téléphones/tablettes)
- **Package Name** : `android.federation`
- **App ID** : `1:865044602349:android:8f4dbc957abdb114171be4` ✅ (configuré)

## 🔧 Configuration Backend Django

### Modèle pour stocker les tokens FCM
```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class FCMToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fcm_tokens')
    token = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=20, choices=[
        ('ios', 'iOS'),
        ('android', 'Android'),
        ('web', 'Web')
    ])
    device_id = models.CharField(max_length=255, blank=True, null=True)
    app_version = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fcm_tokens'
        unique_together = ['user', 'token']

    def __str__(self):
        return f"{self.user.username} - {self.device_type} - {self.token[:20]}..."
```

### Fonction pour envoyer des notifications
```python
# firebase_config.py
import firebase_admin
from firebase_admin import credentials, messaging
import os

def initialize_firebase():
    if not firebase_admin._apps:
        # Chemin vers votre fichier de clé de service Firebase
        cred = credentials.Certificate("path/to/firebase-service-account-key.json")
        firebase_admin.initialize_app(cred)

def send_notification_to_platform(fcm_token, title, body, data=None, platform='web'):
    """Envoyer une notification à une plateforme spécifique"""
    initialize_firebase()
    
    # Configuration différente selon la plateforme
    if platform == 'ios':
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=fcm_token,
            apns=messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(
                        sound='default',
                        badge=1,
                        alert=messaging.ApsAlert(
                            title=title,
                            body=body
                        )
                    )
                )
            )
        )
    elif platform == 'android':
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=fcm_token,
            android=messaging.AndroidConfig(
                notification=messaging.AndroidNotification(
                    sound='default',
                    channel_id='federation_channel',
                    priority='high'
                )
            )
        )
    else:  # web
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=fcm_token,
        )
    
    try:
        response = messaging.send(message)
        print(f'Notification {platform} envoyée avec succès: {response}')
        return True
    except Exception as e:
        print(f'Erreur lors de l\'envoi de la notification {platform}: {e}')
        return False

def send_notification_to_user(user, title, body, data=None):
    """Envoyer une notification à un utilisateur sur toutes ses plateformes"""
    fcm_tokens = FCMToken.objects.filter(user=user, is_active=True)
    
    for fcm_token in fcm_tokens:
        send_notification_to_platform(
            fcm_token.token, 
            title, 
            body, 
            data, 
            fcm_token.device_type
        )

def send_notification_to_all_platforms(title, body, data=None):
    """Envoyer une notification à tous les utilisateurs sur toutes les plateformes"""
    fcm_tokens = FCMToken.objects.filter(is_active=True)
    
    for fcm_token in fcm_tokens:
        send_notification_to_platform(
            fcm_token.token, 
            title, 
            body, 
            data, 
            fcm_token.device_type
        )
```

### Vues API pour les applications mobiles
```python
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FCMToken
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fcm_subscribe_mobile(request):
    """Enregistrer un token FCM pour une application mobile"""
    try:
        data = json.loads(request.body)
        fcm_token = data.get('fcm_token')
        device_type = data.get('device_type', 'web')  # ios, android, web
        device_id = data.get('device_id', '')
        app_version = data.get('app_version', '')
        
        if not fcm_token:
            return Response(
                {'error': 'Token FCM requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer ou mettre à jour le token FCM
        fcm_token_obj, created = FCMToken.objects.get_or_create(
            token=fcm_token,
            defaults={
                'user': request.user,
                'device_type': device_type,
                'device_id': device_id,
                'app_version': app_version,
                'is_active': True
            }
        )
        
        if not created:
            # Mettre à jour le token existant
            fcm_token_obj.user = request.user
            fcm_token_obj.device_type = device_type
            fcm_token_obj.device_id = device_id
            fcm_token_obj.app_version = app_version
            fcm_token_obj.is_active = True
            fcm_token_obj.save()
        
        return Response({
            'success': True,
            'message': f'Token FCM {device_type} enregistré avec succès',
            'created': created
        })
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de l\'enregistrement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

## 📲 Intégration dans les applications mobiles

### iOS (Swift)
```swift
// AppDelegate.swift
import Firebase
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        
        // Demander la permission pour les notifications
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
        
        return true
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // Obtenir le token FCM
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token { token, error in
            if let token = token {
                // Envoyer le token au backend
                self.sendTokenToBackend(token: token, deviceType: "ios")
            }
        }
    }
    
    private func sendTokenToBackend(token: String, deviceType: String) {
        // Envoyer le token à votre API Django
        // POST /api/notifications/fcm/subscribe/
    }
}
```

### Android (Kotlin)
```kotlin
// MainActivity.kt
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Obtenir le token FCM
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                return@addOnCompleteListener
            }
            
            val token = task.result
            // Envoyer le token au backend
            sendTokenToBackend(token, "android")
        }
    }
    
    private fun sendTokenToBackend(token: String, deviceType: String) {
        // Envoyer le token à votre API Django
        // POST /api/notifications/fcm/subscribe/
    }
}
```

## 🚀 Test des notifications

### Test depuis le backend Django
```python
# test_notifications.py
from .firebase_config import send_notification_to_user, send_notification_to_all_platforms

# Envoyer à un utilisateur spécifique
send_notification_to_user(
    user=request.user,
    title="Nouvelle désignation",
    body="Vous avez été désigné pour arbitrer un match",
    data={"match_id": "123", "type": "designation"}
)

# Envoyer à tous les utilisateurs
send_notification_to_all_platforms(
    title="Maintenance programmée",
    body="L'application sera en maintenance demain de 2h à 4h",
    data={"type": "maintenance"}
)
```

## ✅ Avantages de cette configuration

1. **Unified Backend** : Un seul backend Django gère toutes les plateformes
2. **Cross-Platform** : Notifications sur iOS, Android et Web
3. **Device Management** : Suivi des appareils par utilisateur
4. **Platform-Specific** : Configuration optimisée pour chaque plateforme
5. **Scalable** : Facile d'ajouter de nouvelles plateformes
