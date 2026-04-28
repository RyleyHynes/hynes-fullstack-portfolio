import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import type { RouteModel } from '@/features/api/celiumRoutes'

const routeMarkerIcon = L.divIcon({
  className: 'celium-marker',
  html: '<span class="celium-marker__pin"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const userMarkerIcon = L.divIcon({
  className: 'celium-marker celium-marker--user',
  html: '<span class="celium-marker__pin"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

type RouteMapProps = {
  routes: RouteModel[]
  userLocation?: [number, number] | null
  onMarkerClick?: (id: string) => void
  selectedRouteId?: string | null
}

const AutoFit = ({ routes }: { routes: RouteModel[] }) => {
  const map = useMap()
  useEffect(() => {
    if (!routes.length) return
    const bounds = L.latLngBounds(
      routes.map(route => [route.startLatitude, route.startLongitude] as [number, number])
    )
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
  }, [map, routes])
  return null
}

const FocusRoute = ({ routes, selectedRouteId }: { routes: RouteModel[]; selectedRouteId?: string | null }) => {
  const map = useMap()
  useEffect(() => {
    if (!selectedRouteId) return
    const selected = routes.find(route => route.id === selectedRouteId)
    if (!selected) return
    map.flyTo([selected.startLatitude, selected.startLongitude], 12, { duration: 0.6 })
  }, [map, routes, selectedRouteId])
  return null
}

export default function RouteMap({ routes, userLocation, onMarkerClick, selectedRouteId }: RouteMapProps) {
  const center = useMemo<[number, number]>(() => {
    const first = routes[0]
    return first ? [first.startLatitude, first.startLongitude] : [39.7392, -104.9903]
  }, [routes])

  return (
    <MapContainer center={center} zoom={10} className="h-full w-full">
      <AutoFit routes={routes} />
      <FocusRoute routes={routes} selectedRouteId={selectedRouteId} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.map(route => (
        <Marker
          key={route.id}
          position={[route.startLatitude, route.startLongitude]}
          icon={routeMarkerIcon}
          eventHandlers={onMarkerClick ? { click: () => onMarkerClick(route.id) } : undefined}
        >
          <Popup>
            <div className="text-sm">
              <strong>{route.name}</strong>
              <div>{route.distanceMiles} mi · {route.elevationGainFt} ft</div>
            </div>
          </Popup>
        </Marker>
      ))}
      {userLocation ? (
        <Marker position={userLocation} icon={userMarkerIcon}>
          <Popup>
            <div className="text-sm">
              <strong>Your location</strong>
            </div>
          </Popup>
        </Marker>
      ) : null}
    </MapContainer>
  )
}
