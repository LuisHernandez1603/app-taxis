/**
 * ========================================
 * PACIFIC COAST TAXI - EXCEL EXPORT
 * ========================================
 * Modulo para exportacion de reportes a Excel
 * Usa SheetJS (xlsx) para generar archivos
 * ========================================
 */

const ExcelExport = {
  // Load SheetJS library dynamically
  async loadLibrary() {
    if (window.XLSX) return window.XLSX;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      script.onload = () => resolve(window.XLSX);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Export trips report
  async exportTrips(filters = {}) {
    const XLSX = await this.loadLibrary();
    const trips = DataStore.getTrips(filters);
    
    const data = trips.map(trip => ({
      'Codigo': trip.code,
      'Fecha': Utils.formatDateTime(trip.date),
      'Cliente': trip.clientName,
      'Telefono': trip.clientPhone,
      'Conductor': trip.driverName,
      'Origen': trip.origin,
      'Destino': trip.destination,
      'Servicio': trip.service,
      'Pasajeros': trip.passengers,
      'Estado': trip.status,
      'Precio (C$)': trip.price,
      'Comision (C$)': trip.commission,
      'Metodo Pago': trip.paymentMethod
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Viajes');
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    const fileName = `Viajes_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Utils.showToast(`Reporte exportado: ${fileName}`, 'success');
    return fileName;
  },

  // Export revenue report
  async exportRevenue(dateFrom, dateTo) {
    const XLSX = await this.loadLibrary();
    const trips = DataStore.getTrips({ dateFrom, dateTo });
    const completed = trips.filter(t => t.status === 'completado');
    
    // Summary sheet
    const summary = [{
      'Periodo': `${Utils.formatDate(dateFrom)} - ${Utils.formatDate(dateTo)}`,
      'Total Viajes': trips.length,
      'Viajes Completados': completed.length,
      'Ingresos Totales (C$)': completed.reduce((sum, t) => sum + t.price, 0),
      'Comisiones Totales (C$)': completed.reduce((sum, t) => sum + t.commission, 0),
      'Ticket Promedio (C$)': Math.round(completed.reduce((sum, t) => sum + t.price, 0) / (completed.length || 1))
    }];
    
    // Revenue by day
    const byDay = {};
    completed.forEach(trip => {
      const day = Utils.formatDate(trip.date);
      if (!byDay[day]) byDay[day] = { viajes: 0, ingresos: 0 };
      byDay[day].viajes++;
      byDay[day].ingresos += trip.price;
    });
    
    const dailyData = Object.entries(byDay).map(([fecha, data]) => ({
      'Fecha': fecha,
      'Viajes': data.viajes,
      'Ingresos (C$)': data.ingresos
    }));
    
    // Revenue by service
    const byService = {};
    completed.forEach(trip => {
      if (!byService[trip.service]) byService[trip.service] = { viajes: 0, ingresos: 0 };
      byService[trip.service].viajes++;
      byService[trip.service].ingresos += trip.price;
    });
    
    const serviceData = Object.entries(byService).map(([servicio, data]) => ({
      'Servicio': servicio,
      'Viajes': data.viajes,
      'Ingresos (C$)': data.ingresos,
      'Porcentaje': ((data.ingresos / completed.reduce((sum, t) => sum + t.price, 0)) * 100).toFixed(1) + '%'
    }));
    
    // Revenue by driver
    const byDriver = {};
    completed.forEach(trip => {
      if (!byDriver[trip.driverName]) byDriver[trip.driverName] = { viajes: 0, ingresos: 0, comisiones: 0 };
      byDriver[trip.driverName].viajes++;
      byDriver[trip.driverName].ingresos += trip.price;
      byDriver[trip.driverName].comisiones += trip.commission;
    });
    
    const driverData = Object.entries(byDriver).map(([conductor, data]) => ({
      'Conductor': conductor,
      'Viajes': data.viajes,
      'Ingresos (C$)': data.ingresos,
      'Comisiones (C$)': data.comisiones,
      'Neto Conductor (C$)': data.ingresos - data.comisiones
    }));
    
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');
    
    const wsDaily = XLSX.utils.json_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Por Dia');
    
    const wsService = XLSX.utils.json_to_sheet(serviceData);
    XLSX.utils.book_append_sheet(wb, wsService, 'Por Servicio');
    
    const wsDriver = XLSX.utils.json_to_sheet(driverData);
    XLSX.utils.book_append_sheet(wb, wsDriver, 'Por Conductor');
    
    const fileName = `Ingresos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Utils.showToast(`Reporte exportado: ${fileName}`, 'success');
    return fileName;
  },

  // Export drivers report
  async exportDrivers() {
    const XLSX = await this.loadLibrary();
    const drivers = DataStore.getDrivers();
    const trips = DataStore.getTrips();
    
    const data = drivers.map(driver => {
      const driverTrips = trips.filter(t => t.driverId === driver.id);
      const completedTrips = driverTrips.filter(t => t.status === 'completado');
      
      return {
        'Nombre': driver.name,
        'Telefono': driver.phone,
        'Email': driver.email,
        'Vehiculo': driver.vehicle,
        'Placa': driver.plate,
        'Estado': driver.status,
        'Rating': driver.rating,
        'Total Viajes': driverTrips.length,
        'Viajes Completados': completedTrips.length,
        'Ingresos Generados (C$)': completedTrips.reduce((sum, t) => sum + t.price, 0),
        'Fecha Ingreso': Utils.formatDate(driver.joinedAt)
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Conductores');
    
    const fileName = `Conductores_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Utils.showToast(`Reporte exportado: ${fileName}`, 'success');
    return fileName;
  },

  // Export clients report
  async exportClients() {
    const XLSX = await this.loadLibrary();
    const clients = DataStore.getClients();
    
    const data = clients.map(client => ({
      'Nombre': client.name,
      'Email': client.email,
      'Telefono': client.phone,
      'Total Viajes': client.totalTrips,
      'Total Gastado (C$)': client.totalSpent,
      'Ultimo Viaje': Utils.formatDate(client.lastTrip),
      'Cliente Desde': Utils.formatDate(client.createdAt),
      'Estado': client.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    
    const fileName = `Clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Utils.showToast(`Reporte exportado: ${fileName}`, 'success');
    return fileName;
  },

  // Export full BI report
  async exportBIReport(dateFrom, dateTo) {
    const XLSX = await this.loadLibrary();
    const trips = DataStore.getTrips({ dateFrom, dateTo });
    const drivers = DataStore.getDrivers();
    const clients = DataStore.getClients();
    const completed = trips.filter(t => t.status === 'completado');
    
    // KPIs Sheet
    const totalRevenue = completed.reduce((sum, t) => sum + t.price, 0);
    const avgTicket = Math.round(totalRevenue / (completed.length || 1));
    const cancellationRate = ((trips.filter(t => t.status === 'cancelado').length / trips.length) * 100).toFixed(1);
    
    const kpis = [{
      'KPI': 'Total de Viajes',
      'Valor': trips.length,
      'Unidad': 'viajes'
    }, {
      'KPI': 'Viajes Completados',
      'Valor': completed.length,
      'Unidad': 'viajes'
    }, {
      'KPI': 'Ingresos Totales',
      'Valor': totalRevenue,
      'Unidad': 'C$'
    }, {
      'KPI': 'Ticket Promedio',
      'Valor': avgTicket,
      'Unidad': 'C$'
    }, {
      'KPI': 'Tasa de Cancelacion',
      'Valor': cancellationRate,
      'Unidad': '%'
    }, {
      'KPI': 'Conductores Activos',
      'Valor': drivers.filter(d => d.status === 'activo').length,
      'Unidad': 'conductores'
    }, {
      'KPI': 'Clientes Totales',
      'Valor': clients.length,
      'Unidad': 'clientes'
    }];
    
    // Top destinations
    const topDestinations = DataStore.getTopDestinations(10).map((d, i) => ({
      'Ranking': i + 1,
      'Destino': d.name,
      'Viajes': d.count,
      'Porcentaje': ((d.count / trips.length) * 100).toFixed(1) + '%'
    }));
    
    // Hourly distribution
    const hourlyDist = {};
    for (let i = 0; i < 24; i++) hourlyDist[i] = 0;
    trips.forEach(trip => {
      const hour = new Date(trip.date).getHours();
      hourlyDist[hour]++;
    });
    
    const hourlyData = Object.entries(hourlyDist).map(([hora, viajes]) => ({
      'Hora': `${hora}:00`,
      'Viajes': viajes,
      'Porcentaje': ((viajes / trips.length) * 100).toFixed(1) + '%'
    }));
    
    // Service distribution
    const serviceData = Object.entries(DataStore.getTripsByService()).map(([servicio, viajes]) => ({
      'Servicio': servicio,
      'Viajes': viajes,
      'Porcentaje': ((viajes / trips.length) * 100).toFixed(1) + '%'
    }));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpis), 'KPIs');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topDestinations), 'Top Destinos');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hourlyData), 'Dist. Horaria');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(serviceData), 'Por Servicio');
    
    const fileName = `BI_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Utils.showToast(`Reporte BI exportado: ${fileName}`, 'success');
    return fileName;
  }
};

// Export
window.ExcelExport = ExcelExport;
