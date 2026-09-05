// Align and Restore Physiotherapy — shared behaviour

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  /* Sticky header shadow on scroll */
  const headerEl = document.querySelector('.site-header');
  if (headerEl) {
    const onScroll = () => headerEl.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Magnetic pull on primary buttons */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-clay').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35 - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* Card spotlight glow */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card, .value-item').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* Hero mesh gradient — "Bloom Field" */
  const heroMesh = document.querySelector('.hero-mesh');
  if (heroMesh) {
    const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.280'/%3E%3C/svg%3E\")";
    const SEED = 174074637;
    const amt = 0.40;
    const dir = 1;

    // Deterministic per-blob phase, hashed once from the seed — never re-hashed per frame.
    const hashPhase = (i, salt) => {
      let x = Math.sin(SEED * 0.0001 + i * 12.9898 + salt * 78.233) * 43758.5453;
      x -= Math.floor(x);
      return x * Math.PI * 2;
    };
    const hexToRgb = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    };

    const blobs = [
      { hex: '#e9ede2', baseX: 66.94, baseY: 46.43, stops: [[0, 1], [19.02, .844], [38.05, .5], [57.07, .156], [76.1, 0]] },
      { hex: '#a8b89a', baseX: 34.69, baseY: 66.31, stops: [[0, 1], [12.73, .844], [25.45, .5], [38.18, .156], [50.9, 0]] },
      { hex: '#f2e3ba', baseX: 48.93, baseY: 19.32, stops: [[0, 1], [16.75, .844], [33.5, .5], [50.25, .156], [67, 0]] },
      { hex: '#FFFFFF', baseX: 80.23, baseY: 87.54, stops: [[0, 1], [10.28, .844], [20.55, .5], [30.83, .156], [41.1, 0]] },
    ].map((b, i) => ({
      ...b,
      rgb: hexToRgb(b.hex),
      p: hashPhase(i, 1),
      p2: hashPhase(i, 2),
    }));

    const render = (ph) => {
      const images = [GRAIN];
      const sizes = ['120px 120px'];
      const blends = ['overlay'];
      blobs.forEach((b) => {
        const cx = b.baseX + (Math.sin(ph * 0.55 + b.p) - Math.sin(b.p)) * 14 * amt;
        const cy = b.baseY + (Math.sin(ph * 0.43 + b.p2) - Math.sin(b.p2)) * 14 * amt;
        const stopsStr = b.stops.map(([pct, op]) => `rgba(${b.rgb}, ${op}) ${pct}%`).join(', ');
        images.push(`radial-gradient(circle at ${cx}% ${cy}%, ${stopsStr})`);
        sizes.push('auto');
        blends.push('normal');
      });
      heroMesh.style.backgroundImage = images.join(', ');
      heroMesh.style.backgroundSize = sizes.join(', ');
      heroMesh.style.backgroundBlendMode = blends.join(', ');
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      let start = null;
      const frame = (now) => {
        if (start === null) start = now;
        const ph = ((now - start) / 1000) * 1.00 * dir;
        render(ph);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  }

  /* Hero glyph scroll parallax */
  const heroGlyph = document.querySelector('.hero-glyph');
  if (heroGlyph && !prefersReducedMotion) {
    const onGlyphScroll = () => {
      heroGlyph.style.setProperty('--glyph-shift', `${window.scrollY * 0.08}px`);
    };
    onGlyphScroll();
    window.addEventListener('scroll', onGlyphScroll, { passive: true });
  }

  /* Hero art mouse-tilt */
  const heroArt = document.querySelector('.hero-art');
  const heroSection = document.querySelector('.hero');
  if (heroArt && heroSection && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroArt.style.setProperty('--tilt-y', `${px * 10}deg`);
      heroArt.style.setProperty('--tilt-x', `${py * -8}deg`);
    });
    heroSection.addEventListener('mouseleave', () => {
      heroArt.style.setProperty('--tilt-y', '0deg');
      heroArt.style.setProperty('--tilt-x', '0deg');
    });
  }

  /* Mobile nav toggle */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Conditions page tabs */
  const tabsNav = document.querySelector('.tabs-nav');
  if (tabsNav) {
    const triggers = Array.from(tabsNav.querySelectorAll('.tab-trigger'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    const activate = (id) => {
      const target = triggers.some(t => t.dataset.tab === id) ? id : triggers[0].dataset.tab;
      triggers.forEach(t => {
        const active = t.dataset.tab === target;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(p => p.classList.toggle('is-active', p.id === target));
    };
    triggers.forEach(t => {
      t.addEventListener('click', () => {
        activate(t.dataset.tab);
        history.replaceState(null, '', `#${t.dataset.tab}`);
      });
    });
    activate((location.hash || '').slice(1));
    if (location.hash) {
      document.querySelector('.conditions-tabs')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* Contact form — submits to Formspree via fetch so we can stay on-page. */
  const form = document.querySelector('#contact-form');
  if (form) {
    const message = document.querySelector('#form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Form submission failed');

        form.reset();
        if (message) {
          message.classList.remove('is-error');
          message.textContent = "Thanks! Your message has been sent. We'll be in touch shortly.";
          message.classList.add('show');
          message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        if (message) {
          message.classList.add('show', 'is-error');
          message.textContent = "Something went wrong sending your message. Please call us on 07586 572901 or email info@alignrestore.co.uk instead.";
          message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      }
    });
  }

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
