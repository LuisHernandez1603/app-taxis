// ========================================
// Pacific Coast Taxi - Admin JavaScript
// ========================================
// Tipo: Aplicacion Web Visual
// Exportacion: Excel (XLSX) usando SheetJS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initAdminTabs();
  initModals();
  loadDashboardStats();
  loadTrips();
  loadDrivers();
  loadBIData();
  initDateRanges();
  initCurrentYear();
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminName');
      window.location.href = 'login.html';
    });
  }
});

// ========================================
// Sample Data (for demo purposes)
// ========================================
function getSampleTrips() {
  const stored = localStorage.getItem('trips');
  if (stored) return JSON.parse(stored);
  
  // Generate sample data
  const sampleTrips = [
    {
      id: 'PCT-A1B2C3',
      name: 'Juan Perez',
      phone: '+505 8888-1111',
      origin: 'Hotel Pelican Eyes, San Juan del Sur',
      destination: 'Aeropuerto Managua',
      date: '2024-01-15',
      time: '08:00',
      passengers: 2,
      serviceType: 'interdepartamental',
      price: 85.00,
      status: 'completado',
      driverId: 'DRV-001',
      createdAt: '2024-01-14T10:30:00'
    },
    {
      id: 'PCT-D4E5F6',
      name: 'Maria Garcia',
      phone: '+505 8888-2222',
      origin: 'Rivas Centro',
      destination: 'Playa Maderas',
      date: '2024-01-16',
      time: '10:00',
      passengers: 4,
      serviceType: 'turistico',
      price: 25.00,
      status: 'completado',
      driverId: 'DRV-002',
      createdAt: '2024-01-15T14:20:00'
    },
    {
      id: 'PCT-G7H8I9',
      name: 'Carlos Martinez',
      phone: '+505 8888-3333',
      origin: 'Terminal de Buses Rivas',
      destination: 'Hotel Victoriano',
      date: '2024-01-17',
      time: '14:30',
      passengers: 1,
      serviceType: 'local',
      price: 8.00,
      status: 'completado',
      driverId: 'DRV-001',
      createdAt: '2024-01-17T12:00:00'
    },
    {
      id: 'PCT-J1K2L3',
      name: 'Ana Lopez',
      phone: '+505 8888-4444',
      origin: 'San Juan del Sur',
      destination: 'Granada',
      date: '2024-01-18',
      time: '09:00',
      passengers: 3,
      serviceType: 'interdepartamental',
      price: 65.00,
      status: 'confirmado',
      driverId: 'DRV-003',
      createdAt: '2024-01-17T16:45:00'
    },
    {
      id: 'PCT-M4N5O6',
      name: 'Roberto Sanchez',
      phone: '+505 8888-5555',
      origin: 'Playa El Coco',
      destination: 'Rivas Centro',
      date: '2024-01-19',
      time: '16:00',
      passengers: 2,
      serviceType: 'local',
      price: 12.00,
      status: 'pendiente',
      driverId: null,
      createdAt: '2024-01-18T09:30:00'
    },
    {
      id: 'PCT-P7Q8R9',
      name: 'Laura Hernandez',
      phone: '+505 8888-6666',
      origin: 'Managua',
      destination: 'San Juan del Sur',
      date: '2024-01-20',
      time: '11:00',
      passengers: 5,
      serviceType: 'turistico',
      price: 95.00,
      status: 'pendiente',
      driverId: null,
      createdAt: '2024-01-19T11:15:00'
    }
  ];
  
  localStorage.setItem('trips', JSON.stringify(sampleTrips));
  return sampleTrips;
}

