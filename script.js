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
  initCounters();
});

// ---- POČÍTADLÁ ČÍSEL ----
// Čísla v štatistikách (15+ rokov, 8 projektov, 168 m² ...) narátajú
// od 0 po cieľovú hodnotu, keď prvok vojde do viewportu.
// Funguje automaticky — parsuje hodnotu z textu, zachová prefix/suffix.
function initCounters() {
  const els = Array.from(document.querySelectorAll('.hm-n, .pts-n, .pd-param-val'));
  if (!els.length) return;

  // pre každý prvok zisti, či obsahuje číslo; ak nie (napr. "Žilina & SR"), preskoč
  const targets = [];
  els.forEach(el => {
    // ber len čistý textový obsah na úrovni prvku (kvôli <span> sufixom ako "+")
    const raw = el.textContent.trim();
    const match = raw.match(/^(\D*)(\d[\d\s]*)(.*)$/s);
    if (!match) return;                       // žiadne číslo -> nechaj tak
    const value = parseInt(match[2].replace(/\s/g, ''), 10);
    if (isNaN(value)) return;
    targets.push({
      el,
      prefix: match[1],
      value,
      suffix: match[3].replace(/\s+/g, ' '),  // napr. " m²" alebo "+"
      done: false
    });
  });
  if (!targets.length) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(t) {
    if (t.done) return;
    t.done = true;
    if (reduce) {                             // bez animácie -> rovno finálna hodnota
      t.el.textContent = t.prefix + t.value + t.suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const easeOut = p => 1 - Math.pow(1 - p, 3);
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const current = Math.round(easeOut(p) * t.value);
      t.el.textContent = t.prefix + current + t.suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // skry sufixové <span> deti — prepisujeme textContent celého prvku
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const t = targets.find(x => x.el === entry.target);
        if (t) animate(t);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  targets.forEach(t => {
    t.el.textContent = t.prefix + '0' + t.suffix; // začni od 0
    observer.observe(t.el);
  });
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
