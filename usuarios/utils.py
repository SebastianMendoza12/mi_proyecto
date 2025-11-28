from twilio.rest import Client
from django.conf import settings
import os

def enviar_codigo_sms(telefono, codigo):
    """
    Envía un código de verificación por SMS usando Twilio
    
    Args:
        telefono (str): Número de teléfono en formato +57XXXXXXXXXX
        codigo (str): Código de 6 dígitos a enviar
    
    Returns:
        bool: True si se envió correctamente, False en caso contrario
    """
    try:
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
        
        # Si no está configurado Twilio, imprimir código en consola (modo desarrollo)
        if not all([account_sid, auth_token, twilio_phone]):
            print("=" * 50)
            print("TWILIO NO CONFIGURADO - MODO DESARROLLO")
            print(f"Código de verificación para {telefono}: {codigo}")
            print("=" * 50)
            return False
        
        # Crear cliente de Twilio
        client = Client(account_sid, auth_token)
        
        # Mensaje a enviar
        mensaje = f"Tu código de verificación para FastFood.exe es: {codigo}\n\nVálido por 10 minutos."
        
        # Enviar SMS
        message = client.messages.create(
            body=mensaje,
            from_=twilio_phone,
            to=telefono
        )
        
        print(f"SMS enviado exitosamente a {telefono}. SID: {message.sid}")
        return True
        
    except Exception as e:
        print(f"Error al enviar SMS: {str(e)}")
        print(f"MODO DEBUG: Código de verificación para {telefono}: {codigo}")
        return False