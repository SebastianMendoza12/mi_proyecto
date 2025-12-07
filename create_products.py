import os
import django
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mi_proyecto.settings')
django.setup()

from productos.models import Producto, Categoria

# Crear productos de ejemplo
productos = [
    {
        "nombre": "Hamburguesa Sencilla",
        "descripcion": "Hamburguesa sencilla con porción de papas y gaseosa",
        "precio": 20000,
        "categoria_id": 2,
        "imagen": "https://polloslariviera.com/wp-content/uploads/2022/10/LA-RIVIERA_Combo-Hamburguesa-Sencilla.png",
        "stock": 100,
        "disponible": True
    },
    {
        "nombre": "Pizza Hawaiana",
        "descripcion": "Pizza hawaiana mediana con piña y jamón",
        "precio": 25000,
        "categoria_id": 6,
        "imagen": "https://www.recetasnestle.com.co/sites/default/files/srh_recipes/4e4293857c03d819e4ba901e37d0c0be.jpg",
        "stock": 50,
        "disponible": True
    },
    {
        "nombre": "Combo Perros",
        "descripcion": "4 perros calientes + 1 litro de gaseosa",
        "precio": 42900,
        "categoria_id": 7,
        "imagen": "",
        "stock": 30,
        "disponible": True
    }
]

print("=== CREANDO PRODUCTOS ===")
for prod_data in productos:
    try:
        categoria = Categoria.objects.get(id=prod_data["categoria_id"])
        producto, created = Producto.objects.get_or_create(
            nombre=prod_data["nombre"],
            defaults={
                "descripcion": prod_data["descripcion"],
                "precio": prod_data["precio"],
                "categoria": categoria,
                "imagen": prod_data["imagen"],
                "stock": prod_data["stock"],
                "disponible": prod_data["disponible"]
            }
        )
        status = "CREADO" if created else "YA EXISTE"
        print(f"{status} - ID: {producto.id} | {producto.nombre} - ${producto.precio}")
    except Exception as e:
        print(f"ERROR creando {prod_data['nombre']}: {e}")

print("\n=== LISTADO FINAL ===")
for prod in Producto.objects.all().order_by('id'):
    print(f"ID: {prod.id} | {prod.nombre} | Cat: {prod.categoria.nombre} | ${prod.precio}")
