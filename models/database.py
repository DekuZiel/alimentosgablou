from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app(app):
    """Inicializar la base de datos con la aplicación Flask"""
    db.init_app(app)
    return db