/* =============================================
   CUMPLEAÑOS VALENTINA GOMEZ - script.js
   ============================================= */

// ─── PARTÍCULAS DE CORAZONES ────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const SYMBOLS = ['♥', '❤', '✿', '✦', '·'];
  const COLORS  = ['#F4A7B9', '#C9A84C', '#F0D080', '#E8839A', '#FFE4E8'];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 20;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity  = Math.random() * 0.5 + 0.1;
      this.opacityDir = (Math.random() > 0.5 ? 1 : -1) * 0.003;
      this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;
      this.opacity += this.opacityDir;
      if (this.opacity >= 0.6 || this.opacity <= 0.05) {
        this.opacityDir *= -1;
      }
      if (this.y < -30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 50 }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();


// ─── COUNTDOWN TIMER ────────────────────────────────────────────────────────
(function initCountdown() {
  // 12 de marzo de 2026, 12:00 PM (hora local)
  const TARGET = new Date('2026-03-12T12:00:00');

  const elsNum   = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  const countdownGrid = document.getElementById('countdown-grid');
  const arrivedMsg    = document.getElementById('countdown-arrived');

  function pad(n) { return String(n).padStart(2, '0'); }

  function flipUpdate(el, newVal) {
    if (el && el.textContent !== newVal) {
      el.textContent = newVal;
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
    }
  }

  function tick() {
    const now  = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      if (countdownGrid)  countdownGrid.style.display = 'none';
      if (arrivedMsg) {
        arrivedMsg.style.display = 'block';
      }
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    flipUpdate(elsNum.days,    pad(days));
    flipUpdate(elsNum.hours,   pad(hours));
    flipUpdate(elsNum.minutes, pad(minutes));
    flipUpdate(elsNum.seconds, pad(seconds));
  }

  tick();
  setInterval(tick, 1000);
})();


// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


// ─── LIGHTBOX ───────────────────────────────────────────────────────────────
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  const items       = Array.from(document.querySelectorAll('.gallery-item img'));

  if (!lightbox || !items.length) return;

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    lightboxImg.src = items[currentIndex].src;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    lightboxImg.src = items[currentIndex].src;
  }

  items.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();


// ─── CONFETTI AL ACEPTAR ────────────────────────────────────────────────────
(function initConfetti() {
  const btn    = document.getElementById('accept-btn');
  const canvas = document.getElementById('confetti-canvas');
  if (!btn || !canvas) return;

  const ctx = canvas.getContext('2d');
  const COLORS = [
    '#F4A7B9', '#C9A84C', '#F0D080', '#E8839A',
    '#FFE4E8', '#FFFFFF', '#FFD700', '#FF6B9D'
  ];

  let pieces = [];
  let animating = false;
  let frame;

  class Piece {
    constructor() {
      this.reset();
      this.y = Math.random() * -canvas.height;
    }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = -20;
      this.w     = Math.random() * 10 + 5;
      this.h     = Math.random() * 6 + 3;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rot   = Math.random() * Math.PI * 2;
      this.rotV  = (Math.random() - 0.5) * 0.15;
      this.vx    = (Math.random() - 0.5) * 4;
      this.vy    = Math.random() * 3 + 2;
      this.alpha = 1;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.rot += this.rotV;
      if (this.y > canvas.height + 20) {
        this.alpha -= 0.05;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  function startConfetti() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    pieces = Array.from({ length: 180 }, () => new Piece());
    animating = true;
    animateConfetti();
  }

  function animateConfetti() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => { p.update(); p.draw(); });
    pieces = pieces.filter(p => p.alpha > 0);
    if (pieces.length > 0) {
      frame = requestAnimationFrame(animateConfetti);
    } else {
      canvas.style.display = 'none';
      animating = false;
    }
  }

  btn.addEventListener('click', function () {
    if (this.classList.contains('accepted')) return;
    this.classList.add('accepted');
    this.querySelector('span').textContent = '¡Con mucho gusto! 🥂';
    startConfetti();
  });
})();
