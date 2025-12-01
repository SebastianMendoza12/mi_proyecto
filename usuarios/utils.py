from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def enviar_codigo_email(email, codigo):
    """
    Envía el email de forma SÍNCRONA para debugging.
    """
    try:
        # Verificar configuración
        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.error("⚠️ Configuración de email incompleta")
            logger.info(f"🔑 CÓDIGO PARA {email}: {codigo}")
            return False
        
        logger.info(f"📧 Enviando email a: {email}")
        logger.info(f"🔧 EMAIL_HOST: {settings.EMAIL_HOST}")
        logger.info(f"🔧 EMAIL_PORT: {settings.EMAIL_PORT}")
        logger.info(f"🔧 EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
        logger.info(f"🔧 EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        
        # Obtener FROM_EMAIL
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
        if not from_email or from_email == settings.EMAIL_HOST_USER:
            from_email = 'fastfoodexe@gmail.com'
            
        logger.info(f"🔧 FROM_EMAIL: {from_email}")
        
        asunto = '🔐 Código de Verificación - FastFood.exe'
        
        mensaje = f"""
¡Hola!

Tu código de verificación es: {codigo}

⏱️ Este código es válido por 10 minutos.

Si no solicitaste este código, ignora este mensaje.

---
Equipo FastFood.exe 🍔
        """
        
        # Enviar directamente (sin threading)
        send_mail(
            subject=asunto,
            message=mensaje,
            from_email=from_email,
            recipient_list=[email],
            fail_silently=False,
        )
        
        logger.info(f"✅ Email enviado exitosamente a {email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error al enviar email a {email}: {str(e)}")
        logger.error(f"❌ Tipo de error: {type(e).__name__}")
        import traceback
        logger.error(f"❌ Traceback completo: {traceback.format_exc()}")
        logger.info(f"🔑 CÓDIGO PARA {email}: {codigo}")
        return False