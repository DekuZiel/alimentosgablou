from flask import Blueprint, render_template, request, jsonify

menu_bp = Blueprint('menu', __name__)

# Datos de ejemplo (después los conectaremos a la base de datos)
SAMPLE_PRODUCTS = [
    {
        'id': 1,
        'name': 'Spicy seasoned seafood noodles',
        'price': 2.29,
        'category': 'hot dishes',
        'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop',
        'available': 20
    },
    {
        'id': 2,
        'name': 'Salted Pasta with mushroom sauce',
        'price': 2.69,
        'category': 'hot dishes',
        'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
        'available': 11
    },
    {
        'id': 3,
        'name': 'Beef dumpling in hot and sour soup',
        'price': 2.99,
        'category': 'soup',
        'image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
        'available': 16
    },
    {
        'id': 4,
        'name': 'Guatita',
        'price': 2.99,
        'category': 'hot dishes',
        'image': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
        'available': 16
    },
    {
        'id': 5,
        'name': 'Healthy noodle with spinach leaf',
        'price': 3.29,
        'category': 'hot dishes',
        'image': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
        'available': 22
    },
    {
        'id': 6,
        'name': 'Hot spicy fried rice with omelet',
        'price': 3.49,
        'category': 'hot dishes',
        'image': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=300&fit=crop',
        'available': 13
    }
]

def get_all_products():
    """Función para obtener todos los productos"""
    return SAMPLE_PRODUCTS

def get_products_by_category(category):
    """Función para filtrar productos por categoría"""
    return [p for p in SAMPLE_PRODUCTS if p['category'].lower() == category.lower()]

def search_products_by_name(query):
    """Función para buscar productos por nombre"""
    if not query:
        return SAMPLE_PRODUCTS
    return [p for p in SAMPLE_PRODUCTS if query.lower() in p['name'].lower()]

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
    return jsonify([p for p in products])