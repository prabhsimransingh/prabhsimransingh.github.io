'use strict';

/* ── Password Gate ── */
(function() {
  const _k = 'UHJhYmhTaW5naDIwMjY='; // base64
  const _s = 'pg_auth';
  if (sessionStorage.getItem(_s) === _k) return;
  const input = prompt('🔐 Enter password to view this portfolio:');
  if (input !== null && btoa(input) === _k) {
    sessionStorage.setItem(_s, _k);
  } else {
    document.documentElement.innerHTML =
      '<body style="background:#080c1a;color:#94a3b8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:1rem;">' +
      '<span style="font-size:2rem">🔒</span>' +
      '<p style="margin:0">Incorrect password. Please refresh to try again.</p>' +
      '</body>';
  }
})();

const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Loader ── */
function initLoader() {
  const loader = document.getElementById('loader');
  const logo   = loader.querySelector('.loader__logo');
  const fill   = loader.querySelector('.loader__fill');

  gsap.to(logo, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
  gsap.to(fill, {
    width: '100%', duration: 0.9, delay: 0.3, ease: 'power2.inOut',
    onComplete() {
      gsap.to(loader, {
        yPercent: -100, duration: 0.7, delay: 0.15, ease: 'power3.inOut',
        onComplete() {
          loader.style.display = 'none';
          initHeroAnimation();
        }
      });
    }
  });
}

/* ── Lenis Smooth Scroll ── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });
}

/* ── Custom Cursor ── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  (function tick() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a,button,.btn,.filter-tab,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });
}

/* ── Nav ── */
function initNav() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav__link');
  const ham    = document.getElementById('hamburger');
  const menu   = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });

  if (!noMotion) gsap.from(navbar, { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

  const sections = document.querySelectorAll('section[id]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const m = document.querySelector(`.nav__link[href="#${e.target.id}"]`);
      if (m) m.classList.add('active');
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }).observe
    ? sections.forEach(s => new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          links.forEach(l => l.classList.remove('active'));
          const m = document.querySelector(`.nav__link[href="#${e.target.id}"]`);
          if (m) m.classList.add('active');
        });
      }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }).observe(s))
    : null;

  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('mobile-open');
  });
  links.forEach(l => l.addEventListener('click', () => {
    ham?.classList.remove('open');
    menu.classList.remove('mobile-open');
  }));
}