function getSampleDrivers() {
  const stored = localStorage.getItem('drivers');
  if (stored) return JSON.parse(stored);
  
  const sampleDrivers = [
    {
      id: 'DRV-001',
      name: 'Pedro Gonzalez',
      phone: '+505 7777-1111',
      email: 'pedro.gonzalez@email.com',
      license: 'LIC-2024-001',
      vehicle: 'Toyota Corolla 2020',
      plate: 'M-123-456',
      status: 'activo',
      rating: 4.8,
      totalTrips: 45,
      totalEarnings: 1250.00,
      createdAt: '2023-06-15'
    },
    {
      id: 'DRV-002',
      name: 'Miguel Rodriguez',
      phone: '+505 7777-2222',
      email: 'miguel.rodriguez@email.com',
      license: 'LIC-2024-002',
      vehicle: 'Nissan Sentra 2019',
      plate: 'M-234-567',
      status: 'activo',
      rating: 4.9,
      totalTrips: 62,
      totalEarnings: 1580.00,
      createdAt: '2023-04-20'
    },
    {
      id: 'DRV-003',
      name: 'Fernando Jimenez',
      phone: '+505 7777-3333',
      email: 'fernando.jimenez@email.com',
      license: 'LIC-2024-003',
      vehicle: 'Hyundai Accent 2021',
      plate: 'M-345-678',
      status: 'activo',
      rating: 4.7,
      totalTrips: 38,
      totalEarnings: 980.00,
      createdAt: '2023-08-10'
    }
  ];
  
  localStorage.setItem('drivers', JSON.stringify(sampleDrivers));
  return sampleDrivers;
}

function getSampleReviews() {
  const stored = localStorage.getItem('reviews');
  if (stored) return JSON.parse(stored);
  
  const sampleReviews = [
    { rating: 5, comment: 'Excelente servicio, muy puntual', userName: 'Juan Perez', date: '2024-01-15' },
    { rating: 5, comment: 'Conductor muy amable y profesional', userName: 'Maria Garcia', date: '2024-01-16' },
    { rating: 4, comment: 'Buen servicio, llegaron a tiempo', userName: 'Carlos Martinez', date: '2024-01-17' },
    { rating: 5, comment: 'Vehiculo limpio y comodo', userName: 'Ana Lopez', date: '2024-01-18' },
    { rating: 5, comment: 'Recomendado 100%', userName: 'Roberto Sanchez', date: '2024-01-19' }
  ];
  
  localStorage.setItem('reviews', JSON.stringify(sampleReviews));
  return sampleReviews;
}

// ========================================
// Admin Tabs
// ========================================
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const contents = document.querySelectorAll('.admin-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update content
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(tabId + 'Content').classList.add('active');
    });
  });
}

// ========================================
// Dashboard Stats
// ========================================
function loadDashboardStats() {
  const trips = getSampleTrips();
  const drivers = getSampleDrivers();
  const reviews = getSampleReviews();
  
  // Total trips
  document.getElementById('totalTrips').textContent = trips.length;
  
  // Total revenue
  const totalRevenue = trips
    .filter(t => t.status === 'completado')
    .reduce((sum, t) => sum + t.price, 0);
  document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
  
  // Active drivers
  document.getElementById('totalDrivers').textContent = drivers.filter(d => d.status === 'activo').length;
  
  // Average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  document.getElementById('avgRating').textContent = avgRating;
}

