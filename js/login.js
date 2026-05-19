// ========================================
// Pacific Coast Taxi - Login JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initLoginTabs();
  initPassengerForm();
  initDriverLogin();
  initAdminLogin();
  initSocialLogin();
});

// ========================================
// Login Tabs
// ========================================
function initLoginTabs() {
  const tabs = document.querySelectorAll('.login-tab');
  const contents = document.querySelectorAll('.login-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update content
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(tabId + 'Tab').classList.add('active');
    });
  });
}

// ========================================
// Passenger Login
// ========================================
function initPassengerForm() {
  const form = document.getElementById('passengerForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('passengerEmail').value;
      const password = document.getElementById('passengerPassword').value;
      const errorDiv = document.getElementById('passengerError');
      
      // Simple validation (in real app, verify with backend)
      if (!email || !password) {
        showError(errorDiv, 'Por favor completa todos los campos');
        return;
      }
      
      // Demo login - accept any email/password
      const userName = email.split('@')[0].replace(/[._]/g, ' ');
      const capitalizedName = userName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      localStorage.setItem('userName', capitalizedName);
      localStorage.setItem('userEmail', email);
      
      // Redirect to home or trips
      window.location.href = 'index.html';
    });
  }
}

// ========================================
// Driver Login
// ========================================
function initDriverLogin() {
  const driverButtons = document.querySelectorAll('.demo-driver[data-email]');
  
  driverButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const email = this.dataset.email;
      const name = this.dataset.name;
      
      if (email && name) {
        localStorage.setItem('driverEmail', email);
        localStorage.setItem('driverName', name);
        
        // Redirect to driver panel (could be a different page)
        alert('Bienvenido, ' + name + '! Panel de conductor en desarrollo.');
        window.location.href = 'index.html';
      }
    });
  });
}

// ========================================
// Admin Login
// ========================================
function initAdminLogin() {
  const adminBtn = document.getElementById('adminLogin');
  
  if (adminBtn) {
    adminBtn.addEventListener('click', function() {
      localStorage.setItem('adminEmail', 'admin@pacificcoast.taxi');
      localStorage.setItem('adminName', 'Administrador');
      
      // Redirect to admin panel
      window.location.href = 'admin-dashboard.html';
    });
  }
}

// ========================================
// Social Login (Demo)
// ========================================
function initSocialLogin() {
  const googleBtn = document.getElementById('googleLogin');
  const facebookBtn = document.getElementById('facebookLogin');
  
  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      // Demo - simulate Google login
      localStorage.setItem('userName', 'Usuario Google');
      localStorage.setItem('userEmail', 'usuario@gmail.com');
      window.location.href = 'index.html';
    });
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function() {
      // Demo - simulate Facebook login
      localStorage.setItem('userName', 'Usuario Facebook');
      localStorage.setItem('userEmail', 'usuario@facebook.com');
      window.location.href = 'index.html';
    });
  }
}

// ========================================
// Utility Functions
// ========================================
function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}
