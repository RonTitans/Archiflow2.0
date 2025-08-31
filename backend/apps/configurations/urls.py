from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConfigTemplateViewSet, RenderedConfigViewSet

router = DefaultRouter()
router.register(r'templates', ConfigTemplateViewSet)
router.register(r'configs', RenderedConfigViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
