from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CodigoVerificacion
from django.utils import timezone
import logging
import uuid

User = get_user_model()
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")
            
            if not username or not password or not email:
                return Response(
                    {"error": "Usuario, contraseña y email son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if User.objects.filter(username=username).exists():
                return Response({"error": "Usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email ya registrado"}, status=status.HTTP_400_BAD_REQUEST)

            # Create user
            user = User.objects.create_user(username=username, password=password, email=email)
            
            # Auto-verify for now to simplify flow
            user.verificado_2fa = True
            user.save()
            
            # Generate tokens immediately
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Usuario creado exitosamente",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "rol": user.rol,
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error en registro: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
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
            
            # Generate 2FA code and session ID
            session_id = str(uuid.uuid4())
            codigo_obj = CodigoVerificacion.objects.create(
                usuario=user,
                tipo='login',
                session_id=session_id
            )
            
            # SIMULATED EMAIL - Print to console
            print("\n" + "="*60)
            print("SIMULACION DE EMAIL")
            print("="*60)
            print(f"Para: {user.email}")
            print(f"Asunto: Codigo de verificacion - FastFood.exe")
            print("-"*60)
            print(f"Hola {user.username},")
            print(f"\nTu codigo de verificacion es:")
            print(f"\n    {codigo_obj.codigo}")
            print(f"\nEste codigo expira en 10 minutos.")
            print(f"Si no solicitaste este codigo, ignora este mensaje.")
            print("="*60 + "\n")
            
            return Response({
                "requires_2fa": True,
                "session_id": session_id,
                "message": "Código de verificación enviado. Revisa la consola del servidor.",
                "email": user.email,  # For demo purposes
                "debug_code": codigo_obj.codigo # Para facilitar pruebas
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en login: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyCodeView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            session_id = request.data.get("session_id")
            codigo = request.data.get("codigo")
            
            if not session_id or not codigo:
                return Response(
                    {"error": "session_id y código son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get codigo_obj by session_id
            try:
                codigo_obj = CodigoVerificacion.objects.get(session_id=session_id)
                user = codigo_obj.usuario
            except CodigoVerificacion.DoesNotExist:
                return Response(
                    {"error": "Sesión inválida o expirada"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify code
            if not codigo_obj.es_valido():
                return Response(
                    {"error": "Código expirado o ya usado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if codigo_obj.codigo != codigo:
                return Response(
                    {"error": "Código incorrecto"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Mark code as used
            codigo_obj.usado = True
            codigo_obj.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            logger.info(f"Usuario {user.username} verificado con 2FA exitosamente")
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "rol": user.rol,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "message": "Verificación exitosa"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en verificación: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
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
            
            # Generate tokens directly (NO 2FA for admin)
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "rol": user.rol,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en login admin: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
