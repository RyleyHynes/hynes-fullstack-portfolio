import { rainierPhotos } from '@/assets/trips/rainer'
import { tetonPhotos } from '@/assets/trips/teton'
import { whitneyPhotos } from '@/assets/trips/whitney'
import { lookingGlassPhotos } from '@/assets/trips/lookingGlass'

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const photoMap: Record<string, readonly string[]> = {
  disappointmentcleaver: rainierPhotos,
  eastbuttress: whitneyPhotos,
  owenspalding: tetonPhotos,
  lookingglass: lookingGlassPhotos,
  thenose: lookingGlassPhotos,
}

export const getRoutePhotos = (routeName: string) => (
  photoMap[normalizeName(routeName)] ?? []
)
