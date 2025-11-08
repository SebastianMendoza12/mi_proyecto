# administracion/admin.py

from django.contrib import admin
from .models import Producto, Venta, DetalleVenta
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

# Obtiene tu CustomUser
CustomUser = get_user_model() 

# ----------------------------------------------------
# 1. Registro de Modelos de Negocio
# ----------------------------------------------------

# Muestra los campos importantes en la lista de Productos
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock', 'fecha_creacion')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('stock', 'fecha_creacion')
    ordering = ('-fecha_creacion',)


# Para Venta, mostramos una lista de los detalles de la venta
class DetalleVentaInline(admin.TabularInline):
    model = DetalleVenta
    extra = 1 # Muestra un campo vacío adicional para agregar un nuevo detalle

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'fecha_venta', 'total')
    list_filter = ('fecha_venta',)
    # Muestra los detalles de venta dentro del formulario de Venta
    inlines = [DetalleVentaInline] 
    readonly_fields = ('total', 'fecha_venta')
    ordering = ('-fecha_venta',)


# ----------------------------------------------------
# 2. Registro de Usuario (OPCIONAL, pero útil)
# ----------------------------------------------------

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    # Definimos qué campos se muestran en la lista
    list_display = ('email', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email',)
    ordering = ('email',)
    
    # Definimos los campos que se ven en el formulario de edición/creación
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Excluye 'username' si usaste email como identificador
    exclude = ('username',)