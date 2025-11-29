from django.core.mail import send_mail
from django.conf import settings
import os
from dotenv import load_dotenv

load_dotenv()

# Configurar Django manualmente
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mi_proyecto.settings')
import django
django.setup()

print("🔄 Probando envío de email...")
print(f"📧 Desde: {settings.EMAIL_HOST_USER}")
print(f"🔑 Host: {settings.EMAIL_HOST}")

try:
    send_mail(
        subject='Prueba de FastFood.exe',
        message='Este es un mensaje de prueba. Tu configuración funciona!',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['sebas1093432545@gmail.com'],  # Cambia esto por tu email
        fail_silently=False,
    )
    print("✅ Email enviado exitosamente!")
except Exception as e:
    print(f"❌ Error al enviar email: {e}")