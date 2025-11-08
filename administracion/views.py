# administracion/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Producto, Venta
from .serializers import ProductoSerializer, VentaSerializer 

# ViewSet para Productos: Permite a los administradores el CRUD completo.
class ProductoAdminViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('id')
    serializer_class = ProductoSerializer
    # ¡CRUCIAL! Solo permite acceso a usuarios staff/admin
    permission_classes = [IsAdminUser] 

# ViewSet para Ventas: Permite a los administradores ver, crear, y potencialmente modificar ventas.
class VentaAdminViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha_venta') 
    serializer_class = VentaSerializer
    # ¡CRUCIAL! Solo permite acceso a usuarios staff/admin
    permission_classes = [IsAdminUser]