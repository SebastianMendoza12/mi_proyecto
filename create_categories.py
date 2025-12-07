import os
import django
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mi_proyecto.settings')
django.setup()

from productos.models import Categoria

# Categorías basadas en el frontend
categorias = [
    {"nombre": "Bebidas", "icono": "🥤", "descripcion": "Bebidas frías y calientes"},
    {"nombre": "Hamburguesas", "icono": "🍔", "descripcion": "Hamburguesas de todo tipo"},
    {"nombre": "Combos", "icono": "🍱", "descripcion": "Combos especiales"},
    {"nombre": "Postres", "icono": "🍰", "descripcion": "Postres deliciosos"},
    {"nombre": "Acompañantes", "icono": "🍟", "descripcion": "Papas, aros de cebolla, etc"},
    {"nombre": "Pizza", "icono": "🍕", "descripcion": "Pizzas artesanales"},
    {"nombre": "Perros", "icono": "🌭", "descripcion": "Perros calientes"},
]

print("=== CREANDO CATEGORÍAS ===")
for cat_data in categorias:
    cat, created = Categoria.objects.get_or_create(
        nombre=cat_data["nombre"],
        defaults={
            "icono": cat_data["icono"],
            "descripcion": cat_data["descripcion"],
            "activa": True
        }
    )
    status = "CREADA" if created else "YA EXISTE"
    print(f"{status} - ID: {cat.id} | {cat.nombre} {cat.icono}")

print("\n=== LISTADO FINAL ===")
for cat in Categoria.objects.all().order_by('id'):
    print(f"ID: {cat.id} | Nombre: {cat.nombre} | Icono: {cat.icono}")
