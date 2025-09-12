"use strict";

// Starfield simples no canvas (respeita prefers-reduced-motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let anim = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}
window.addEventListener('resize', resize);

function initStars() {
  const count = prefersReducedMotion ? 0 : Math.min(400, Math.floor(canvas.width * canvas.height / 4000));
  stars = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 2 + 0.5,
    r: Math.random() * 1.3 + 0.2
  }));
}

function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.y += s.z; // queda
    if (s.y > canvas.height) { s.y = 0; s.x = Math.random()*canvas.width; }
  }
  anim = requestAnimationFrame(loop);
}

function start() {
  resize();
  if (!prefersReducedMotion) {
    anim = requestAnimationFrame(loop);
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && anim) { cancelAnimationFrame(anim); anim = null; }
  else if (!document.hidden && !prefersReducedMotion && !anim) { anim = requestAnimationFrame(loop); }
});
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'h') { window.location.href = './'; }
});
start();


