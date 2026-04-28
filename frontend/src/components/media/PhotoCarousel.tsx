import { useEffect, useMemo } from 'react'

type PhotoCarouselProps = {
  photos: ReadonlyArray<File | string>
  index: number
  onPrev: () => void
  onNext: () => void
  onUpload?: (files: File[]) => void
}

const PhotoCarousel = ({ photos, index, onPrev, onNext, onUpload }: PhotoCarouselProps) => {
  const current = photos[index]
  const total = photos.length
  const src = useMemo(() => {
    if (!current) return ''
    return typeof current === 'string' ? current : URL.createObjectURL(current)
  }, [current])

  useEffect(() => {
    if (!current || typeof current === 'string') return
    return () => {
      URL.revokeObjectURL(src)
    }
  }, [current, src])

  return (
    <div className="grid gap-3">
      {onUpload ? (
        <input
          className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onUpload(Array.from(event.target.files ?? []))}
        />
      ) : null}
      <div className="relative h-72 sm:h-80 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center text-xs text-slate-400 overflow-hidden">
        {current ? (
          <>
            <img
              src={src}
              className="max-h-full w-full object-contain"
            />
            {total > 1 ? (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white text-2xl"
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white text-2xl"
                  type="button"
                  onClick={onNext}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            ) : null}
            <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
              {index + 1}/{total || 1}
            </span>
          </>
        ) : (
          'No photos yet'
        )}
      </div>
    </div>
  )
}

export default PhotoCarousel
