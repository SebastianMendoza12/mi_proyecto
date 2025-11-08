from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from administracion.views import ProductoAdminViewSet, VentaAdminViewSet

# Configuración del Router para la API de administración
router_admin = DefaultRouter()
router_admin.register(r'productos', ProductoAdminViewSet, basename='admin-producto')
router_admin.register(r'ventas', VentaAdminViewSet, basename='admin-venta')

urlpatterns = [
    # Interfaz de administración de Django
    path('admin/', admin.site.urls),
    
    # Rutas de autenticación JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas específicas de la app de usuarios
    path("api/auth/", include("usuarios.urls")),
    
    # Rutas de la API de administración (CRUD protegido)
    path('api/admin/', include(router_admin.urls)),
]
