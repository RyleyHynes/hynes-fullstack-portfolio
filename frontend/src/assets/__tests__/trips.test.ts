import {
  rainierPhotos,
  tetonPhotos,
  whitneyPhotos,
  lookingGlassPhotos,
  mojonRojoPhotos,
} from '@/assets/trips'

describe('trip photo exports', () => {
  it('exports photo arrays', () => {
    expect(rainierPhotos.length).toBeGreaterThan(0)
    expect(tetonPhotos.length).toBeGreaterThan(0)
    expect(whitneyPhotos.length).toBeGreaterThan(0)
    expect(lookingGlassPhotos.length).toBeGreaterThan(0)
    expect(mojonRojoPhotos.length).toBeGreaterThan(0)
  })
})
