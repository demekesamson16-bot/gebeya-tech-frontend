import { useState } from 'react';
import Lightbox from './Lightbox';

export default function PhotoCarousel({ images = [], alt = '' }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#f7f7f7',
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          fontSize: 40,
          color: '#ccc',
        }}
      >
        📷
      </div>
    );
  }

  const goPrev = () =>
    setCurrent((c) => (c - 1 + images.length) % images.length);
  const goNext = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <div className="carousel">
        <div className="carousel-hero" onClick={() => setLightboxOpen(true)}>
          <img src={images[current]} alt={`${alt} ${current + 1}`} />

          <div className="carousel-counter">
            {current + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="carousel-thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                className={`carousel-thumb ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={src} alt={`Thumb ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={current}
          onClose={() => setLightboxOpen(false)}
          onChange={setCurrent}
        />
      )}
    </>
  );
}