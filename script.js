// ============================================================
//  atearch - spoločný JavaScript
// ============================================================

// ---- NAČÍTANIE HLAVIČKY A PÄTIČKY ----
// Hlavička a pätička sú v samostatných súboroch (header.html / footer.html)
// a načítavajú sa do každej stránky cez fetch.
async function loadPartial(targetId, file) {
  const host = document.getElementById(targetId);
  if (!host) return;
  try {
    const res = await fetch(file);
    host.innerHTML = await res.text();
  } catch (err) {
    console.error('Nepodarilo sa načítať ' + file, err);
  }
}

// Zvýrazní aktívnu položku v navigácii podľa data-page na <body>
function markActiveNav() {
  const current = document.body.getAttribute('data-page');
  if (!current) return;
  document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === current) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPartial('site-header', 'header.html');
  await loadPartial('site-footer', 'footer.html');
  markActiveNav();
  initScrollReveal();
});

// ---- SCROLL REVEAL ANIMÁCIE ----
// Automaticky označí kľúčové prvky triedou .reveal a sleduje ich vstup
// do viewportu cez IntersectionObserver. Netreba upravovať HTML.
function initScrollReveal() {
  // používateľ si neželá animácie -> nič nerobíme
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // prvky, ktoré chceme animovať pri scrollovaní
  const selectors = [
    '.section-head', '.svc-item', '.hp-card', '.hp-view-all',
    '.cta-strip', '.gallery-item', '.tl-item', '.val-item',
    '.ska-left', '.ska-right', '.ki-item', '.hours-item',
    '.kontakt-hero-right', '.pd-params', '.pd-desc', '.pd-ph', '.pd-nav',
    '.proj-type-stat', '.onas-hero-text', '.timeline-section .tl-aside'
  ];
  const els = document.querySelectorAll(selectors.join(','));
  if (!els.length) return;

  els.forEach(el => el.classList.add('reveal'));

  // stagger pre súrodencov v rámci spoločného rodiča (mriežky)
  const groups = new Map();
  els.forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
    const i = groups.get(parent);
    if (i >= 1 && i <= 4) el.classList.add('d' + i);
    groups.set(parent, i + 1);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => observer.observe(el));
}

// ---- FILTER PROJEKTOV (stránka Projekty) ----
function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = document.querySelectorAll('.gallery-item');
  let visible = 0;
  items.forEach(item => {
    const cats = item.getAttribute('data-cat') || '';
    if (cat === 'all' || cats.includes(cat)) {
      item.classList.remove('hidden');
      visible++;
    } else {
      item.classList.add('hidden');
    }
  });
  const noRes = document.getElementById('no-results');
  if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
}

// ---- ODOSLANIE FORMULÁRA (stránka Kontakt) ----
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Odosielam...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    btn.textContent = 'Odoslané ✓';
    e.target.reset();
  }, 1200);
}
