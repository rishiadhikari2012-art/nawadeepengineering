/**
 * NAWADEEP ENGINEERING SERVICES - Interactive Logic & WhatsApp Dispatch
 * Phone / WhatsApp: 9768864618
 * Email: nawadeepengineeringservices@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '9779768864618'; // International format for Nepal

  // --- Sticky Header on Scroll ---
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Drawer Toggle ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNavMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // --- Quick WhatsApp Service Inquiry Triggers ---
  window.sendQuickWhatsApp = function (serviceName) {
    const message = encodeURIComponent(
      `Namaste Nawadeep Engineering Services,\n\nI am interested in your service: *${serviceName}*.\nI would like to discuss my project requirements, estimates, and site visit.\n\nThank you!`
    );
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(waUrl, '_blank');
  };

  // --- Contact Form Submission & WhatsApp Dispatch ---
  const contactForm = document.getElementById('consultationContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim() || 'Not Provided';
      const service = document.getElementById('formService').value;
      const location = document.getElementById('formLocation').value.trim() || 'Not Specified';
      const details = document.getElementById('formMessage').value.trim() || 'Please reach out to discuss the project.';

      // Construct formatted message
      const formattedMessage =
`🏗️ *NEW CLIENT INQUIRY - NAWADEEP ENGINEERING*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Full Name:* ${fullName}
📞 *Contact Phone:* ${phone}
✉️ *Email Address:* ${email}
🏢 *Service Required:* ${service}
📍 *Location / Municipality:* ${location}
📝 *Project Details:*
${details}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent via Nawadeep Engineering Web Portal`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

      // Show toast notification
      showToast('Opening WhatsApp with your inquiry details...');

      // Open WhatsApp in new tab / mobile app
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);

      contactForm.reset();
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fab fa-whatsapp" style="color:#25d366; font-size:1.2rem;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ==========================================================================
  // NEPAL CONSTRUCTION COST ESTIMATOR LOGIC
  // ==========================================================================
  const calcAreaInput = document.getElementById('calcArea');
  const calcUnitSelect = document.getElementById('calcUnit');
  const calcStoriesSelect = document.getElementById('calcStories');
  const tierOptions = document.querySelectorAll('.tier-option');
  
  let selectedTierRate = 3600; // Default Premium Rate per sq ft
  let selectedTierName = 'Premium Quality (RCC Frame)';

  // Unit conversion factor to Square Feet
  const unitToSqFt = {
    sqft: 1,
    aana: 342.25,      // 1 Aana = 342.25 sq ft
    ropani: 5476,      // 1 Ropani = 16 Aana = 5476 sq ft
    dhur: 182.25,      // 1 Dhur = 182.25 sq ft
    kattha: 3645       // 1 Kattha = 20 Dhur = 3645 sq ft
  };

  // Tier selection handlers
  tierOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      tierOptions.forEach(t => t.classList.remove('selected'));
      opt.classList.add('selected');
      selectedTierRate = parseInt(opt.getAttribute('data-rate'), 10);
      selectedTierName = opt.getAttribute('data-name');
      calculateCost();
    });
  });

  if (calcAreaInput && calcUnitSelect && calcStoriesSelect) {
    calcAreaInput.addEventListener('input', calculateCost);
    calcUnitSelect.addEventListener('change', calculateCost);
    calcStoriesSelect.addEventListener('change', calculateCost);
  }

  function formatNepaliCurrency(amount) {
    if (amount >= 10000000) {
      const crore = (amount / 10000000).toFixed(2);
      return `रू ${crore} Crore`;
    } else if (amount >= 100000) {
      const lakh = (amount / 100000).toFixed(2);
      return `रू ${lakh} Lakhs`;
    } else {
      return `रू ${Math.round(amount).toLocaleString('en-IN')}`;
    }
  }

  function calculateCost() {
    const rawArea = parseFloat(calcAreaInput.value) || 0;
    const unit = calcUnitSelect.value;
    const stories = parseFloat(calcStoriesSelect.value) || 1;

    if (rawArea <= 0) {
      document.getElementById('displayTotalCost').innerText = 'रू 0.00';
      document.getElementById('displayTotalSqFt').innerText = '0 sq.ft';
      document.getElementById('estCement').innerText = '0 Bags';
      document.getElementById('estSteel').innerText = '0 MT';
      document.getElementById('estSand').innerText = '0 cu.ft';
      document.getElementById('estAggregate').innerText = '0 cu.ft';
      document.getElementById('estBricks').innerText = '0 Pcs';
      return;
    }

    const groundSqFt = rawArea * (unitToSqFt[unit] || 1);
    const totalBuiltUpArea = groundSqFt * stories;
    const totalEstimatedCost = totalBuiltUpArea * selectedTierRate;

    // Standard structural thumb-rules for Nepal RCC Construction
    const cementBags = Math.round(totalBuiltUpArea * 0.43);
    const steelTons = ((totalBuiltUpArea * 3.85) / 1000).toFixed(2);
    const sandCuFt = Math.round(totalBuiltUpArea * 1.85);
    const aggregateCuFt = Math.round(totalBuiltUpArea * 1.45);
    const brickCount = Math.round(totalBuiltUpArea * 8.8);

    // Update UI
    document.getElementById('displayTotalCost').innerText = formatNepaliCurrency(totalEstimatedCost);
    document.getElementById('displayTotalSqFt').innerText = `Total Built-up: ~${Math.round(totalBuiltUpArea).toLocaleString()} sq.ft (${stories} Storey)`;
    document.getElementById('estCement').innerText = `${cementBags.toLocaleString()} Bags`;
    document.getElementById('estSteel').innerText = `${steelTons} MT (Tons)`;
    document.getElementById('estSand').innerText = `${sandCuFt.toLocaleString()} cu.ft`;
    document.getElementById('estAggregate').innerText = `${aggregateCuFt.toLocaleString()} cu.ft`;
    document.getElementById('estBricks').innerText = `${brickCount.toLocaleString()} Pcs`;
  }

  // Initial Calculation Run
  calculateCost();

  // Send Estimate to WhatsApp Button
  window.sendEstimateToWhatsApp = function () {
    const rawArea = parseFloat(calcAreaInput.value) || 0;
    const unit = calcUnitSelect.value;
    const stories = calcStoriesSelect.value;
    const totalCost = document.getElementById('displayTotalCost').innerText;
    const totalBuiltUp = document.getElementById('displayTotalSqFt').innerText;
    const cement = document.getElementById('estCement').innerText;
    const steel = document.getElementById('estSteel').innerText;

    if (rawArea <= 0) {
      alert('Please enter a valid area to calculate the estimate.');
      return;
    }

    const waMsg =
`📊 *ESTIMATE INQUIRY - NAWADEEP ENGINEERING*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 *Land / Plot Area:* ${rawArea} ${unit.toUpperCase()}
🏢 *Number of Storeys:* ${stories}
🏗️ *Building Package:* ${selectedTierName}
📏 *${totalBuiltUp}*
💰 *Calculated Estimate Range:* ${totalCost}

📦 *Estimated Key Materials:*
• Cement: ~${cement}
• Structural Steel Rebars: ~${steel}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Namaste! I would like to get a detailed Bill of Quantities (BOQ), architectural consultation, and site visit schedule.`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
  };

  // ==========================================================================
  // PORTFOLIO FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================================================
  // ANIMATED STATISTICS COUNTER ON SCROLL
  // ==========================================================================
  const statsSection = document.querySelector('.stats-strip');
  let animated = false;

  function countUp(element, target, duration = 2000) {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.innerText = target + (element.dataset.suffix || '');
        clearInterval(timer);
      } else {
        element.innerText = Math.floor(start) + (element.dataset.suffix || '');
      }
    }, stepTime);
  }

  if (statsSection) {
    window.addEventListener('scroll', () => {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50 && !animated) {
        animated = true;
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10) || 0;
          countUp(num, target, 1800);
        });
      }
    });
  }
});
