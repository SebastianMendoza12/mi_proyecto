from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    rol = models.CharField(max_length=20, choices=[("admin", "Admin"), ("cliente", "Cliente")], default="cliente")

# Create your models here.