/* ── Scroll Progress ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ── Hero Animation ── */
function initHeroAnimation() {
  if (noMotion) return;

  // Split name chars
  const nameEl = document.getElementById('hero-name');
  if (nameEl) {
    nameEl.innerHTML = [...nameEl.textContent].map(c =>
      `<span class="char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
    gsap.from(nameEl.querySelectorAll('.char'), {
      clipPath: 'inset(0 100% 0 0)', opacity: 0,
      duration: 0.65, stagger: 0.04, ease: 'power3.out', delay: 0.1
    });
  }

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero__badge',      { y: 30, opacity: 0, duration: 0.6 }, 0.35)
    .from('.hero__typed-wrap', { y: 25, opacity: 0, duration: 0.6 }, 0.85)
    .from('.hero__tagline',    { y: 20, opacity: 0, duration: 0.6 }, 1.05)
    .from('.hero__ctas .btn',  { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, 1.25)
    .from('.hero__socials',    { y: 15, opacity: 0, duration: 0.5 }, 1.5)
    .from('.hero__scroll-hint',{ opacity: 0, duration: 0.5 }, 1.65);

  gsap.to('.hero__content', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    y: 100, opacity: 0.3
  });
}

/* ── Particles ── */
function initParticles() {
  if (noMotion) return;
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = ['rgba(201,168,76,0.6)', 'rgba(232,201,122,0.5)', 'rgba(168,136,53,0.5)', 'rgba(201,168,76,0.4)'];
  let particles = [], mouse = { x: null, y: null };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class P {
    constructor() { this.init(true); }
    init(rand) {
      this.x  = Math.random() * canvas.width;
      this.y  = rand ? Math.random() * canvas.height : -10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = Math.random() * 0.3 + 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.op = Math.random() * 0.5 + 0.2;
    }
    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { const f = (120 - d) / 120; this.vx += dx / d * f * 1.5; this.vy += dy / d * f * 1.5; }
      }
      this.vx *= 0.98; this.vy *= 0.98;
      this.x += this.vx; this.y += this.vy;
      if (this.y > canvas.height + 10) this.init(false);
      if (this.x < -10 || this.x > canvas.width + 10) { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; }
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color; ctx.globalAlpha = this.op; ctx.fill(); ctx.globalAlpha = 1;
    }
  }

  function spawn() {
    particles = Array.from({ length: Math.min(90, Math.floor(canvas.width * canvas.height / 9000)) }, () => new P());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(201,168,76,1)'; ctx.globalAlpha = (1 - d / 130) * 0.15; ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  })();

  new ResizeObserver(() => { resize(); spawn(); }).observe(canvas.parentElement);
  resize(); spawn();

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

/* ── Typewriter ── */
function initTypewriter() {
  const el = document.getElementById('hero-typed');
  if (!el || typeof Typed === 'undefined') return;
  new Typed(el, {
    strings: ['enterprise AI infrastructure.', 'Kubernetes platforms at Fortune 500 scale.', 'engineering orgs that ship.', 'cloud-native systems that last.', 'platforms powering $25B+ in revenue.'],
    typeSpeed: 55, backSpeed: 30, backDelay: 2000, loop: true, smartBackspace: true
  });
}

/* ── Counters ── */
function initCounters() {
  let done = false;
  const about = document.getElementById('about');
  if (!about) return;
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || done) return;
    done = true;
    document.querySelectorAll('.stat__num').forEach(el => {
      const target = +el.dataset.target;
      const dur = target > 100 ? 2200 : 1600;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = target >= 1000 ? val.toLocaleString() : val;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target >= 1000 ? target.toLocaleString() : target;
      })(t0);
    });
  }, { threshold: 0.4 }).observe(about);
}

/* ── Scroll Animations ── */
function initScrollAnimations() {
  if (noMotion) return;

  const st = (trigger, props, extra = {}) =>
    gsap.from(trigger, { scrollTrigger: { trigger, start: 'top 87%', ...extra }, ...props });

  gsap.utils.toArray('.section-label').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, x: -20, opacity: 0, duration: 0.6, ease: 'power3.out' }));
  gsap.utils.toArray('.section-heading').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }));

  gsap.from('.about__text',   { scrollTrigger: { trigger: '#about', start: 'top 76%' }, x: -50, opacity: 0, duration: 0.9, ease: 'power3.out' });
  gsap.from('.about__visual', { scrollTrigger: { trigger: '#about', start: 'top 76%' }, x: 50,  opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out' });
  gsap.from('.stat', { scrollTrigger: { trigger: '.about__stats', start: 'top 87%' }, y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)' });

  gsap.from('.skill-chip--i', { scrollTrigger: { trigger: '.skills__grid-wrap', start: 'top 86%' }, y: 20, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(1.7)' });

  gsap.from('.project-card', { scrollTrigger: { trigger: '.projects__grid', start: 'top 82%' }, y: 50, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });

  gsap.to('.timeline__line', {
    scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
    scaleY: 1, duration: 1, ease: 'none'
  });
  gsap.utils.toArray('.timeline-entry').forEach((el, i) =>
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, x: -40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.05 })
  );

  gsap.from('.contact__heading', { scrollTrigger: { trigger: '#contact', start: 'top 82%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.contact__sub',     { scrollTrigger: { trigger: '#contact', start: 'top 80%' }, y: 25, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' });
  gsap.from('.contact-card',     { scrollTrigger: { trigger: '.contact__cards', start: 'top 86%' }, y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
  gsap.from('.social-btn',       { scrollTrigger: { trigger: '.contact__socials', start: 'top 88%' }, y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' });
}

/* ── Project Filter ── */
function initFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || (card.dataset.tags || '').split(' ').includes(f);
        if (show) {
          card.style.display = '';
          card.style.opacity = '';
          gsap.killTweensOf(card);
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.killTweensOf(card);
          gsap.to(card, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: () => { card.style.display = 'none'; } });
        }
      });
    });
  });
}

/* ── Vanilla Tilt ── */
function initTilt() {
  if (typeof VanillaTilt === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;
  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 8, speed: 400, glare: true, 'max-glare': 0.08, scale: 1.02, perspective: 1000, gyroscope: false
  });
}

/* ── Magnetic Buttons ── */
function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
  });
}

/* ── Copy Email ── */
function initCopy() {
  const btn   = document.getElementById('copy-email');
  const email = document.getElementById('contact-email');
  if (!btn || !email) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email.textContent.trim());
      const orig = btn.innerHTML;
      btn.innerHTML = '✓';
      btn.style.cssText = 'background:var(--accent);color:var(--bg-void);border-color:var(--accent)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; }, 2000);
    } catch { /* silent fail */ }
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  initCursor();
  initScrollProgress();
  initNav();
  initTypewriter();
  initCounters();
  // Ensure all project cards are visible before filter/ScrollTrigger run
  document.querySelectorAll('.project-card').forEach(c => {
    c.style.opacity = '1';
    c.style.display = '';
  });
  initFilter();
  initCopy();

  if (!noMotion) {
    initLenis();
    initParticles();
    initScrollAnimations();
    initTilt();
    initMagnetic();
    initLoader();
  } else {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }
});
