# ====================================
# controllers/menu_controller.py (CON CATEGORÍAS DINÁMICAS)
# ====================================

from flask import Blueprint, render_template, request, jsonify
from models.product import Product
from models.database import db
from sqlalchemy import distinct

menu_bp = Blueprint('menu', __name__)

def get_all_products():
    """Obtener todos los productos de MySQL"""
    try:
        products = Product.query.filter_by(available=True).order_by(Product.name).all()
        return [p.to_dict() for p in products]
    except Exception as e:
        print(f"Error obteniendo productos: {e}")
        return get_fallback_products()

def get_available_categories():
    """Obtener todas las categorías que tienen productos disponibles"""
    try:
        # Consultar categorías distintas de productos disponibles
        categories = db.session.query(distinct(Product.category))\
                              .filter(Product.available == True)\
                              .order_by(Product.category)\
                              .all()
        
        # Extraer solo los nombres de las categorías
        category_names = [cat[0] for cat in categories if cat[0]]
        
        print(f"📂 Categorías disponibles: {category_names}")
        return category_names
        
    except Exception as e:
        print(f"Error obteniendo categorías: {e}")
        # Fallback a categorías por defecto
        return ["Bandejas", "Platos Principales", "Postres"]

def get_products_by_category(category):
    """Filtrar productos por categoría desde MySQL"""
    try:
        products = Product.query.filter_by(category=category, available=True).order_by(Product.name).all()
        return [p.to_dict() for p in products]
    except Exception as e:
        print(f"Error filtrando por categoría: {e}")
        return []

def search_products_by_name(query):
    """Buscar productos por nombre en MySQL"""
    try:
        if not query:
            return get_all_products()
        products = Product.query.filter(
            Product.name.like(f'%{query}%'),
            Product.available == True
        ).order_by(Product.name).all()
        return [p.to_dict() for p in products]
    except Exception as e:
        print(f"Error buscando productos: {e}")
        return []

def get_fallback_products():
    """Datos de ejemplo como fallback"""
    return [
        {
            'id': 1,
            'name': 'Spicy seasoned seafood noodles',
            'description': 'Delicious seafood noodles with spicy seasoning',
            'price': 2.29,
            'category': 'Hot Dishes',
            'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop',
            'stock': 20,
            'available': True
        },
        {
            'id': 2,
            'name': 'Salted Pasta with mushroom sauce',
            'description': 'Creamy pasta with fresh mushroom sauce',
            'price': 2.69,
            'category': 'Hot Dishes',
            'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
            'stock': 11,
            'available': True
        }
    ]

@menu_bp.route('/')
def menu_list():
    """Mostrar todos los productos con categorías dinámicas"""
    products = get_all_products()
    categories = get_available_categories()
    
    print(f"📦 Mostrando {len(products)} productos")
    print(f"📂 Categorías disponibles: {categories}")
    
    return render_template('search.html', 
                         products=products, 
                         categories=categories)

@menu_bp.route('/category/<category>')
def menu_by_category(category):
    """Mostrar productos por categoría"""
    products = get_products_by_category(category)
    categories = get_available_categories()
    
    print(f"📦 Mostrando {len(products)} productos de categoría: {category}")
    
    return render_template('search.html', 
                         products=products, 
                         categories=categories,
                         active_category=category)

@menu_bp.route('/search')
def search_products():
    """API endpoint para búsqueda de productos"""
    query = request.args.get('q', '')
    products = search_products_by_name(query)
    return jsonify({
        'products': products,
        'total': len(products),
        'query': query
    })

@menu_bp.route('/api/categories')
def api_categories():
    """API endpoint para obtener categorías disponibles"""
    try:
        categories = get_available_categories()
        return jsonify({
            'success': True,
            'categories': categories,
            'total': len(categories)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'categories': [],
            'total': 0
        }), 500

@menu_bp.route('/api/products')
def api_products():
    """API endpoint para obtener todos los productos"""
    try:
        products = get_all_products()
        categories = get_available_categories()
        return jsonify({
            'success': True,
            'products': products,
            'categories': categories,
            'total': len(products)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'products': [],
            'categories': [],
            'total': 0
        }), 500
