# administracion/models.py

from django.db import models
from usuarios.models import CustomUser as User
from django.utils import timezone
from django.db.models import Sum, F
from productos.models import Producto # Import from productos app

class Venta(models.Model):
    # Relación uno a muchos: Un usuario puede tener muchas ventas
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_venta = models.DateTimeField(default=timezone.now)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def calcular_total(self):
        total_calculado = self.detalles.aggregate(
            total_venta=Sum(F('cantidad') * F('precio_unitario'))
        )['total_venta']

        self.total = total_calculado if total_calculado is not None else 0.00
        self.save()

    def __str__(self):
        return f"Venta {self.id} de {self.usuario.username}"

# Clase DetalleVenta
class DetalleVenta(models.Model):
    # Asegúrate de tener 'precio_unitario' en tu modelo DetalleVenta
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    # Lógica para guardar el precio del producto al momento de la venta
    def save(self, *args, **kwargs):
        # Si el precio unitario no está seteado, usa el precio actual del producto
        if not self.precio_unitario:
            self.precio_unitario = self.producto.precio

        super().save(*args, **kwargs)
        # Llama a calcular_total después de que el detalle se guarde
        self.venta.calcular_total()