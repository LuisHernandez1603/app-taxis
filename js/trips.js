// ========================================
// Trips Page JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initBookingForm();
  initServiceFromURL();
  loadMyTrips();
  initCurrentYear();
});

// ========================================
// Tabs
// ========================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update content
      tabContents.forEach(content => content.classList.remove('active'));
      
      if (tabId === 'book') {
        document.getElementById('bookTab').classList.add('active');
      } else if (tabId === 'my-trips') {
        document.getElementById('myTripsTab').classList.add('active');
        loadMyTrips();
      }
      
      // Hide confirmation view when switching tabs
      document.getElementById('confirmationView').style.display = 'none';
      document.getElementById('tabsContainer').style.display = 'flex';
      document.getElementById('pageTitle').textContent = 'Centro de Viajes';
      document.getElementById('pageSubtitle').textContent = 'Reserva un nuevo viaje o consulta tus viajes anteriores.';
    });
  });
}

// ========================================
// Booking Form
// ========================================
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const serviceTypeSelect = document.getElementById('serviceType');
  
  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
  
  // Calculate price on input change
  [originInput, destinationInput, serviceTypeSelect].forEach(input => {
    if (input) {
      input.addEventListener('change', calculateEstimatedPrice);
    }
  });
  
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }
}

function calculateEstimatedPrice() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const serviceType = document.getElementById('serviceType').value;
  
  if (!origin || !destination) {
    document.getElementById('baseFare').textContent = '$0.00';
    document.getElementById('distance').textContent = '-- km';
    document.getElementById('totalPrice').textContent = '$0.00 USD';
    return;
  }
  
  // Simulated pricing based on service type
  const baseFares = {
    'local': 5,
    'turistico': 15,
    'interdepartamental': 25,
    'programada': 10
  };
  
  const distances = {
    'local': Math.floor(Math.random() * 10) + 2,
    'turistico': Math.floor(Math.random() * 30) + 10,
    'interdepartamental': Math.floor(Math.random() * 100) + 50,
    'programada': Math.floor(Math.random() * 20) + 5
  };
  
  const baseFare = baseFares[serviceType] || 10;
  const distance = distances[serviceType];
  const pricePerKm = 0.5;
  const total = baseFare + (distance * pricePerKm);
  
  document.getElementById('baseFare').textContent = '$' + baseFare.toFixed(2);
  document.getElementById('distance').textContent = distance + ' km';
  document.getElementById('totalPrice').textContent = '$' + total.toFixed(2) + ' USD';
}

function handleBookingSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const trip = {
    id: 'trip_' + Date.now(),
    confirmationCode: generateConfirmationCode(),
    name: formData.get('name'),
    phone: formData.get('phone'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    date: formData.get('date'),
    time: formData.get('time'),
    passengers: formData.get('passengers'),
    serviceType: formData.get('serviceType'),
    notes: formData.get('notes'),
    price: document.getElementById('totalPrice').textContent,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Save trip to localStorage
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  trips.unshift(trip);
  localStorage.setItem('trips', JSON.stringify(trips));
  
  // Save user info
  localStorage.setItem('userName', trip.name);
  localStorage.setItem('userPhone', trip.phone);
  
  // Show confirmation
  showConfirmation(trip);
}

function generateConfirmationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PCT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function showConfirmation(trip) {
  // Hide tabs and form
  document.getElementById('tabsContainer').style.display = 'none';
  document.getElementById('bookTab').classList.remove('active');
  document.getElementById('myTripsTab').classList.remove('active');
  
  // Update page title
  document.getElementById('pageTitle').textContent = 'Viaje Reservado';
  document.getElementById('pageSubtitle').textContent = 'Tu viaje ha sido confirmado. Revisa los detalles a continuacion.';
  
  // Fill confirmation details
  document.getElementById('confirmationCode').textContent = trip.confirmationCode;
  document.getElementById('confOrigin').textContent = trip.origin;
  document.getElementById('confDestination').textContent = trip.destination;
  document.getElementById('confDate').textContent = formatDate(trip.date);
  document.getElementById('confTime').textContent = trip.time;
  document.getElementById('confPassengers').textContent = trip.passengers + ' pasajero(s)';
  document.getElementById('confService').textContent = getServiceLabel(trip.serviceType);
  document.getElementById('confName').textContent = trip.name;
  document.getElementById('confPhone').textContent = trip.phone;
  document.getElementById('confPrice').textContent = trip.price;
  
  // Show confirmation view
  document.getElementById('confirmationView').style.display = 'block';
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', options);
}

// ========================================
// My Trips
// ========================================
function loadMyTrips() {
  const tripsList = document.getElementById('tripsList');
  const noTrips = document.getElementById('noTrips');
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  
  if (!tripsList) return;
  
  if (trips.length === 0) {
    tripsList.innerHTML = '';
    if (noTrips) noTrips.style.display = 'block';
    return;
  }
  
  if (noTrips) noTrips.style.display = 'none';
  
  tripsList.innerHTML = trips.map(trip => `
    <div class="trip-card">
      <div class="trip-card-header">
        <span class="trip-code">${trip.confirmationCode}</span>
        <span class="trip-status ${trip.status}">${getStatusLabel(trip.status)}</span>
      </div>
      <div class="trip-card-body">
        <div class="trip-route">
          <div class="trip-location">
            <span>Origen</span>
            <strong>${trip.origin}</strong>
          </div>
          <div class="trip-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div class="trip-location">
            <span>Destino</span>
            <strong>${trip.destination}</strong>
          </div>
        </div>
        <div class="trip-details">
          <div class="trip-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${formatDate(trip.date)}
          </div>
          <div class="trip-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${trip.time}
          </div>
          <div class="trip-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            ${trip.passengers} pasajero(s)
          </div>
          <div class="trip-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            ${trip.price}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getStatusLabel(status) {
  const labels = {
    'confirmed': 'Confirmado',
    'pending': 'Pendiente',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  };
  return labels[status] || status;
}

// ========================================
// Service from URL
// ========================================
function initServiceFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get('service');
  
  if (service) {
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect) {
      serviceSelect.value = service;
    }
  }
}

// ========================================
// Navigation Functions
// ========================================
function newTrip() {
  // Reset form
  document.getElementById('bookingForm').reset();
  
  // Reset price
  document.getElementById('baseFare').textContent = '$0.00';
  document.getElementById('distance').textContent = '-- km';
  document.getElementById('totalPrice').textContent = '$0.00 USD';
  
  // Set date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  
  // Show form
  document.getElementById('confirmationView').style.display = 'none';
  document.getElementById('tabsContainer').style.display = 'flex';
  document.getElementById('bookTab').classList.add('active');
  document.getElementById('pageTitle').textContent = 'Centro de Viajes';
  document.getElementById('pageSubtitle').textContent = 'Reserva un nuevo viaje o consulta tus viajes anteriores.';
  
  // Set active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'book');
  });
}

function viewMyTrips() {
  document.getElementById('confirmationView').style.display = 'none';
  document.getElementById('tabsContainer').style.display = 'flex';
  document.getElementById('bookTab').classList.remove('active');
  document.getElementById('myTripsTab').classList.add('active');
  document.getElementById('pageTitle').textContent = 'Centro de Viajes';
  document.getElementById('pageSubtitle').textContent = 'Reserva un nuevo viaje o consulta tus viajes anteriores.';
  
  // Set active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'my-trips');
  });
  
  loadMyTrips();
}

function switchToBookTab() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'book');
  });
  document.getElementById('bookTab').classList.add('active');
  document.getElementById('myTripsTab').classList.remove('active');
}

// ========================================
// Current Year
// ========================================
function initCurrentYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
