## Pacific Coast Taxi - Dashboard Empresarial en Tiempo Real

**Aplicación Web**: HTML5, CSS3, JavaScript Vanilla (Sin frameworks)

---

### 📁 ESTRUCTURA DEL PROYECTO

```
project/
├── index.html                 # Dashboard principal (punto de entrada)
├── landing.html               # Página de inicio/landing pública
│
├── pages/                     # Páginas de administración
│   ├── trips.html            # Gestión de viajes
│   ├── drivers.html          # Gestión de conductores
│   ├── clients.html          # Gestión de clientes
│   └── reports.html          # Reportes e Inteligencia de Negocio
│
├── css/                       # Estilos organizados por módulos
│   ├── variables.css         # Paleta de colores y variables CSS
│   ├── base.css              # Estilos base y reset
│   ├── components.css        # Componentes reutilizables (botones, inputs, etc)
│   ├── dashboard.css         # Estilos del dashboard
│   └── styles.css            # Estilos legacy
│
├── js/                        # JavaScript en capas
│   ├── data.js               # Capa de datos (DataManager)
│   ├── utils.js              # Funciones de utilidad
│   ├── excel.js              # Exportación a Excel (ExcelExporter)
│   ├── dashboard.js          # Lógica del dashboard principal
│   ├── pages/                # Módulos de cada página
│   │   ├── trips.js          # TripsManager
│   │   ├── drivers.js        # DriversManager
│   │   ├── clients.js        # ClientsManager
│   │   └── reports.js        # ReportsManager
│   ├── admin.js              # Admin legacy
│   ├── login.js              # Login legacy
│   ├── main.js               # Main legacy
│   └── trips.js              # Trips legacy
│
└── package.json              # Configuración del proyecto
```

---

### 🎯 ARQUITECTURA POR CAPAS

#### 1️⃣ **CAPA DE PRESENTACIÓN (HTML/CSS)**
- `index.html` - Dashboard responsivo con sidebar navegación
- `pages/*.html` - Páginas específicas para cada módulo
- Componentes UI reutilizables (cards, botones, tablas, modales)

#### 2️⃣ **CAPA DE ESTILOS (CSS Modular)**
- `variables.css` - Tema centralizado (colores, espaciado, tipografía)
- `base.css` - Reset CSS y estilos globales
- `components.css` - Componentes reutilizables
- `dashboard.css` - Estilos específicos del dashboard

#### 3️⃣ **CAPA DE LÓGICA (JavaScript)**
- `data.js` - Gestión centralizada de datos (almacenamiento local)
- `utils.js` - Funciones de utilidad compartidas
- `excel.js` - Exportación de datos a Excel
- Módulos específicos por página (trips.js, drivers.js, clients.js, reports.js)

#### 4️⃣ **CAPA DE DATOS (LocalStorage)**
- Almacenamiento persistente de viajes, conductores y clientes
- Simulación de datos en tiempo real

---

### 🚀 FUNCIONALIDADES PRINCIPALES

#### Dashboard Principal (`index.html`)
- **KPIs en tiempo real**:
  - Viajes hoy
  - Ingresos del día
  - Conductores activos
  - Clientes activos

- **Gráficos dinámicos**:
  - Ingresos por hora
  - Viajes activos vs completados
  - Distribución por servicio
  - Top destinos

- **Actividad en vivo**:
  - Lista de viajes en curso
  - Estado de conductores
  - Alertas y notificaciones

#### Gestión de Viajes (`pages/trips.html`)
- Tabla con todos los viajes
- Filtros por estado (pendiente, confirmado, en curso, completado)
- Búsqueda por cliente, conductor o destino
- Acciones: ver detalles, editar, cancelar

#### Gestión de Conductores (`pages/drivers.html`)
- Tabla de conductores con rating
- Filtros por estado (activo/inactivo)
- Estadísticas: viajes hoy, calificación promedio
- Acciones: ver perfil, editar, activar/desactivar

#### Gestión de Clientes (`pages/clients.html`)
- Base de datos de clientes
- Estadísticas: viajes, gasto total, última actividad
- Agregar nuevos clientes
- Búsqueda y filtrado

#### Reportes e Inteligencia de Negocio (`pages/reports.html`)
- **KPIs Ejecutivos**:
  - Ingresos totales del mes
  - Crecimiento mes a mes
  - Promedio por viaje
  - Tasa de utilización

- **Gráficos Avanzados**:
  - Ingresos últimos 7 días
  - Viajes por hora
  - Top 5 destinos
  - Top 5 conductores por ingresos

- **Exportación a Excel**:
  - Reporte de Viajes
  - Reporte de Ingresos
  - Reporte de Conductores
  - Reporte de Clientes
  - Resumen mensual comparativo

---

### 🔄 FLUJO DE DATOS

```
LocalStorage (data.js)
    ↓
DataManager.loadData()
    ↓
Módulos específicos (trips.js, drivers.js, etc)
    ↓
Manipulación de datos (filtrar, buscar, agregar)
    ↓
Renderizado en HTML (document.innerHTML)
    ↓
Actualización cada 30 segundos (simulación tiempo real)
    ↓
ExcelExporter.export*() → Descarga Excel
```

---

### 🎨 DISEÑO Y ESTILOS

**Paleta de Colores:**
- Primario: #102F63 (Azul Marino)
- Secundario: #FFC107 (Amarillo)
- Éxito: #22C55E (Verde)
- Peligro: #EF4444 (Rojo)
- Fondo: #0F1419 (Gris muy oscuro)
- Texto: #E4E4E7 (Gris claro)

**Tipografía:**
- Font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Componentes Principales:**
- Header/Navbar con usuario y notificaciones
- Sidebar con navegación principal
- Cards para mostrar datos
- Tablas de datos con acciones
- Modales para formularios
- Gráficos SVG personalizados

---

### 💾 ALMACENAMIENTO DE DATOS

Todos los datos se guardan en LocalStorage bajo la clave `'businessData'`:

```javascript
{
  trips: [
    { id, clientName, driverName, origin, destination, fare, status, date, time, duration }
  ],
  drivers: [
    { id, name, phone, vehicle, status, tripsToday, rating }
  ],
  clients: [
    { id, name, phone, email, tripsCount, totalSpent, active, lastActivity }
  ]
}
```

---

### 📊 GENERACIÓN DE REPORTES EXCEL

El módulo `excel.js` utiliza la librería SheetJS para:
- Crear libros de Excel (.xlsx)
- Agregar múltiples hojas por reporte
- Formatear celdas con colores y bordes
- Agregar fórmulas y totales
- Generar descargas automáticas

---

### ⚙️ CONFIGURACIÓN Y EJECUCIÓN

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar servidor:**
   ```bash
   npm start
   ```

3. **Acceder:** `http://localhost:3000`

4. **Credenciales de prueba:**
   - Email: `admin@pacificcoast.com`
   - Contraseña: `admin123`

---

### 📱 RESPONSIVIDAD

- Desktop: Layout completo con sidebar
- Tablet: Sidebar colapsable
- Mobile: Navegación hamburgesa

---

### 🔐 SEGURIDAD

- Datos almacenados localmente (sin servidor externo)
- Autenticación básica con localStorage
- CSRF y XSS mitigados por no usar eval()
- Validación de inputs en formularios

---

### 🚀 PRÓXIMAS MEJORAS

- Backend real con base de datos
- Autenticación con JWT
- WebSockets para tiempo real verdadero
- Gráficos más avanzados (Chart.js, D3.js)
- PWA para uso offline
- Notificaciones push
- Integración con APIs de mapas

---

**Versión:** 1.0.0  
**Última actualización:** Mayo 2026
