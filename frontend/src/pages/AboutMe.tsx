/**
 * External Imports
*/
import { useCallback, useEffect, useState } from 'react'
import { MapPin, Plane } from 'lucide-react'
/**
 * Internal Imports
 */
import { profile } from '@/data/profile'
import {
  lookingGlassPhotos,
  tetonPhotos,
  rainierPhotos,
  whitneyPhotos,
  mojonRojoPhotos,
} from '@/assets/trips'

/**
 * Defines the metadata for each mountain card and its carousel.
 */
type MountainTrip = {
  name: string
  range: string
  elevation: string
  blurb: string
  photos: readonly string[]
}

/**
 * Curated summits used to illustrate personal stories and photography.
 */
const mountains: MountainTrip[] = [
  {
    name: 'Mount Rainier',
    range: 'Cascade Range, WA',
    elevation: '14,411 ft',
    photos: rainierPhotos,
    blurb: 'Long glacier pushes, rope teams, and weather windows that demand patience and planning — a perfect metaphor for product work.',
  },
  {
    name: 'Grand Teton',
    range: 'Teton Range, WY',
    elevation: '13,775 ft',
    photos: tetonPhotos,
    blurb: 'My first major alpine summit — where I learned to love early starts, glacier travel, and moving efficiently on ridge lines.',
  },
  {
    name: 'Mount Whitney',
    range: 'Sierra Nevada, CA',
    elevation: '14,505 ft',
    photos: whitneyPhotos,
    blurb: 'Exposure, switchbacks, and high-altitude pacing taught me how to stay calm, conserve energy, and lead in thin air.',
  },
  {
    name: 'Mojón Rojo',
    range: 'Patagonia, Argentina',
    elevation: '7,438 ft',
    photos: mojonRojoPhotos,
    blurb: 'Patagonian wind and weather keep you humble. These missions remind me to respect nature and enjoy every ridge line.',
  },
  {
    name: 'Looking Glass Rock',
    range: 'Pisgah National Forest, NC',
    elevation: '3,969 ft',
    photos: lookingGlassPhotos,
    blurb: 'Blue Ridge sandstone, long rappels, and humid approach hikes — this is home terrain where I coach friends on their first multi-pitch climbs.',
  },
] as const

/**
 * About-me page combining a location card with interactive summit photo carousels.
 */
export default function AboutMe() {
  const [photoIndex, setPhotoIndex] = useState<Record<string, number>>({})
  const [modal, setModal] = useState<{ name: string; index: number } | null>(null)
  const activeMountain = modal ? mountains.find((m) => m.name === modal.name) : null

  const handleModalShift = useCallback(
    (direction: 1 | -1) => {
      if (!modal || !activeMountain) return
      const total = activeMountain.photos.length
      const next = (modal.index + direction + total) % total
      setPhotoIndex((prev) => ({ ...prev, [modal.name]: next }))
      setModal({ name: modal.name, index: next })
    },
    [modal, activeMountain]
  )

  const shiftPhoto = (name: string, total: number, direction: 1 | -1) => {
    setPhotoIndex((prev) => {
      const current = prev[name] ?? 0
      const next = (current + direction + total) % total
      return { ...prev, [name]: next }
    })
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null)
      if (modal && activeMountain) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          handleModalShift(-1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          handleModalShift(1)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modal, activeMountain, handleModalShift])

  return (
    <section className="grid gap-8 text-slate-900 dark:text-slate-100">
      <header className="max-w-3xl space-y-4">
        <h2 className="section-title">About Me</h2>
      </header>

      <section className="grid gap-4">
        <article className="card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 grid place-items-center">
              <MapPin />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Based in</p>
              <p className="text-2xl font-semibold">{profile.location}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 px-3 py-1 rounded-full w-fit">
            <Plane size={16} />
            Willing to relocate for the right team
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Outside of work, I’m usually traveling, hiking, fishing, or planning a weekend somewhere new. I climb when I can, but mostly I just like being outdoors and staying active. I enjoy trying new things, checking out new spots, and taking a break from the screen. It keeps me balanced and helps me come back to work with a clear head.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {[
              'Syracuse, NY',
              'Albany, NY',
              'Nashville, TN (TVA)',
              'Fort Myers, FL (Junior Hockey)',
              'Knoxville, TN (College)',
              'Nashville, TN (Now)',
            ].map((stop, index, arr) => (
              <span key={stop} className="flex items-center gap-2 whitespace-nowrap">
                <span>{stop}</span>
                {index < arr.length - 1 && <span aria-hidden="true">✈︎</span>}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
            <h3 className="text-xl font-semibold">Notable Summits</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">A few mountains that shaped how I approach life and work.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {mountains.map((mountain) => {
            const idx = photoIndex[mountain.name] ?? 0
            const total = mountain.photos.length
            const photo = mountain.photos[idx]

            return (
              <article key={mountain.name} className="card overflow-hidden">
                <div className="relative group">
                  <button
                    className="block w-full"
                    onClick={() => setModal({ name: mountain.name, index: idx })}
                    aria-label={`Expand ${mountain.name} photo ${idx + 1}`}
                  >
                    <img
                      src={photo}
                      alt={`${mountain.name} trip photo ${idx + 1}`}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                  {total > 1 && (
                    <>
                      <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center opacity-80 hover:opacity-100 transition"
                        onClick={() => shiftPhoto(mountain.name, total, -1)}
                        aria-label={`Previous ${mountain.name} photo`}
                      >
                        <span className="text-lg">‹</span>
                      </button>
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center opacity-80 hover:opacity-100 transition"
                        onClick={() => shiftPhoto(mountain.name, total, 1)}
                        aria-label={`Next ${mountain.name} photo`}
                      >
                        <span className="text-lg">›</span>
                      </button>
                    </>
                  )}
                  <span className="absolute bottom-3 right-3 text-xs font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
                    {idx + 1}/{total}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{mountain.name}</h4>
                    <span className="text-xs uppercase tracking-wide text-slate-400">{mountain.range}</span>
                  </div>
                  <p className="text-xs text-slate-500">Elevation {mountain.elevation}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{mountain.blurb}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {modal && activeMountain && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModal(null)}
          role="dialog"
          aria-label={`${activeMountain.name} photo viewer`}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900/70 rounded-3xl p-4" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
              onClick={() => setModal(null)}
              aria-label="Close photo viewer"
            >
              ×
            </button>
            <div className="relative flex items-center justify-center">
              <img
                src={activeMountain.photos[modal.index]}
                alt={`${activeMountain.name} expanded view ${modal.index + 1}`}
                className="max-h-[70vh] w-full object-contain rounded-2xl"
              />
              {activeMountain.photos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 text-white text-2xl"
                    onClick={() => handleModalShift(-1)}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 text-white text-2xl"
                    onClick={() => handleModalShift(1)}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-slate-100">
              <p className="font-semibold">{activeMountain.name}</p>
              <p className="text-slate-300">{activeMountain.range} · Elevation {activeMountain.elevation}</p>
              <p className="text-xs text-slate-400 mt-1">
                Photo {modal.index + 1} of {activeMountain.photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
