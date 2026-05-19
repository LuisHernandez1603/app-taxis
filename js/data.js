/**
 * ========================================
 * PACIFIC COAST TAXI - DATA LAYER
 * ========================================
 * Capa de datos y almacenamiento
 * Usa LocalStorage para persistencia
 * Exporta a Excel para reportes
 * ========================================
 */

const DataStore = {
  // Keys for localStorage
  KEYS: {
    TRIPS: 'pct_trips',
    DRIVERS: 'pct_drivers',
    CLIENTS: 'pct_clients',
    REVIEWS: 'pct_reviews',
    SETTINGS: 'pct_settings',
    USER: 'pct_user'
  },

  // Initialize with demo data if empty
  init() {
    if (!this.get(this.KEYS.TRIPS)) {
      this.set(this.KEYS.TRIPS, this.generateDemoTrips());
    }
    if (!this.get(this.KEYS.DRIVERS)) {
      this.set(this.KEYS.DRIVERS, this.generateDemoDrivers());
    }
    if (!this.get(this.KEYS.CLIENTS)) {
      this.set(this.KEYS.CLIENTS, this.generateDemoClients());
    }
    if (!this.get(this.KEYS.REVIEWS)) {
      this.set(this.KEYS.REVIEWS, this.generateDemoReviews());
    }
  },

  // Basic CRUD operations
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  },

  // Generate unique ID
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Generate trip code
  generateTripCode() {
    const prefix = 'PCT';
    const number = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${number}`;
  },

  // Demo data generators
  generateDemoTrips() {
    const statuses = ['pendiente', 'confirmado', 'en_curso', 'completado', 'cancelado'];
    const services = ['Estandar', 'Premium', 'Aeropuerto', 'Tour'];
    const origins = ['Managua Centro', 'Aeropuerto MGA', 'Masaya', 'Granada', 'Leon'];
    const destinations = ['San Juan del Sur', 'Playa Maderas', 'Granada', 'Managua', 'Leon'];
    
    const trips = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const basePrice = 500 + Math.floor(Math.random() * 2500);
      
      trips.push({
        id: this.generateId(),
        code: this.generateTripCode(),
        clientId: `client_${Math.floor(Math.random() * 10) + 1}`,
        clientName: `Cliente ${Math.floor(Math.random() * 10) + 1}`,
        clientPhone: `+505 ${Math.floor(8000 + Math.random() * 2000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        driverId: `driver_${Math.floor(Math.random() * 5) + 1}`,
        driverName: ['Carlos M.', 'Juan P.', 'Pedro R.', 'Miguel A.', 'Roberto S.'][Math.floor(Math.random() * 5)],
        origin: origins[Math.floor(Math.random() * origins.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        date: date.toISOString(),
        service: services[Math.floor(Math.random() * services.length)],
        passengers: Math.floor(1 + Math.random() * 4),
        status: status,
        price: basePrice,
        commission: Math.floor(basePrice * 0.15),
        paymentMethod: Math.random() > 0.5 ? 'Efectivo' : 'Transferencia',
        notes: '',
        createdAt: date.toISOString()
      });
    }
    
    return trips.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  generateDemoDrivers() {
    const drivers = [
      { name: 'Carlos Martinez', phone: '+505 8845-1234', vehicle: 'Toyota Corolla 2020', plate: 'M-123456' },
      { name: 'Juan Perez', phone: '+505 8756-5678', vehicle: 'Honda Civic 2019', plate: 'M-234567' },
      { name: 'Pedro Rodriguez', phone: '+505 8867-9012', vehicle: 'Nissan Sentra 2021', plate: 'M-345678' },
      { name: 'Miguel Alvarez', phone: '+505 8978-3456', vehicle: 'Hyundai Elantra 2020', plate: 'M-456789' },
      { name: 'Roberto Sanchez', phone: '+505 8089-7890', vehicle: 'Toyota Yaris 2022', plate: 'M-567890' }
    ];

    return drivers.map((driver, index) => ({
      id: `driver_${index + 1}`,
      ...driver,
      email: driver.name.toLowerCase().replace(' ', '.') + '@email.com',
      status: index < 3 ? 'activo' : 'inactivo',
      rating: (4 + Math.random()).toFixed(1),
      totalTrips: Math.floor(50 + Math.random() * 200),
      totalEarnings: Math.floor(50000 + Math.random() * 150000),
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentsVerified: true,
      photo: null
    }));
  },

  generateDemoClients() {
    const names = ['Maria Garcia', 'Jose Lopez', 'Ana Martinez', 'Luis Hernandez', 'Carmen Diaz',
                   'Francisco Torres', 'Rosa Morales', 'Jorge Castillo', 'Elena Vargas', 'Pablo Mendez'];
    
    return names.map((name, index) => ({
      id: `client_${index + 1}`,
      name: name,
      email: name.toLowerCase().replace(' ', '.') + '@email.com',
      phone: `+505 ${Math.floor(8000 + Math.random() * 2000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      totalTrips: Math.floor(1 + Math.random() * 20),
      totalSpent: Math.floor(1000 + Math.random() * 50000),
      lastTrip: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'activo'
    }));
  },

  generateDemoReviews() {
    const comments = [
      'Excelente servicio, muy puntual',
      'Conductor muy amable y profesional',
      'Buen viaje, vehiculo limpio',
      'Todo perfecto, lo recomiendo',
      'Muy buen servicio, gracias'
    ];

    const reviews = [];
    for (let i = 0; i < 20; i++) {
      reviews.push({
        id: this.generateId(),
        tripId: `trip_${i + 1}`,
        clientId: `client_${Math.floor(Math.random() * 10) + 1}`,
        clientName: `Cliente ${Math.floor(Math.random() * 10) + 1}`,
        driverId: `driver_${Math.floor(Math.random() * 5) + 1}`,
        driverName: ['Carlos M.', 'Juan P.', 'Pedro R.', 'Miguel A.', 'Roberto S.'][Math.floor(Math.random() * 5)],
        rating: Math.floor(3 + Math.random() * 3),
        comment: comments[Math.floor(Math.random() * comments.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    return reviews;
  },

  // TRIPS CRUD
  getTrips(filters = {}) {
    let trips = this.get(this.KEYS.TRIPS) || [];
    
    if (filters.status && filters.status !== 'all') {
      trips = trips.filter(t => t.status === filters.status);
    }
    if (filters.driverId) {
      trips = trips.filter(t => t.driverId === filters.driverId);
    }
    if (filters.dateFrom) {
      trips = trips.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      trips = trips.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      trips = trips.filter(t => 
        t.code.toLowerCase().includes(search) ||
        t.clientName.toLowerCase().includes(search) ||
        t.driverName.toLowerCase().includes(search)
      );
    }
    
    return trips;
  },

  addTrip(trip) {
    const trips = this.get(this.KEYS.TRIPS) || [];
    const newTrip = {
      id: this.generateId(),
      code: this.generateTripCode(),
      ...trip,
      createdAt: new Date().toISOString()
    };
    trips.unshift(newTrip);
    this.set(this.KEYS.TRIPS, trips);
    return newTrip;
  },

  updateTrip(id, updates) {
    const trips = this.get(this.KEYS.TRIPS) || [];
    const index = trips.findIndex(t => t.id === id);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates, updatedAt: new Date().toISOString() };
      this.set(this.KEYS.TRIPS, trips);
      return trips[index];
    }
    return null;
  },

  deleteTrip(id) {
    const trips = this.get(this.KEYS.TRIPS) || [];
    const filtered = trips.filter(t => t.id !== id);
    this.set(this.KEYS.TRIPS, filtered);
    return true;
  },

  // DRIVERS CRUD
  getDrivers(filters = {}) {
    let drivers = this.get(this.KEYS.DRIVERS) || [];
    
    if (filters.status && filters.status !== 'all') {
      drivers = drivers.filter(d => d.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      drivers = drivers.filter(d => 
        d.name.toLowerCase().includes(search) ||
        d.phone.includes(search) ||
        d.plate.toLowerCase().includes(search)
      );
    }
    
    return drivers;
  },

  addDriver(driver) {
    const drivers = this.get(this.KEYS.DRIVERS) || [];
    const newDriver = {
      id: this.generateId(),
      ...driver,
      status: 'activo',
      rating: 5.0,
      totalTrips: 0,
      totalEarnings: 0,
      joinedAt: new Date().toISOString()
    };
    drivers.push(newDriver);
    this.set(this.KEYS.DRIVERS, drivers);
    return newDriver;
  },

  updateDriver(id, updates) {
    const drivers = this.get(this.KEYS.DRIVERS) || [];
    const index = drivers.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers[index] = { ...drivers[index], ...updates };
      this.set(this.KEYS.DRIVERS, drivers);
      return drivers[index];
    }
    return null;
  },

  deleteDriver(id) {
    const drivers = this.get(this.KEYS.DRIVERS) || [];
    const filtered = drivers.filter(d => d.id !== id);
    this.set(this.KEYS.DRIVERS, filtered);
    return true;
  },

  // CLIENTS CRUD  
  getClients(filters = {}) {
    let clients = this.get(this.KEYS.CLIENTS) || [];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      clients = clients.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }
    
    return clients;
  },

  // REVIEWS
  getReviews() {
    return this.get(this.KEYS.REVIEWS) || [];
  },

  // ANALYTICS
  getStats() {
    const trips = this.getTrips();
    const drivers = this.getDrivers();
    const clients = this.getClients();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTrips = trips.filter(t => new Date(t.date) >= today);
    const completedTrips = trips.filter(t => t.status === 'completado');
    const activeTrips = trips.filter(t => t.status === 'en_curso');
    const pendingTrips = trips.filter(t => t.status === 'pendiente');
    
    const totalRevenue = completedTrips.reduce((sum, t) => sum + t.price, 0);
    const todayRevenue = todayTrips.filter(t => t.status === 'completado').reduce((sum, t) => sum + t.price, 0);
    
    const activeDrivers = drivers.filter(d => d.status === 'activo');
    
    // Calculate trends (compare to previous period)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const thisWeekTrips = trips.filter(t => new Date(t.date) >= weekAgo);
    const lastWeekTrips = trips.filter(t => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < weekAgo);
    
    const tripsTrend = lastWeekTrips.length > 0 
      ? ((thisWeekTrips.length - lastWeekTrips.length) / lastWeekTrips.length * 100).toFixed(1)
      : 0;
    
    const thisWeekRevenue = thisWeekTrips.filter(t => t.status === 'completado').reduce((sum, t) => sum + t.price, 0);
    const lastWeekRevenue = lastWeekTrips.filter(t => t.status === 'completado').reduce((sum, t) => sum + t.price, 0);
    
    const revenueTrend = lastWeekRevenue > 0
      ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue * 100).toFixed(1)
      : 0;

    return {
      totalTrips: trips.length,
      todayTrips: todayTrips.length,
      completedTrips: completedTrips.length,
      activeTrips: activeTrips.length,
      pendingTrips: pendingTrips.length,
      cancelledTrips: trips.filter(t => t.status === 'cancelado').length,
      totalRevenue,
      todayRevenue,
      totalDrivers: drivers.length,
      activeDrivers: activeDrivers.length,
      totalClients: clients.length,
      avgRating: (drivers.reduce((sum, d) => sum + parseFloat(d.rating), 0) / drivers.length).toFixed(1),
      tripsTrend: parseFloat(tripsTrend),
      revenueTrend: parseFloat(revenueTrend)
    };
  },

  // Get revenue by period (for charts)
  getRevenueByPeriod(period = 'week') {
    const trips = this.getTrips();
    const completed = trips.filter(t => t.status === 'completado');
    
    const data = {};
    const now = new Date();
    
    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('es', { weekday: 'short' });
        data[key] = 0;
      }
      
      completed.forEach(trip => {
        const tripDate = new Date(trip.date);
        const daysDiff = Math.floor((now - tripDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff <= 6) {
          const key = tripDate.toLocaleDateString('es', { weekday: 'short' });
          if (data[key] !== undefined) {
            data[key] += trip.price;
          }
        }
      });
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.getDate().toString();
        data[key] = 0;
      }
      
      completed.forEach(trip => {
        const tripDate = new Date(trip.date);
        const daysDiff = Math.floor((now - tripDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff <= 29) {
          const key = tripDate.getDate().toString();
          if (data[key] !== undefined) {
            data[key] += trip.price;
          }
        }
      });
    }
    
    return data;
  },

  // Get trips by service type
  getTripsByService() {
    const trips = this.getTrips();
    const data = {};
    
    trips.forEach(trip => {
      if (!data[trip.service]) {
        data[trip.service] = 0;
      }
      data[trip.service]++;
    });
    
    return data;
  },

  // Get top destinations
  getTopDestinations(limit = 5) {
    const trips = this.getTrips();
    const data = {};
    
    trips.forEach(trip => {
      if (!data[trip.destination]) {
        data[trip.destination] = 0;
      }
      data[trip.destination]++;
    });
    
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  },

  // Get recent activity
  getRecentActivity(limit = 10) {
    const trips = this.getTrips();
    
    return trips
      .slice(0, limit)
      .map(trip => ({
        id: trip.id,
        type: 'trip',
        title: `Viaje ${trip.code}`,
        description: `${trip.origin} → ${trip.destination}`,
        status: trip.status,
        time: trip.date,
        driver: trip.driverName,
        client: trip.clientName,
        amount: trip.price
      }));
  }
};

// Initialize data store
DataStore.init();

// Export for use in other modules
window.DataStore = DataStore;