// ========================================
// Trips Management
// ========================================
function loadTrips() {
  const trips = getSampleTrips();
  const tbody = document.getElementById('tripsTableBody');
  const noData = document.getElementById('noTripsData');
  
  console.log("[v0] loadTrips - trips:", trips);
  console.log("[v0] loadTrips - tbody:", tbody);
  console.log("[v0] loadTrips - noData:", noData);
  
  if (!tbody) {
    console.log("[v0] loadTrips - tbody not found");
    return;
  }
  
  if (trips.length === 0) {
    console.log("[v0] loadTrips - no trips, showing empty message");
    if (noData) noData.style.display = 'flex';
    tbody.parentElement.style.display = 'none';
    return;
  }
  
  console.log("[v0] loadTrips - rendering " + trips.length + " trips");
  if (noData) noData.style.display = 'none';
  tbody.parentElement.style.display = 'table';
  
  try {
    tbody.innerHTML = trips.map(trip => `
      <tr>
        <td><span class="trip-code">${trip.id}</span></td>
        <td>
          <div class="client-info">
            <span class="client-name">${trip.name}</span>
            <span class="client-phone">${trip.phone}</span>
          </div>
        </td>
        <td>${trip.origin}</td>
        <td>${trip.destination}</td>
        <td>${formatDate(trip.date)} ${trip.time}</td>
        <td>$${trip.price.toFixed(2)}</td>
        <td><span class="status-badge ${trip.status}">${getStatusLabel(trip.status)}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" onclick="editTrip('${trip.id}')" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon danger" onclick="deleteTrip('${trip.id}')" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    console.log("[v0] loadTrips - HTML rendered successfully");
  } catch (error) {
    console.error("[v0] loadTrips - Error rendering HTML:", error);
  }
  
  // Search functionality
  const searchInput = document.getElementById('tripSearch');
  if (searchInput) {
    searchInput.addEventListener('input', filterTrips);
  }
  
  // Status filter
  const statusFilter = document.getElementById('tripStatusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterTrips);
  }
}

function filterTrips() {
  const searchTerm = document.getElementById('tripSearch').value.toLowerCase();
  const statusFilter = document.getElementById('tripStatusFilter').value;
  const trips = getSampleTrips();
  
  const filtered = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm) ||
                         trip.origin.toLowerCase().includes(searchTerm) ||
                         trip.destination.toLowerCase().includes(searchTerm) ||
                         trip.id.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const tbody = document.getElementById('tripsTableBody');
  const noData = document.getElementById('noTripsData');
  
  if (filtered.length === 0) {
    noData.style.display = 'flex';
    tbody.innerHTML = '';
    return;
  }
  
  noData.style.display = 'none';
  tbody.innerHTML = filtered.map(trip => `
    <tr>
      <td><span class="trip-code">${trip.id}</span></td>
      <td>
        <div class="client-info">
          <span class="client-name">${trip.name}</span>
          <span class="client-phone">${trip.phone}</span>
        </div>
      </td>
      <td>${trip.origin}</td>
      <td>${trip.destination}</td>
      <td>${formatDate(trip.date)} ${trip.time}</td>
      <td>$${trip.price.toFixed(2)}</td>
      <td><span class="status-badge ${trip.status}">${getStatusLabel(trip.status)}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="editTrip('${trip.id}')" title="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon danger" onclick="deleteTrip('${trip.id}')" title="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editTrip(tripId) {
  const trips = getSampleTrips();
  const trip = trips.find(t => t.id === tripId);
  
  if (!trip) return;
  
  document.getElementById('editTripId').value = tripId;
  document.getElementById('editTripStatus').value = trip.status;
  document.getElementById('editTripPrice').value = trip.price;
  document.getElementById('editTripNotes').value = trip.adminNotes || '';
  
  // Load drivers into select
  const drivers = getSampleDrivers();
  const driverSelect = document.getElementById('editTripDriver');
  driverSelect.innerHTML = '<option value="">Sin asignar</option>' + 
    drivers.map(d => `<option value="${d.id}" ${trip.driverId === d.id ? 'selected' : ''}>${d.name}</option>`).join('');
  
  document.getElementById('editTripModal').classList.add('active');
}

function closeEditTripModal() {
  document.getElementById('editTripModal').classList.remove('active');
}

function deleteTrip(tripId) {
  if (!confirm('Esta seguro de eliminar este viaje?')) return;
  
  let trips = getSampleTrips();
  trips = trips.filter(t => t.id !== tripId);
  localStorage.setItem('trips', JSON.stringify(trips));
  
  loadTrips();
  loadDashboardStats();
}

// ========================================
// Drivers Management
// ========================================
function loadDrivers() {
  const drivers = getSampleDrivers();
  const grid = document.getElementById('driversGrid');
  const noData = document.getElementById('noDriversData');
  
  console.log("[v0] loadDrivers - drivers:", drivers);
  console.log("[v0] loadDrivers - grid:", grid);
  
  if (!grid) {
    console.log("[v0] loadDrivers - grid not found");
    return;
  }
  
  if (drivers.length === 0) {
    console.log("[v0] loadDrivers - no drivers");
    if (noData) noData.style.display = 'flex';
    grid.style.display = 'none';
    return;
  }
  
  console.log("[v0] loadDrivers - rendering " + drivers.length + " drivers");
  if (noData) noData.style.display = 'none';
  grid.style.display = 'grid';
  
  grid.innerHTML = drivers.map(driver => `
    <div class="driver-card">
      <div class="driver-header">
        <div class="driver-avatar">${driver.name.charAt(0)}</div>
        <div class="driver-info">
          <h3>${driver.name}</h3>
          <span class="driver-status ${driver.status}">${driver.status === 'activo' ? 'Activo' : 'Inactivo'}</span>
        </div>
      </div>
      <div class="driver-details">
        <div class="driver-detail">
          <span class="label">Telefono</span>
          <span class="value">${driver.phone}</span>
        </div>
        <div class="driver-detail">
          <span class="label">Vehiculo</span>
          <span class="value">${driver.vehicle}</span>
        </div>
        <div class="driver-detail">
          <span class="label">Placa</span>
          <span class="value">${driver.plate}</span>
        </div>
        <div class="driver-detail">
          <span class="label">Licencia</span>
          <span class="value">${driver.license}</span>
        </div>
      </div>
      <div class="driver-stats">
        <div class="driver-stat">
          <span class="stat-value">${driver.totalTrips}</span>
          <span class="stat-label">Viajes</span>
        </div>
        <div class="driver-stat">
          <span class="stat-value">$${driver.totalEarnings.toFixed(0)}</span>
          <span class="stat-label">Ingresos</span>
        </div>
        <div class="driver-stat">
          <span class="stat-value">${driver.rating}</span>
          <span class="stat-label">Rating</span>
        </div>
      </div>
      <div class="driver-actions">
        <button class="btn btn-outline btn-sm" onclick="toggleDriverStatus('${driver.id}')">
          ${driver.status === 'activo' ? 'Desactivar' : 'Activar'}
        </button>
        <button class="btn btn-outline btn-sm danger" onclick="deleteDriver('${driver.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function openAddDriverModal() {
  document.getElementById('addDriverModal').classList.add('active');
}

function closeAddDriverModal() {
  document.getElementById('addDriverModal').classList.remove('active');
  document.getElementById('addDriverForm').reset();
}

function toggleDriverStatus(driverId) {
  let drivers = getSampleDrivers();
  const driver = drivers.find(d => d.id === driverId);
  
  if (driver) {
    driver.status = driver.status === 'activo' ? 'inactivo' : 'activo';
    localStorage.setItem('drivers', JSON.stringify(drivers));
    loadDrivers();
    loadDashboardStats();
  }
}

function deleteDriver(driverId) {
  if (!confirm('Esta seguro de eliminar este conductor?')) return;
  
  let drivers = getSampleDrivers();
  drivers = drivers.filter(d => d.id !== driverId);
  localStorage.setItem('drivers', JSON.stringify(drivers));
  
  loadDrivers();
  loadDashboardStats();
}

// ========================================
// Modals
// ========================================
function initModals() {
  // Add Driver Form
  const addDriverForm = document.getElementById('addDriverForm');
  if (addDriverForm) {
    addDriverForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const drivers = getSampleDrivers();
      const newDriver = {
        id: 'DRV-' + String(drivers.length + 1).padStart(3, '0'),
        name: document.getElementById('driverName').value,
        phone: document.getElementById('driverPhone').value,
        email: document.getElementById('driverEmail').value,
        license: document.getElementById('driverLicense').value,
        vehicle: document.getElementById('driverVehicle').value,
        plate: document.getElementById('driverPlate').value,
        status: 'activo',
        rating: 5.0,
        totalTrips: 0,
        totalEarnings: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      drivers.push(newDriver);
      localStorage.setItem('drivers', JSON.stringify(drivers));
      
      closeAddDriverModal();
      loadDrivers();
      loadDashboardStats();
      alert('Conductor agregado exitosamente');
    });
  }
  
  // Edit Trip Form
  const editTripForm = document.getElementById('editTripForm');
  if (editTripForm) {
    editTripForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tripId = document.getElementById('editTripId').value;
      let trips = getSampleTrips();
      const tripIndex = trips.findIndex(t => t.id === tripId);
      
      if (tripIndex !== -1) {
        trips[tripIndex].status = document.getElementById('editTripStatus').value;
        trips[tripIndex].driverId = document.getElementById('editTripDriver').value || null;
        trips[tripIndex].price = parseFloat(document.getElementById('editTripPrice').value) || trips[tripIndex].price;
        trips[tripIndex].adminNotes = document.getElementById('editTripNotes').value;
        
        localStorage.setItem('trips', JSON.stringify(trips));
        closeEditTripModal();
        loadTrips();
        loadDashboardStats();
        alert('Viaje actualizado exitosamente');
      }
    });
  }
  
  // Modal overlays
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
      this.parentElement.classList.remove('active');
    });
  });
}

// ========================================
// BI (Business Intelligence)
// ========================================
function loadBIData() {
  const trips = getSampleTrips();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Monthly stats
  const monthlyTrips = trips.filter(t => {
    const tripDate = new Date(t.date);
    return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
  });
  
  const monthlyRevenue = monthlyTrips
    .filter(t => t.status === 'completado')
    .reduce((sum, t) => sum + t.price, 0);
  
  document.getElementById('monthlyRevenue').textContent = '$' + monthlyRevenue.toFixed(2);
  document.getElementById('monthlyTrips').textContent = monthlyTrips.length;
  
  // Average ticket
  const completedTrips = trips.filter(t => t.status === 'completado');
  const avgTicket = completedTrips.length > 0 
    ? completedTrips.reduce((sum, t) => sum + t.price, 0) / completedTrips.length 
    : 0;
  document.getElementById('avgTicket').textContent = '$' + avgTicket.toFixed(2);
  
  // Cancel rate
  const cancelledTrips = trips.filter(t => t.status === 'cancelado').length;
  const cancelRate = trips.length > 0 ? (cancelledTrips / trips.length * 100).toFixed(1) : 0;
  document.getElementById('cancelRate').textContent = cancelRate + '%';
  
  // Top destinations
  const destinations = {};
  trips.forEach(t => {
    destinations[t.destination] = (destinations[t.destination] || 0) + 1;
  });
  
  const topDestinations = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const destContainer = document.getElementById('topDestinations');
  if (destContainer) {
    destContainer.innerHTML = topDestinations.map(([dest, count], i) => `
      <div class="top-item">
        <span class="rank">${i + 1}</span>
        <span class="name">${dest}</span>
        <span class="count">${count} viajes</span>
      </div>
    `).join('') || '<p>No hay datos suficientes</p>';
  }
  
  // Service types chart (simple bars)
  const serviceTypes = {};
  trips.forEach(t => {
    const type = getServiceLabel(t.serviceType);
    serviceTypes[type] = (serviceTypes[type] || 0) + 1;
  });
  
  const serviceChart = document.getElementById('serviceChart');
  if (serviceChart) {
    const maxCount = Math.max(...Object.values(serviceTypes), 1);
    serviceChart.innerHTML = Object.entries(serviceTypes).map(([type, count]) => `
      <div class="bar-item">
        <span class="bar-label">${type}</span>
        <div class="bar-container">
          <div class="bar" style="width: ${(count / maxCount * 100)}%"></div>
        </div>
        <span class="bar-value">${count}</span>
      </div>
    `).join('') || '<p>No hay datos suficientes</p>';
  }
  
  // Peak hours
  const hours = {};
  trips.forEach(t => {
    const hour = t.time.split(':')[0];
    hours[hour] = (hours[hour] || 0) + 1;
  });
  
  const peakHours = Object.entries(hours)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const peakContainer = document.getElementById('peakHours');
  if (peakContainer) {
    peakContainer.innerHTML = peakHours.map(([hour, count]) => `
      <div class="top-item">
        <span class="name">${hour}:00 - ${hour}:59</span>
        <span class="count">${count} viajes</span>
      </div>
    `).join('') || '<p>No hay datos suficientes</p>';
  }
  
  // Revenue chart (simple bars by month)
  const revenueByMonth = {};
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  trips.filter(t => t.status === 'completado').forEach(t => {
    const month = new Date(t.date).getMonth();
    revenueByMonth[month] = (revenueByMonth[month] || 0) + t.price;
  });
  
  const revenueChart = document.getElementById('revenueChart');
  if (revenueChart) {
    const maxRevenue = Math.max(...Object.values(revenueByMonth), 1);
    revenueChart.innerHTML = months.map((month, i) => {
      const revenue = revenueByMonth[i] || 0;
      return `
        <div class="bar-item vertical">
          <div class="bar-container vertical">
            <div class="bar" style="height: ${revenue > 0 ? (revenue / maxRevenue * 100) : 5}%"></div>
          </div>
          <span class="bar-label">${month}</span>
        </div>
      `;
    }).join('');
  }
}

// ========================================
// Excel Export Functions
// ========================================
function exportTripsToExcel() {
  const trips = getSampleTrips();
  const drivers = getSampleDrivers();
  
  const data = trips.map(trip => ({
    'Codigo': trip.id,
    'Cliente': trip.name,
    'Telefono': trip.phone,
    'Origen': trip.origin,
    'Destino': trip.destination,
    'Fecha': trip.date,
    'Hora': trip.time,
    'Pasajeros': trip.passengers,
    'Tipo de Servicio': getServiceLabel(trip.serviceType),
    'Precio (USD)': trip.price,
    'Estado': getStatusLabel(trip.status),
    'Conductor': drivers.find(d => d.id === trip.driverId)?.name || 'Sin asignar'
  }));
  
  downloadExcel(data, 'Viajes_PacificCoastTaxi');
}

function exportDriversToExcel() {
  const drivers = getSampleDrivers();
  
  const data = drivers.map(driver => ({
    'ID': driver.id,
    'Nombre': driver.name,
    'Telefono': driver.phone,
    'Email': driver.email,
    'Licencia': driver.license,
    'Vehiculo': driver.vehicle,
    'Placa': driver.plate,
    'Estado': driver.status === 'activo' ? 'Activo' : 'Inactivo',
    'Calificacion': driver.rating,
    'Total Viajes': driver.totalTrips,
    'Ingresos Totales (USD)': driver.totalEarnings,
    'Fecha Registro': driver.createdAt
  }));
  
  downloadExcel(data, 'Conductores_PacificCoastTaxi');
}

function generateTripsReport() {
  const startDate = document.getElementById('tripStartDate').value;
  const endDate = document.getElementById('tripEndDate').value;
  let trips = getSampleTrips();
  const drivers = getSampleDrivers();
  
  // Filter by date range if provided
  if (startDate && endDate) {
    trips = trips.filter(t => t.date >= startDate && t.date <= endDate);
  }
  
  const data = trips.map(trip => ({
    'Codigo': trip.id,
    'Cliente': trip.name,
    'Telefono': trip.phone,
    'Origen': trip.origin,
    'Destino': trip.destination,
    'Fecha': trip.date,
    'Hora': trip.time,
    'Pasajeros': trip.passengers,
    'Tipo de Servicio': getServiceLabel(trip.serviceType),
    'Precio (USD)': trip.price,
    'Estado': getStatusLabel(trip.status),
    'Conductor': drivers.find(d => d.id === trip.driverId)?.name || 'Sin asignar',
    'Notas': trip.adminNotes || ''
  }));
  
  const filename = startDate && endDate 
    ? `Reporte_Viajes_${startDate}_a_${endDate}`
    : 'Reporte_Viajes_Completo';
  
  downloadExcel(data, filename);
}

function generateRevenueReport() {
  const startDate = document.getElementById('revenueStartDate').value;
  const endDate = document.getElementById('revenueEndDate').value;
  let trips = getSampleTrips().filter(t => t.status === 'completado');
  const drivers = getSampleDrivers();
  
  // Filter by date range if provided
  if (startDate && endDate) {
    trips = trips.filter(t => t.date >= startDate && t.date <= endDate);
  }
  
  // Group by date
  const revenueByDate = {};
  trips.forEach(t => {
    if (!revenueByDate[t.date]) {
      revenueByDate[t.date] = { count: 0, total: 0, byService: {}, byDriver: {} };
    }
    revenueByDate[t.date].count++;
    revenueByDate[t.date].total += t.price;
    
    // By service
    const service = getServiceLabel(t.serviceType);
    revenueByDate[t.date].byService[service] = (revenueByDate[t.date].byService[service] || 0) + t.price;
    
    // By driver
    const driverName = drivers.find(d => d.id === t.driverId)?.name || 'Sin asignar';
    revenueByDate[t.date].byDriver[driverName] = (revenueByDate[t.date].byDriver[driverName] || 0) + t.price;
  });
  
  // Daily summary
  const dailyData = Object.entries(revenueByDate).map(([date, data]) => ({
    'Fecha': date,
    'Total Viajes': data.count,
    'Ingresos (USD)': data.total.toFixed(2)
  }));
  
  // By service type
  const serviceData = {};
  trips.forEach(t => {
    const service = getServiceLabel(t.serviceType);
    if (!serviceData[service]) {
      serviceData[service] = { count: 0, total: 0 };
    }
    serviceData[service].count++;
    serviceData[service].total += t.price;
  });
  
  const serviceReport = Object.entries(serviceData).map(([service, data]) => ({
    'Tipo de Servicio': service,
    'Total Viajes': data.count,
    'Ingresos (USD)': data.total.toFixed(2)
  }));
  
  // By driver
  const driverData = {};
  trips.forEach(t => {
    const driverName = drivers.find(d => d.id === t.driverId)?.name || 'Sin asignar';
    if (!driverData[driverName]) {
      driverData[driverName] = { count: 0, total: 0 };
    }
    driverData[driverName].count++;
    driverData[driverName].total += t.price;
  });
  
  const driverReport = Object.entries(driverData).map(([driver, data]) => ({
    'Conductor': driver,
    'Total Viajes': data.count,
    'Ingresos (USD)': data.total.toFixed(2)
  }));
  
  // Total summary
  const totalRevenue = trips.reduce((sum, t) => sum + t.price, 0);
  const summaryData = [{
    'Concepto': 'TOTAL GENERAL',
    'Total Viajes': trips.length,
    'Ingresos (USD)': totalRevenue.toFixed(2)
  }];
  
  // Create workbook with multiple sheets
  const wb = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Resumen');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dailyData), 'Por Dia');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(serviceReport), 'Por Servicio');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(driverReport), 'Por Conductor');
  
  const filename = startDate && endDate 
    ? `Reporte_Ingresos_${startDate}_a_${endDate}.xlsx`
    : 'Reporte_Ingresos_Completo.xlsx';
  
  XLSX.writeFile(wb, filename);
}

function generateDriversReport() {
  const drivers = getSampleDrivers();
  const trips = getSampleTrips();
  
  const data = drivers.map(driver => {
    const driverTrips = trips.filter(t => t.driverId === driver.id);
    const completedTrips = driverTrips.filter(t => t.status === 'completado');
    const earnings = completedTrips.reduce((sum, t) => sum + t.price, 0);
    
    return {
      'ID': driver.id,
      'Nombre': driver.name,
      'Telefono': driver.phone,
      'Email': driver.email,
      'Licencia': driver.license,
      'Vehiculo': driver.vehicle,
      'Placa': driver.plate,
      'Estado': driver.status === 'activo' ? 'Activo' : 'Inactivo',
      'Calificacion Promedio': driver.rating,
      'Total Viajes Asignados': driverTrips.length,
      'Viajes Completados': completedTrips.length,
      'Ingresos Generados (USD)': earnings.toFixed(2),
      'Fecha Registro': driver.createdAt
    };
  });
  
  downloadExcel(data, 'Reporte_Conductores_PacificCoastTaxi');
}

function generateReviewsReport() {
  const reviews = getSampleReviews();
  
  const data = reviews.map(review => ({
    'Fecha': review.date,
    'Cliente': review.userName,
    'Calificacion': review.rating,
    'Comentario': review.comment
  }));
  
  // Summary
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : 0;
  
  const summaryData = [{
    'Total Resenas': reviews.length,
    'Calificacion Promedio': avgRating,
    '5 Estrellas': reviews.filter(r => r.rating === 5).length,
    '4 Estrellas': reviews.filter(r => r.rating === 4).length,
    '3 Estrellas': reviews.filter(r => r.rating === 3).length,
    '2 Estrellas': reviews.filter(r => r.rating === 2).length,
    '1 Estrella': reviews.filter(r => r.rating === 1).length
  }];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Resumen');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Detalle Resenas');
  
  XLSX.writeFile(wb, 'Reporte_Resenas_PacificCoastTaxi.xlsx');
}

function generateBIReport() {
  const startDate = document.getElementById('biStartDate').value;
  const endDate = document.getElementById('biEndDate').value;
  
  let trips = getSampleTrips();
  const drivers = getSampleDrivers();
  const reviews = getSampleReviews();
  
  // Filter by date range if provided
  if (startDate && endDate) {
    trips = trips.filter(t => t.date >= startDate && t.date <= endDate);
  }
  
  const completedTrips = trips.filter(t => t.status === 'completado');
  const totalRevenue = completedTrips.reduce((sum, t) => sum + t.price, 0);
  const avgTicket = completedTrips.length > 0 ? totalRevenue / completedTrips.length : 0;
  const cancelRate = trips.length > 0 ? (trips.filter(t => t.status === 'cancelado').length / trips.length * 100) : 0;
  
  // KPIs
  const kpisData = [{
    'KPI': 'Total de Viajes',
    'Valor': trips.length
  }, {
    'KPI': 'Viajes Completados',
    'Valor': completedTrips.length
  }, {
    'KPI': 'Ingresos Totales (USD)',
    'Valor': totalRevenue.toFixed(2)
  }, {
    'KPI': 'Ticket Promedio (USD)',
    'Valor': avgTicket.toFixed(2)
  }, {
    'KPI': 'Tasa de Cancelacion (%)',
    'Valor': cancelRate.toFixed(2)
  }, {
    'KPI': 'Conductores Activos',
    'Valor': drivers.filter(d => d.status === 'activo').length
  }, {
    'KPI': 'Calificacion Promedio',
    'Valor': reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : 'N/A'
  }];
  
  // Revenue by service type
  const serviceData = {};
  completedTrips.forEach(t => {
    const service = getServiceLabel(t.serviceType);
    if (!serviceData[service]) {
      serviceData[service] = { count: 0, revenue: 0 };
    }
    serviceData[service].count++;
    serviceData[service].revenue += t.price;
  });
  
  const serviceReport = Object.entries(serviceData).map(([service, data]) => ({
    'Tipo de Servicio': service,
    'Cantidad de Viajes': data.count,
    'Porcentaje de Viajes (%)': ((data.count / completedTrips.length) * 100).toFixed(2),
    'Ingresos (USD)': data.revenue.toFixed(2),
    'Porcentaje de Ingresos (%)': ((data.revenue / totalRevenue) * 100).toFixed(2)
  }));
  
  // Top destinations
  const destinations = {};
  trips.forEach(t => {
    destinations[t.destination] = (destinations[t.destination] || 0) + 1;
  });
  
  const topDestinations = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([dest, count], i) => ({
      'Posicion': i + 1,
      'Destino': dest,
      'Cantidad de Viajes': count,
      'Porcentaje (%)': ((count / trips.length) * 100).toFixed(2)
    }));
  
  // Driver performance
  const driverPerformance = drivers.map(driver => {
    const driverTrips = trips.filter(t => t.driverId === driver.id);
    const driverCompleted = driverTrips.filter(t => t.status === 'completado');
    const driverRevenue = driverCompleted.reduce((sum, t) => sum + t.price, 0);
    
    return {
      'Conductor': driver.name,
      'Viajes Asignados': driverTrips.length,
      'Viajes Completados': driverCompleted.length,
      'Tasa de Completado (%)': driverTrips.length > 0 ? ((driverCompleted.length / driverTrips.length) * 100).toFixed(2) : '0.00',
      'Ingresos Generados (USD)': driverRevenue.toFixed(2),
      'Calificacion': driver.rating
    };
  });
  
  // Peak hours analysis
  const hours = {};
  trips.forEach(t => {
    const hour = parseInt(t.time.split(':')[0]);
    hours[hour] = (hours[hour] || 0) + 1;
  });
  
  const hoursReport = Object.entries(hours)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([hour, count]) => ({
      'Hora': `${hour}:00 - ${hour}:59`,
      'Cantidad de Viajes': count,
      'Porcentaje (%)': ((count / trips.length) * 100).toFixed(2)
    }));
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpisData), 'KPIs Principales');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(serviceReport), 'Por Tipo Servicio');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topDestinations), 'Top Destinos');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(driverPerformance), 'Rendimiento Conductores');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hoursReport), 'Analisis Horarios');
  
  const filename = startDate && endDate 
    ? `Reporte_BI_${startDate}_a_${endDate}.xlsx`
    : 'Reporte_Inteligencia_Negocio_Completo.xlsx';
  
  XLSX.writeFile(wb, filename);
}

// Helper function to download Excel
function downloadExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, filename + '.xlsx');
}

// ========================================
// Utility Functions
// ========================================
function getStatusLabel(status) {
  const labels = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_curso': 'En Curso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  };
  return labels[status] || status;
}

function getServiceLabel(serviceType) {
  const labels = {
    'local': 'Traslado Local',
    'turistico': 'Servicio Turistico',
    'interdepartamental': 'Viaje Interdepartamental',
    'programada': 'Recogida Programada'
  };
  return labels[serviceType] || serviceType;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function initDateRanges() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
  
  // Set default date ranges
  const dateInputs = [
    'tripStartDate', 'tripEndDate',
    'revenueStartDate', 'revenueEndDate',
    'biStartDate', 'biEndDate'
  ];
  
  dateInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      if (id.includes('Start')) {
        input.value = firstDayStr;
      } else {
        input.value = todayStr;
      }
    }
  });
}

function initCurrentYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
