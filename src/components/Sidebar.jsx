import { CATEGORIES, REGION_SCHEMES } from '../data/places.js'

export default function Sidebar({
  activeCats, toggleCat, regionScheme, setRegionScheme,
  studyMode, setStudyMode, query, setQuery, results, selectedId, setSelectedId,
}) {
  return (
    <aside className="sidebar">
      <header className="brand">
        <div className="brand-mark">🗺️</div>
        <div>
          <h1>CCSE · Mapa de España</h1>
          <p>Estudia la geografía del examen de nacionalidad de forma visual</p>
        </div>
      </header>

      <div className="search">
        <span className="search-icon">🔎</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar capital, río, fiesta…"
        />
        {query && (
          <button className="clear" onClick={() => setQuery('')} aria-label="Limpiar">×</button>
        )}
      </div>

      <div className="toggle-row">
        <label className="switch">
          <input type="checkbox" checked={studyMode} onChange={(e) => setStudyMode(e.target.checked)} />
          <span className="slider" />
        </label>
        <div className="toggle-label">
          <strong>Modo estudio</strong>
          <span>Oculta la respuesta hasta que pulses la pregunta</span>
        </div>
      </div>

      <section className="block">
        <h2>Categorías</h2>
        <div className="chips">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const on = activeCats.has(key)
            return (
              <button
                key={key}
                className={`chip ${on ? 'on' : ''}`}
                style={on ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.color, color: cat.color }}
                onClick={() => toggleCat(key)}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="block">
        <h2>Colorear comunidades por…</h2>
        <div className="seg">
          {Object.entries(REGION_SCHEMES).map(([key, s]) => (
            <button
              key={key}
              className={`seg-btn ${regionScheme === key ? 'on' : ''}`}
              onClick={() => setRegionScheme(key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        {REGION_SCHEMES[regionScheme].legend.length > 0 && (
          <ul className="legend">
            {REGION_SCHEMES[regionScheme].legend.map((l) => (
              <li key={l.label}>
                <span className="swatch" style={{ background: l.color }} /> {l.label}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="block list-block">
        <h2>{results.length} lugares</h2>
        <ul className="results">
          {results.map((p) => {
            const cat = CATEGORIES[p.category]
            return (
              <li
                key={p.id}
                className={`result ${selectedId === p.id ? 'active' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="dot" style={{ background: cat.color }} />
                <div>
                  <strong>{cat.emoji} {p.name}</strong>
                  <span>{p.question}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className="foot">
        Datos basados en el manual CCSE del Instituto Cervantes. Hecho para estudiar 💪
      </footer>
    </aside>
  )
}
