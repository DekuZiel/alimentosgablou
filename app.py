# ====================================
# app.py - Archivo Principal Actualizado con Admin
# ====================================

import os
from flask import Flask
from models.database import init_app, db
from controllers.home_controller import home_bp
from controllers.menu_controller import menu_bp
from controllers.admin_controller import admin_bp  # NUEVO

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Configurar secret key para sessions
    app.secret_key = app.config.get('SECRET_KEY', 'gablou-secret-key-2024')
    
    # Inicializar base de datos
    init_app(app)
    
    # Registrar blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(admin_bp, url_prefix='/admin')  # NUEVO
    
    return app

def populate_initial_data():
    """Poblar la base de datos con productos iniciales de Gablou"""
    try:
        # Verificar si ya hay productos
        if Product.query.count() == 0:
            sample_products = [
                Product(
                    name='Bandeja de churitos',
                    description='Deliciosos churitos caseros crujientes por fuera y suaves por dentro. Preparados con ingredientes frescos y servidos en una práctica bandeja.',
                    price=4.50,
                    category='Bandejas',
                    image='plato1.jpeg',
                    stock=25,
                    available=True
                ),
                Product(
                    name='Bandeja de empanada',
                    description='Empanadas tradicionales horneadas con masa dorada y relleno sabroso. Cada empanada está cuidadosamente preparada con ingredientes de primera calidad.',
                    price=4.50,
                    category='Bandejas',
                    image='plato2.jpeg',
                    stock=30,
                    available=True
                ),
                Product(
                    name='Bandeja de Muffins',
                    description='Muffins esponjosos y húmedos disponibles en diferentes sabores. Horneados frescos diariamente con los mejores ingredientes.',
                    price=4.50,
                    category='Postres',
                    image='plato3.jpeg',
                    stock=20,
                    available=True
                ),
                Product(
                    name='Pollo relleno en salsa ciruela',
                    description='Exquisito pollo relleno bañado en una deliciosa salsa de ciruela agridulce. Preparado con técnicas culinarias tradicionales.',
                    price=7.50,
                    category='Platos Principales',
                    image='plato4.jpeg',
                    stock=15,
                    available=True
                )
            ]
            
            for product in sample_products:
                db.session.add(product)
            
            db.session.commit()
            print("✅ Base de datos poblada con productos de Gablou")
        else:
            print("✅ Base de datos ya contiene productos")
            
    except Exception as e:
        print(f"⚠️ Error poblando la base de datos: {e}")
        db.session.rollback()

def create_admin_user():
    """Crear usuario administrador por defecto"""
    try:
        from models.admin import Admin
        Admin.create_default_admin()
    except Exception as e:
        print(f"⚠️ Error creando administrador: {e}")

# Crear instancia de app para gunicorn
app = create_app()

if __name__ == '__main__':
    # Crear las tablas y poblar datos
    with app.app_context():
        try:
            from models.product import Product
            from models.admin import Admin  # NUEVO
            
            # Crear todas las tablas
            db.create_all()
            print("✅ Tablas de MySQL creadas/verificadas")
            
            # Poblar con datos iniciales
            populate_initial_data()
            
            # Crear administrador por defecto
            create_admin_user()
            
        except Exception as e:
            print(f"❌ Error conectando a MySQL: {e}")
            print("🔄 Verificando conexión a la base de datos...")
    
    print("🚀 Iniciando servidor Flask...")
    # Usar puerto dinámico para producción
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))