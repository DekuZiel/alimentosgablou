# ====================================
# controllers/admin_controller.py - Controlador de Administración
# ====================================

import os
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from werkzeug.utils import secure_filename
from PIL import Image
from models.admin import Admin
from models.product import Product
from models.database import db
import uuid
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# Configuración de uploads
UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Verificar si el archivo es válido"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def requires_admin_login(f):
    """Decorador para verificar login de administrador"""
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ========== RUTAS DE AUTENTICACIÓN ==========

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Login de administrador"""
    if request.method == 'GET':
        # Si ya está logueado, redirigir al dashboard
        if 'admin_id' in session:
            return redirect(url_for('admin.dashboard'))
        return render_template('admin_login.html')
    
    if request.method == 'POST':
        try:
            data = request.get_json() if request.is_json else request.form
            username = data.get('username', '').strip()
            password = data.get('password', '')
            
            if not username or not password:
                return jsonify({
                    'success': False,
                    'message': 'Username y contraseña son requeridos'
                }), 400
            
            # Buscar administrador
            admin = Admin.query.filter_by(username=username, is_active=True).first()
            
            if admin and admin.check_password(password):
                # Login exitoso
                session['admin_id'] = admin.id
                session['admin_username'] = admin.username
                session['admin_full_name'] = admin.full_name
                session['is_super_admin'] = admin.is_super_admin
                
                # Actualizar último login
                admin.update_last_login()
                
                return jsonify({
                    'success': True,
                    'message': f'Bienvenido, {admin.full_name}',
                    'redirect_url': url_for('admin.dashboard')
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Credenciales incorrectas'
                }), 401
                
        except Exception as e:
            print(f"Error en login: {e}")
            return jsonify({
                'success': False,
                'message': 'Error interno del servidor'
            }), 500

@admin_bp.route('/logout')
def logout():
    """Cerrar sesión de administrador"""
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('home.index'))

# ========== RUTAS DEL DASHBOARD ==========

@admin_bp.route('/dashboard')
@requires_admin_login
def dashboard():
    """Dashboard principal de administración"""
    try:
        # Estadísticas básicas
        total_products = Product.query.count()
        active_products = Product.query.filter_by(available=True).count()
        categories_count = db.session.query(Product.category).distinct().count()
        
        stats = {
            'total_products': total_products,
            'active_products': active_products,
            'inactive_products': total_products - active_products,
            'categories_count': categories_count
        }
        
        # Productos recientes
        recent_products = Product.query.order_by(Product.created_at.desc()).limit(5).all()
        
        return render_template('admin_dashboard.html', 
                             stats=stats, 
                             recent_products=recent_products)
    except Exception as e:
        print(f"Error en dashboard: {e}")
        flash('Error al cargar el dashboard', 'error')
        return redirect(url_for('admin.logout'))

@admin_bp.route('/products')
@requires_admin_login
def products():
    """Gestión de productos"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 12
        
        # Filtros
        category = request.args.get('category', '')
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        
        # Query base
        query = Product.query
        
        # Aplicar filtros
        if category:
            query = query.filter_by(category=category)
        if search:
            query = query.filter(Product.name.like(f'%{search}%'))
        if status == 'active':
            query = query.filter_by(available=True)
        elif status == 'inactive':
            query = query.filter_by(available=False)
        
        # Paginación
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Categorías para el filtro
        categories = db.session.query(Product.category).distinct().all()
        categories = [cat[0] for cat in categories if cat[0]]
        
        return render_template('admin_products.html', 
                             products=products, 
                             categories=categories)
    except Exception as e:
        print(f"Error en products: {e}")
        flash('Error al cargar productos', 'error')
        return redirect(url_for('admin.dashboard'))

# ========== API ENDPOINTS PARA PRODUCTOS ==========

