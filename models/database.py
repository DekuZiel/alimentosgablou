from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def init_app(app):
    """Inicializar la base de datos con la aplicación Flask"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    return db