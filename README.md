# 🗺️ CCSE · Mapa de España

Mapa interactivo para estudiar **de forma visual** la geografía del examen **CCSE**
(Conocimientos Constitucionales y Socioculturales de España) del Instituto Cervantes.

Coloca sobre el mapa los datos del examen con referencia geográfica: capitales
autonómicas, lenguas cooficiales, policías autonómicas (Mossos, Ertzaintza, Policía
Foral), fiestas populares, museos, monumentos, ríos y montañas.

**En vivo:** https://carlows.github.io/ccse26/

## Funcionalidades

- 📍 Marcadores por categoría con filtros (chips) y buscador.
- 🎨 Colorea las comunidades autónomas por **lengua cooficial** o **policía autonómica**.
- 🧠 **Modo estudio**: oculta la respuesta hasta que pulsas la pregunta.
- 🔎 Lista lateral sincronizada con el mapa (clic → vuela al lugar).

## Datos

Todos los contenidos están **verificados contra el Manual CCSE 2026 oficial** del
Instituto Cervantes (Tarea 3 — Organización territorial / Geografía física y política).
Los datos se editan en [`src/data/places.js`](src/data/places.js).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Despliegue

Automático con GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`:
compila y publica `dist/` en la rama `gh-pages`.
En el repositorio, activa **Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`**.

Stack: React + Vite + React-Leaflet · mapa base CARTO Voyager.
