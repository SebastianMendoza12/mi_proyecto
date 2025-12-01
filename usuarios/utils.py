from django.conf import settings
import logging
<<<<<<< HEAD
import requests
=======
import threading
>>>>>>> parent of ed77cc0 (Update utils.py)

logger = logging.getLogger(__name__)

def enviar_codigo_email_async(email, codigo):
    """
<<<<<<< HEAD
    Envía un código de verificación usando la API de SendGrid.
    NO usa SMTP, por lo tanto funciona en Render Free.
    """
    try:
        logger.info(f"📧 Enviando email via API a: {email}")
        
        # Validar API Key
        sendgrid_api_key = settings.EMAIL_HOST_PASSWORD
        if not sendgrid_api_key or sendgrid_api_key == '':
            logger.error("❌ SendGrid API Key no configurada")
            logger.warning(f"💡 CÓDIGO: {codigo}")
            return False
        
        # Preparar email
        asunto = 'Código de Verificación - FastFood.exe'
        mensaje_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .code {{ 
                    background: #f4f4f4; 
                    padding: 15px; 
                    font-size: 32px; 
                    font-weight: bold; 
                    text-align: center; 
                    letter-spacing: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Código de Verificación</h2>
                <p>Hola,</p>
                <p>Tu código de verificación es:</p>
                <div class="code">{codigo}</div>
                <p>Este código es válido por 10 minutos.</p>
                <p>Si no solicitaste este código, ignora este mensaje.</p>
                <br>
                <p>Saludos,<br><strong>Equipo FastFood.exe</strong></p>
            </div>
        </body>
        </html>
        """
        
        # Payload para SendGrid API
        payload = {
            "personalizations": [{
                "to": [{"email": email}],
                "subject": asunto
            }],
            "from": {
                "email": settings.DEFAULT_FROM_EMAIL,
                "name": "FastFood.exe"
            },
            "content": [{
                "type": "text/html",
                "value": mensaje_html
            }]
        }
        
        # Enviar via API
        headers = {
            "Authorization": f"Bearer {sendgrid_api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 202:
            logger.info(f"✅ Email enviado exitosamente a {email}")
            return True
        else:
            logger.error(f"❌ SendGrid respondió con código {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
            logger.warning(f"💡 CÓDIGO: {codigo}")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error al enviar email: {str(e)}")
        logger.warning(f"💡 CÓDIGO: {codigo}")
=======
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
        
        # Usar DEFAULT_FROM_EMAIL si está configurado, sino un email por defecto
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
        
        # Si DEFAULT_FROM_EMAIL no está configurado, usar un email genérico
        if not from_email or from_email == settings.EMAIL_HOST_USER:
            from_email = 'fastfoodexe@gmail.com'  # Cambiar por tu dominio verificado
            
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
        # Cambiar a daemon=False para que el thread termine antes de cerrar
        thread.daemon = False
        thread.start()
        
        # OPCIONAL: Esperar máximo 2 segundos para que el thread termine
        thread.join(timeout=2)
        
        logger.info(f"🚀 Email en cola para: {email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error al iniciar thread: {str(e)}")
        logger.info(f"🔑 CÓDIGO PARA {email}: {codigo}")
>>>>>>> parent of ed77cc0 (Update utils.py)
        return False