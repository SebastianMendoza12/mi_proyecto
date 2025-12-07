from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

class CustomUser(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    rol = models.CharField(max_length=20, choices=[("admin", "Admin"), ("cliente", "Cliente")], default="cliente")
    verificado_2fa = models.BooleanField(default=False)

    def __str__(self):
        return self.username
# Create your models here.

class CodigoVerificacion(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='codigos')
    codigo = models.CharField(max_length=6)
    creado_en = models.DateTimeField(auto_now_add=True)
    expira_en = models.DateTimeField()
    usado = models.BooleanField(default=False)
    tipo = models.CharField(
        max_length=20,
        choices=[('registro', 'Registro'), ('login', 'Login')],
        default='login'
    )
    session_id = models.CharField(max_length=100, blank=True, null=True)  # Para manejar 2FA sin depender de Django sessions
    
    class Meta:
        ordering = ['-creado_en']
    
    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = ''.join(random.choices(string.digits, k=6))
        if not self.expira_en:
            self.expira_en = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def es_valido(self):
        return not self.usado and timezone.now() < self.expira_en
    
    def __str__(self):
        return f"Código {self.codigo} para {self.usuario.username}"