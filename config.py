import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gablou-secret-key-2024'
    
    # Configuración de MySQL en Railway
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:uSwQTHJytEhnWyhQxcABePnhJoxqxgtM@trolley.proxy.rlwy.net:52009/railway'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    DEBUG = True