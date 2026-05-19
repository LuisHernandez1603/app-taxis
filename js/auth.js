/**
 * Modulo de Autenticacion Simplificado
 * Gestiona login y logout basico
 */

const AUTH = {
  // Usuarios demo
  users: {
    'admin@pacificcoast.com': { password: 'admin123', name: 'Administrador' },
    'user@pacificcoast.com': { password: 'user123', name: 'Usuario' }
  },

  // Login
  login: function(email, password) {
    const user = this.users[email];
    if (!user) return { success: false, error: 'Usuario no encontrado' };
    if (user.password !== password) return { success: false, error: 'Contraseña incorrecta' };
    
    localStorage.setItem('auth_user', JSON.stringify({
      email: email,
      name: user.name,
      loginTime: new Date().toISOString()
    }));
    
    return { success: true, user: { email, name: user.name } };
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

  // Inicializar UI de autenticacion
  initUI: function() {
    const user = this.getCurrentUser();
    
    if (!user) return;

    // Actualizar nombre de usuario en el header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.name;

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

// Ejecutar inicializacion cuando carga la pagina
document.addEventListener('DOMContentLoaded', () => {
  AUTH.initUI();
});

