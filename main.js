/**
 * NAWADEEP ENGINEERING SERVICES - JAVASCRIPT LOGIC ENGINE
 * Handles WhatsApp Form Dispatch, Cost Estimator, Portfolio Filters, Accordion & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Contact Config
  const WHATSAPP_PHONE = '9779768864618'; // Standard Nepal country code + phone

  /* ==========================================================================
     1. STICKY NAVBAR & ACTIVE SCROLL SPY
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled class for glassmorphic depth
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active navbar link
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  /* ==========================================================================
     3. ANIMATED NUMBER COUNTERS
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target;
              clearInterval(timer);
            } else {
              counter.innerText = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection) countUpObserver.observe(statsSection);

  /* ==========================================================================
     4. INTERACTIVE PROJECT & NAKSA COST ESTIMATOR
     ========================================================================== */
  const servicePills = document.querySelectorAll('.calc-pill');
  const unitButtons = document.querySelectorAll('.unit-btn');
  const calcAreaInput = document.getElementById('calcAreaInput');
  const unitSuffix = document.getElementById('unitSuffix');
  const unitHelper = document.getElementById('unitHelper');
  const storeyButtons = document.querySelectorAll('.storey-btn');
  const calcBuildingType = document.getElementById('calcBuildingType');
  const calcLocation = document.getElementById('calcLocation');

  // Summary elements
  const resServiceName = document.getElementById('resServiceName');
  const resTotalArea = document.getElementById('resTotalArea');
  const resFloors = document.getElementById('resFloors');
  const resBuildingType = document.getElementById('resBuildingType');
  const resTimeline = document.getElementById('resTimeline');
  const resPriceRange = document.getElementById('resPriceRange');
  const sendEstimateWhatsappBtn = document.getElementById('sendEstimateWhatsappBtn');

  let currentUnit = 'sqft'; // 'sqft', 'aana', 'dhur'
  let currentServiceKey = 'full-package';
  let currentMultiplier = 1.0;
  let currentFloors = '2.5';
  let currentServiceNameText = 'Full Package (2D + 3D + Structural + Naksa)';

  // Service Pill Selection
  servicePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      servicePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentServiceKey = pill.getAttribute('data-service');
      currentMultiplier = parseFloat(pill.getAttribute('data-multiplier')) || 1.0;
      currentServiceNameText = pill.querySelector('span').innerText;
      updateEstimator();
    });
  });

  // Unit Toggle (Sq Ft vs Aana vs Dhur)
  unitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      unitButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const prevUnit = currentUnit;
      currentUnit = btn.getAttribute('data-unit');

      let val = parseFloat(calcAreaInput.value) || 0;
      // Convert value when switching units
      if (prevUnit === 'sqft' && currentUnit === 'aana') {
        val = (val / 342.25).toFixed(2);
      } else if (prevUnit === 'sqft' && currentUnit === 'dhur') {
        val = (val / 182.25).toFixed(2);
      } else if (prevUnit === 'aana' && currentUnit === 'sqft') {
        val = Math.round(val * 342.25);
      } else if (prevUnit === 'aana' && currentUnit === 'dhur') {
        val = ((val * 342.25) / 182.25).toFixed(2);
      } else if (prevUnit === 'dhur' && currentUnit === 'sqft') {
        val = Math.round(val * 182.25);
      } else if (prevUnit === 'dhur' && currentUnit === 'aana') {
        val = ((val * 182.25) / 342.25).toFixed(2);
      }

      calcAreaInput.value = val;
      if (currentUnit === 'sqft') unitSuffix.innerText = 'Sq. Ft.';
      else if (currentUnit === 'aana') unitSuffix.innerText = 'Aana';
      else if (currentUnit === 'dhur') unitSuffix.innerText = 'Dhur';

      updateEstimator();
    });
  });

  // Storey Selector
  storeyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      storeyButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloors = btn.getAttribute('data-floors');
      updateEstimator();
    });
  });

  if (calcAreaInput) calcAreaInput.addEventListener('input', updateEstimator);
  if (calcBuildingType) calcBuildingType.addEventListener('change', updateEstimator);
  if (calcLocation) calcLocation.addEventListener('input', updateEstimator);

  function calculateSqFtArea() {
    const rawVal = parseFloat(calcAreaInput.value) || 0;
    if (currentUnit === 'sqft') return rawVal;
    if (currentUnit === 'aana') return rawVal * 342.25;
    if (currentUnit === 'dhur') return rawVal * 182.25;
    return rawVal;
  }

  function updateEstimator() {
    const sqftArea = calculateSqFtArea();
    const rawVal = parseFloat(calcAreaInput.value) || 0;

    // Helper text conversion
    if (currentUnit === 'sqft') {
      const aanaVal = (sqftArea / 342.25).toFixed(2);
      unitHelper.innerHTML = `Converted Area: <strong>${Math.round(sqftArea).toLocaleString()} Sq. Ft.</strong> (~${aanaVal} Aana)`;
    } else if (currentUnit === 'aana') {
      unitHelper.innerHTML = `Input: <strong>${rawVal} Aana</strong> (~${Math.round(sqftArea).toLocaleString()} Sq. Ft.)`;
    } else {
      unitHelper.innerHTML = `Input: <strong>${rawVal} Dhur</strong> (~${Math.round(sqftArea).toLocaleString()} Sq. Ft.)`;
    }

    // Floors multiplier
    const floorFloat = parseFloat(currentFloors) || 1;
    const totalBuiltUp = sqftArea * (floorFloat >= 1 ? floorFloat : 1);

    // Update Result Card
    resServiceName.innerText = currentServiceNameText;
    resTotalArea.innerText = `${Math.round(totalBuiltUp).toLocaleString()} Sq. Ft. (~${(totalBuiltUp / 342.25).toFixed(1)} Aana)`;
    resFloors.innerText = `${currentFloors} Storey`;
    resBuildingType.innerText = calcBuildingType ? calcBuildingType.value : 'Residential';

    // Pricing calculation
    let minPrice = 0;
    let maxPrice = 0;
    let timeline = '7 - 14 Working Days';

    if (currentServiceKey === 'full-package') {
      // NPR 18 to 28 per sqft of built-up for complete architectural, structural, 3D and municipal sanctioning
      minPrice = Math.max(30000, Math.round(totalBuiltUp * 18));
      maxPrice = Math.max(45000, Math.round(totalBuiltUp * 28));
      timeline = '10 - 18 Working Days';
    } else if (currentServiceKey === 'naksa-only') {
      minPrice = Math.max(18000, Math.round(totalBuiltUp * 9));
      maxPrice = Math.max(28000, Math.round(totalBuiltUp * 15));
      timeline = '5 - 10 Working Days';
    } else if (currentServiceKey === 'structural-only') {
      minPrice = Math.max(15000, Math.round(totalBuiltUp * 8));
      maxPrice = Math.max(25000, Math.round(totalBuiltUp * 14));
      timeline = '5 - 8 Working Days';
    } else if (currentServiceKey === 'elevation-3d') {
      minPrice = 12000;
      maxPrice = 25000;
      timeline = '3 - 6 Working Days';
    } else if (currentServiceKey === 'valuation') {
      minPrice = 10000;
      maxPrice = 25000;
      timeline = '2 - 4 Working Days';
    } else if (currentServiceKey === 'turnkey-construction') {
      // NPR 3,200 to 4,500 per sqft for quality civil construction
      minPrice = Math.round(totalBuiltUp * 3200);
      maxPrice = Math.round(totalBuiltUp * 4500);
      timeline = '6 - 12 Months';
    }

    if (currentServiceKey === 'turnkey-construction') {
      resPriceRange.innerText = `NPR ${(minPrice / 100000).toFixed(2)} Lakh - ${(maxPrice / 100000).toFixed(2)} Lakh (Approx)`;
    } else {
      resPriceRange.innerText = `NPR ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}*`;
    }

    resTimeline.innerText = timeline;
  }

  // Send Estimate to WhatsApp Handler
  if (sendEstimateWhatsappBtn) {
    sendEstimateWhatsappBtn.addEventListener('click', () => {
      const sqftArea = calculateSqFtArea();
      const floorFloat = parseFloat(currentFloors) || 1;
      const totalBuiltUp = sqftArea * (floorFloat >= 1 ? floorFloat : 1);
      const location = calcLocation ? calcLocation.value : 'Nepal';
      const buildingType = calcBuildingType ? calcBuildingType.value : 'Residential House';
      const priceText = resPriceRange.innerText;

      const message = 
`📐 *ESTIMATE INQUIRY - NAWADEEP ENGINEERING SERVICES*
---------------------------------------------
🎯 *Service Package:* ${currentServiceNameText}
🏢 *Building Type:* ${buildingType}
📍 *Project Location:* ${location}
📐 *Plot / Built-up Area:* ${Math.round(totalBuiltUp).toLocaleString()} Sq. Ft. (~${(totalBuiltUp / 342.25).toFixed(1)} Aana)
🏬 *Number of Storeys:* ${currentFloors} Floors
💰 *Estimated Range:* ${priceText}
---------------------------------------------
Hello Engineer Nawadeep, I calculated this estimate on your website and would like to schedule a site consultation.`;

      openWhatsAppWithMessage(message);
    });
  }

  // Initial calculation call
  updateEstimator();

  /* ==========================================================================
     5. PORTFOLIO FILTERABLE TABS
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const cardCategories = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. FAQ ACCORDION INTERACTION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close other items for clean accordion behavior
      faqItems.forEach((f) => f.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     7. CONTACT FORM -> DYNAMIC WHATSAPP DISPATCH SYSTEM
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const clientNameInput = document.getElementById('clientName');
  const clientPhoneInput = document.getElementById('clientPhone');
  const clientEmailInput = document.getElementById('clientEmail');
  const serviceSelected = document.getElementById('serviceSelected');
  const projectLocation = document.getElementById('projectLocation');
  const projectArea = document.getElementById('projectArea');
  const projectMessage = document.getElementById('projectMessage');

  // Modal Toast Elements
  const toastModal = document.getElementById('toastModal');
  const toastDirectLink = document.getElementById('toastDirectLink');
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  const toastMessage = document.getElementById('toastMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!clientNameInput.value.trim()) {
        clientNameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        clientNameInput.classList.remove('is-invalid');
      }

      // Validate Phone
      const phoneVal = clientPhoneInput.value.trim();
      if (!phoneVal || phoneVal.length < 8) {
        clientPhoneInput.classList.add('is-invalid');
        isValid = false;
      } else {
        clientPhoneInput.classList.remove('is-invalid');
      }

      // Validate Service
      if (!serviceSelected.value) {
        serviceSelected.classList.add('is-invalid');
        isValid = false;
      } else {
        serviceSelected.classList.remove('is-invalid');
      }

      // Validate Location
      if (!projectLocation.value.trim()) {
        projectLocation.classList.add('is-invalid');
        isValid = false;
      } else {
        projectLocation.classList.remove('is-invalid');
      }

      // Validate Message
      if (!projectMessage.value.trim()) {
        projectMessage.classList.add('is-invalid');
        isValid = false;
      } else {
        projectMessage.classList.remove('is-invalid');
      }

      if (!isValid) {
        // Scroll to first invalid field
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Format clean, professional WhatsApp engineering brief
      const formattedWhatsAppMessage = 
`🏗️ *NEW PROJECT INQUIRY - NAWADEEP ENGINEERING SERVICES*
======================================
👤 *Client Name:* ${clientNameInput.value.trim()}
📱 *Contact Phone:* ${clientPhoneInput.value.trim()}
${clientEmailInput.value.trim() ? `📧 *Email:* ${clientEmailInput.value.trim()}\n` : ''}🎯 *Service Requested:* ${serviceSelected.value}
📍 *Project Location:* ${projectLocation.value.trim()}
${projectArea.value.trim() ? `📐 *Plot / Built-up Size:* ${projectArea.value.trim()}\n` : ''}💬 *Project Details:*
"${projectMessage.value.trim()}"
======================================
*Sent from Nawadeep Engineering Website*`;

      openWhatsAppWithMessage(formattedWhatsAppMessage);
    });
  }

  // Helper Function: Opens WhatsApp with message and displays feedback modal
  function openWhatsAppWithMessage(messageText) {
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

    // Update Modal
    if (toastDirectLink) toastDirectLink.setAttribute('href', waUrl);
    if (toastModal) toastModal.classList.add('show');

    // Attempt to open WhatsApp window automatically
    const waWindow = window.open(waUrl, '_blank');
    if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
      // Popup blocked - modal already has the direct link ready
      if (toastMessage) {
        toastMessage.innerHTML = `Please click the button below to open your message directly in WhatsApp for <strong>+977 9768864618</strong>.`;
      }
    }
  }

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      toastModal.classList.remove('show');
    });
  }

  if (toastModal) {
    toastModal.addEventListener('click', (e) => {
      if (e.target === toastModal) toastModal.classList.remove('show');
    });
  }

  /* ==========================================================================
     8. DYNAMIC COPYRIGHT YEAR
     ========================================================================== */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.innerText = new Date().getFullYear();
  }
});
