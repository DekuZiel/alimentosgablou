import os
from flask import Flask
from models.database import init_app, db
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

def populate_initial_data():
    """Poblar la base de datos con productos iniciales de Gablou"""
    try:
        # Verificar si ya hay productos
        if Product.query.count() == 0:
            sample_products = [
                Product(
                    name='Bandeja de churitos',
                    description='Deliciosa bandeja de churitos caseros',
                    price=4.50,
                    category='Bandejas',
                    image='plato1.jpeg',
                    stock=25,
                    available=True
                ),
                Product(
                    name='Bandeja de empanada',
                    description='Empanadas tradicionales recién horneadas',
                    price=4.50,
                    category='Bandejas',
                    image='plato2.jpeg',
                    stock=30,
                    available=True
                ),
                Product(
                    name='Bandeja de Muffins',
                    description='Muffins caseros de diferentes sabores',
                    price=4.50,
                    category='Postres',
                    image='plato3.jpeg',
                    stock=20,
                    available=True
                ),
                Product(
                    name='Pollo relleno en salsa ciruela',
                    description='Pollo relleno con salsa especial de ciruela',
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

# Crear instancia de app para gunicorn (NUEVO)
app = create_app()

if __name__ == '__main__':
    # Crear las tablas y poblar datos
    with app.app_context():
        try:
            from models.product import Product
            
            # Crear todas las tablas
            db.create_all()
            print("✅ Tablas de MySQL creadas/verificadas")
            
            # Poblar con datos iniciales
            populate_initial_data()
            
        except Exception as e:
            print(f"❌ Error conectando a MySQL: {e}")
            print("🔄 Verificando conexión a la base de datos...")
    
    print("🚀 Iniciando servidor Flask...")
    # Usar puerto dinámico para producción (MODIFICADO)
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))