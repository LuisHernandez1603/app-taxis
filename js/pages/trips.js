// ============================================
// TRIPS PAGE MODULE
// ============================================

class TripsManager {
  constructor() {
    this.trips = [];
    this.filteredTrips = [];
    this.filters = {
      status: 'all',
      date: 'all'
    };
    this.init();
  }

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
    setInterval(() => this.updateTripsData(), 30000);
  }

  setupEventListeners() {
    document.getElementById('filterStatus').addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.filterTrips();
    });

    document.getElementById('filterDate').addEventListener('change', (e) => {
      this.filters.date = e.target.value;
      this.filterTrips();
    });

    document.getElementById('searchTrips').addEventListener('input', (e) => {
      this.searchTrips(e.target.value);
    });

    document.getElementById('newTripBtn').addEventListener('click', () => {
      this.showNewTripModal();
    });
  }

  loadData() {
    const data = DataManager.loadData();
    this.trips = data.trips || [];
    this.filterTrips();
    this.updateStats();
  }

  updateTripsData() {
    // Simula actualización en tiempo real
    this.trips.forEach(trip => {
      if (trip.status === 'en_curso') {
        trip.duration = Math.floor(Math.random() * 60) + 5;
      }
    });
    this.render();
  }

  filterTrips() {
    this.filteredTrips = this.trips.filter(trip => {
      const statusMatch = this.filters.status === 'all' || trip.status === this.filters.status;
      return statusMatch;
    });
    this.render();
  }

  searchTrips(query) {
    if (!query) {
      this.filterTrips();
      return;
    }
    this.filteredTrips = this.trips.filter(trip => 
      trip.id.toLowerCase().includes(query.toLowerCase()) ||
      trip.clientName.toLowerCase().includes(query.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(query.toLowerCase())
    );
    this.render();
  }

  updateStats() {
    const totalTrips = this.trips.length;
    const todayTrips = this.trips.filter(t => t.date === new Date().toISOString().split('T')[0]).length;
    const activeTrips = this.trips.filter(t => t.status === 'en_curso').length;
    const completedTrips = this.trips.filter(t => t.status === 'completado').length;
    const totalRevenue = this.trips.reduce((sum, t) => sum + (t.fare || 0), 0);

    document.getElementById('totalTrips').textContent = totalTrips;
    document.getElementById('todayTrips').textContent = todayTrips;
    document.getElementById('activeTrips').textContent = activeTrips;
    document.getElementById('completedTrips').textContent = completedTrips;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
  }

  render() {
    const tbody = document.getElementById('tripsTable');
    tbody.innerHTML = '';

    if (this.filteredTrips.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--muted);">No hay viajes</td></tr>';
      return;
    }

    this.filteredTrips.forEach(trip => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trip.id}</td>
        <td>${trip.clientName}</td>
        <td>${trip.driverName}</td>
        <td>${trip.origin} → ${trip.destination}</td>
        <td>${trip.date}</td>
        <td>${trip.status === 'en_curso' ? trip.duration + ' min' : '-'}</td>
        <td>$${trip.fare}</td>
        <td><span class="status-badge status-${trip.status}">${this.getStatusLabel(trip.status)}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="tripsManager.viewTrip('${trip.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="tripsManager.editTrip('${trip.id}')">
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

  getStatusLabel(status) {
    const labels = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'en_curso': 'En Curso',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  }

  showNewTripModal() {
    document.getElementById('tripModal').classList.add('active');
  }

  viewTrip(tripId) {
    alert('Ver detalles del viaje: ' + tripId);
  }

  editTrip(tripId) {
    alert('Editar viaje: ' + tripId);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.tripsManager = new TripsManager();
});
