// ============================================
// CLIENTS PAGE MODULE
// ============================================

class ClientsManager {
  constructor() {
    this.clients = [];
    this.filteredClients = [];
    this.init();
  }

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
    setInterval(() => this.updateClientsData(), 30000);
  }

  setupEventListeners() {
    document.getElementById('searchClients').addEventListener('input', (e) => {
      this.searchClients(e.target.value);
    });

    document.getElementById('addClientBtn').addEventListener('click', () => {
      this.showNewClientModal();
    });

    document.getElementById('clientForm').addEventListener('submit', (e) => {
      this.saveClient(e);
    });
  }

  loadData() {
    const data = DataManager.loadData();
    this.clients = data.clients || [];
    this.filteredClients = [...this.clients];
    this.updateStats();
  }

  updateClientsData() {
    // Simula actualización en tiempo real
    this.loadData();
    this.render();
  }

  searchClients(query) {
    if (!query) {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.phone.includes(query) ||
        client.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    this.render();
  }

  updateStats() {
    const totalClients = this.clients.length;
    const monthlyTrips = this.clients.reduce((sum, c) => sum + (c.tripsCount || 0), 0);
    const totalRevenue = this.clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const activeToday = this.clients.filter(c => c.lastActivityToday).length;

    document.getElementById('totalClients').textContent = totalClients;
    document.getElementById('monthlyTrips').textContent = monthlyTrips;
    document.getElementById('clientRevenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('activeClientsToday').textContent = activeToday;
  }

  render() {
    const tbody = document.getElementById('clientsTable');
    tbody.innerHTML = '';

    if (this.filteredClients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--muted);">No hay clientes</td></tr>';
      return;
    }

    this.filteredClients.forEach(client => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.phone}</td>
        <td>${client.email || 'N/A'}</td>
        <td>${client.tripsCount || 0}</td>
        <td>$${(client.totalSpent || 0).toFixed(2)}</td>
        <td><span class="status-badge status-${client.active ? 'activo' : 'inactivo'}">${client.active ? 'Activo' : 'Inactivo'}</span></td>
        <td>${client.lastActivity || 'Nunca'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="clientsManager.viewClient('${client.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="clientsManager.editClient('${client.id}')">
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

  showNewClientModal() {
    document.getElementById('clientModal').classList.add('active');
    document.getElementById('clientForm').reset();
  }

  closeModal() {
    document.getElementById('clientModal').classList.remove('active');
  }

  saveClient(event) {
    event.preventDefault();

    const newClient = {
      id: 'CL' + Date.now(),
      name: document.getElementById('clientName').value,
      phone: document.getElementById('clientPhone').value,
      email: document.getElementById('clientEmail').value,
      tripsCount: 0,
      totalSpent: 0,
      active: true,
      lastActivity: new Date().toLocaleDateString(),
      lastActivityToday: true
    };

    this.clients.push(newClient);
    DataManager.saveData({
      trips: DataManager.loadData().trips,
      drivers: DataManager.loadData().drivers,
      clients: this.clients
    });

    this.filteredClients = [...this.clients];
    this.updateStats();
    this.render();
    this.closeModal();
  }

  viewClient(clientId) {
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      alert(`Cliente: ${client.name}\nTeléfono: ${client.phone}\nViajes: ${client.tripsCount}\nGasto Total: $${client.totalSpent.toFixed(2)}`);
    }
  }

  editClient(clientId) {
    alert('Editar cliente: ' + clientId);
  }
}

// Funciones globales para HTML
function closeClientModal() {
  document.getElementById('clientModal').classList.remove('active');
}

function saveClient(event) {
  if (window.clientsManager) {
    window.clientsManager.saveClient(event);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.clientsManager = new ClientsManager();
});
