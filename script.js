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

// ============================================================
// EMAILJS — auto-send the brief link to the submitter
// SETUP (4 min): https://www.emailjs.com — sign up, add Gmail
// service (OAuth), create a template, paste 3 IDs below.
// Template variables to use: {{user_email}}, {{brief_link}}
// ============================================================
const EMAILJS_PUBLIC_KEY  = 'PASTE_PUBLIC_KEY_HERE';
const EMAILJS_SERVICE_ID  = 'PASTE_SERVICE_ID_HERE';
const EMAILJS_TEMPLATE_ID = 'PASTE_TEMPLATE_ID_HERE';
const BRIEF_LINK = 'https://benjamincolab-brief-builder.vercel.app';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'PASTE_PUBLIC_KEY_HERE') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

async function handleBriefForm(e) {
  e.preventDefault();
  const emailInput = document.getElementById('brief-email');
  const email = (emailInput.value || '').trim();
  if (!email) return false;

  const form = document.getElementById('brief-form');
  const btn = document.getElementById('brief-submit-btn');
  const btnSpan = btn.querySelector('span');
  const originalLabel = btnSpan.textContent;
  let success = form.querySelector('.brief-form-success');
  if (!success) {
    success = document.createElement('p');
    success.className = 'brief-form-success';
    form.appendChild(success);
  }

  // Fallback if EmailJS isn't configured yet — open user's mail client
  if (EMAILJS_PUBLIC_KEY === 'PASTE_PUBLIC_KEY_HERE' || typeof emailjs === 'undefined') {
    const subject = encodeURIComponent('Send me the Creative Brief Questionnaire');
    const body = encodeURIComponent(`Hi Ben,\n\nPlease send me the questionnaire — link: ${BRIEF_LINK}\n\nMy email: ${email}\n\nThanks,`);
    window.location.href = `mailto:Ben@BenjaminCoLab.com?subject=${subject}&body=${body}`;
    success.innerHTML = `Email opened in your mail client — hit send and Ben will reply with the brief link.`;
    success.classList.add('show');
    return false;
  }

  btnSpan.textContent = 'Sending...';
  btn.disabled = true;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      user_email: email,
      to_email: email,
      brief_link: BRIEF_LINK,
      reply_to: 'Ben@BenjaminCoLab.com'
    });
    success.innerHTML = `<strong>Sent.</strong> Check <strong style="color:var(--text)">${email}</strong> — the questionnaire link is on its way.`;
    success.classList.add('show');
    emailInput.value = '';
    btnSpan.textContent = 'Sent ✓';
    setTimeout(() => { btnSpan.textContent = originalLabel; btn.disabled = false; }, 4000);
  } catch (err) {
    console.error('EmailJS send failed:', err);
    success.innerHTML = `Couldn't send automatically. Email Ben at <a href="mailto:Ben@BenjaminCoLab.com?subject=Send%20me%20the%20Brief&body=My%20email%3A%20${encodeURIComponent(email)}" style="color:var(--accent)">Ben@BenjaminCoLab.com</a> and he'll send the link.`;
    success.classList.add('show');
    btnSpan.textContent = originalLabel;
    btn.disabled = false;
  }
  return false;
}

// --- Collapsible "What you'll fill out" preview card ---
function toggleBriefPreview() {
  const card = document.getElementById('brief-preview-card');
  const isCollapsed = card.classList.toggle('collapsed');
  const toggle = card.querySelector('.brief-preview-toggle');
  toggle.setAttribute('aria-expanded', !isCollapsed);
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
