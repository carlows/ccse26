import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Tooltip, Popup, useMap } from 'react-leaflet'
import { CATEGORIES, REGION_SCHEMES } from '../data/places.js'

const SPAIN_CENTER = [39.6, -3.6]

// Nombres de las comunidades autónomas en español, situados sobre el mapa
// para saber de un vistazo dónde está cada región (Cataluña, Andalucía…).
const REGION_LABELS = [
  { name: 'Galicia', lat: 42.75, lng: -7.9 },
  { name: 'Asturias', lat: 43.25, lng: -6.0 },
  { name: 'Cantabria', lat: 43.15, lng: -4.03 },
  { name: 'País Vasco', lat: 43.05, lng: -2.65 },
  { name: 'Navarra', lat: 42.65, lng: -1.6 },
  { name: 'La Rioja', lat: 42.28, lng: -2.5 },
  { name: 'Aragón', lat: 41.3, lng: -0.6 },
  { name: 'Cataluña', lat: 41.85, lng: 1.6 },
  { name: 'Castilla y León', lat: 41.7, lng: -4.9 },
  { name: 'Comunidad de Madrid', lat: 40.6, lng: -3.95 },
  { name: 'Extremadura', lat: 39.2, lng: -6.3 },
  { name: 'Castilla-La Mancha', lat: 39.35, lng: -2.9 },
  { name: 'Comunidad Valenciana', lat: 39.4, lng: -0.7 },
  { name: 'Islas Baleares', lat: 39.65, lng: 3.0 },
  { name: 'Región de Murcia', lat: 38.05, lng: -1.6 },
  { name: 'Andalucía', lat: 37.5, lng: -4.7 },
  { name: 'Canarias', lat: 28.5, lng: -15.7 },
]

const regionIcon = (name) =>
  L.divIcon({
    className: 'region-label',
    html: `<span>${name}</span>`,
    iconSize: [0, 0],
  })

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
        {REGION_LABELS.map((r) => (
          <Marker
            key={r.name}
            position={[r.lat, r.lng]}
            icon={regionIcon(r.name)}
            interactive={false}
            keyboard={false}
          />
        ))}
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
