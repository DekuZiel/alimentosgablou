from flask import Blueprint, render_template

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def index():
    # Productos destacados para la página principal
    featured_products = [
        {'name': 'Bandeja de churitos', 'price': 4.50, 'image': 'plato1.jpeg'},
        {'name': 'Bandeja de empanada', 'price': 4.50, 'image': 'plato2.jpeg'},
        {'name': 'Bandeja de Muffins', 'price': 4.50, 'image': 'plato3.jpeg'},
        {'name': 'Pollo relleno en salsa ciruela', 'price': 7.50, 'image': 'plato4.jpeg'}
    ]
    return render_template('index.html', products=featured_products)

@home_bp.route('/search')
def search():
    return render_template('search.html')