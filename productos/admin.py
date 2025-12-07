from django.contrib import admin
from .models import Categoria, Producto

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'icono', 'activa', 'fecha_creacion']
    list_filter = ['activa']
    search_fields = ['nombre', 'descripcion']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'precio', 'stock', 'disponible', 'calificacion']
    list_filter = ['categoria', 'disponible']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['precio', 'stock', 'disponible']
