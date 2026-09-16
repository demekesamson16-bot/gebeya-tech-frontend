import { useEffect, useState } from 'react';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SafetyBox({ categorySlug }) {
  const { lang } = useLanguage();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    fetch(`${API_BASE}/api/checklists/${categorySlug}?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [categorySlug, lang]);

  if (!data) return null;

  return (
    <div className="safety-box">
      <button
        className="safety-header"
        onClick={() => {
          haptic('light');
          setOpen(!open);
        }}
      >
        <span className="safety-header-icon">✅</span>
        <div className="safety-header-text">
          <div className="safety-header-title">{data.title}</div>
          {data.preview && (
            <div className="safety-header-preview">{data.preview}</div>
          )}
        </div>
        <span className={`safety-caret ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="safety-body">
          {data.sections.map((section) => (
            <div key={section.heading} className="safety-section">
              <div className="safety-section-heading">{section.heading}</div>
              {section.items.map((item) => (
                <div key={item} className="safety-item">
                  <span className="safety-checkbox">☐</span>
                  <span className="safety-item-text">{item}</span>
                </div>
              ))}
            </div>
          ))}

          <div className="safety-footer">
            Not what you expected? Message us before accepting delivery.
          </div>
        </div>
      )}
    </div>
  );
}