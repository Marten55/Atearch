# atearch — webová stránka

Statická webová stránka ateliéru **atearch** (Ing. arch. Anna Mäkká) — ateliér empatickej architektúry.

## Štruktúra

| Súbor | Popis |
|-------|-------|
| `index.html` | Domov |
| `o-nas.html` | O nás |
| `projekty.html` | Projekty (portfólio + filter) |
| `kontakt.html` | Kontakt (formulár) |
| `header.html` | Spoločná navigácia (vkladaná cez JS) |
| `footer.html` | Spoločná pätička (vkladaná cez JS) |
| `style.css` | Všetky štýly |
| `script.js` | Vkladanie header/footer, filter projektov, formulár |
| `Foto/` | Fotografie projektov |

## Spustenie lokálne

Header a pätička sa načítavajú cez `fetch()`, preto stránka potrebuje **lokálny server**
(otvorenie dvojklikom cez `file://` nebude fungovať):

```bash
python -m http.server 8000
```
Potom otvorte `http://localhost:8000`.

Alebo vo VS Code: rozšírenie **Live Server** → pravý klik na `index.html` → *Open with Live Server*.

## Nasadenie

Hostované cez **GitHub Pages** — `Settings → Pages → branch main / root`.
