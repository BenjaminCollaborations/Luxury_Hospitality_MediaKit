// ============================================================
// BENJAMIN CO//LAB — Script
// ============================================================

// --- Nav scroll behavior ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// --- Hamburger / mobile menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

// --- Contact form (Web3Forms) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit span');
    const success = document.getElementById('form-success');
    btn.textContent = 'Sending...';
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(contactForm)
    });
    if (res.ok) {
      contactForm.reset();
      btn.textContent = 'Send Message';
      success.style.display = 'block';
    } else {
      btn.textContent = 'Try again';
    }
  });
}

// --- Creative Brief Questionnaire — email handoff ---
function handleBriefForm(e) {
  e.preventDefault();
  const email = document.getElementById('brief-email').value.trim();
  if (!email) return false;
  const subject = encodeURIComponent('Send me the Creative Brief Questionnaire');
  const body = encodeURIComponent(
    `Hi Ben,\n\nPlease send me the creative brief questionnaire — I'd like to fill it out before our meeting.\n\nMy email: ${email}\n\nThanks,`
  );
  window.location.href = `mailto:Ben@BenjaminCoLab.com?subject=${subject}&body=${body}`;
  const form = document.getElementById('brief-form');
  let success = form.querySelector('.brief-form-success');
  if (!success) {
    success = document.createElement('p');
    success.className = 'brief-form-success';
    form.appendChild(success);
  }
  success.textContent = `Email opened — send it from your mail client and Ben will reply with the brief link.`;
  success.classList.add('show');
  return false;
}

// --- Smooth anchor scroll (for older browsers) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
