// Panel del Pasajero
document.addEventListener('DOMContentLoaded', () => {
  AUTH.initUI();
  
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });

  document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
  });
});
