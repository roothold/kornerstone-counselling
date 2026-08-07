/* Kornerstone Counselling Centre — interactions */
(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal on scroll — with above-the-fold fallback so heroes never stay hidden
  const reveals = document.querySelectorAll('.reveal');
  const revealNow = (el) => el.classList.add('in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          revealNow(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
    // Immediate fallback: anything already in the initial viewport should show now,
    // even if the observer's first callback misses it (some browsers race on load).
    requestAnimationFrame(() => {
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) revealNow(el);
      });
    });
  } else {
    reveals.forEach(revealNow);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const ans  = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      ans.style.maxHeight = isOpen ? null : ans.scrollHeight + 'px';
    });
  });

  // FormSubmit AJAX for contact form
  document.querySelectorAll('form[data-formsubmit]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const btnOriginal = btn ? btn.textContent : '';
      const note = form.querySelector('.form-result') || (() => {
        const n = document.createElement('p');
        n.className = 'form-note form-result';
        n.setAttribute('role', 'status');
        n.setAttribute('aria-live', 'polite');
        form.appendChild(n);
        return n;
      })();
      note.textContent = '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!resp.ok) throw new Error('Server rejected');
        note.textContent = form.dataset.success || 'Thank you. We have received your message.';
        note.style.color = 'var(--teal-d)';
        if (btn) { btn.textContent = 'Sent'; }
        form.reset();
      } catch (err) {
        note.textContent = 'Something went wrong. Please try again, or email kstone@kstonecc.org directly.';
        note.style.color = '#c94c4c';
        if (btn) { btn.disabled = false; btn.textContent = btnOriginal; }
      }
    });
  });

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
