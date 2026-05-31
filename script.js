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
});

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
