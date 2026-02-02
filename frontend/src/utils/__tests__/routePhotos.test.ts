import { getRoutePhotos } from '@/utils/routePhotos'

describe('route photo mapping', () => {
  it('returns photos by normalized route name', () => {
    const photos = getRoutePhotos('Disappointment Cleaver')
    expect(photos.length).toBeGreaterThan(0)
  })

  it('returns empty array for unknown routes', () => {
    expect(getRoutePhotos('Unknown Route')).toEqual([])
  })
})
