from flask import Blueprint, render_template, request, jsonify
from models.product import Product
from models.database import db

menu_bp = Blueprint('menu', __name__)

def get_all_products():
    """Obtener todos los productos de MySQL"""
    try:
        products = Product.query.filter_by(available=True).all()
        return [p.to_dict() for p in products]
    except Exception as e:
        print(f"Error obteniendo productos: {e}")
        # Fallback a datos de ejemplo
        return get_fallback_products()

def get_products_by_category(category):
    """Filtrar productos por categoría desde MySQL"""
    try:
        products = Product.query.filter_by(category=category, available=True).all()
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
        ).all()
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
            'price': 2.29,
            'category': 'hot dishes',
            'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop',
            'stock': 20,
            'available': True
        },
        {
            'id': 2,
            'name': 'Healthy noodle with spinach leaf',
            'price': 3.29,
            'category': 'hot dishes',
            'image': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
            'stock': 22,
            'available': True
        }
    ]

@menu_bp.route('/')
def menu_list():
    products = get_all_products()
    return render_template('search.html', products=products)

@menu_bp.route('/category/<category>')
def menu_by_category(category):
    products = get_products_by_category(category)
    return render_template('search.html', products=products, active_category=category)

@menu_bp.route('/search')
def search_products():
    query = request.args.get('q', '')
    products = search_products_by_name(query)
    return jsonify(products)