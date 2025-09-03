# 🔄 Synchronisation FCM Frontend ↔ Backend

## 📋 Endpoints à implémenter côté Backend Django

### 1. **Notifications FCM (Web)**
```
POST /api/notifications/fcm/subscribe/
POST /api/notifications/fcm/unsubscribe/
GET  /api/notifications/fcm/status/
POST /api/notifications/fcm/test/
GET  /api/notifications/fcm/stats/        # Admin seulement
POST /api/notifications/fcm/broadcast/    # Admin seulement
```

### 2. **Accounts FCM (Mobile)**
```
POST /api/accounts/fcm/subscribe/
POST /api/accounts/fcm/unsubscribe/
GET  /api/accounts/fcm/status/
POST /api/accounts/fcm/test/
GET  /api/accounts/fcm/stats/        # Admin seulement
POST /api/accounts/fcm/broadcast/    # Admin seulement
```

## 🔧 Structure des données

### Subscribe Request
```json
{
  "fcm_token": "string",
  "device_type": "web|ios|android",
  "device_id": "string (optionnel)",
  "app_version": "string (optionnel)",
  "user_agent": "string (optionnel)"
}
```

### Subscribe Response
```json
{
  "success": true,
  "message": "Token FCM enregistré avec succès",
  "created": true
}
```

### Status Response
```json
{
  "is_subscribed": true,
  "device_type": "web",
  "last_updated": "2024-01-01T00:00:00Z",
  "is_active": true,
  "tokens": [
    {
      "token": "string",
      "device_type": "web",
      "created_at": "2024-01-01T00:00:00Z",
      "is_active": true
    }
  ]
}
```

## 🚀 Code Backend Django à implémenter

### models.py
```python
from django.db import models
from django.contrib.auth.models import User

class FCMToken(models.Model):
    DEVICE_TYPES = [
        ('web', 'Web'),
        ('ios', 'iOS'),
        ('android', 'Android'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=10, choices=DEVICE_TYPES)
    device_id = models.CharField(max_length=255, blank=True)
    app_version = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'token']
```

### views.py
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fcm_subscribe(request):
    """Enregistrer un token FCM"""
    try:
        data = json.loads(request.body)
        fcm_token = data.get('fcm_token')
        device_type = data.get('device_type', 'web')
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fcm_unsubscribe(request):
    """Désactiver un token FCM"""
    try:
        data = json.loads(request.body)
        fcm_token = data.get('fcm_token')
        
        if not fcm_token:
            return Response(
                {'error': 'Token FCM requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Désactiver le token
        FCMToken.objects.filter(
            user=request.user,
            token=fcm_token
        ).update(is_active=False)
        
        return Response({
            'success': True,
            'message': 'Token FCM désactivé avec succès'
        })
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors du désabonnement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fcm_status(request):
    """Obtenir le statut des tokens FCM de l'utilisateur"""
    try:
        tokens = FCMToken.objects.filter(
            user=request.user,
            is_active=True
        ).order_by('-created_at')
        
        return Response({
            'is_subscribed': tokens.exists(),
            'device_type': tokens.first().device_type if tokens.exists() else None,
            'last_updated': tokens.first().updated_at.isoformat() if tokens.exists() else None,
            'is_active': tokens.exists(),
            'tokens': [
                {
                    'token': token.token[:20] + '...',  # Masquer le token pour la sécurité
                    'device_type': token.device_type,
                    'created_at': token.created_at.isoformat(),
                    'is_active': token.is_active
                }
                for token in tokens
            ]
        })
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de la vérification: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

### urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    # Notifications FCM (Web)
    path('notifications/fcm/subscribe/', views.fcm_subscribe, name='fcm_subscribe'),
    path('notifications/fcm/unsubscribe/', views.fcm_unsubscribe, name='fcm_unsubscribe'),
    path('notifications/fcm/status/', views.fcm_status, name='fcm_status'),
    path('notifications/fcm/test/', views.fcm_test, name='fcm_test'),
    
    # Accounts FCM (Mobile)
    path('accounts/fcm/subscribe/', views.fcm_subscribe, name='fcm_subscribe_mobile'),
    path('accounts/fcm/unsubscribe/', views.fcm_unsubscribe, name='fcm_unsubscribe_mobile'),
    path('accounts/fcm/status/', views.fcm_status, name='fcm_status_mobile'),
    path('accounts/fcm/test/', views.fcm_test, name='fcm_test_mobile'),
]
```

## ✅ Checklist de synchronisation

- [ ] Modèle FCMToken créé
- [ ] Vues FCM implémentées
- [ ] URLs configurées
- [ ] Tests unitaires ajoutés
- [ ] Documentation API mise à jour
- [ ] Migration de base de données créée
- [ ] Configuration Firebase côté backend
- [ ] Tests d'intégration frontend ↔ backend

## 🔍 Tests à effectuer

1. **Frontend Web** : Tester l'abonnement/désabonnement FCM
2. **Mobile iOS** : Tester l'enregistrement du token FCM
3. **Mobile Android** : Tester l'enregistrement du token FCM
4. **Backend** : Tester l'envoi de notifications push
5. **Intégration** : Tester le flux complet de bout en bout



