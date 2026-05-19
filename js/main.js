// ========================================
// Pacific Coast Taxi - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initUserMenu();
  initTestimonials();
  initFAQ();
  initChatbot();
  initReviewModal();
  initCurrentYear();
  checkUserLogin();
});

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      const isOpen = mobileNav.classList.contains('active');
      menuIcon.style.display = isOpen ? 'none' : 'block';
      closeIcon.style.display = isOpen ? 'block' : 'none';
    });

    // Close menu when clicking on links
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      });
    });
  }
}

// ========================================
// User Menu (Dropdown)
// ========================================
function initUserMenu() {
  const userMenuBtn = document.getElementById('userMenuBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const reviewBtn = document.getElementById('reviewBtn');

  if (userMenuBtn && dropdownMenu) {
    userMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdownMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
        dropdownMenu.classList.remove('active');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      handleLogout();
    });
  }

  if (reviewBtn) {
    reviewBtn.addEventListener('click', function() {
      openReviewModal();
      dropdownMenu.classList.remove('active');
    });
  }
}

// ========================================
// Check User Login Status
// ========================================
function checkUserLogin() {
  const userName = localStorage.getItem('userName');
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnMobile = document.getElementById('loginBtnMobile');
  const userMenu = document.getElementById('userMenu');
  const userNameSpan = document.getElementById('userName');

  if (userName) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = 'none';
    if (loginBtnMobile) loginBtnMobile.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (userNameSpan) userNameSpan.textContent = userName;
  } else {
    // User is not logged in
    if (loginBtn) loginBtn.style.display = 'flex';
    if (loginBtnMobile) loginBtnMobile.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

function handleLogout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('driverEmail');
  localStorage.removeItem('driverName');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminName');
  window.location.href = 'index.html';
}

// ========================================
// Testimonials Slider
// ========================================
const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Muy buena atencion al cliente, responden rapido y cumplen con lo prometido.",
    email: "maria.lopez@gmail.com",
    name: "Maria Lopez"
  },
  {
    id: 2,
    rating: 5,
    text: "Excelente servicio, el conductor llego puntual y el viaje fue muy comodo.",
    email: "carlos.martinez@hotmail.com",
    name: "Carlos Martinez"
  },
  {
    id: 3,
    rating: 5,
    text: "Reservar fue facil y recibi confirmacion. Sin duda volveria a usar Pacific Coast.",
    email: "ana.garcia@yahoo.com",
    name: "Ana Garcia"
  },
  {
    id: 4,
    rating: 5,
    text: "Viajamos en familia a San Juan del Sur y el servicio fue increible. Conductor muy amable.",
    email: "roberto.perez@outlook.com",
    name: "Roberto Perez"
  },
  {
    id: 5,
    rating: 5,
    text: "Los mejores precios de la zona y vehiculos muy limpios. Totalmente recomendado.",
    email: "lucia.hernandez@gmail.com",
    name: "Lucia Hernandez"
  }
];

let currentTestimonialIndex = 0;

function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialsDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track) return;

  // Render testimonials
  renderTestimonials();
  
  // Render dots
  if (dotsContainer) {
    testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToTestimonial(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonials();
      updateDots();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonials();
      updateDots();
    });
  }
}

function renderTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  const isMobile = window.innerWidth < 768;
  const itemsToShow = isMobile ? 1 : 3;
  
  track.innerHTML = '';
  
  for (let i = 0; i < itemsToShow; i++) {
    const index = (currentTestimonialIndex + i) % testimonials.length;
    const testimonial = testimonials[index];
    
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="testimonial-stars">
        ${Array(testimonial.rating).fill('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}
      </div>
      <p class="testimonial-text">"${testimonial.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${testimonial.name.charAt(0)}</div>
        <div>
          <p class="testimonial-name">${testimonial.name}</p>
          <p class="testimonial-email">${testimonial.email}</p>
        </div>
      </div>
    `;
    track.appendChild(card);
  }
}

function goToTestimonial(index) {
  currentTestimonialIndex = index;
  renderTestimonials();
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentTestimonialIndex);
  });
}

// Handle window resize
window.addEventListener('resize', renderTestimonials);

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ========================================
// Chatbot
// ========================================
function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const window = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatbotMessages');

  if (!toggle || !window) return;

  toggle.addEventListener('click', () => {
    window.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.classList.remove('active');
    });
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const response = getBotResponse(text);
      addMessage(response, 'bot');
    }, 1000);
  }

  function addMessage(text, type) {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.innerHTML = `<p>${text}</p>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotResponse(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('reservar') || lowerText.includes('viaje')) {
      return 'Para reservar un viaje, puedes usar nuestro <a href="trips.html">formulario de reservas</a> o contactarnos por WhatsApp al +505 7750-2626.';
    } else if (lowerText.includes('precio') || lowerText.includes('tarifa') || lowerText.includes('costo')) {
      return 'Nuestras tarifas varian segun el destino y tipo de servicio. Los viajes locales en Rivas empiezan desde $5 USD. Para cotizaciones especificas, contactanos por WhatsApp.';
    } else if (lowerText.includes('pago') || lowerText.includes('pagar')) {
      return 'Aceptamos efectivo (cordobas y dolares), transferencias bancarias, y pagos con tarjeta. Tambien aceptamos pagos digitales.';
    } else if (lowerText.includes('whatsapp') || lowerText.includes('contacto') || lowerText.includes('telefono')) {
      return 'Puedes contactarnos por WhatsApp al <a href="https://wa.me/50577502626" target="_blank">+505 7750-2626</a>. Estamos disponibles 24/7.';
    } else if (lowerText.includes('hola') || lowerText.includes('buenos') || lowerText.includes('buenas')) {
      return 'Hola! Bienvenido a Pacific Coast Taxi. Como puedo ayudarte hoy? Puedo asistirte con reservas, precios, destinos o cualquier consulta sobre nuestros servicios.';
    } else {
      return 'Gracias por tu mensaje. Para asistencia inmediata, te recomiendo contactarnos por <a href="https://wa.me/50577502626" target="_blank">WhatsApp</a> donde podemos atenderte de forma personalizada.';
    }
  }
}

// ========================================
// Review Modal
// ========================================
function initReviewModal() {
  const modal = document.getElementById('reviewModal');
  const closeBtn = document.getElementById('closeReviewModal');
  const overlay = modal?.querySelector('.modal-overlay');
  const form = document.getElementById('reviewForm');
  const stars = document.querySelectorAll('#starRating .star');
  
  let selectedRating = 0;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeReviewModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeReviewModal);
  }

  // Star rating
  stars.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.dataset.rating);
      updateStars();
    });

    star.addEventListener('mouseenter', function() {
      const rating = parseInt(this.dataset.rating);
      highlightStars(rating);
    });

    star.addEventListener('mouseleave', function() {
      updateStars();
    });
  });

  function highlightStars(rating) {
    stars.forEach((star, index) => {
      star.classList.toggle('active', index < rating);
    });
  }

  function updateStars() {
    stars.forEach((star, index) => {
      star.classList.toggle('active', index < selectedRating);
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const comment = document.getElementById('reviewComment').value;
      
      if (selectedRating === 0) {
        alert('Por favor selecciona una calificacion');
        return;
      }

      // Save review (in real app, send to server)
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      reviews.push({
        rating: selectedRating,
        comment: comment,
        date: new Date().toISOString(),
        userName: localStorage.getItem('userName') || 'Anonimo'
      });
      localStorage.setItem('reviews', JSON.stringify(reviews));

      alert('Gracias por tu resena!');
      closeReviewModal();
      form.reset();
      selectedRating = 0;
      updateStars();
    });
  }
}

function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.add('active');
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.remove('active');
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

// ========================================
// Utility Functions
// ========================================
function generateConfirmationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PCT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2) + ' USD';
}

// Export functions for use in other pages
window.PacificCoastTaxi = {
  generateConfirmationCode,
  formatDate,
  formatCurrency,
  checkUserLogin,
  handleLogout
};
