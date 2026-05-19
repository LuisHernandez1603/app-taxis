/**
 * ========================================
 * PACIFIC COAST TAXI - DASHBOARD JS
 * ========================================
 * Logica principal del dashboard
 * Actualizaciones en tiempo real
 * ========================================
 */

// Global state
let currentPeriod = 'week';
let refreshInterval = null;

// Initialize dashboard on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  setupEventListeners();
  startAutoRefresh();
});

/**
 * Initialize dashboard
 */
function initDashboard() {
  DataStore.init();
  renderStats();
  renderRevenueChart();
  renderTripStatusChart();
  renderActivityList();
  renderTopDestinations();
  renderActiveDrivers();
  populateDriverSelect();
  updateNotificationCount();
  setDefaultDateTime();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Time filter buttons
  const timeFilter = document.getElementById('timeFilter');
  if (timeFilter) {
    timeFilter.addEventListener('click', (e) => {
      if (e.target.classList.contains('time-filter-btn')) {
        document.querySelectorAll('.time-filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentPeriod = e.target.dataset.period;
        refreshData();
      }
    });
  }

  // Global search
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value;
      if (query.length >= 2) {
        // Could implement search results dropdown
        console.log('Searching:', query);
      }
    }, 300));
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  });
}

/**
 * Start auto-refresh (every 30 seconds)
 */
function startAutoRefresh() {
  refreshInterval = setInterval(() => {
    refreshData();
  }, 30000);
}

/**
 * Refresh all dashboard data
 */
function refreshData() {
  renderStats();
  renderRevenueChart();
  renderTripStatusChart();
  renderActivityList();
  renderTopDestinations();
  renderActiveDrivers();
  updateNotificationCount();
  Utils.showToast('Datos actualizados', 'success');
}

/**
 * Render stats cards
 */
function renderStats() {
  const stats = DataStore.getStats();
  const container = document.getElementById('statsGrid');
  
  const statsConfig = [
    {
      label: 'Viajes Hoy',
      value: stats.todayTrips,
      icon: 'car',
      color: 'blue',
      trend: stats.tripsTrend,
      trendLabel: 'vs semana pasada'
    },
    {
      label: 'Ingresos del Dia',
      value: Utils.formatCurrency(stats.todayRevenue),
      icon: 'dollar',
      color: 'green',
      trend: stats.revenueTrend,
      trendLabel: 'vs semana pasada'
    },
    {
      label: 'Viajes Activos',
      value: stats.activeTrips,
      icon: 'activity',
      color: 'yellow',
      badge: stats.pendingTrips > 0 ? `${stats.pendingTrips} pendientes` : null
    },
    {
      label: 'Conductores Activos',
      value: `${stats.activeDrivers}/${stats.totalDrivers}`,
      icon: 'users',
      color: 'purple',
      badge: 'En linea'
    }
  ];

  const icons = {
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
  };

  container.innerHTML = statsConfig.map(stat => `
    <div class="stat-card">
      <div class="stat-card-header">
        <div class="stat-card-icon ${stat.color}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${icons[stat.icon]}
          </svg>
        </div>
        ${stat.badge ? `<span class="badge badge-${stat.color === 'yellow' ? 'warning' : 'success'}">${stat.badge}</span>` : ''}
      </div>
      <div>
        <div class="stat-card-label">${stat.label}</div>
        <div class="stat-card-value">${stat.value}</div>
        ${stat.trend !== undefined ? `
          <div class="stat-card-change ${stat.trend >= 0 ? 'positive' : 'negative'}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${stat.trend >= 0 
                ? '<path d="m18 15-6-6-6 6"/>' 
                : '<path d="m6 9 6 6 6-6"/>'}
            </svg>
            ${Math.abs(stat.trend)}% ${stat.trendLabel || ''}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Update pending trips badge in sidebar
  const pendingBadge = document.getElementById('pendingTripsCount');
  if (pendingBadge) {
    pendingBadge.textContent = stats.pendingTrips;
    pendingBadge.style.display = stats.pendingTrips > 0 ? 'block' : 'none';
  }
}

/**
 * Render revenue bar chart
 */
function renderRevenueChart() {
  const data = DataStore.getRevenueByPeriod(currentPeriod);
  const container = document.getElementById('revenueChart');
  const maxValue = Math.max(...Object.values(data), 1);

  container.innerHTML = Object.entries(data).map(([label, value]) => {
    const height = (value / maxValue) * 180;
    return `
      <div class="bar-chart-item">
        <div class="bar-chart-value">${value > 0 ? Utils.formatCurrency(value).replace('C$ ', '') : '0'}</div>
        <div class="bar-chart-bar" style="height: ${Math.max(height, 4)}px;"></div>
        <div class="bar-chart-label">${label}</div>
      </div>
    `;
  }).join('');
}

/**
 * Render trip status chart
 */
function renderTripStatusChart() {
  const stats = DataStore.getStats();
  const container = document.getElementById('tripStatusChart');
  
  const statusData = [
    { label: 'Completados', value: stats.completedTrips, color: 'green' },
    { label: 'En Curso', value: stats.activeTrips, color: 'blue' },
    { label: 'Pendientes', value: stats.pendingTrips, color: 'yellow' },
    { label: 'Cancelados', value: stats.cancelledTrips, color: 'red' }
  ];

  const total = statusData.reduce((sum, s) => sum + s.value, 0) || 1;

  container.innerHTML = statusData.map(status => {
    const percent = ((status.value / total) * 100).toFixed(0);
    return `
      <div style="margin-bottom: var(--space-md);">
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
          <span style="font-size: 0.875rem; color: var(--color-text-secondary);">${status.label}</span>
          <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary);">${status.value} (${percent}%)</span>
        </div>
        <div class="progress">
          <div class="progress-bar ${status.color}" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render recent activity list
 */
function renderActivityList() {
  const activities = DataStore.getRecentActivity(6);
  const container = document.getElementById('activityList');

  if (activities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
        </svg>
        <p class="empty-state-title">Sin actividad reciente</p>
        <p class="empty-state-description">Los viajes apareceran aqui</p>
      </div>
    `;
    return;
  }

  const statusColors = {
    pendiente: 'yellow',
    confirmado: 'blue',
    en_curso: 'blue',
    completado: 'green',
    cancelado: 'red'
  };

  container.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon stat-card-icon ${statusColors[activity.status] || 'blue'}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
        </svg>
      </div>
      <div class="activity-content">
        <div class="activity-text">
          <strong>${activity.title}</strong> - ${activity.description}
        </div>
        <div class="activity-time">
          ${Utils.formatRelativeTime(activity.time)} · ${activity.driver} · ${Utils.formatCurrency(activity.amount)}
        </div>
      </div>
      ${Utils.getStatusBadge(activity.status)}
    </div>
  `).join('');
}

/**
 * Render top destinations
 */
function renderTopDestinations() {
  const destinations = DataStore.getTopDestinations(5);
  const container = document.getElementById('topDestinations');
  const maxCount = destinations[0]?.count || 1;

  container.innerHTML = destinations.map((dest, index) => `
    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
      <div style="width: 24px; height: 24px; background: ${index < 3 ? 'var(--color-accent)' : 'var(--color-surface-elevated)'}; color: ${index < 3 ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
        ${index + 1}
      </div>
      <div style="flex: 1;">
        <div style="font-size: 0.875rem; color: var(--color-text-primary); margin-bottom: var(--space-xs);">${dest.name}</div>
        <div class="progress" style="height: 4px;">
          <div class="progress-bar blue" style="width: ${(dest.count / maxCount) * 100}%;"></div>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: var(--color-text-muted);">${dest.count} viajes</div>
    </div>
  `).join('');
}

/**
 * Render active drivers
 */
function renderActiveDrivers() {
  const drivers = DataStore.getDrivers({ status: 'activo' });
  const container = document.getElementById('activeDriversGrid');

  if (drivers.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p class="text-muted">No hay conductores activos</p>
      </div>
    `;
    return;
  }

  container.innerHTML = drivers.map(driver => `
    <div class="card" style="padding: var(--space-md);">
      <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
        <div class="avatar">${Utils.getInitials(driver.name)}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 500; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${driver.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted);">${driver.vehicle}</div>
        </div>
        <span class="status-dot online pulse"></span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted);">
        <span>${driver.totalTrips} viajes</span>
        <span style="display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="var(--color-warning)" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          ${driver.rating}
        </span>
      </div>
    </div>
  `).join('');
}

/**
 * Populate driver select in modal
 */
function populateDriverSelect() {
  const drivers = DataStore.getDrivers({ status: 'activo' });
  const select = document.getElementById('driverSelect');
  
  if (select) {
    select.innerHTML = `
      <option value="">Seleccionar conductor...</option>
      ${drivers.map(driver => `
        <option value="${driver.id}">${driver.name} - ${driver.vehicle}</option>
      `).join('')}
    `;
  }
}

/**
 * Update notification count
 */
function updateNotificationCount() {
  const stats = DataStore.getStats();
  const badge = document.getElementById('notificationCount');
  if (badge) {
    const count = stats.pendingTrips;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Set default datetime for new trip form
 */
function setDefaultDateTime() {
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    dateInput.value = now.toISOString().slice(0, 16);
  }
}

// ========== MODAL FUNCTIONS ==========

function openNewTripModal() {
  document.getElementById('newTripModal').classList.add('active');
  setDefaultDateTime();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function createTrip(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const driver = DataStore.getDrivers().find(d => d.id === formData.get('driverId'));
  
  const tripData = {
    clientName: formData.get('clientName'),
    clientPhone: formData.get('clientPhone'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    date: new Date(formData.get('date')).toISOString(),
    service: formData.get('service'),
    passengers: parseInt(formData.get('passengers')),
    price: parseInt(formData.get('price')),
    commission: Math.floor(parseInt(formData.get('price')) * 0.15),
    driverId: formData.get('driverId') || null,
    driverName: driver?.name || 'Sin asignar',
    status: 'pendiente',
    paymentMethod: 'Efectivo'
  };

  DataStore.addTrip(tripData);
  closeModal('newTripModal');
  form.reset();
  refreshData();
  Utils.showToast('Viaje creado exitosamente', 'success');
}

// ========== UTILITY FUNCTIONS ==========

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}

function toggleDropdown(button) {
  const menu = button.nextElementSibling;
  document.querySelectorAll('.dropdown-menu.active').forEach(m => {
    if (m !== menu) m.classList.remove('active');
  });
  menu.classList.toggle('active');
}

function toggleNotifications() {
  Utils.showToast('Notificaciones: ' + DataStore.getStats().pendingTrips + ' viajes pendientes', 'info');
}

function exportDashboard() {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  ExcelExport.exportBIReport(from.toISOString(), now.toISOString());
}

async function resetDemoData() {
  const confirmed = await Utils.confirm('Esto eliminara todos los datos actuales y generara nuevos datos de demostración. ¿Continuar?');
  if (confirmed) {
    localStorage.clear();
    DataStore.init();
    refreshData();
    Utils.showToast('Datos reiniciados', 'success');
  }
}

function logout() {
  localStorage.removeItem('pct_user');
  window.location.href = 'landing.html';
}

// Export functions for global access
window.openNewTripModal = openNewTripModal;
window.closeModal = closeModal;
window.createTrip = createTrip;
window.toggleSidebar = toggleSidebar;
window.toggleDropdown = toggleDropdown;
window.toggleNotifications = toggleNotifications;
window.refreshData = refreshData;
window.exportDashboard = exportDashboard;
window.resetDemoData = resetDemoData;
window.logout = logout;
