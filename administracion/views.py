# administracion/views.py

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from productos.models import Producto
from productos.serializers import ProductoSerializer
from .models import Venta
from .serializers import VentaSerializer 

# ViewSet para Productos: Permite a los administradores el CRUD completo.
class ProductoAdminViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('categoria').order_by('-fecha_creacion')
    serializer_class = ProductoSerializer
    # ¡CRUCIAL! Solo permite acceso a usuarios staff/admin
    permission_classes = [IsAdminUser]
    # Add filtering support
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'disponible']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'fecha_creacion']

# ViewSet para Ventas: Permite a los administradores ver, crear, y potencialmente modificar ventas.
class VentaAdminViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha_venta') 
    serializer_class = VentaSerializer
    # ¡CRUCIAL! Solo permite acceso a usuarios staff/admin
    permission_classes = [IsAdminUser]