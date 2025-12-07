# FastFood.exe 🍔

Sistema de gestión de comida rápida con panel de administración, autenticación 2FA, y carrito de compras.

## 📋 Descripción

FastFood.exe es una aplicación web full-stack moderna que permite gestionar un negocio de comida rápida. Los usuarios pueden explorar productos, realizar pedidos, y los administradores pueden gestionar el catálogo completo desde un panel administrativo.

## ✨ Características Principales

- 🔐 Sistema de autenticación con 2FA (Two-Factor Authentication)
- 👨‍💼 Panel de administración completo para gestión de productos
- 🛒 Sistema de carrito de compras interactivo
- 📱 Interfaz moderna y responsiva con React y TailwindCSS
- 🔒 API REST segura con JWT tokens
- 📊 Gestión de categorías y productos
- 👤 Sistema de perfiles de usuario

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django 5.2.7** - Framework web
- **Django REST Framework 3.16.1** - API REST
- **JWT** - Autenticación con tokens
- **SQLite/PostgreSQL** - Base de datos

### Frontend
- **React 19.1.1** - Librería UI
- **Vite 7.1.9** - Build tool
- **React Router 7.9.3** - Navegación
- **Axios 1.12.2** - Cliente HTTP
- **TailwindCSS 4.1.16** - Framework CSS

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.10 o superior**
- **Node.js 18 o superior**
- **npm** o **yarn**
- **Git**

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/SebastianMendoza12/mi_proyecto.git
cd mi_proyecto
```

### 2️⃣ Configurar el Backend

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Copiar el archivo de ejemplo y editar según necesites
copy .env.example .env
# En Linux/Mac: cp .env.example .env
# Edita el archivo .env con tus configuraciones

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario para el panel de administración
python manage.py createsuperuser

# (Opcional) Cargar datos de prueba
python create_categories.py
python create_products.py

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en **http://localhost:8000**

### 3️⃣ Configurar el Frontend

En una nueva terminal:

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en **http://localhost:5173**

## 📁 Estructura del Proyecto

```
mi_proyecto/
├── administracion/        # App de administración y ventas
├── productos/             # App de productos y categorías
├── usuarios/              # App de usuarios y autenticación
├── mi_proyecto/           # Configuración principal de Django
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── context/      # React Context (estado global)
│   │   └── services/     # Servicios API
│   └── package.json
├── requirements.txt       # Dependencias Python
├── manage.py             # CLI Django
└── README.md             # Este archivo
```

## 🔑 Credenciales por Defecto

Después de ejecutar `create_admin.py` o crear un superusuario manualmente:

- **Usuario admin**: El que definiste con `createsuperuser`
- **Panel Django Admin**: http://localhost:8000/admin
- **Panel Personalizado**: http://localhost:5173/admin/login

## 📖 Documentación

Para una documentación más detallada, consulta:

- **[DOCUMENTACION.md](DOCUMENTACION.md)** - Documentación técnica completa
- **[frontend/README.md](frontend/README.md)** - Documentación específica del frontend

## 🧪 Datos de Prueba

El proyecto incluye scripts para crear datos de prueba:

```bash
# Crear categorías de productos
python create_categories.py

# Crear productos de ejemplo
python create_products.py

# Crear usuario administrador (si no usaste createsuperuser)
python create_admin.py
```

## 🔧 Comandos Útiles

### Backend

```bash
# Crear migraciones después de modificar modelos
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Acceder a la shell de Django
python manage.py shell

# Ejecutar servidor
python manage.py runserver
```

### Frontend

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🌐 Endpoints Principales de la API

### Autenticación
- `POST /api/usuarios/register/` - Registro de usuario
- `POST /api/usuarios/login/` - Login con 2FA
- `POST /api/usuarios/verify-code/` - Verificar código 2FA
- `POST /api/usuarios/admin-login/` - Login de administrador

### Productos (Público)
- `GET /api/productos/` - Listar productos
- `GET /api/productos/{id}/` - Detalle de producto
- `GET /api/categorias/` - Listar categorías

### Admin (Requiere autenticación)
- `GET /api/admin/productos/` - Listar productos (admin)
- `POST /api/admin/productos/` - Crear producto
- `PUT /api/admin/productos/{id}/` - Actualizar producto
- `DELETE /api/admin/productos/{id}/` - Eliminar producto

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas Importantes

- ⚠️ El archivo `.env` contiene información sensible y **NO debe ser compartido**
- ⚠️ La base de datos SQLite (`db.sqlite3`) es local y **NO se sube al repositorio**
- ⚠️ Asegúrate de activar el entorno virtual antes de trabajar con el backend
- ⚠️ En producción, usa PostgreSQL y configura `DEBUG=False`

## 🐛 Solución de Problemas

### Error de migraciones
```bash
python manage.py migrate --run-syncdb
```

### Puerto ocupado
Si el puerto 8000 o 5173 está ocupado, puedes cambiarlos:
```bash
# Backend
python manage.py runserver 8001

# Frontend (editar vite.config.js o usar flag)
npm run dev -- --port 5174
```

### CORS Errors
Verifica que en `settings.py` tengas:
```python
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
```

## 📧 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**© 2025 FastFood.exe - Desarrollado con ❤️**
