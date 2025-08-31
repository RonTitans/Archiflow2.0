from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubnetViewSet, IPAddressViewSet

router = DefaultRouter()
router.register(r'subnets', SubnetViewSet)
router.register(r'ip-addresses', IPAddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
