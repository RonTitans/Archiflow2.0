from django.contrib import admin
from .models import Tenant, TenantGroup

admin.site.register(Tenant)
admin.site.register(TenantGroup)