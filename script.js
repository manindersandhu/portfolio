const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

// Mobile navigation
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);

        const spans = hamburger.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

function closeMobileMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 16 : 80;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll state
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    }
    updateActiveNav();
}, { passive: true });

// Active section highlighting
function updateActiveNav() {
    const scrollPos = window.pageYOffset + (navbar ? navbar.offsetHeight + 40 : 100);

    let current = '';
    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// Scroll reveal
const revealElements = document.querySelectorAll(
    '.expertise-card, .work-card, .stack-group, .process-step, .principle, .service-chip, .availability-item, .contact-card, .hero-terminal'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index % 4 * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Counter animation for stats
function animateCounter(element, target, suffix, duration = 1800) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const count = parseInt(entry.target.dataset.count, 10);
            const suffix = entry.target.dataset.suffix || '';
            animateCounter(entry.target, count, suffix);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-count]').forEach(stat => {
    statObserver.observe(stat);
});

// Subtle terminal parallax on desktop
const terminal = document.querySelector('.hero-terminal');
if (terminal && window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        terminal.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
    terminal.style.transition = 'transform 0.4s ease-out';
}

updateActiveNav();
