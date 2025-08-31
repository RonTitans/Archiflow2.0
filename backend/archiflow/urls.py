from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="ArchiFlow API",
        default_version='v1',
        description="Network Management and IPAM/DCIM Platform API",
        terms_of_service="https://www.archiflow.com/terms/",
        contact=openapi.Contact(email="api@archiflow.com"),
        license=openapi.License(name="Commercial License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Authentication
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    # API v1
    path('api/v1/sites/', include('apps.sites.urls')),
    path('api/v1/tenants/', include('apps.tenants.urls')),
    path('api/v1/equipment/', include('apps.equipment.urls')),
    path('api/v1/ipam/', include('apps.ipam.urls')),
    path('api/v1/dns/', include('apps.dns.urls')),
    path('api/v1/configurations/', include('apps.configurations.urls')),
    path('api/v1/diagrams/', include('apps.diagrams.urls')),
    path('api/v1/alerts/', include('apps.alerts.urls')),
    path('api/v1/contacts/', include('apps.contacts.urls')),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/audit/', include('apps.audit.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)