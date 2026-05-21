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

// --- Creative Brief Questionnaire — auto-reply with link via FormSubmit ---
async function handleBriefForm(e) {
  e.preventDefault();
  const emailInput = document.getElementById('brief-email');
  const email = emailInput.value.trim();
  if (!email) return false;

  const form = document.getElementById('brief-form');
  const btn = document.getElementById('brief-submit-btn');
  const btnSpan = btn.querySelector('span');
  const originalLabel = btnSpan.textContent;

  btnSpan.textContent = 'Sending...';
  btn.disabled = true;

  let success = form.querySelector('.brief-form-success');
  if (!success) {
    success = document.createElement('p');
    success.className = 'brief-form-success';
    form.appendChild(success);
  }

  try {
    const res = await fetch('https://formsubmit.co/ajax/Ben@BenjaminCoLab.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: email,
        _subject: 'New Brief Questionnaire request — auto-sent link',
        _template: 'table',
        _captcha: 'false',
        _autoresponse: `Hey —\n\nThanks for reaching out. Here's the Creative Brief Questionnaire we'll work through together:\n\nhttps://benjamincolab-brief-builder.vercel.app\n\nFill it out before our meeting and export the PDF when you're done, or we can walk through it together on our call. Either way, this gets us aligned fast.\n\nSee you soon.\n— Ben\nBenjamin Co//Lab\nBen@BenjaminCoLab.com`
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      success.innerHTML = `<strong>Sent.</strong> Check <strong style="color:var(--text)">${email}</strong> — the questionnaire link is on its way.`;
      success.classList.add('show');
      emailInput.value = '';
      btnSpan.textContent = 'Sent ✓';
      setTimeout(() => { btnSpan.textContent = originalLabel; btn.disabled = false; }, 4000);
    } else {
      throw new Error('FormSubmit rejected');
    }
  } catch (err) {
    success.innerHTML = `Couldn't send automatically. Email Ben directly at <a href="mailto:Ben@BenjaminCoLab.com?subject=Send%20me%20the%20Creative%20Brief&body=Hi%20Ben%2C%20please%20send%20me%20the%20questionnaire.%20My%20email%3A%20${encodeURIComponent(email)}" style="color:var(--accent)">Ben@BenjaminCoLab.com</a>.`;
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
