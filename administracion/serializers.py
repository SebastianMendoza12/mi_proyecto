# administracion/serializers.py

from rest_framework import serializers
from .models import Producto, Venta, DetalleVenta
from django.contrib.auth import get_user_model

User = get_user_model() 

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre') 

    class Meta:
        model = DetalleVenta
        fields = ['producto', 'producto_nombre', 'cantidad', 'precio_unitario']

class VentaSerializer(serializers.ModelSerializer):
    usuario_username = serializers.ReadOnlyField(source='usuario.username') 
    detalles = DetalleVentaSerializer(source='detalleventa_set', many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'usuario', 'usuario_username', 'fecha_venta', 'total', 'detalles']
        read_only_fields = ['id', 'fecha_venta', 'total']