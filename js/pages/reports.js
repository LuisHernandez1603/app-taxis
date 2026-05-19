// ============================================
// REPORTS & BI PAGE MODULE
// ============================================

class ReportsManager {
  constructor() {
    this.data = {};
    this.init();
  }

  init() {
    this.loadData();
    this.renderKPIs();
    this.renderCharts();
    this.renderSummary();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Auto-set date ranges to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input, index) => {
      if (input.id.includes('StartDate')) {
        input.valueAsDate = firstDay;
      } else if (input.id.includes('EndDate')) {
        input.valueAsDate = lastDay;
      }
    });
  }

  loadData() {
    this.data = DataManager.loadData();
  }

  renderKPIs() {
    const trips = this.data.trips || [];
    const drivers = this.data.drivers || [];
    const clients = this.data.clients || [];

    const totalRevenue = trips.reduce((sum, t) => sum + (t.fare || 0), 0);
    const avgFare = trips.length > 0 ? totalRevenue / trips.length : 0;
    const activeDrivers = drivers.filter(d => d.status === 'activo').length;
    const utilization = activeDrivers > 0 ? (trips.length / (activeDrivers * 10)) * 100 : 0;

    document.getElementById('biTotalRevenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('biGrowth').textContent = '12.5%';
    document.getElementById('biAvgFare').textContent = '$' + avgFare.toFixed(2);
    document.getElementById('biUtilization').textContent = Math.min(100, Math.round(utilization)) + '%';
  }

  renderCharts() {
    this.renderRevenueChart();
    this.renderTripsChart();
    this.renderTopDestinations();
    this.renderTopDrivers();
  }

  renderRevenueChart() {
    const trips = this.data.trips || [];
    const last7Days = this.getLast7Days();
    const revenueByDay = {};

    last7Days.forEach(date => {
      revenueByDay[date] = 0;
    });

    trips.forEach(trip => {
      if (revenueByDay[trip.date] !== undefined) {
        revenueByDay[trip.date] += trip.fare || 0;
      }
    });

    const maxRevenue = Math.max(...Object.values(revenueByDay), 1);
    const svg = document.getElementById('revenueChart');
    svg.innerHTML = this.generateBarChart(revenueByDay, last7Days, maxRevenue, 'vertical');
  }

  renderTripsChart() {
    const trips = this.data.trips || [];
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
    const tripsByHour = {};

    hours.forEach(hour => {
      tripsByHour[hour] = 0;
    });

    trips.forEach(trip => {
      const hour = trip.time ? trip.time.split(':')[0].toString().padStart(2, '0') + ':00' : '00:00';
      if (tripsByHour[hour] !== undefined) {
        tripsByHour[hour]++;
      }
    });

    const maxTrips = Math.max(...Object.values(tripsByHour), 1);
    const svg = document.getElementById('tripsChart');
    svg.innerHTML = this.generateBarChart(tripsByHour, hours, maxTrips, 'vertical');
  }

  renderTopDestinations() {
    const trips = this.data.trips || [];
    const destinations = {};

    trips.forEach(trip => {
      destinations[trip.destination] = (destinations[trip.destination] || 0) + 1;
    });

    const sorted = Object.entries(destinations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const html = sorted.map((item, index) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 1.5rem; height: 1.5rem; background-color: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">${index + 1}</div>
          <span>${item[0]}</span>
        </div>
        <span style="font-weight: 600; color: var(--primary);">${item[1]} viajes</span>
      </div>
    `).join('');

    document.getElementById('topDestinations').innerHTML = html || '<p style="color: var(--muted);">Sin datos disponibles</p>';
  }

  renderTopDrivers() {
    const trips = this.data.trips || [];
    const drivers = this.data.drivers || [];
    const driverRevenue = {};

    trips.forEach(trip => {
      driverRevenue[trip.driverName] = (driverRevenue[trip.driverName] || 0) + (trip.fare || 0);
    });

    const sorted = Object.entries(driverRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const html = sorted.map((item, index) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 1.5rem; height: 1.5rem; background-color: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">${index + 1}</div>
          <span>${item[0]}</span>
        </div>
        <span style="font-weight: 600; color: var(--primary);">$${item[1].toFixed(2)}</span>
      </div>
    `).join('');

    document.getElementById('topDrivers').innerHTML = html || '<p style="color: var(--muted);">Sin datos disponibles</p>';
  }

  renderSummary() {
    const trips = this.data.trips || [];
    const drivers = this.data.drivers || [];
    const clients = this.data.clients || [];

    const totalRevenue = trips.reduce((sum, t) => sum + (t.fare || 0), 0);
    const avgFare = trips.length > 0 ? totalRevenue / trips.length : 0;
    const activeClients = clients.filter(c => c.active).length;
    const activeDrivers = drivers.filter(d => d.status === 'activo').length;

    document.getElementById('summary-revenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('summary-revenue-prev').textContent = '$' + (totalRevenue * 0.85).toFixed(2);
    document.getElementById('summary-revenue-var').textContent = '17.6%';

    document.getElementById('summary-trips').textContent = trips.length;
    document.getElementById('summary-trips-prev').textContent = Math.round(trips.length * 0.88);
    document.getElementById('summary-trips-var').textContent = '13.6%';

    document.getElementById('summary-clients').textContent = activeClients;
    document.getElementById('summary-clients-prev').textContent = Math.round(activeClients * 0.92);
    document.getElementById('summary-clients-var').textContent = '8.7%';

    document.getElementById('summary-drivers').textContent = activeDrivers;
    document.getElementById('summary-drivers-prev').textContent = Math.round(activeDrivers * 0.95);
    document.getElementById('summary-drivers-var').textContent = '5.3%';

    document.getElementById('summary-avg-fare').textContent = '$' + avgFare.toFixed(2);
    document.getElementById('summary-avg-fare-prev').textContent = '$' + (avgFare * 0.95).toFixed(2);
    document.getElementById('summary-avg-fare-var').textContent = '5.3%';
  }

  getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }

  generateBarChart(data, labels, max, type = 'vertical') {
    const chartHeight = 200;
    const chartWidth = 600;
    const barWidth = chartWidth / labels.length - 5;
    const padding = 40;

    let svg = `<svg viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">`;

    labels.forEach((label, index) => {
      const value = data[label] || 0;
      const barHeight = (value / max) * (chartHeight - padding);
      const x = (index * (barWidth + 5)) + 20;
      const y = chartHeight - barHeight - 20;

      // Barra
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="var(--primary)" rx="3"/>`;

      // Label
      svg += `<text x="${x + barWidth / 2}" y="${chartHeight - 5}" text-anchor="middle" font-size="11" fill="var(--muted)">${label}</text>`;
    });

    svg += `</svg>`;
    return svg;
  }
}

// Funciones globales de exportación
function exportTripsReport() {
  const startDate = document.getElementById('tripsStartDate').value;
  const endDate = document.getElementById('tripsEndDate').value;
  ExcelExporter.exportTripsReport(startDate, endDate);
}

function exportRevenueReport() {
  const startDate = document.getElementById('revenueStartDate').value;
  const endDate = document.getElementById('revenueEndDate').value;
  ExcelExporter.exportRevenueReport(startDate, endDate);
}

function exportDriversReport() {
  const startDate = document.getElementById('driversStartDate').value;
  const endDate = document.getElementById('driversEndDate').value;
  ExcelExporter.exportDriversReport(startDate, endDate);
}

function exportClientsReport() {
  const startDate = document.getElementById('clientsStartDate').value;
  const endDate = document.getElementById('clientsEndDate').value;
  ExcelExporter.exportClientsReport(startDate, endDate);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.reportsManager = new ReportsManager();
});
