from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
import re
from .models import CodigoVerificacion
from .utils import enviar_codigo_email

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        if not username or not password or not email:
            return Response({"error": "Usuario, contraseña y email son requeridos"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email ya registrado"}, status=status.HTTP_400_BAD_REQUEST)

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
        
        user = User.objects.create_user(username=username, password=password, email=email)
        codigo = CodigoVerificacion.objects.create(usuario=user,tipo='registro')
        enviar_codigo_email(email, codigo.codigo)
        
        return Response({"message": "Usuario creado. Se ha enviado un código de verificación a tu email",
                         "user_id": user.id,
                         "email": email,
                         "requiere_verificacion": True
                        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                {"error": "Usuario y contraseña son requeridos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {"error": "Credenciales incorrectas"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.verificado_2fa:
            if not user.email:
                return Response(
                    {"error": "Usuario sin email configurado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            codigo = CodigoVerificacion.objects.create(
                usuario=user,
                tipo='login'
            )
            
            enviar_codigo_email(user.email, codigo.codigo)
            
            return Response({
                "message": "Se ha enviado un código de verificación a tu email",
                "user_id": user.id,
                "email": user.email,
                "requiere_verificacion": True
            }, status=status.HTTP_200_OK)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "rol": user.rol
        }, status=status.HTTP_200_OK)


class VerificarCodigoView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user_id = request.data.get("user_id")
        codigo_ingresado = request.data.get("codigo")
        
        if not user_id or not codigo_ingresado:
            return Response(
                {"error": "user_id y código son requeridos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        codigo = CodigoVerificacion.objects.filter(
            usuario=user,
            codigo=codigo_ingresado,
            usado=False
        ).first()
        
        if not codigo:
            return Response(
                {"error": "Código inválido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not codigo.es_valido():
            return Response(
                {"error": "Código expirado"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        codigo.usado = True
        codigo.save()
        
        user.verificado_2fa = True
        user.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "Verificación exitosa",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "rol": user.rol
        }, status=status.HTTP_200_OK)


class ReenviarCodigoView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user_id = request.data.get("user_id")
        
        if not user_id:
            return Response(
                {"error": "user_id es requerido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not user.email:
            return Response(
                {"error": "Usuario sin email configurado"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        CodigoVerificacion.objects.filter(
            usuario=user,
            usado=False
        ).update(usado=True)
        
        codigo = CodigoVerificacion.objects.create(
            usuario=user,
            tipo='login'
        )
        
        enviar_codigo_email(user.email, codigo.codigo)
        
        return Response({
            "message": "Código reenviado exitosamente"
        }, status=status.HTTP_200_OK)