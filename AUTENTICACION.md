# Sistema de Autenticación y Roles

## Arquitectura

El sistema está diseñado con **3 roles principales** con acceso a diferentes paneles:

### Roles y Acceso

1. **ADMIN** → Dashboard Completo (`/index.html`)
   - Panel de monitoreo en tiempo real
   - Gestión de viajes, conductores, clientes
   - Reportes y exportación a Excel
   - BI y análisis de negocio

2. **DRIVER** → Panel de Conductor (`/driver-panel.html`)
   - Panel específico para conductores
   - Viajes asignados
   - Ganancias diarias
   - Calificaciones

3. **PASSENGER** → Panel de Pasajero (`/passenger-panel.html`)
   - Panel específico para pasajeros
   - Reserva de viajes
   - Historial de viajes
   - Calificar conductores

## Usuarios Demo

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@pacificcoast.com | admin123 | Admin |
| driver@pacificcoast.com | driver123 | Driver |
| passenger@pacificcoast.com | pass123 | Passenger |

## Flujo de Autenticación

```
1. Usuario ingresa a login.html
2. Valida credenciales con AUTH.login()
3. Guarda en LocalStorage: auth_user (JSON)
4. Redirige a index.html
5. AUTH.redirectByRole() verifica el rol
6. Redirige al panel correspondiente según rol
7. Si intenta acceder a un panel no autorizado, redirige al suyo
```

## Funciones Principales

### `auth.js`

```javascript
AUTH.login(email, password)
// Autentica usuario. Retorna { success: bool, error?: string }

AUTH.logout()
// Limpia la sesión

AUTH.getCurrentUser()
// Obtiene el usuario actual del localStorage

AUTH.isAuthenticated()
// Verifica si hay sesión activa

AUTH.hasRole(role)
// Verifica si el usuario tiene un rol específico

AUTH.redirectByRole()
// Redirige según el rol a la página correcta

AUTH.initUI()
// Actualiza el nombre y rol en el header
```

## Uso en Páginas

### En el HTML (login.html)
```html
<script src="js/auth.js"></script>
<script>
  // El usuario puede hacer login
  const result = AUTH.login(email, password);
  if (result.success) {
    window.location.href = 'index.html';
  }
</script>
```

### En Dashboard y Paneles
```html
<script src="js/auth.js"></script>
<!-- El auth.js automáticamente:
     1. Verifica si hay usuario logueado
     2. Si no hay, redirige a login.html
     3. Si el rol no coincide, redirige al panel correcto
     4. Actualiza el UI con nombre y rol del usuario
-->
```

## Flujo Visual

```
[Landing Page] 
      ↓
[Login Page] → Valida credenciales
      ↓
[index.html] → AUTH.redirectByRole() →  Según rol:
                                          ├─ Admin → Dashboard
                                          ├─ Driver → driver-panel.html
                                          └─ Passenger → passenger-panel.html
```

## Almacenamiento

Los datos de autenticación se guardan en `localStorage`:

```javascript
{
  email: "admin@pacificcoast.com",
  role: "admin",
  name: "Admin Panel",
  loginTime: "2024-05-18T..."
}
```

## Seguridad

- Las contraseñas se comparan directamente (demo)
- Para producción: usar hash + salt (bcrypt)
- Implementar HTTPS obligatorio
- Usar HTTP-only cookies para tokens
- Agregar CSRF protection
- Rate limiting en intentos de login

## Personalizacion

Para agregar nuevos usuarios, editar `js/auth.js`:

```javascript
const AUTH = {
  users: {
    'email@domain.com': { 
      password: 'hash_or_plain', 
      role: 'admin', 
      name: 'Nombre' 
    },
    // ... más usuarios
  }
}
```
