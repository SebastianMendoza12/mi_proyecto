# administracion/admin.py

from django.contrib import admin
from .models import Venta, DetalleVenta
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

# Obtiene tu CustomUser
CustomUser = get_user_model()

# Para Venta, mostramos una lista de los detalles de la venta
class DetalleVentaInline(admin.TabularInline):
    model = DetalleVenta
    extra = 1 # Muestra un campo vacío adicional para agregar un nuevo detalle

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'fecha_venta', 'total')
    list_filter = ('fecha_venta',)
    inlines = [DetalleVentaInline]
    # Dejamos estos como solo lectura, pues ahora se llenan automáticamente
    readonly_fields = ('total', 'fecha_venta')
    ordering = ('-fecha_venta',)

    # Este método se llama después de guardar la Venta y sus Detalles (inlines)
    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        
        # Obtenemos la instancia de la Venta que acabamos de guardar
        venta = form.instance
        
        # Llamamos a la función de lógica de negocio para calcular el total
        # ¡Esto actualiza y guarda los campos total y fecha_venta!
        venta.calcular_total()

# ----------------------------------------------------
# 2. Registro de Usuario (OPCIONAL, pero útil)
# ----------------------------------------------------

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    # Campos que se muestran en la lista (esto ya estaba bien)
    list_display = ('email', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email',)
    ordering = ('email',)
    
    # FIX CRÍTICO: Definimos la estructura del formulario de ADICIÓN/EDICIÓN
    # Quitamos 'username' de todos los fieldsets y lo reemplazamos por 'email'.
    fieldsets = (
        (None, {'fields': ('email', 'password')}), # <-- Cambiado de ('username', 'password')
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Definimos qué campos se muestran en la pantalla de CREACIÓN de nuevo usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2'), # <-- Usamos email para crear
        }),
    )

    # Excluye 'username' (aunque con el add_fieldsets ya no es tan necesario)
    exclude = ('username',)