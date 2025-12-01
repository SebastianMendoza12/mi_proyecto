from django.conf import settings
import logging
import requests

logger = logging.getLogger(__name__)

def enviar_codigo_email(email, codigo):
    """
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
        return False