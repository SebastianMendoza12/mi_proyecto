from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    rol = models.CharField(max_length=20, choices=[("admin", "Admin"), ("cliente", "Cliente")], default="cliente")

    def __str__(self):
        return self.username
# Create your models here.
