import { useEffect } from 'react';

export default function Lightbox({ images = [], index = 0, onClose, onChange }) {
  useEffect(() => {
    // Lock body scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight') onChange?.((index + 1) % images.length);
      if (e.key === 'ArrowLeft')
        onChange?.((index - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, onClose, onChange]);

  if (!images || images.length === 0) return null;

  const goPrev = (e) => {
    e.stopPropagation();
    onChange?.((index - 1 + images.length) % images.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    onChange?.((index + 1) % images.length);
  };

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="lightbox-counter">
        {index + 1} / {images.length}
      </div>

      <img
        src={images[index]}
        alt={`Photo ${index + 1}`}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            className="lightbox-arrow lightbox-arrow-left"
            onClick={goPrev}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="lightbox-arrow lightbox-arrow-right"
            onClick={goNext}
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}