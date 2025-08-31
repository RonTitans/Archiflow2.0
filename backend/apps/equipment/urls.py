from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, InterfaceViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'interfaces', InterfaceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
