from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

    @action(detail=False, methods=['get'])
    def activas(self, request):
        """Obtiene solo las categorías activas"""
        activas = Categoria.objects.filter(activa=True)
        serializer = self.get_serializer(activas, many=True)
        return Response(serializer.data)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(disponible=True).select_related('categoria')
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'disponible', 'precio']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'calificacion', 'fecha_creacion']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtiene solo productos disponibles"""
        disponibles = self.queryset.filter(disponible=True)
        serializer = self.get_serializer(disponibles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_stock(self, request, pk=None):
        """Actualiza el stock de un producto"""
        if not request.user.is_staff:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        producto = self.get_object()
        cantidad = request.data.get('cantidad', 0)
        
        try:
            cantidad = int(cantidad)
            producto.stock = max(0, producto.stock + cantidad)
            producto.save()
            return Response({
                'mensaje': f'Stock actualizado a {producto.stock}',
                'stock': producto.stock
            })
        except (ValueError, TypeError):
            return Response(
                {'error': 'Cantidad debe ser un número'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def calificar(self, request, pk=None):
        """Permite a usuarios calificar un producto (1-5 estrellas)"""
        producto = self.get_object()
        calificacion = request.data.get('calificacion')
        
        try:
            calificacion = float(calificacion)
            if not (1 <= calificacion <= 5):
                raise ValueError
            producto.calificacion = calificacion
            producto.save()
            return Response({
                'mensaje': f'Producto calificado con {calificacion} estrellas',
                'calificacion': producto.calificacion
            })
        except (ValueError, TypeError):
            return Response(
                {'error': 'Calificación debe estar entre 1 y 5'},
                status=status.HTTP_400_BAD_REQUEST
            )