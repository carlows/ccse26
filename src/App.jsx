import { useState, useMemo } from 'react'
import MapView from './components/MapView.jsx'
import Sidebar from './components/Sidebar.jsx'
import { PLACES, CATEGORIES } from './data/places.js'

export default function App() {
  const [activeCats, setActiveCats] = useState(() => new Set(Object.keys(CATEGORIES)))
  const [regionScheme, setRegionScheme] = useState('none')
  const [studyMode, setStudyMode] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PLACES.filter((p) => activeCats.has(p.category))
      .filter((p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.question.toLowerCase().includes(q) ||
        p.answer.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
      )
  }, [activeCats, query])

  const toggleCat = (key) =>
    setActiveCats((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="app">
      <Sidebar
        activeCats={activeCats}
        toggleCat={toggleCat}
        regionScheme={regionScheme}
        setRegionScheme={setRegionScheme}
        studyMode={studyMode}
        setStudyMode={setStudyMode}
        query={query}
        setQuery={setQuery}
        results={filtered}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      <MapView
        places={filtered}
        regionScheme={regionScheme}
        studyMode={studyMode}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  )
}
