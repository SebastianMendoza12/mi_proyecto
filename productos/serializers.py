from rest_framework import serializers
from .models import Categoria, Producto

class CategoriaSerializer(serializers.ModelSerializer):
    productos_count = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'icono', 'descripcion', 'activa', 'productos_count', 'fecha_creacion']

    def get_productos_count(self, obj):
        return obj.productos.count()


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'categoria', 
            'categoria_nombre', 'imagen', 'disponible', 'stock', 
            'calificacion', 'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def to_representation(self, instance):
        """Personalizar la representación para devolver URLs absolutas de imágenes"""
        data = super().to_representation(instance)
        
        # Asegurar que la imagen sea una URL absoluta al leer
        if data.get('imagen'):
            imagen_url = data['imagen']
            # Si ya es una URL completa, devolverla tal cual
            if not (imagen_url.startswith('http://') or imagen_url.startswith('https://')):
                # Si es una ruta relativa, construir URL absoluta
                request = self.context.get('request')
                if request:
                    data['imagen'] = request.build_absolute_uri(imagen_url)
        
        return data

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value