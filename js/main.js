document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Header Scroll State
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Active Link Detection based on URL
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  let matched = false;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== 'index.html' && href !== './' && href !== '') {
      link.classList.add('active');
      matched = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Default fallback for index/home
  if (!matched && navLinks.length > 0) {
    const homeLink = Array.from(navLinks).find(l => l.getAttribute('href') === 'index.html' || l.getAttribute('href') === './');
    if (homeLink) homeLink.classList.add('active');
  }

  // Page fade-in effect on page load
  const mainWrapper = document.querySelector('.content-wrapper');
  if (mainWrapper) {
    mainWrapper.classList.add('page-fade-in');
  }

  // Scroll Animation Observer (matching standard guidelines)
  const animObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, animObserverOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animObserver.observe(el);
  });

  // Menu Filtering Logic (for menu.html)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (tabButtons.length > 0 && menuItems.length > 0) {
    // Show all items initially
    filterMenuItems('all');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle active button class
        tabButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Filter items
        const category = e.target.getAttribute('data-category');
        filterMenuItems(category);
      });
    });
  }

  function filterMenuItems(category) {
    menuItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (category === 'all' || itemCategory === category) {
        item.classList.add('show');
      } else {
        item.classList.remove('show');
      }
    });
  }

  // Modal Dialogs Logic (e.g. Host inquiries on events.html)
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  if (openModalBtns.length > 0) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-target');
        const modal = document.getElementById(targetId);
        if (modal) {
          modal.classList.add('open');
          document.body.style.overflow = 'hidden'; // Disable scroll under modal
        }
      });
    });
  }

  if (closeModalBtns.length > 0) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modalOverlays.forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
      });
    });
  }

  if (modalOverlays.length > 0) {
    modalOverlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Form Validation & Mock Submit
  const contactForm = document.querySelector('.contact-form-element');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  const modalForm = document.querySelector('.modal-form-element');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Request Received!';
        
        setTimeout(() => {
          modalForm.reset();
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
          document.body.style.overflow = '';
          submitBtn.textContent = 'Send Request';
          submitBtn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }
});
