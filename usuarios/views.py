from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
import re

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"error": "Usuario y contraseña son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        # ============ NUEVO: Validación de contraseña segura ============
        password_errors = []
        if len(password) < 8:
            password_errors.append("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r'[A-Z]', password):
            password_errors.append("Debe contener al menos una letra mayúscula")
        if not re.search(r'[a-z]', password):
            password_errors.append("Debe contener al menos una letra minúscula")
        if not re.search(r'[0-9]', password):
            password_errors.append("Debe contener al menos un número")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            password_errors.append("Debe contener al menos un carácter especial (!@#$%^&*)")
        if password_errors:
            return Response({"error": "Contraseña débil: " + ", ".join(password_errors)}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, password=password)
        return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)
