"use strict";

// JSON-LD (schema.org Person)
const personLdJson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Douglas Vinicius Alves da Silva",
  "jobTitle": "Desenvolvedor em Formação",
  "url": "https://ViniciusVivet.github.io/portfolio-pessoal-dev/",
  "email": "mailto:douglasvivet@gmail.com",
  "sameAs": [
    "https://github.com/ViniciusVivet",
    "https://www.linkedin.com/in/vivetsp/"
  ]
};
const ldScript = document.createElement('script');
ldScript.type = 'application/ld+json';
ldScript.textContent = JSON.stringify(personLdJson);
document.head.appendChild(ldScript);

// JavaScript para o efeito de digitação no texto do desenvolvedor
const typingTextElement = document.getElementById('typing-text');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phrases = [
  "Desenvolvedor em Formação.",
  "Developer in Progress."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 100; // ms por caractere ao digitar
const erasingSpeed = 50;  // ms por caractere ao apagar
const pauseTime = 2000;  // ms de pausa após digitar (2 segundos)
const delayBetweenPhrases = 1000; // ms de pausa após apagar completamente e antes de digitar a próxima

if (typingTextElement) {
  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        typingTextElement.textContent += currentPhrase.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        isDeleting = true;
        setTimeout(typeWriter, pauseTime);
      }
    } else {
      if (charIndex > 0) {
        typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, erasingSpeed);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeWriter, delayBetweenPhrases);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    typingTextElement.textContent = "";
    if (!prefersReducedMotion) {
      typeWriter();
    } else {
      typingTextElement.textContent = phrases[0];
    }
  });
} else {
  console.error("Elemento 'typing-text' não encontrado. O efeito de digitação não será iniciado.");
}

// --- JavaScript para o fundo animado (DNA-like) ---
const canvas = document.getElementById('dnaCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 250 };
  let isAnimating = false;

  const particleStrokeColor = '#00ff99';
  const particleFillColor = 'rgba(0, 204, 255, 0.1)';
  const lineColorBase = '0, 204, 255';

  function getConfig() {
    const isMobile = window.innerWidth < 768;
    // Reduz mais 15% (total ~27,25% do original)
    const baseParticles = isMobile ? Math.round(80 * 0.85 * 0.85) : Math.round(150 * 0.85 * 0.85);
    const baseSpeed = isMobile ? 1.0 : 1.2;
    const baseLineDist = isMobile ? 120 : 200;
    return {
      numberOfParticles: prefersReducedMotion ? 0 : baseParticles,
      particleSpeedFactor: prefersReducedMotion ? 0 : baseSpeed,
      lineDistance: prefersReducedMotion ? 0 : baseLineDist,
      particleRadius: 1.8,
      particleStrokeWidth: 2.8
    };
  }
  let { numberOfParticles, particleSpeedFactor, lineDistance, particleRadius, particleStrokeWidth } = getConfig();

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    ({ numberOfParticles, particleSpeedFactor, lineDistance, particleRadius, particleStrokeWidth } = getConfig());
    createParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function createParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * particleSpeedFactor,
        vy: (Math.random() - 0.5) * particleSpeedFactor,
        radius: particleRadius
      });
    }
  }

  function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = particleStrokeColor;
    ctx.lineWidth = particleStrokeWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particleFillColor;
    ctx.fill();
  }

  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      let dxMouse = mouse.x - p.x;
      let dyMouse = mouse.y - p.y;
      let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distanceMouse < mouse.radius) {
        let forceDirectionX = dxMouse / distanceMouse;
        let forceDirectionY = dyMouse / distanceMouse;
        let force = (mouse.radius - distanceMouse) / mouse.radius;
        let repulsionStrength = 12;
        let directionX = forceDirectionX * force * repulsionStrength;
        let directionY = forceDirectionY * force * repulsionStrength;
        p.x -= directionX;
        p.y -= directionY;
      }
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let p1 = particles[i];
        let p2 = particles[j];
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < lineDistance) {
          let opacity = 1 - (distance / lineDistance);
          ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isAnimating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawLines();
    particles.forEach(drawParticle);
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  createParticles();
  if (!prefersReducedMotion) {
    isAnimating = true;
    requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isAnimating = false;
    } else if (!prefersReducedMotion) {
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    }
  });
} else {
  console.error("Elemento 'dnaCanvas' não encontrado. A animação de fundo não será iniciada.");
}

