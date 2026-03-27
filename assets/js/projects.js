"use strict";

// ---- Canvas de partículas (fundo animado) ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PARTICLE_COUNT_MOBILE  = 48;
const PARTICLE_COUNT_DESKTOP = 90;
const PARTICLE_SPEED_MOBILE  = 1.0;
const PARTICLE_SPEED_DESKTOP = 1.2;
const LINE_DIST_MOBILE       = 120;
const LINE_DIST_DESKTOP      = 190;
const MOUSE_REPULSION_RADIUS   = 250;
const MOUSE_REPULSION_STRENGTH = 12;

const canvas = document.getElementById('dnaCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let isAnimating = false;

  function getConfig() {
    const mobile = window.innerWidth < 768;
    return {
      count:     prefersReducedMotion ? 0 : (mobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP),
      speed:     prefersReducedMotion ? 0 : (mobile ? PARTICLE_SPEED_MOBILE : PARTICLE_SPEED_DESKTOP),
      lineDist:  prefersReducedMotion ? 0 : (mobile ? LINE_DIST_MOBILE : LINE_DIST_DESKTOP),
    };
  }

  let cfg = getConfig();

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cfg = getConfig();
    particles = [];
    for (let i = 0; i < cfg.count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
      });
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function animate() {
    if (!isAnimating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linhas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.lineDist) {
          ctx.strokeStyle = `rgba(0,204,255,${1 - dist / cfg.lineDist})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPULSION_RADIUS) {
          const force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
          p.x -= (dx / dist) * force * MOUSE_REPULSION_STRENGTH;
          p.y -= (dy / dist) * force * MOUSE_REPULSION_STRENGTH;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ff99';
      ctx.lineWidth = 2.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,204,255,0.1)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isAnimating = false;
    } else if (!prefersReducedMotion) {
      if (!isAnimating) { isAnimating = true; requestAnimationFrame(animate); }
    }
  });

  if (!prefersReducedMotion) {
    isAnimating = true;
    requestAnimationFrame(animate);
  }
}

// ---- Cards clicáveis ----
document.querySelectorAll('[data-href]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return; // deixa links internos funcionarem normalmente
    window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
    }
  });
});

// ---- Reveal de seções ----
document.querySelectorAll('section').forEach(section => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }).observe(section);
});

// ---- Scroll-to-top ----
const scrollBtn = document.getElementById('scrollToTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- Hamburger menu ----
(function initHamburger() {
  const btn  = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  function closeMenu() {
    menu.classList.remove('nav-open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('nav-open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
  });
})();

// ---- Tema claro/escuro ----
(function initThemeToggle() {
  const THEME_KEY = 'portfolio-theme';
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  const stored = (() => { try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; } })();
  if (stored === 'light' || stored === 'dark') setTheme(stored);

  btn.addEventListener('click', () => {
    const next = (html.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
})();
