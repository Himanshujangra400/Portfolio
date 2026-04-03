/* ====================================================
   script.js — Himanshu Jangra Portfolio
   ==================================================== */

// ─── 1. AOS (Animate On Scroll) ───────────────────────
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// ─── 2. NAVBAR scroll effect + hamburger ─────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Highlight active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.querySelectorAll('a').forEach(a => a.style.color = '');
        link.style.color = 'var(--primary)';
      }
    }
  });
});

// ─── 3. TYPING EFFECT ─────────────────────────────────
const lines = [
  'Content Creator 🚀',
  'Aspiring Developer 💻',
  'Building Systems, Not Shortcuts 🔥',
  'JavaScript & React Dev ⚛️',
  'YouTube Storyteller 🎬',
];
let lineIdx = 0;
let charIdx = 0;
let deleting = false;
let paused  = false;

const typedEl = document.getElementById('typed-text');

function type() {
  if (paused) return;
  const current = lines[lineIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; requestAnimationFrame(typingLoop); }, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      lineIdx  = (lineIdx + 1) % lines.length;
      paused   = true;
      setTimeout(() => { paused = false; requestAnimationFrame(typingLoop); }, 350);
      return;
    }
  }
  requestAnimationFrame(typingLoop);
}

let lastTime = 0;
function typingLoop(timestamp) {
  const speed = deleting ? 35 : 70;
  if (timestamp - lastTime > speed) {
    lastTime = timestamp;
    type();
  } else {
    requestAnimationFrame(typingLoop);
  }
}
requestAnimationFrame(typingLoop);

// ─── 4. COUNTER ANIMATION ─────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let count    = 0;
  const step   = Math.ceil(target / 40);
  const timer  = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 40);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ─── 5. SKILL BARS ANIMATION ──────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-col').forEach(col => skillObserver.observe(col));

// ─── 6. PARTICLES CANVAS ──────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - .5) * .35;
      this.vy   = (Math.random() - .5) * .35;
      this.r    = Math.random() * 1.5 + .5;
      this.alpha= Math.random() * .5 + .1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(Math.floor((W * H) / 14000), 120);
  particles = Array.from({ length: COUNT }, () => new Particle());

  const MAX_DIST = 130;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34,197,94,${0.12 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth   = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── 7. CONTACT FORM ──────────────────────────────────
const form     = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formNote.style.color = '#ef4444';
    formNote.textContent = '⚠️ Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formNote.style.color = '#ef4444';
    formNote.textContent = '⚠️ Please enter a valid email address.';
    return;
  }

  // Open mail client as fallback (no backend needed)
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.open(`mailto:jangrahimanshu076@gmail.com?subject=${subject}&body=${body}`, '_blank');

  formNote.style.color = 'var(--primary)';
  formNote.textContent = '✅ Opening your mail client… Message ready to send!';
  form.reset();
  setTimeout(() => { formNote.textContent = ''; }, 5000);
});

// ─── 8. BACK TO TOP ───────────────────────────────────
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