// --- Reveal Animation ---
const sectionsToObserve = document.querySelectorAll('section:not(#home)');
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
sectionsToObserve.forEach(section => sectionObserver.observe(section));

// Scrollspy
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }
  });
}, { threshold: 0.6 });
sections.forEach(s => spyObserver.observe(s));

// Botão voltar ao topo
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};
scrollToTopBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Smooth scroll navegação
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Formulário: FormSubmit primário (free tier). Se action for API (ex.: Render), tenta API com timeout curto e fallback automático para FormSubmit (cold start).
const form = document.getElementById('contact-form');
if (form) {
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('input[type="submit"]');
  const isFormSubmit = form.action && form.action.includes('formsubmit.co');

  // Fallback FormSubmit (usado quando a API falha ou dorme — ex.: Render free tier)
  const FALLBACK_FORMSUBMIT_URL = 'https://formsubmit.co/douglasvivet@gmail.com';
  const FALLBACK_HIDDEN = {
    _subject: 'Nova mensagem do Portfólio',
    _template: 'table',
    _captcha: 'false',
    _next: 'https://viniciusvivet.github.io/portfolio-pessoal-dev/#contato',
    _autoresponse: 'Olá! Recebi sua mensagem enviada pelo meu portfólio e retornarei em breve. Obrigado pelo contato!'
  };

  if (!isFormSubmit) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.className = 'visually-hidden';
    form.appendChild(honeypot);
  }

  function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options; // 5s: evita esperar cold start do Render
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), timeout);
      fetch(resource, options).then(
        (response) => { clearTimeout(timer); resolve(response); },
        (err) => { clearTimeout(timer); reject(err); }
      );
    });
  }

  function sendViaFormSubmit() {
    form.action = FALLBACK_FORMSUBMIT_URL;
    Object.keys(FALLBACK_HIDDEN).forEach(function (name) {
      let input = form.querySelector('input[name="' + name + '"]');
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      input.value = FALLBACK_HIDDEN[name];
    });
    form.submit();
  }

  form.addEventListener('submit', async (e) => {
    if (isFormSubmit) return; // FormSubmit primário: envio normal, sem JS

    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) {
      statusEl.textContent = 'Enviando...';
      statusEl.classList.remove('success', 'error');
    }

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) {
      if (statusEl) statusEl.textContent = 'Mensagem enviada.';
      if (statusEl) statusEl.classList.add('success');
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    try {
      const fd = new FormData(form);
      const res = await fetchWithTimeout(form.action, { method: 'POST', body: fd });
      if (res.ok) {
        if (statusEl) statusEl.textContent = 'Mensagem enviada com sucesso!';
        if (statusEl) statusEl.classList.add('success');
        form.reset();
      } else {
        if (statusEl) statusEl.textContent = 'Enviando por método alternativo...';
        sendViaFormSubmit();
        return;
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Enviando por método alternativo...';
      sendViaFormSubmit();
      return;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}


// --- Countdown Formação ---
(function initCountdown(){
  const daysEl = document.getElementById('cd-days');
  const hmsEl = document.getElementById('cd-hms');
  const weeksEl = document.getElementById('cd-weeks');
  const monthsEl = document.getElementById('cd-months');
  const progressEl = document.getElementById('cd-progress');
  const progressBar = document.getElementById('cd-progress-bar');
  if (!daysEl || !hmsEl) return;
  const target = new Date('2027-06-30T23:59:59-03:00'); // 30/06/2027 23:59 (BRT)
  const start  = new Date('2025-03-01T00:00:00-03:00'); // início do curso (aprox.)
  function update() {
    const now = new Date();
    const diffMs = target - now;
    if (diffMs <= 0) {
      daysEl.textContent = '0';
      hmsEl.textContent = '00:00:00';
      if (weeksEl) weeksEl.textContent = '0';
      if (monthsEl) monthsEl.textContent = '0';
      if (progressEl) progressEl.textContent = '100%';
      if (progressBar) progressBar.style.width = '100%';
      return;
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    daysEl.textContent = String(days);
    hmsEl.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    // Extras: semanas e meses aproximados
    if (weeksEl) weeksEl.textContent = String(Math.floor(days / 7));
    if (monthsEl) monthsEl.textContent = String(Math.floor(days / 30));

    // Progresso (do início até a data-alvo)
    if (progressEl && progressBar) {
      const totalDuration = target - start;
      const elapsed = now - start;
      let pct = Math.max(0, Math.min(1, elapsed / totalDuration));
      const pctStr = Math.round(pct * 100) + '%';
      progressEl.textContent = pctStr;
      progressBar.style.width = pctStr;
    }
  }
  update();
  setInterval(update, 1000);
})();


// --- Contador de visitas (countapi.mileshilliard.com) ---
(function initVisitCounter(){
  const el = document.getElementById('visit-count');
  if (!el) return;

  const SESSION_FLAG = 'visit-counted';
  const shouldCount = !sessionStorage.getItem(SESSION_FLAG);
  const KEY = 'viniciusvivet-portfolio-visits';
  const MIN_VISITS = 46; // valor inicial "fake"; abaixo disso a API é ajustada para 46 e as próximas visitas sobem normal (47, 48...)
  const baseUrl = 'https://countapi.mileshilliard.com/api/v1';
  const url = shouldCount
    ? `${baseUrl}/hit/${encodeURIComponent(KEY)}`
    : `${baseUrl}/get/${encodeURIComponent(KEY)}`;

  function parseValue(data) {
    if (data == null || data.value == null) return null;
    const v = data.value;
    return typeof v === 'number' ? v : parseInt(v, 10);
  }

  function updateUI(totalVisits) {
    const num = Math.max(0, totalVisits);
    const numStr = num.toLocaleString('pt-BR');
    el.textContent = numStr;
    const tooltipEl = document.getElementById('visit-tooltip-text');
    const toastTooltipEl = document.getElementById('visit-toast-tooltip-text');
    const tooltipText = numStr + ' é o número de visitas no site';
    if (tooltipEl) tooltipEl.textContent = tooltipText;
    if (toastTooltipEl) toastTooltipEl.textContent = tooltipText;
    const toast = document.getElementById('visit-toast');
    const toastNum = document.getElementById('visit-toast-count');
    if (toast && toastNum) {
      toastNum.textContent = numStr;
      toast.classList.add('show');
      const btn = toast.querySelector('.visit-toast-close');
      if (btn && !btn._bound) {
        btn._bound = true;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toast.classList.remove('show');
        });
      }
      if (!toast._dragBound) {
        toast._dragBound = true;
        let isDragging = false, currentX = 0, currentY = 0, initialX, initialY, xOffset = 0, yOffset = 0;
        function dragStart(e) {
          if (e.target.classList.contains('visit-toast-close')) return;
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
          isDragging = true;
          toast.style.cursor = 'grabbing';
          toast.style.transition = 'none';
          e.preventDefault();
        }
        function drag(e) {
          if (!isDragging) return;
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          xOffset = currentX;
          yOffset = currentY;
          toast.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        function dragEnd() {
          if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            toast.style.cursor = 'move';
            toast.style.transition = 'opacity .3s ease';
          }
        }
        toast.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
      }
    }
    if (shouldCount) sessionStorage.setItem(SESSION_FLAG, '1');
  }

  fetch(url)
    .then(r => r.json())
    .then(data => {
      const totalVisits = parseValue(data);
      if (totalVisits === null || isNaN(totalVisits)) {
        el.textContent = '—';
        return;
      }
      if (totalVisits < MIN_VISITS) {
        fetch(`${baseUrl}/set/${encodeURIComponent(KEY)}?value=${MIN_VISITS}`)
          .then(() => updateUI(MIN_VISITS))
          .catch(() => updateUI(totalVisits));
      } else {
        updateUI(totalVisits);
      }
    })
    .catch(() => { el.textContent = '—'; });
})();

// --- Clique no card do projeto para abrir link
(function initProjectCardClicks(){
  document.querySelectorAll('.clickable-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-link');
      if (url) window.open(url, '_blank');
    });
  });
})();

// Dino game carregado via assets/js/games/dino.js (seção #diversao no HTML)

// Alternar tema claro/escuro (persiste em localStorage)
(function initThemeToggle() {
  const THEME_KEY = "portfolio-theme";
  const html = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  const stored = getStoredTheme();
  if (stored === "light" || stored === "dark") setTheme(stored);

  btn.addEventListener("click", function () {
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  });
})();

