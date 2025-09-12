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

// Formulário: honeypot + feedback + timeout/retry
const form = document.querySelector('form[action*="send-message"]');
if (form) {
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.className = 'visually-hidden';
  form.appendChild(honeypot);

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('input[type="submit"]');

  function fetchWithTimeout(resource, options = {}) {
    const { timeout = 15000 } = options; // 15s
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), timeout);
      fetch(resource, options).then(
        (response) => { clearTimeout(timer); resolve(response); },
        (err) => { clearTimeout(timer); reject(err); }
      );
    });
  }

  async function fetchWithRetry(resource, options = {}, retries = 2, backoffMs = 1500) {
    try {
      return await fetchWithTimeout(resource, options);
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise(r => setTimeout(r, backoffMs));
      return fetchWithRetry(resource, options, retries - 1, backoffMs * 2);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    statusEl.textContent = 'Enviando...';
    statusEl.classList.remove('success','error');

    if (honeypot.value) {
      statusEl.textContent = 'Mensagem enviada.';
      statusEl.classList.add('success');
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    try {
      const fd = new FormData(form);
      const res = await fetchWithRetry(form.action, { method: 'POST', body: fd });
      if (res.ok) {
        statusEl.textContent = 'Mensagem enviada com sucesso!';
        statusEl.classList.add('success');
        form.reset();
      } else {
        statusEl.textContent = 'Não foi possível enviar agora. Tente novamente mais tarde.';
        statusEl.classList.add('error');
      }
    } catch (err) {
      statusEl.textContent = 'Falha de conexão. Verifique sua internet e tente novamente.';
      statusEl.classList.add('error');
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


// --- Contador de visitas (CountAPI) ---
(function initVisitCounter(){
  const el = document.getElementById('visit-count');
  if (!el) return;
  const NAMESPACE = 'viniciusvivet-portfolio';
  const KEY = 'site-visits-total';
  const endpoint = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
  const SESSION_FLAG = 'visit-counted';
  const shouldCount = !sessionStorage.getItem(SESSION_FLAG);
  const url = shouldCount ? endpoint : `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
  fetch(url).then(r => r.json()).then(data => {
    if (data && typeof data.value === 'number') {
      // Se for a primeira visita, usa 33 como base, senão usa o valor real
      const baseVisits = 33;
      const totalVisits = data.value > baseVisits ? data.value : baseVisits;
      
      // Atualiza o rodapé
      el.textContent = totalVisits.toLocaleString('pt-BR');
      
      // Atualiza e mostra toast
      const toast = document.getElementById('visit-toast');
      const toastNum = document.getElementById('visit-toast-count');
      if (toast && toastNum) {
        toastNum.textContent = totalVisits.toLocaleString('pt-BR');
        // Garante que apareça ao carregar
        toast.classList.add('show');
        const btn = toast.querySelector('.visit-toast-close');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toast.classList.remove('show');
          });
        }
        
        // Funcionalidade de arrastar
        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

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
          if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            toast.style.transform = `translate(${currentX}px, ${currentY}px)`;
          }
        }

        function dragEnd(e) {
          if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            toast.style.cursor = 'move';
            toast.style.transition = 'opacity .3s ease';
          }
        }

        // Adiciona os event listeners
        toast.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
      }
      if (shouldCount) sessionStorage.setItem(SESSION_FLAG, '1');
    }
  }).catch(() => { el.textContent = '—'; });
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

// --- Lazy-load do jogo T-Rex quando a seção entra em viewport
(function initDinoLazyLoad(){
  const canvas = document.getElementById('dinoCanvas');
  if (!canvas) return; /* seção removida */
})();

