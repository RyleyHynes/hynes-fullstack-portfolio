import { routeMetadata } from '@/celium/routeMetadata'

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const photoMap = routeMetadata.reduce<Record<string, readonly string[]>>((accumulator, entry) => {
  entry.aliases.forEach((alias) => {
    accumulator[normalizeName(alias)] = entry.photos
  })
  return accumulator
}, {})

export const getRoutePhotos = (routeName: string) => (
  photoMap[normalizeName(routeName)] ?? []
)
