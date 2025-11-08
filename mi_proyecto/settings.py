# mi_proyecto/settings.py

import os
from pathlib import Path
from decouple import config
import dj_database_url

# ----------------- CONFIGURACIÓN BÁSICA -----------------

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config("SECRET_KEY")
DEBUG = True
ALLOWED_HOSTS = ['fastfood-fapu.onrender.com', 'localhost', '127.0.0.1'] 


# ----------------- APLICACIONES Y MIDDLEWARE -----------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    "corsheaders",
    "usuarios",
    'administracion',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware", 
    "django.middleware.common.CommonMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://mi-proyecto-amber-delta.vercel.app",
]

ROOT_URLCONF = 'mi_proyecto.urls'

# ... (TEMPLATES sigue igual) ...

WSGI_APPLICATION = 'mi_proyecto.wsgi.application'


# ----------------- BASE DE DATOS -----------------

DATABASES = {
    'default': dj_database_url.config(
        default=config("DATABASE_URL"), 
        conn_max_age=600,
        # La configuración de SSL se mantiene eliminada o comentada para el desarrollo local.
    )
}


# ----------------- SEGURIDAD, USUARIOS Y DRF -----------------

# ... (AUTH_PASSWORD_VALIDATORS sigue igual) ...

AUTH_USER_MODEL = 'usuarios.CustomUser' 

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}