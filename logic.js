// ---------- PHASE JS-1: INIT & LOADER ----------
window.addEventListener('load', function() {
  // Simulate loading progress
  const loader = document.querySelector('.hyper-loader');
  const loaderPercent = document.querySelector('.loader-percent');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 800);
      }, 500);
    }
    loaderPercent.textContent = progress + '%';
  }, 150);

  // Back to top button
  const backBtn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });

  // Scroll progress bar
  const progressBar = document.querySelector('.scroll-progress-fill');
  window.addEventListener('scroll', function() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const navList = document.querySelector('.nav-list');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        if (navList && navList.classList.contains('active')) {
          navList.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});

// ---------- PHASE JS-2: THEME TOGGLE ----------
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
}

// ---------- PHASE JS-3: TYPED TEXT ----------
const typedElement = document.querySelector('.typed-words');
if (typedElement) {
  const words = ['build web apps', 'design UI', 'optimize performance', 'break limits'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typedElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
  }
  typeEffect();
}

// ---------- PHASE JS-4: PARTICLE CANVAS (theme-aware) ----------
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function getParticleColor() {
    return getComputedStyle(document.body).getPropertyValue('--particle-color').trim();
  }

  function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.8,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getParticleColor();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', initParticles);
  initParticles();
  drawParticles();

  // Update particle color on theme change
  themeToggle.addEventListener('click', function() {
    // Wait for CSS to update, then redraw with new color
    setTimeout(() => {}, 50);
  });
}

// ---------- PHASE JS-5: PROJECT FILTER ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ---------- PHASE JS-6: SKILL BARS ANIMATION ----------
const skillItems = document.querySelectorAll('.skill-item');

function animateSkills() {
  skillItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50 && !item.classList.contains('animated')) {
      item.classList.add('animated');
      // Set progress bar width based on data-percent
      const percent = item.dataset.percent;
      const progressDiv = item.querySelector('.progress-bar div');
      if (progressDiv && percent) {
        progressDiv.style.width = percent + '%';
      }
    }
  });
}
window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

// ---------- PHASE JS-7: MAGNETIC BUTTONS (only on hover devices) ----------
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    let originalTransform = '';
    btn.addEventListener('mouseenter', () => {
      originalTransform = btn.style.transform;
    });
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = originalTransform || 'translate(0, 0)';
    });
  });
}

// ---------- PHASE JS-8: CUSTOM CURSOR (only on hover devices) ----------
if (window.matchMedia('(hover: hover)').matches) {
  const cursorMain = document.querySelector('.cursor-main');
  const cursorTrail = document.querySelector('.cursor-trail');

  if (cursorMain && cursorTrail) {
    document.addEventListener('mousemove', function(e) {
      cursorMain.style.left = e.clientX + 'px';
      cursorMain.style.top = e.clientY + 'px';
      cursorTrail.style.left = e.clientX + 'px';
      cursorTrail.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .filter-btn, .project-card, .magnetic-btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorMain.style.transform = 'translate(-50%, -50%) scale(1.8)';
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursorMain.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }
}

// ---------- PHASE JS-9: MOBILE MENU ----------
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' ? false : true;
    menuToggle.setAttribute('aria-expanded', expanded);
    navList.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !menuToggle.contains(e.target) && navList.classList.contains('active')) {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- PHASE JS-10: STATS COUNTER ANIMATION ----------
const statNumbers = document.querySelectorAll('.stat-num');
function animateStats() {
  statNumbers.forEach(stat => {
    const rect = stat.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50 && !stat.classList.contains('counted')) {
      stat.classList.add('counted');
      const target = parseInt(stat.dataset.count);
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 30);
    }
  });
}
window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

// ---------- PHASE JS-11: ADJUST HERO PADDING (for badge overlap) ----------
function adjustHeroPadding() {
  const header = document.querySelector('.main-header');
  const hero = document.querySelector('.hero-section');
  if (header && hero) {
    const headerHeight = header.offsetHeight;
    hero.style.paddingTop = (headerHeight + 40) + 'px'; // add extra 20px for comfort
  }
}

// ---------- PHASE JS-13: SCROLL SPY - ACTIVE NAV LINK ----------
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSectionId = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollY = window.scrollY;
    
    // Adjust the offset (150) to match your header height + some tolerance
    if (scrollY >= sectionTop - 150 && scrollY < sectionTop + sectionHeight - 150) {
      currentSectionId = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').substring(1); // remove '#'
    if (href === currentSectionId) {
      link.classList.add('active');
    }
  });
}

// Run on scroll and on page load
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

window.addEventListener('load', adjustHeroPadding);
window.addEventListener('resize', adjustHeroPadding);

