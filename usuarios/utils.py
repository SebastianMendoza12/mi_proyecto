from django.core.mail import send_mail
from django.conf import settings
import logging
import threading

logger = logging.getLogger(__name__)

def enviar_codigo_email_async(email, codigo):
    """
    Envía el email en un thread separado para no bloquear la request.
    """
    try:
        asunto = '🔐 Código de Verificación - FastFood.exe'
        
        mensaje = f"""
¡Hola!

Tu código de verificación es: {codigo}

⏱️ Este código es válido por 10 minutos.

Si no solicitaste este código, ignora este mensaje.

---
Equipo FastFood.exe 🍔
        """
        
        logger.info(f"📧 Thread iniciado - Enviando email a: {email}")
        
        # Verificar configuración
        logger.info(f"🔧 EMAIL_HOST: {settings.EMAIL_HOST}")
        logger.info(f"🔧 EMAIL_PORT: {settings.EMAIL_PORT}")
        logger.info(f"🔧 EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
        logger.info(f"🔧 EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        logger.info(f"🔧 EMAIL_HOST_PASSWORD configurado: {'Sí' if settings.EMAIL_HOST_PASSWORD else 'NO'}")
        
        # Usar DEFAULT_FROM_EMAIL si está configurado, sino EMAIL_HOST_USER
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER)
        logger.info(f"🔧 FROM_EMAIL: {from_email}")
        
        send_mail(
            subject=asunto,
            message=mensaje,
            from_email=from_email,
            recipient_list=[email],
            fail_silently=False,
        )
        
        logger.info(f"✅ Email enviado exitosamente a {email}")
        
    except Exception as e:
        logger.error(f"❌ Error al enviar email a {email}: {str(e)}")
        logger.error(f"❌ Tipo de error: {type(e).__name__}")
        import traceback
        logger.error(f"❌ Traceback completo: {traceback.format_exc()}")


def enviar_codigo_email(email, codigo):
    """
    Inicia el envío de email en segundo plano.
    Retorna inmediatamente sin esperar a que se envíe.
    """
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        logger.error("⚠️ Configuración de email incompleta")
        logger.info(f"🔑 CÓDIGO PARA {email}: {codigo}")
        return False
    
    try:
        # Enviar en thread separado para no bloquear
        thread = threading.Thread(
            target=enviar_codigo_email_async,
            args=(email, codigo)
        )
        thread.daemon = True
        thread.start()
        
        logger.info(f"🚀 Email en cola para: {email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error al iniciar thread: {str(e)}")
        logger.info(f"🔑 CÓDIGO PARA {email}: {codigo}")
        return False