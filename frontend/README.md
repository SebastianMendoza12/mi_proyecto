# Frontend - FastFood.exe 🎨

Aplicación React del sistema FastFood.exe construida con Vite y TailwindCSS.

## 🛠️ Tecnologías

- **React 19.1.1** - Librería UI
- **Vite 7.1.9** - Build tool y dev server
- **React Router DOM 7.9.3** - Enrutamiento
- **Axios 1.12.2** - Cliente HTTP para comunicación con API
- **TailwindCSS 4.1.16** - Framework CSS utility-first

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install
```

## 🚀 Scripts Disponibles

```bash
# Modo desarrollo (puerto 5173)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting con ESLint
npm run lint
```

## 🌐 Variables de Entorno

El frontend se comunica con el backend a través de la variable de entorno `VITE_API_URL`.

Crea un archivo `.env` en la carpeta `frontend/` (opcional, tiene fallback):

```env
VITE_API_URL=http://localhost:8000
```

Si no se define, por defecto usa `http://localhost:8000`.

## 📁 Estructura de Carpetas

```
frontend/
├── public/              # Archivos estáticos públicos
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── AdminRoute.jsx
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/        # React Context para estado global
│   │   └── CartContext.jsx
│   ├── pages/          # Páginas/vistas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RegisterSuccess.jsx
│   │   ├── Profile.jsx
│   │   ├── Feedback.jsx
│   │   ├── WhatsAppChat.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── ProductForm.jsx
│   ├── services/       # Servicios para llamadas a la API
│   │   └── api.js
│   ├── App.jsx         # Componente raíz con rutas
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globales con TailwindCSS
├── index.html
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de TailwindCSS
├── postcss.config.js   # Configuración de PostCSS
└── package.json
```

## 🧩 Componentes Principales

### Context

- **CartContext** - Manejo del estado global del carrito de compras

### Componentes de Utilidad

- **ProtectedRoute** - HOC para proteger rutas que requieren autenticación
- **AdminRoute** - HOC para proteger rutas de administrador
- **Header** - Barra de navegación principal
- **ProductCard** - Tarjeta de producto reutilizable

### Páginas

#### Públicas
- **Home** - Página principal con catálogo de productos
- **Login** - Inicio de sesión con 2FA
- **Register** - Registro de nuevos usuarios
- **RegisterSuccess** - Confirmación de registro

#### Autenticadas
- **Profile** - Perfil del usuario
- **Feedback** - Sistema de retroalimentación
- **WhatsAppChat** - Integración con WhatsApp

#### Admin
- **AdminLogin** - Login específico para administradores
- **AdminDashboard** - Panel de gestión de productos
- **ProductForm** - Formulario para crear/editar productos

## 🔌 Servicios API

El archivo `services/api.js` contiene funciones para comunicarse con el backend:

```javascript
import api from './services/api';

// Ejemplo de uso
const productos = await api.get('/api/productos/');
```

### Interceptores

El servicio API incluye interceptores que:
- Añaden automáticamente el token JWT a las peticiones autenticadas
- Manejan la renovación de tokens expirados
- Redirigen al login si la sesión expira

## 🎨 Estilos

El proyecto usa **TailwindCSS** con configuración personalizada que incluye:

- Gradientes personalizados
- Animaciones suaves
- Tema oscuro/claro
- Componentes con glassmorphism

### Personalización de Tailwind

Edita `tailwind.config.js` para personalizar colores, fuentes, etc.

## 🔐 Autenticación

El frontend implementa autenticación JWT con:

1. **Login** - Usuario y contraseña
2. **2FA** - Código de verificación de 6 dígitos
3. **JWT Tokens** - Access y refresh tokens almacenados en localStorage

### Flujo de Autenticación

```
Login → Verificar Credenciales → Código 2FA → Verificar Código → JWT Token → Acceso
```

## 📱 Rutas Disponibles

### Públicas
- `/` - Home (catálogo de productos)
- `/login` - Login de usuarios
- `/register` - Registro de usuarios
- `/register-success` - Confirmación de registro

### Protegidas (Usuario autenticado)
- `/profile` - Perfil del usuario
- `/feedback` - Enviar feedback

### Admin (Solo administradores)
- `/admin/login` - Login de administradores
- `/admin/dashboard` - Panel de administración
- `/admin/products/new` - Crear nuevo producto
- `/admin/products/edit/:id` - Editar producto

## 🐛 Debugging

### Consola del navegador

Abre las DevTools de tu navegador (F12) para ver:
- Errores de JavaScript
- Network requests a la API
- Estado de React components

### React DevTools

Instala la extensión [React Developer Tools](https://react.dev/learn/react-developer-tools) para inspeccionar componentes y estado.

## ⚡ Optimización

### Build de Producción

```bash
npm run build
```

Genera archivos optimizados en la carpeta `dist/`:
- Minificación de JS y CSS
- Code splitting
- Tree shaking
- Asset optimization

### Análisis del Bundle

Para analizar el tamaño del bundle:

```bash
npm run build -- --mode analyze
```

## 🔧 Configuración de Vite

El archivo `vite.config.js` incluye:

```javascript
export default {
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'  // Proxy para desarrollo
    }
  }
}
```

## 📚 Recursos Útiles

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de TailwindCSS](https://tailwindcss.com/)
- [Documentación de React Router](https://reactrouter.com/)

## 🤝 Convenciones de Código

- Usar componentes funcionales con hooks
- Nombres de componentes en PascalCase
- Nombres de archivos coinciden con el nombre del componente
- Usar destructuring para props
- Mantener componentes pequeños y reutilizables

## ⚠️ Notas Importantes

- El token JWT se almacena en `localStorage`
- Las rutas protegidas verifican el token antes de renderizar
- Los interceptores manejan automáticamente tokens expirados
- En producción, asegúrate de configurar HTTPS

---

**Para más información, consulta la [documentación principal](../README.md)**
