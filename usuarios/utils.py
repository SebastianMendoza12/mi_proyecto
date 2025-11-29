from django.core.mail import send_mail
from django.conf import settings

def enviar_codigo_email(email, codigo):
    """
    Envía un código de verificación por email
    Completamente GRATIS usando el servidor SMTP de Django
    """
    try:
        asunto = 'Código de Verificación - FastFood.exe'
        
        mensaje = f"""
Hola,

Tu código de verificación es: {codigo}

Este código es válido por 10 minutos.

Si no solicitaste este código, ignora este mensaje.

Saludos,
Equipo FastFood.exe
        """
        
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        print(f"Email enviado exitosamente a {email}")
        return True
        
    except Exception as e:
        print(f"Error al enviar email: {str(e)}")
        print(f"MODO DEBUG: Código de verificación para {email}: {codigo}")
        return False