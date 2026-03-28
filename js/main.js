/* ============================================================
   CUSTOM CURSOR
============================================================ */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.style.width  = '56px';
        cursorFollower.style.height = '56px';
        cursorFollower.style.borderColor = 'rgba(6,181,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.style.width  = '36px';
        cursorFollower.style.height = '36px';
        cursorFollower.style.borderColor = 'rgba(6,181,255,0.5)';
    });
});

/* ============================================================
   NAVBAR — scroll & active link
============================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
        }
    });
}

/* ============================================================
   HERO CANVAS — floating particles
============================================================ */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x     = Math.random() * canvas.width;
        this.y     = Math.random() * canvas.height;
        this.size  = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,181,255,${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
}

function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(6,181,255,${0.08 * (1 - dist / maxDist)})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateCanvas);
}

initParticles();
animateCanvas();

/* ============================================================
   TYPED TEXT ANIMATION
============================================================ */
const typedEl = document.getElementById('typedText');
const phrases = [
    'Desenvolvedor Web',
    'Web Designer',
    'Ethical Hacker',
    'Programador',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

function typeLoop() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typedEl.textContent = current.substring(0, --charIndex);
    } else {
        typedEl.textContent = current.substring(0, ++charIndex);
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
    }
    setTimeout(typeLoop, delay);
}
typeLoop();

/* ============================================================
   SCROLL ANIMATIONS
============================================================ */
const animatedEls = document.querySelectorAll('[data-anime]');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

animatedEls.forEach(el => observer.observe(el));

/* ============================================================
   CONTACT FORM — EmailJS
   Configure: replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, YOUR_TEMPLATE_ID
============================================================ */
(function () {
    emailjs.init({ publicKey: '3GKuO8RBSYDKk1hoe' });
})();

const contactForm  = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
const btnText      = document.getElementById('btnText');
const btnIcon      = document.getElementById('btnIcon');
const formStatus   = document.getElementById('formStatus');

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled  = true;
    btnText.textContent = 'A enviar...';
    btnIcon.className   = 'fas fa-spinner fa-spin';
    formStatus.textContent = '';
    formStatus.className   = 'form-status';

    const params = {
        from_name:  document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject:    document.getElementById('subject').value,
        message:    document.getElementById('message').value,
    };

    try {
        await emailjs.send('service_m8tp42e', 'template_6fsmoon', params);
        formStatus.textContent = 'Mensagem enviada com sucesso! Responderei em breve.';
        formStatus.className   = 'form-status success';
        contactForm.reset();
    } catch (err) {
        formStatus.textContent = 'Erro ao enviar. Por favor, tente novamente ou contacte diretamente por email.';
        formStatus.className   = 'form-status error';
        console.error('EmailJS error:', err);
    } finally {
        submitBtn.disabled  = false;
        btnText.textContent = 'Enviar Mensagem';
        btnIcon.className   = 'fas fa-paper-plane';
    }
});
