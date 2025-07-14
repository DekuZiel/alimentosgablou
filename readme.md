# 🛒 Sistema de Carrito de Compras con WhatsApp - Gablou

## 📋 Descripción
Sistema completo de carrito de compras que permite a los clientes seleccionar productos y enviar su pedido directamente por WhatsApp al número **0983381474**.

## 📁 Archivos Agregados

### 1. **static/js/cart.js**
- Sistema principal del carrito de compras
- Gestión de productos, cantidades y almacenamiento local
- Integración con WhatsApp

### 2. **static/css/cart.css**
- Estilos para el widget del carrito
- Botones flotantes y notificaciones
- Diseño responsive

### 3. **static/js/whatsapp-integration.js**
- Funciones avanzadas de WhatsApp
- Botones de pedido rápido
- Contacto directo

### 4. **search.html** (actualizado)
- Incluye los nuevos archivos CSS y JS
- Botón flotante adicional de WhatsApp

## 🚀 Instalación

### Paso 1: Agregar archivos
Coloca los archivos en tu estructura:
```
static/
├── css/
│   ├── search.css (existente)
│   └── cart.css (NUEVO)
└── js/
    ├── search.js (existente)
    ├── cart.js (NUEVO)
    └── whatsapp-integration.js (NUEVO)
```

### Paso 2: Actualizar search.html
Reemplaza tu archivo `templates/search.html` con la versión actualizada que incluye:
```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/cart.css') }}">
<script src="{{ url_for('static', filename='js/cart.js') }}"></script>
<script src="{{ url_for('static', filename='js/whatsapp-integration.js') }}"></script>
```

### Paso 3: Verificar estructura de productos
Asegúrate de que tus productos tengan los siguientes campos en el HTML:
```html
<div class="dish-card" data-category="categoria">
    <img src="imagen.jpg" alt="Producto">
    <h3>Nombre del Producto</h3>
    <p class="price">$5.99</p>
    <p class="availability">10 disponibles</p>
</div>
```

## 🎯 Funcionalidades

### ✅ Carrito de Compras
- **Widget flotante**: Aparece en la esquina inferior derecha
- **Contador dinámico**: Muestra la cantidad de productos
- **Gestión de cantidades**: Aumentar/disminuir/eliminar productos
- **Persistencia**: Los productos se guardan en localStorage
- **Total automático**: Calcula el precio total en tiempo real

### ✅ Integración WhatsApp
- **Mensaje formateado**: Envía un mensaje estructurado con todos los productos
- **Número configurado**: 0983381474 (Ecuador: +593983381474)
- **Información completa**: Incluye productos, cantidades, precios y total
- **Hora del pedido**: Timestamp automático

### ✅ Botones de Acción
1. **Botón en productos**: Icono "+" en cada producto para agregar al carrito
2. **Botón carrito principal**: Widget flotante con carrito completo
3. **Botón WhatsApp carrito**: Envía todo el carrito por WhatsApp
4. **Botón WhatsApp flotante**: Envío rápido sin abrir carrito
5. **Botones pedido rápido**: WhatsApp directo de cada producto

### ✅ Características Avanzadas
- **Notificaciones**: Mensajes de confirmación elegantes
- **Responsive**: Funciona perfectamente en móvil y desktop
- **Animaciones**: Transiciones suaves y feedback visual
- **Accesibilidad**: Navegación con teclado y lectores de pantalla

## 📱 Formato del Mensaje WhatsApp

```
🍽️ Nuevo Pedido - Gablou

📋 Productos:
1. Bandeja de churitos
   • Cantidad: 2
   • Precio unitario: $4.50
   • Subtotal: $9.00

2. Pollo relleno en salsa ciruela
   • Cantidad: 1
   • Precio unitario: $7.50
   • Subtotal: $7.50

💰 Total: $16.50

📍 Información de entrega:
Por favor, proporciona tu dirección de entrega.

⏰ Hora del pedido: 14/7/2025 15:30:25
```

## ⚙️ Configuración

### Cambiar número de WhatsApp
En `static/js/cart.js`, línea 4:
```javascript
this.whatsappNumber = '593983381474'; // Cambiar aquí
```

### Personalizar mensajes
En `static/js/cart.js`, función `sendToWhatsApp()`:
```javascript
let message = '🍽️ *Nuevo Pedido - Gablou*\n\n';
// Personalizar mensaje aquí
```

### Ajustar estilos
En `static/css/cart.css`:
```css
.cart-widget {
    /* Personalizar posición y colores */
}
```

## 🐛 Solución de Problemas

### Problema: Los botones no aparecen
**Solución**: Verificar que los archivos CSS y JS estén correctamente enlazados en search.html

### Problema: WhatsApp no abre
**Solución**: Verificar el formato del número de teléfono (debe incluir código de país)

### Problema: Productos no se agregan
**Solución**: Verificar que los elementos HTML tengan las clases correctas (h3, .price, etc.)

### Problema: Carrito se vacía al recargar
**Solución**: El sistema usa localStorage, debería persistir. Verificar consola de errores.

## 📊 Testing

### Probar funcionalidad básica:
1. Abrir search.html en el navegador
2. Verificar que aparezca el widget del carrito
3. Agregar productos usando el botón "+"
4. Verificar que el contador se actualice
5. Abrir el carrito y verificar los productos
6. Hacer clic en "Enviar por WhatsApp"
7. Verificar que se abra WhatsApp con el mensaje formateado

### Probar en móvil:
1. Abrir en navegador móvil o DevTools modo móvil
2. Verificar que todos los botones sean visibles y clickeables
3. Probar la funcionalidad completa

## 🔧 Mantenimiento

### Actualizar productos
El sistema se adapta automáticamente a nuevos productos que sigan la estructura HTML requerida.

### Backup del carrito
Los datos se guardan en localStorage con la clave `gablou_cart`.

### Limpieza automática
El sistema incluye funciones para vaciar el carrito y gestionar el almacenamiento.

## 📞 Soporte
Para soporte técnico o personalizaciones adicionales, consultar con el desarrollador.

---
**Versión**: 1.0  
**Última actualización**: Julio 2025  
**Compatibilidad**: Todos los navegadores modernos