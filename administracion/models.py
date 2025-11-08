# administracion/models.py

from django.db import models
from usuarios.models import CustomUser as User 

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    # Relación uno a muchos: Un usuario puede tener muchas ventas
    usuario = models.ForeignKey(User, on_delete=models.CASCADE) 
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Venta {self.id} de {self.usuario.username}"

# Modelo intermedio para manejar la relación muchos a muchos entre Venta y Producto
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('venta', 'producto')