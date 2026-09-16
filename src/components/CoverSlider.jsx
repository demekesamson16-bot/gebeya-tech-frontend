import { useEffect, useRef, useState } from 'react';

export default function CoverSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, images.length]);

  if (!images || images.length === 0) return null;

  const goTo = (i) => setCurrent(i);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const onTouchStart = (e) => {
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50) next();
      else if (diff < -50) prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setPaused(false), 6000);
  };

  return (
    <div
      className="cover-slider"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`cover-slide ${i === current ? 'active' : ''}`}
          aria-hidden={i !== current}
        >
          <img src={src} alt={`Cover ${i + 1}`} />
        </div>
      ))}

      {images.length > 1 && (
        <div className="cover-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`cover-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}