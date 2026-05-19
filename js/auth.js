/**
 * Modulo de Autenticacion
 * Gestiona login, logout y verificacion de roles
 */

const AUTH = {
  // Usuarios demo
  users: {
    'admin@pacificcoast.com': { password: 'admin123', role: 'admin', name: 'Admin Panel' },
    'driver@pacificcoast.com': { password: 'driver123', role: 'driver', name: 'Juan Mendoza' },
    'passenger@pacificcoast.com': { password: 'pass123', role: 'passenger', name: 'Carlos' }
  },

  // Login
  login: function(email, password) {
    const user = this.users[email];
    if (!user) return { success: false, error: 'Usuario no encontrado' };
    if (user.password !== password) return { success: false, error: 'Contraseña incorrecta' };
    
    localStorage.setItem('auth_user', JSON.stringify({
      email: email,
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString()
    }));
    
    return { success: true, user: { email, role: user.role, name: user.name } };
  },

  // Logout
  logout: function() {
    localStorage.removeItem('auth_user');
  },

  // Obtener usuario actual
  getCurrentUser: function() {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si esta autenticado
  isAuthenticated: function() {
    return this.getCurrentUser() !== null;
  },

  // Verificar rol
  hasRole: function(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  // Redirigir segun rol
  redirectByRole: function() {
    const user = this.getCurrentUser();
    if (!user) {
      // Si no esta autenticado y esta en pagina protegida, redirige a login
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (['admin-dashboard.html', 'driver-panel.html', 'passenger-panel.html'].includes(currentPage)) {
        window.location.href = 'login.html';
      }
      return;
    }

    // Definir rutas por rol
    const routes = {
      admin: 'admin-dashboard.html',
      driver: 'driver-panel.html',
      passenger: 'passenger-panel.html'
    };

    // Si intenta acceder a una ruta no autorizada, redirigir a su dashboard
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'admin-dashboard.html' && user.role !== 'admin') {
      window.location.href = routes[user.role];
    }
    if (currentPage === 'driver-panel.html' && user.role !== 'driver') {
      window.location.href = routes[user.role];
    }
    if (currentPage === 'passenger-panel.html' && user.role !== 'passenger') {
      window.location.href = routes[user.role];
    }
  },

  // Inicializar UI de autenticacion
  initUI: function() {
    const user = this.getCurrentUser();
    
    if (!user) return;

    // Actualizar nombre de usuario en el header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.name;

    // Actualizar rol en el header
    const userRoleEl = document.getElementById('userRole');
    if (userRoleEl) {
      const roleText = {
        admin: 'Administrador',
        driver: 'Conductor',
        passenger: 'Pasajero'
      };
      userRoleEl.textContent = roleText[user.role] || user.role;
    }

    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
        window.location.href = 'index.html';
      });
    }
  }
};

// Ejecutar redireccion de rol cuando carga la pagina
document.addEventListener('DOMContentLoaded', () => {
  AUTH.redirectByRole();
  AUTH.initUI();
});
