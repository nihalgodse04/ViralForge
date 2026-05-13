"""
Django settings for config project.
ViralForge AI — Production-ready configuration.
"""

from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv
import dj_database_url

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent


# ─── SECURITY ───────────────────────────────────────────────

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-fallback-key')

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = ["*"]


# ─── INSTALLED APPS ─────────────────────────────────────────

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',

    # Local apps
    'vfbackend.apps.VfbackendConfig',
]


# ─── MIDDLEWARE ──────────────────────────────────────────────

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ─── CORS ────────────────────────────────────────────────────
# Allows the Vercel frontend to call this API.
# Add your exact Vercel domain below.

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",           # Vite dev server
    "http://localhost:3000",
    "https://viralforge.vercel.app",
    "https://viral-forge-git-main-nihalgodse04-2249s-projects.vercel.app",   # ← Replace with your actual Vercel URL
]
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "origin",
    "x-csrftoken",
    "x-requested-with",
]

# Required for POST/DELETE from Vercel on HTTPS
CSRF_TRUSTED_ORIGINS = [
    "https://viral-forge-git-main-nihalgodse04-2249s-projects.vercel.app",   # ← Replace with your actual Vercel URL
]


# ─── DJANGO REST FRAMEWORK ──────────────────────────────────

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}


# ─── JWT SETTINGS ───────────────────────────────────────────

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=6),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}


# ─── URLS / TEMPLATES / WSGI ────────────────────────────────

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# ─── DATABASE ───────────────────────────────────────────────

# DATABASES = {
#     'default': dj_database_url.parse(
#         os.environ.get("DATABASE_URL")
#     )
# }

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get(
            'DATABASE_URL',
            f"sqlite:///{BASE_DIR / 'db.sqlite3'}"  # SQLite for local dev only
        ),
        conn_max_age=600,  # Keep DB connections alive for 10 mins (important on Render)
    )
}


# ─── PASSWORD VALIDATION ────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ─── INTERNATIONALIZATION ───────────────────────────────────

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# ─── STATIC FILES ───────────────────────────────────────────

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'


# ─── MEDIA FILES ────────────────────────────────────────────

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# ─── DEFAULT PRIMARY KEY FIELD ──────────────────────────────

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'