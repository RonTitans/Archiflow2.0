from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrentUserView, current_user

router = DefaultRouter()

urlpatterns = [
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/', current_user, name='user-profile'),
    path('', include(router.urls)),
]
