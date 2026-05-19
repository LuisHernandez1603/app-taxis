/**
 * ========================================
 * PACIFIC COAST TAXI - UTILS
 * ========================================
 * Funciones utilitarias del sistema
 * ========================================
 */

const Utils = {
  // Format currency
  formatCurrency(amount, currency = 'C$') {
    return `${currency} ${amount.toLocaleString('es-NI')}`;
  },

  // Format date
  formatDate(dateString, options = {}) {
    const date = new Date(dateString);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-NI', { ...defaultOptions, ...options });
  },

  // Format time
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
  },

  // Format datetime
  formatDateTime(dateString) {
    return `${this.formatDate(dateString)} ${this.formatTime(dateString)}`;
  },

  // Relative time (e.g., "hace 5 minutos")
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return this.formatDate(dateString);
  },

  // Get status badge HTML
  getStatusBadge(status) {
    const statusConfig = {
      pendiente: { class: 'badge-warning', text: 'Pendiente' },
      confirmado: { class: 'badge-info', text: 'Confirmado' },
      en_curso: { class: 'badge-info', text: 'En Curso' },
      completado: { class: 'badge-success', text: 'Completado' },
      cancelado: { class: 'badge-danger', text: 'Cancelado' },
      activo: { class: 'badge-success', text: 'Activo' },
      inactivo: { class: 'badge-neutral', text: 'Inactivo' }
    };

    const config = statusConfig[status] || { class: 'badge-neutral', text: status };
    return `<span class="badge ${config.class}">${config.text}</span>`;
  },

  // Get initials from name
  getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Generate random color
  getRandomColor() {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Truncate text
  truncate(text, length = 50) {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  // Parse query string
  parseQuery(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Build query string
  buildQuery(params) {
    return new URLSearchParams(params).toString();
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      return false;
    }
  },

  // Show notification toast
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;
    
    // Add toast container if not exists
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Confirm dialog
  confirm(message) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 400px;">
          <div class="modal-body" style="text-align: center; padding: 2rem;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2" style="margin-bottom: 1rem;">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style="font-size: 1rem; margin-bottom: 1.5rem;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
              <button class="btn btn-secondary" id="confirmCancel">Cancelar</button>
              <button class="btn btn-danger" id="confirmOk">Confirmar</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector('#confirmCancel').onclick = () => {
        modal.remove();
        resolve(false);
      };
      
      modal.querySelector('#confirmOk').onclick = () => {
        modal.remove();
        resolve(true);
      };
      
      modal.querySelector('.modal-overlay').onclick = () => {
        modal.remove();
        resolve(false);
      };
    });
  }
};

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
  }
  
  .toast-success { border-color: var(--color-success); }
  .toast-warning { border-color: var(--color-warning); }
  .toast-danger { border-color: var(--color-danger); }
  .toast-info { border-color: var(--color-info); }
  
  .toast-message {
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }
  
  .toast-close {
    color: var(--color-text-muted);
    padding: 0.25rem;
  }
  
  .toast-close:hover {
    color: var(--color-text-primary);
  }
  
  .toast-exit {
    animation: fadeOut 0.3s ease forwards;
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(toastStyles);

// Export
window.Utils = Utils;
