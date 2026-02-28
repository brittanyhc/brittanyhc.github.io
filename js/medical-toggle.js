/* =============================================================
   🩺 Medical Mode Toggle — "Scrub In" Easter Egg
   Injects the toggle button, overlay, and manages state via
   localStorage.  Lazy-loads Google Fonts on first activation.
   ============================================================= */

(function () {
  'use strict';

  /* ── Constants ── */
  const STORAGE_KEY = 'medicalMode';
  const BODY = document.body;

  let fontsLoaded = false;

  /* ──────────────────────────────────────────────
     1.  Inject HTML elements
     ────────────────────────────────────────────── */

  // --- Toggle button ---
  const btn = document.createElement('button');
  btn.id = 'medical-toggle-btn';
  btn.setAttribute('aria-label', 'Toggle Medical Mode');
  btn.title = 'Scrub In 🧤';
  btn.innerHTML = '🩺';
  BODY.appendChild(btn);

  // --- Overlay ---
  const overlay = document.createElement('div');
  overlay.id = 'scrub-overlay';
  overlay.innerHTML =
    '<span class="scrub-emoji"></span><span class="scrub-text"></span>';
  BODY.appendChild(overlay);

  /* ──────────────────────────────────────────────
     2.  Nav logo label swap
     ────────────────────────────────────────────── */
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    const originalText = navLogo.textContent.trim();
    navLogo.innerHTML =
      '<span class="normal-label">' + originalText + '</span>' +
      '<span class="medical-label">Dr. Nini 🩺</span>';
  }

  /* ──────────────────────────────────────────────
     3.  Footer chart note
     ────────────────────────────────────────────── */
  const footer = document.querySelector('.footer');
  if (footer) {
    const note = document.createElement('span');
    note.className = 'medical-footer-note';
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    note.textContent =
      'No Refills — For Office Use Only · Chart reviewed by Dr. Nini — ' + today;
    footer.appendChild(note);
  }

  /* ──────────────────────────────────────────────
     4.  ECG heartbeat SVG (inline, for "Vital Signs")
     ────────────────────────────────────────────── */
  function injectECG() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection || skillsSection.querySelector('.ecg-container')) return;

    const container = document.createElement('div');
    container.className = 'ecg-container';
    container.setAttribute('aria-hidden', 'true');

    // Inline SVG with animated PQRST waveform
    container.innerHTML = `
      <svg viewBox="0 0 600 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path class="ecg-line" d="
          M 0,30 L 30,30 L 40,30 L 50,26 L 55,30 L 70,30
          L 80,30 L 85,30 L 90,8 L 95,52 L 100,22 L 105,30
          L 120,30 L 130,30 L 140,24 L 155,24 L 165,30 L 180,30
          L 210,30 L 220,30 L 230,26 L 235,30 L 250,30
          L 260,30 L 265,30 L 270,8 L 275,52 L 280,22 L 285,30
          L 300,30 L 310,30 L 320,24 L 335,24 L 345,30 L 360,30
          L 390,30 L 400,30 L 410,26 L 415,30 L 430,30
          L 440,30 L 445,30 L 450,8 L 455,52 L 460,22 L 465,30
          L 480,30 L 490,30 L 500,24 L 515,24 L 525,30 L 540,30
          L 570,30 L 600,30
        "
        stroke="#4CAF50"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        />
      </svg>`;

    // Insert before the skills grid
    const grid = skillsSection.querySelector('.skills-grid');
    if (grid) {
      grid.parentNode.insertBefore(container, grid);
    } else {
      skillsSection.querySelector('.container').prepend(container);
    }
  }

  /* ──────────────────────────────────────────────
     5.  Lazy-load Google Fonts
     ────────────────────────────────────────────── */
  function loadMedicalFonts() {
    if (fontsLoaded) return;
    fontsLoaded = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Courier+Prime:wght@400;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }

  /* ──────────────────────────────────────────────
     6.  Section title rewrites
     ────────────────────────────────────────────── */
  const titleMap = {
    about:      { medical: 'Patient History',           normal: 'About Me' },
    education:  { medical: 'Medical Records',           normal: 'Education' },
    research:   { medical: 'Diagnostic Reports',        normal: 'Research Experience' },
    volunteer:  { medical: 'Clinical Volunteer Log',    normal: 'Volunteer & Community Service' },
    experience: { medical: 'Clinical Rotations Log',    normal: 'Work Experience' },
    skills:     { medical: 'Vital Signs',               normal: 'Skills & Involvement' },
    contact:    { medical: 'Consultation Request',      normal: 'Get In Touch' },
  };

  function rewriteTitles(mode) {
    Object.keys(titleMap).forEach(function (id) {
      const section = document.getElementById(id);
      if (!section) return;
      const h2 = section.querySelector('.section-title');
      if (!h2) return;
      h2.textContent = titleMap[id][mode];
    });
  }

  /* Contact-link label rewrites */
  const contactOriginals = [];
  function rewriteContactLinks(mode) {
    const items = document.querySelectorAll('#contact .contact-item');
    if (mode === 'medical') {
      items.forEach(function (item, i) {
        const span = item.querySelector('span:last-child');
        if (!span) return;
        if (!contactOriginals[i]) {
          contactOriginals[i] = { icon: item.querySelector('.contact-icon').textContent, text: span.textContent };
        }
        const icon = item.querySelector('.contact-icon');
        if (item.href && item.href.includes('mailto')) {
          icon.textContent = '📞';
          span.textContent = 'Paging: ' + contactOriginals[i].text;
        } else {
          icon.textContent = '📟';
          span.textContent = 'Direct Line: ' + contactOriginals[i].text;
        }
      });
    } else {
      items.forEach(function (item, i) {
        if (!contactOriginals[i]) return;
        const icon = item.querySelector('.contact-icon');
        const span = item.querySelector('span:last-child');
        icon.textContent = contactOriginals[i].icon;
        span.textContent = contactOriginals[i].text;
      });
    }
  }

  /* ──────────────────────────────────────────────
     7.  Skills list — staggered animation index
     ────────────────────────────────────────────── */
  function assignVitalIndices() {
    document.querySelectorAll('.skills-list li').forEach(function (li, idx) {
      li.style.setProperty('--i', idx);
    });
  }

  /* ──────────────────────────────────────────────
     8.  Apply / remove medical mode (no overlay)
     ────────────────────────────────────────────── */
  function applyMedical() {
    BODY.classList.add('medical-mode');
    loadMedicalFonts();
    injectECG();
    rewriteTitles('medical');
    rewriteContactLinks('medical');
    assignVitalIndices();
    btn.innerHTML = '💊';
    btn.title = 'Scrub Out';
  }

  function removeMedical() {
    BODY.classList.remove('medical-mode');
    rewriteTitles('normal');
    rewriteContactLinks('normal');
    btn.innerHTML = '🩺';
    btn.title = 'Scrub In 🧤';
  }

  /* ──────────────────────────────────────────────
     9.  Overlay animation
     ────────────────────────────────────────────── */
  function showOverlay(scrubIn, callback) {
    const emojiEl = overlay.querySelector('.scrub-emoji');
    const textEl = overlay.querySelector('.scrub-text');

    if (scrubIn) {
      emojiEl.textContent = '🧤';
      textEl.textContent = 'Scrubbing In...';
    } else {
      emojiEl.textContent = '👋';
      textEl.textContent = 'Scrubbing Out...';
    }

    overlay.classList.add('active');

    // Hold for ~750ms then fade out
    setTimeout(function () {
      overlay.classList.remove('active');
      // Wait for CSS fade-out transition (350ms)
      setTimeout(function () {
        if (callback) callback();
      }, 350);
    }, 750);
  }

  /* ──────────────────────────────────────────────
     10. Toggle handler
     ────────────────────────────────────────────── */
  let toggling = false;

  btn.addEventListener('click', function () {
    if (toggling) return;
    toggling = true;

    const isCurrentlyMedical = BODY.classList.contains('medical-mode');

    if (isCurrentlyMedical) {
      // Scrub Out
      showOverlay(false, function () {
        removeMedical();
        localStorage.setItem(STORAGE_KEY, 'false');
        toggling = false;
      });
    } else {
      // Scrub In — load fonts first so they're ready after overlay
      loadMedicalFonts();
      showOverlay(true, function () {
        applyMedical();
        localStorage.setItem(STORAGE_KEY, 'true');
        toggling = false;
      });
    }
  });

  /* ──────────────────────────────────────────────
     11. Restore state on page load (no overlay)
     ────────────────────────────────────────────── */
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    applyMedical();
  }
})();
