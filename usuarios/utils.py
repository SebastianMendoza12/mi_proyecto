from django.conf import settings
import logging
import requests

logger = logging.getLogger(__name__)

def enviar_codigo_email(email, codigo):
    """
    Envía un código de verificación usando la API de SendGrid.
    Configuración corregida para el campo 'from'.
    """
    try:
        logger.info(f"📧 Enviando email via SendGrid a: {email}")
        
        # Validar API Key
        sendgrid_api_key = settings.EMAIL_HOST_PASSWORD
        if not sendgrid_api_key or sendgrid_api_key == '':
            logger.error("❌ SendGrid API Key no configurada")
            logger.warning(f"💡 CÓDIGO: {codigo}")
            return False
        
        # ✅ CORRECCIÓN: Usar el email verificado en SendGrid
        # NO usar EMAIL_HOST_USER porque es "apikey", usar DEFAULT_FROM_EMAIL
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'fastfoodexe@gmail.com')
        
        # Validar que from_email sea un email real, no "apikey"
        if from_email == 'apikey' or '@' not in from_email:
            from_email = 'fastfoodexe@gmail.com'
        
        logger.info(f"📤 Usando remitente: {from_email}")
        
        # Preparar email HTML
        asunto = 'Código de Verificación - FastFood.exe'
        mensaje_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }}
                .container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #007bff;
                    padding-bottom: 20px;
                }}
                .logo {{
                    font-size: 48px;
                    margin-bottom: 10px;
                }}
                h1 {{
                    color: #007bff;
                    margin: 0;
                    font-size: 28px;
                }}
                .code-container {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    padding: 30px;
                    margin: 30px 0;
                    text-align: center;
                }}
                .code {{ 
                    background: white;
                    border-radius: 8px;
                    padding: 20px; 
                    font-size: 42px; 
                    font-weight: bold; 
                    letter-spacing: 10px;
                    color: #667eea;
                    font-family: 'Courier New', monospace;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }}
                .info-box {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }}
                .info-box p {{
                    margin: 0;
                    color: #856404;
                }}
                .footer {{
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #eee;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #007bff;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🍔</div>
                    <h1>FastFood.exe</h1>
                    <p style="color: #666; margin-top: 10px;">Verificación de Cuenta</p>
                </div>
                
                <p style="font-size: 16px; color: #333;">¡Hola!</p>
                <p style="font-size: 16px; color: #333;">Gracias por registrarte en FastFood.exe. Para completar tu registro, por favor ingresa el siguiente código:</p>
                
                <div class="code-container">
                    <div class="code">{codigo}</div>
                </div>
                
                <div class="info-box">
                    <p>⏱️ <strong>Importante:</strong> Este código expira en 10 minutos</p>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    Si no solicitaste este código, puedes ignorar este mensaje de forma segura. Tu cuenta no será creada hasta que ingreses el código.
                </p>
                
                <div class="footer">
                    <p style="font-weight: bold; color: #333; font-size: 16px;">Equipo FastFood.exe</p>
                    <p style="font-size: 12px; color: #999; margin-top: 10px;">
                        Este es un email automático, por favor no respondas a este mensaje.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # ✅ Payload CORREGIDO para SendGrid
        payload = {
            "personalizations": [{
                "to": [{"email": email}],
                "subject": asunto
            }],
            "from": {
                "email": from_email,  # ✅ Email verificado en SendGrid
                "name": "FastFood.exe"
            },
            "content": [{
                "type": "text/html",
                "value": mensaje_html
            }]
        }
        
        # Headers para SendGrid API
        headers = {
            "Authorization": f"Bearer {sendgrid_api_key}",
            "Content-Type": "application/json"
        }
        
        # Enviar via SendGrid API
        response = requests.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 202:
            logger.info(f"✅ Email enviado exitosamente a {email}")
            logger.info("✅ SendGrid aceptó el mensaje (status 202)")
            return True
        else:
            logger.error(f"❌ SendGrid respondió con código {response.status_code}")
            logger.error(f"Respuesta: {response.text}")
            
            # Diagnosticar el error específico
            if response.status_code == 400:
                logger.error("⚠️ Error 400: Verifica que el email remitente esté verificado en SendGrid")
                logger.error(f"⚠️ Email usado como remitente: {from_email}")
            elif response.status_code == 401:
                logger.error("⚠️ Error 401: API Key inválida o mal configurada")
            elif response.status_code == 403:
                logger.error("⚠️ Error 403: Email remitente no verificado en SendGrid")
            
            logger.warning(f"💡 CÓDIGO (para que el usuario pueda continuar): {codigo}")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error al enviar email: {str(e)}")
        logger.warning(f"💡 CÓDIGO: {codigo}")
        return False