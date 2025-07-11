from flask import Flask
from models.database import init_app
from controllers.home_controller import home_bp
from controllers.menu_controller import menu_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Inicializar base de datos
    init_app(app)
    
    # Registrar blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(menu_bp, url_prefix='/menu')
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Crear las tablas si no existen
    with app.app_context():
        from models.database import db
        from models.product import Product, Category
        db.create_all()
        print("✅ Tablas de base de datos creadas/verificadas")
    
    app.run(debug=True, host='0.0.0.0', port=5000)