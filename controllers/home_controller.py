# ====================================
# controllers/home_controller.py (ACTUALIZADO)
# ====================================

from flask import Blueprint, render_template
from models.product import Product

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def index():
    """Página principal con productos destacados"""
    try:
        # Obtener productos destacados de la base de datos
        featured_products_db = Product.query.filter_by(available=True).limit(4).all()
        
        if featured_products_db:
            # Convertir a diccionario para el template
            featured_products = [p.to_dict() for p in featured_products_db]
            print(f"✅ Mostrando {len(featured_products)} productos desde la base de datos")
        else:
            # Fallback a productos hardcodeados si no hay en la BD
            featured_products = [
                {'name': 'Bandeja de churitos', 'price': 4.50, 'image': 'plato1.jpeg'},
                {'name': 'Bandeja de empanada', 'price': 4.50, 'image': 'plato2.jpeg'},
                {'name': 'Bandeja de Muffins', 'price': 4.50, 'image': 'plato3.jpeg'},
                {'name': 'Pollo relleno en salsa ciruela', 'price': 7.50, 'image': 'plato4.jpeg'}
            ]
            print("⚠️ Usando productos de fallback")
            
    except Exception as e:
        print(f"❌ Error obteniendo productos: {e}")
        # Fallback en caso de error
        featured_products = [
            {'name': 'Bandeja de churitos', 'price': 4.50, 'image': 'plato1.jpeg'},
            {'name': 'Bandeja de empanada', 'price': 4.50, 'image': 'plato2.jpeg'},
            {'name': 'Bandeja de Muffins', 'price': 4.50, 'image': 'plato3.jpeg'},
            {'name': 'Pollo relleno en salsa ciruela', 'price': 7.50, 'image': 'plato4.jpeg'}
        ]
        print("⚠️ Usando productos de fallback debido a error")
    
    return render_template('index.html', products=featured_products)

@home_bp.route('/search')
def search():
    """Redirigir a la página de búsqueda del menú"""
    from controllers.menu_controller import get_all_products, get_available_categories
    products = get_all_products()
    categories = get_available_categories()
    return render_template('search.html', products=products, categories=categories)