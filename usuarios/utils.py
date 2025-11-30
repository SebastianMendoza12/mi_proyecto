from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def enviar_codigo_email(email, codigo):
    """
    Envía un código de verificación por email.
    Retorna True si se envió exitosamente, False en caso contrario.
    """
    try:
        # Validar configuración
        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.error("Configuración de email incompleta")
            logger.info(f"MODO DEBUG: Código de verificación para {email}: {codigo}")
            return False
        
        asunto = 'Código de Verificación - FastFood.exe'
        
        mensaje = f"""
Hola,

Tu código de verificación es: {codigo}

Este código es válido por 10 minutos.

Si no solicitaste este código, ignora este mensaje.

Saludos,
Equipo FastFood.exe
        """
        
        logger.info(f"Intentando enviar email a: {email}")
        logger.info(f"Usando EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        logger.info(f"Usando EMAIL_HOST: {settings.EMAIL_HOST}")
        logger.info(f"Usando EMAIL_PORT: {settings.EMAIL_PORT}")
        
        send_mail(
            asunto,
            mensaje,
            settings.EMAIL_HOST_USER,  # From
            [email],                    # To
            fail_silently=False,
        )
        
        logger.info(f"✅ Email enviado exitosamente a {email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error al enviar email a {email}: {str(e)}", exc_info=True)
        logger.info(f"MODO DEBUG: Código de verificación para {email}: {codigo}")
        return False