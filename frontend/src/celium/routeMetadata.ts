import { grooverPhotos } from '@/assets/trips/groover'
import { lookingGlassPhotos } from '@/assets/trips/looking-glass'
import { rainierPhotos } from '@/assets/trips/rainier'
import { tetonPhotos } from '@/assets/trips/teton'
import { whitneyPhotos } from '@/assets/trips/whitney'

export type RouteMetadata = {
  aliases: readonly string[]
  photos: readonly string[]
}

export const routeMetadata: readonly RouteMetadata[] = [
  {
    aliases: ['Disappointment Cleaver'],
    photos: rainierPhotos,
  },
  {
    aliases: ['East Buttress'],
    photos: whitneyPhotos,
  },
  {
    aliases: ['Owenspalding'],
    photos: tetonPhotos,
  },
  {
    aliases: ['Looking Glass', 'The Nose'],
    photos: lookingGlassPhotos,
  },
  {
    aliases: ['Groover', 'Groover - Laurel Knob'],
    photos: grooverPhotos,
  },
]

