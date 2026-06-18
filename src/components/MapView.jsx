import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet'
import { CATEGORIES, REGION_SCHEMES } from '../data/places.js'

const SPAIN_CENTER = [39.6, -3.6]

// Vuela al lugar seleccionado en la lista.
function FlyTo({ place }) {
  const map = useMap()
  useEffect(() => {
    if (place) map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 8), { duration: 0.8 })
  }, [place, map])
  return null
}

function PlacePopup({ place, studyMode }) {
  const [revealed, setRevealed] = useState(!studyMode)
  useEffect(() => setRevealed(!studyMode), [studyMode, place.id])
  const cat = CATEGORIES[place.category]
  return (
    <div className="popup">
      <span className="popup-tag" style={{ background: cat.color }}>{cat.emoji} {cat.label}</span>
      <p className="popup-q">{place.question}</p>
      {revealed ? (
        <p className="popup-a">{place.answer}</p>
      ) : (
        <button className="reveal" onClick={() => setRevealed(true)}>Ver respuesta</button>
      )}
    </div>
  )
}

export default function MapView({ places, regionScheme, studyMode, selectedId, setSelectedId }) {
  const [geo, setGeo] = useState(null)
  const selected = places.find((p) => p.id === selectedId) || null

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}spain-communities.geojson`)
      .then((r) => r.json())
      .then(setGeo)
      .catch(() => setGeo(null))
  }, [])

  const scheme = REGION_SCHEMES[regionScheme]
  const styleFn = (feature) => {
    const fill = scheme.map[feature.properties.name]
    return {
      fillColor: fill || '#e2e8f0',
      fillOpacity: regionScheme === 'none' ? 0.04 : fill ? 0.55 : 0.12,
      color: '#94a3b8',
      weight: 1,
    }
  }

  return (
    <main className="map-wrap">
      <MapContainer center={SPAIN_CENTER} zoom={6} minZoom={5} className="map" worldCopyJump>
        {/* CARTO Voyager sin etiquetas: base limpia y sin texto en inglés.
            Los nombres (en español) los aportan los marcadores al pasar el ratón. */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> · &copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        {geo && (
          <GeoJSON key={regionScheme} data={geo} style={styleFn} interactive={false} />
        )}
        {places.map((p) => {
          const cat = CATEGORIES[p.category]
          const isSel = p.id === selectedId
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={isSel ? 11 : 7}
              pathOptions={{
                color: '#fff',
                weight: isSel ? 3 : 1.5,
                fillColor: cat.color,
                fillOpacity: 0.95,
              }}
              eventHandlers={{ click: () => setSelectedId(p.id) }}
            >
              <Tooltip direction="top" offset={[0, -6]}>{cat.emoji} {p.name}</Tooltip>
              <Popup>
                <PlacePopup place={p} studyMode={studyMode} />
              </Popup>
            </CircleMarker>
          )
        })}
        <FlyTo place={selected} />
      </MapContainer>
    </main>
  )
}
