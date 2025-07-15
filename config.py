# ====================================
# config.py - Configuración Actualizada con Nueva Base de Datos
# ====================================

import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gablou-secret-key-2024'
    
    # Configuración de MySQL en Railway - NUEVA BASE DE DATOS
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:QlkpOSdBlMzeoJVOdcilDCOsWwyyYkXz@interchange.proxy.rlwy.net:59474/railway'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de uploads para administrador
    UPLOAD_FOLDER = 'static/images'
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB máximo
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Configuración de sesiones
    PERMANENT_SESSION_LIFETIME = 86400  # 24 horas
    SESSION_COOKIE_SECURE = False  # Cambiar a True en producción con HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    DEBUG = True