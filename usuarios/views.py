from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
import re
import logging
from .models import CodigoVerificacion
from .utils import enviar_codigo_email

User = get_user_model()
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")
            
            logger.info(f"Intento de registro: username={username}, email={email}")
            
            # Validaciones básicas
            if not username or not password or not email:
                return Response(
                    {"error": "Usuario, contraseña y email son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Usuario ya existe"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Email ya registrado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validación de contraseña
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
                return Response(
                    {"error": "Contraseña débil: " + ", ".join(password_errors)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear usuario
            logger.info(f"Creando usuario: {username}")
            user = User.objects.create_user(username=username, password=password, email=email)
            logger.info(f"Usuario creado exitosamente: {user.id}")
            
            # Crear código de verificación
            logger.info(f"Generando código de verificación para: {user.id}")
            codigo = CodigoVerificacion.objects.create(usuario=user, tipo='registro')
            logger.info(f"Código generado: {codigo.codigo}")
            
            # Intentar enviar email
            try:
                email_enviado = enviar_codigo_email(email, codigo.codigo)
                if email_enviado:
                    logger.info(f"Email enviado exitosamente a: {email}")
                else:
                    logger.warning(f"No se pudo enviar email a: {email}, pero continuamos")
            except Exception as email_error:
                logger.error(f"Error al enviar email: {str(email_error)}")
                # No fallar el registro si el email falla
            
            return Response({
                "message": "Usuario creado. Se ha enviado un código de verificación a tu email",
                "user_id": user.id,
                "email": email,
                "requiere_verificacion": True,
                "codigo_debug": codigo.codigo if logger.level == logging.DEBUG else None
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
            
            logger.info(f"Intento de login: username={username}")
            
            if not username or not password:
                return Response(
                    {"error": "Usuario y contraseña son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = authenticate(username=username, password=password)
            
            if not user:
                logger.warning(f"Credenciales incorrectas para: {username}")
                return Response(
                    {"error": "Credenciales incorrectas"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            logger.info(f"Usuario autenticado: {user.id}, verificado_2fa: {user.verificado_2fa}")
            
            if not user.verificado_2fa:
                if not user.email:
                    return Response(
                        {"error": "Usuario sin email configurado"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Crear código de verificación
                logger.info(f"Generando código 2FA para: {user.id}")
                codigo = CodigoVerificacion.objects.create(usuario=user, tipo='login')
                
                # Intentar enviar email
                try:
                    email_enviado = enviar_codigo_email(user.email, codigo.codigo)
                    if email_enviado:
                        logger.info(f"Código 2FA enviado a: {user.email}")
                    else:
                        logger.warning(f"No se pudo enviar código 2FA a: {user.email}")
                except Exception as email_error:
                    logger.error(f"Error al enviar código 2FA: {str(email_error)}")
                
                return Response({
                    "message": "Se ha enviado un código de verificación a tu email",
                    "user_id": user.id,
                    "email": user.email,
                    "requiere_verificacion": True,
                    "codigo_debug": codigo.codigo if logger.level == logging.DEBUG else None
                }, status=status.HTTP_200_OK)
            
            # Usuario ya verificado - generar tokens
            logger.info(f"Generando tokens para usuario verificado: {user.id}")
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "rol": user.rol
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en login: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerificarCodigoView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            user_id = request.data.get("user_id")
            codigo_ingresado = request.data.get("codigo")
            
            logger.info(f"Intento de verificación: user_id={user_id}, codigo={codigo_ingresado}")
            
            if not user_id or not codigo_ingresado:
                return Response(
                    {"error": "user_id y código son requeridos"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                logger.warning(f"Usuario no encontrado: {user_id}")
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
                logger.warning(f"Código inválido para usuario: {user_id}")
                return Response(
                    {"error": "Código inválido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not codigo.es_valido():
                logger.warning(f"Código expirado para usuario: {user_id}")
                return Response(
                    {"error": "Código expirado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Marcar código como usado
            codigo.usado = True
            codigo.save()
            
            # Marcar usuario como verificado
            user.verificado_2fa = True
            user.save()
            
            logger.info(f"Usuario verificado exitosamente: {user_id}")
            
            # Generar tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Verificación exitosa",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "rol": user.rol
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en verificación: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReenviarCodigoView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            user_id = request.data.get("user_id")
            
            logger.info(f"Reenvío de código solicitado para: {user_id}")
            
            if not user_id:
                return Response(
                    {"error": "user_id es requerido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                logger.warning(f"Usuario no encontrado: {user_id}")
                return Response(
                    {"error": "Usuario no encontrado"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if not user.email:
                return Response(
                    {"error": "Usuario sin email configurado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Invalidar códigos anteriores
            CodigoVerificacion.objects.filter(
                usuario=user,
                usado=False
            ).update(usado=True)
            
            # Crear nuevo código
            codigo = CodigoVerificacion.objects.create(usuario=user, tipo='login')
            
            # Intentar enviar email
            try:
                email_enviado = enviar_codigo_email(user.email, codigo.codigo)
                if email_enviado:
                    logger.info(f"Código reenviado a: {user.email}")
                else:
                    logger.warning(f"No se pudo reenviar código a: {user.email}")
            except Exception as email_error:
                logger.error(f"Error al reenviar código: {str(email_error)}")
            
            return Response({
                "message": "Código reenviado exitosamente",
                "codigo_debug": codigo.codigo if logger.level == logging.DEBUG else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error al reenviar código: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )