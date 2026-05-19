// ============================================
// DRIVERS PAGE MODULE
// ============================================

class DriversManager {
  constructor() {
    this.drivers = [];
    this.filteredDrivers = [];
    this.filters = {
      status: 'all',
      rating: 'all'
    };
    this.init();
  }

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
    setInterval(() => this.updateDriversData(), 30000);
  }

  setupEventListeners() {
    document.getElementById('filterStatus').addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.filterDrivers();
    });

    document.getElementById('searchDrivers').addEventListener('input', (e) => {
      this.searchDrivers(e.target.value);
    });

    document.getElementById('addDriverBtn').addEventListener('click', () => {
      this.showNewDriverModal();
    });
  }

  loadData() {
    const data = DataManager.loadData();
    this.drivers = data.drivers || [];
    this.filterDrivers();
    this.updateStats();
  }

  updateDriversData() {
    // Simula actualización en tiempo real
    this.drivers.forEach(driver => {
      if (driver.status === 'activo') {
        driver.tripsToday = Math.floor(Math.random() * 15) + 1;
      }
    });
    this.render();
  }

  filterDrivers() {
    this.filteredDrivers = this.drivers.filter(driver => {
      const statusMatch = this.filters.status === 'all' || driver.status === this.filters.status;
      return statusMatch;
    });
    this.render();
  }

  searchDrivers(query) {
    if (!query) {
      this.filterDrivers();
      return;
    }
    this.filteredDrivers = this.drivers.filter(driver => 
      driver.name.toLowerCase().includes(query.toLowerCase()) ||
      driver.phone.includes(query) ||
      driver.id.toLowerCase().includes(query.toLowerCase())
    );
    this.render();
  }

  updateStats() {
    const totalDrivers = this.drivers.length;
    const activeDrivers = this.drivers.filter(d => d.status === 'activo').length;
    const inactiveDrivers = this.drivers.filter(d => d.status === 'inactivo').length;
    const averageRating = (this.drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / this.drivers.length).toFixed(1);

    document.getElementById('totalDrivers').textContent = totalDrivers;
    document.getElementById('activeDrivers').textContent = activeDrivers;
    document.getElementById('inactiveDrivers').textContent = inactiveDrivers;
    document.getElementById('averageRating').textContent = averageRating;
  }

  render() {
    const tbody = document.getElementById('driversTable');
    tbody.innerHTML = '';

    if (this.filteredDrivers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--muted);">No hay conductores</td></tr>';
      return;
    }

    this.filteredDrivers.forEach(driver => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${driver.id}</td>
        <td>${driver.name}</td>
        <td>${driver.phone}</td>
        <td>${driver.vehicle || 'N/A'}</td>
        <td>${driver.tripsToday || 0}</td>
        <td>${driver.rating || 0} ⭐</td>
        <td><span class="status-badge status-${driver.status}">${driver.status === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="driversManager.viewDriver('${driver.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="driversManager.editDriver('${driver.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  showNewDriverModal() {
    document.getElementById('driverModal').classList.add('active');
  }

  viewDriver(driverId) {
    alert('Ver detalles del conductor: ' + driverId);
  }

  editDriver(driverId) {
    alert('Editar conductor: ' + driverId);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.driversManager = new DriversManager();
});
