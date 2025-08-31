from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DNSZoneViewSet, DNSRecordViewSet

router = DefaultRouter()
router.register(r'zones', DNSZoneViewSet)
router.register(r'records', DNSRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