@admin_bp.route('/api/products', methods=['GET'])
@requires_admin_login
def api_get_products():
    """API para obtener productos"""
    try:
        products = Product.query.order_by(Product.created_at.desc()).all()
        return jsonify({
            'success': True,
            'products': [p.to_dict() for p in products],
            'total': len(products)
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/api/products', methods=['POST'])
@requires_admin_login
def api_create_product():
    """API para crear producto"""
    try:
        # Obtener datos del formulario
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = request.form.get('price', type=float)
        category = request.form.get('category', '').strip()
        stock = request.form.get('stock', type=int)
        available = request.form.get('available') == 'true'
        
        # Validaciones
        if not name:
            return jsonify({'success': False, 'message': 'El nombre es requerido'}), 400
        if not price or price <= 0:
            return jsonify({'success': False, 'message': 'El precio debe ser mayor a 0'}), 400
        if not category:
            return jsonify({'success': False, 'message': 'La categoría es requerida'}), 400
        if stock is None or stock < 0:
            return jsonify({'success': False, 'message': 'El stock debe ser 0 o mayor'}), 400
        
        # Procesar imagen
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                # Generar nombre único
                extension = file.filename.rsplit('.', 1)[1].lower()
                clean_name = secure_filename(name.lower().replace(' ', '_'))
                image_filename = f"{clean_name}_{uuid.uuid4().hex[:8]}.{extension}"
                
                # Guardar archivo
                if save_uploaded_image(file, image_filename):
                    print(f"✅ Imagen guardada: {image_filename}")
                else:
                    return jsonify({'success': False, 'message': 'Error al guardar la imagen'}), 500
        
        # Crear producto
        product = Product(
            name=name,
            description=description,
            price=price,
            category=category,
            stock=stock,
            available=available,
            image=image_filename or 'default-product.jpg'
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Producto "{name}" creado exitosamente',
            'product': product.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creando producto: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/api/products/<int:product_id>', methods=['PUT'])
@requires_admin_login
def api_update_product(product_id):
    """API para actualizar producto"""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Obtener datos
        data = request.get_json()
        
        # Actualizar campos
        if 'name' in data:
            product.name = data['name'].strip()
        if 'description' in data:
            product.description = data['description'].strip()
        if 'price' in data:
            product.price = float(data['price'])
        if 'category' in data:
            product.category = data['category'].strip()
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'available' in data:
            product.available = bool(data['available'])
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Producto "{product.name}" actualizado',
            'product': product.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
@requires_admin_login
def api_delete_product(product_id):
    """API para eliminar producto"""
    try:
        product = Product.query.get_or_404(product_id)
        product_name = product.name
        
        # Eliminar imagen si existe
        if product.image and product.image != 'default-product.jpg':
            try:
                image_path = os.path.join(UPLOAD_FOLDER, product.image)
                if os.path.exists(image_path):
                    os.remove(image_path)
            except Exception as e:
                print(f"Error eliminando imagen: {e}")
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Producto "{product_name}" eliminado'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ========== FUNCIONES AUXILIARES ==========

def save_uploaded_image(file, filename):
    """Guardar imagen subida con redimensionamiento"""
    try:
        # Crear directorio si no existe
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Ruta completa
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Abrir y procesar imagen
        image = Image.open(file.stream)
        
        # Convertir a RGB si es necesario
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        
        # Redimensionar manteniendo aspecto
        max_size = (800, 800)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Guardar con calidad optimizada
        image.save(filepath, 'JPEG', quality=85, optimize=True)
        
        return True
        
    except Exception as e:
        print(f"Error guardando imagen: {e}")
        return False

# ========== RUTAS ADICIONALES ==========

@admin_bp.route('/api/categories')
@requires_admin_login
def api_get_categories():
    """API para obtener categorías"""
    try:
        categories = db.session.query(Product.category).distinct().all()
        categories = [cat[0] for cat in categories if cat[0]]
        return jsonify({
            'success': True,
            'categories': categories
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/api/stats')
@requires_admin_login
def api_get_stats():
    """API para obtener estadísticas"""
    try:
        total_products = Product.query.count()
        active_products = Product.query.filter_by(available=True).count()
        categories_count = db.session.query(Product.category).distinct().count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_products': total_products,
                'active_products': active_products,
                'inactive_products': total_products - active_products,
                'categories_count': categories_count
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500