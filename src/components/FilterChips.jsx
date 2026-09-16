import { useEffect, useState } from 'react';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// =====================================================
// Price ranges per category — customize freely
// =====================================================
const QUICK_RANGES = {
  phones: [
    ['', '15000', 'Under 15,000'],
    ['15000', '30000', '15,000 – 30,000'],
    ['30000', '50000', '30,000 – 50,000'],
    ['50000', '80000', '50,000 – 80,000'],
    ['80000', '120000', '80,000 – 120,000'],
    ['120000', '', 'Above 120,000'],
  ],
  laptops: [
    ['', '25000', 'Under 25,000'],
    ['25000', '50000', '25,000 – 50,000'],
    ['50000', '100000', '50,000 – 100,000'],
    ['100000', '200000', '100,000 – 200,000'],
    ['200000', '350000', '200,000 – 350,000'],
    ['350000', '500000', '350,000 – 500,000'],
    ['500000', '', 'Above 500,000'],
  ],
  accessories: [
    ['', '1000', 'Under 1,000'],
    ['1000', '3000', '1,000 – 3,000'],
    ['3000', '5000', '3,000 – 5,000'],
    ['5000', '10000', '5,000 – 10,000'],
    ['10000', '', 'Above 10,000'],
  ],
  tablets: [
    ['', '20000', 'Under 20,000'],
    ['20000', '40000', '20,000 – 40,000'],
    ['40000', '60000', '40,000 – 60,000'],
    ['60000', '100000', '60,000 – 100,000'],
    ['100000', '', 'Above 100,000'],
  ],
};

export default function FilterChips({ categorySlug, filters, onChange }) {
  const { t } = useLanguage();
  const [options, setOptions] = useState(null);
  const [open, setOpen] = useState(null);
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    if (!categorySlug) {
      setOptions(null);
      return;
    }
    fetch(`${API_BASE}/api/filters/${categorySlug}`)
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => setOptions(null));
  }, [categorySlug]);

  if (!categorySlug || !options) return null;

  const isAccessories = categorySlug === 'accessories';
  const ranges = QUICK_RANGES[categorySlug] || QUICK_RANGES.phones;

  const brandList = Object.keys(options.brand || {}).sort();
  const typeList = Object.keys(options.type || {}).sort();

  const brandCount = (filters.brand || []).length;
  const typeCount = (filters.type || []).length;
  const hasPrice = filters.min_price || filters.max_price;

  const openPanel = (kind) => {
    haptic('light');
    setDraft(filters);
    setOpen(kind);
  };

  const toggleBrand = (b) => {
    const list = draft.brand || [];
    const next = list.includes(b) ? list.filter((x) => x !== b) : [...list, b];
    setDraft({ ...draft, brand: next });
  };

  const toggleType = (ty) => {
    const list = draft.type || [];
    const next = list.includes(ty)
      ? list.filter((x) => x !== ty)
      : [...list, ty];
    setDraft({ ...draft, type: next });
  };

  const setQuickRange = (mn, mx) => {
    setDraft({ ...draft, min_price: mn, max_price: mx });
  };

  const apply = () => {
    haptic('medium');
    onChange(draft);
    setOpen(null);
  };

  const reset = () => {
    haptic('light');
    setDraft({ brand: [], type: [], min_price: '', max_price: '' });
  };

  // Translate a quick range label. Handles "Under X" and "Above X".
  const translateRange = (label) => {
    if (label.startsWith('Under ')) {
      const num = label.slice(6);
      return `${t('filter_under') || 'Under'} ${num}`;
    }
    if (label.startsWith('Above ')) {
      const num = label.slice(6);
      return `${t('filter_above') || 'Above'} ${num}`;
    }
    return label;
  };

  return (
    <>
      <div className="filter-bar">
        <button
          className={`filter-btn ${
            (isAccessories ? typeCount : brandCount) > 0 ? 'active' : ''
          }`}
          onClick={() => openPanel(isAccessories ? 'type' : 'brand')}
        >
          <span className="filter-btn-icon">
            {isAccessories ? '🎧' : '📱'}
          </span>
          <span className="filter-btn-label">
            {isAccessories ? t('filter_type') : t('filter_brand')}
          </span>
          {(isAccessories ? typeCount : brandCount) > 0 && (
            <span className="filter-btn-badge">
              {isAccessories ? typeCount : brandCount}
            </span>
          )}
          <span className="filter-btn-caret">▾</span>
        </button>

        <button
          className={`filter-btn ${hasPrice ? 'active' : ''}`}
          onClick={() => openPanel('price')}
        >
          <span className="filter-btn-icon">💰</span>
          <span className="filter-btn-label">{t('filter_price')}</span>
          {hasPrice && <span className="filter-btn-badge">✓</span>}
          <span className="filter-btn-caret">▾</span>
        </button>
      </div>

      {(brandCount > 0 || typeCount > 0 || hasPrice) && (
        <div className="filter-active-row">
          <span className="filter-active-label">{t('filter_active')}:</span>

          {!isAccessories &&
            (filters.brand || []).map((b) => (
              <button
                key={b}
                className="active-pill"
                onClick={() =>
                  onChange({
                    ...filters,
                    brand: (filters.brand || []).filter((x) => x !== b),
                  })
                }
              >
                {b} <span>✕</span>
              </button>
            ))}

          {isAccessories &&
            (filters.type || []).map((ty) => (
              <button
                key={ty}
                className="active-pill"
                onClick={() =>
                  onChange({
                    ...filters,
                    type: (filters.type || []).filter((x) => x !== ty),
                  })
                }
              >
                {ty} <span>✕</span>
              </button>
            ))}

          {hasPrice && (
            <button
              className="active-pill"
              onClick={() =>
                onChange({ ...filters, min_price: '', max_price: '' })
              }
            >
              Br {filters.min_price || '0'} – {filters.max_price || '∞'}{' '}
              <span>✕</span>
            </button>
          )}

          <button
            className="active-pill clear"
            onClick={() =>
              onChange({ brand: [], type: [], min_price: '', max_price: '' })
            }
          >
            {t('clear_all')}
          </button>
        </div>
      )}

      {open && (
        <div className="sheet-overlay" onClick={() => setOpen(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />

            <div className="sheet-header">
              <div className="sheet-title">
                {open === 'price' && `💰 ${t('filter_price_range')}`}
                {open === 'brand' && `📱 ${t('filter_choose_brands')}`}
                {open === 'type' && `🎧 ${t('filter_choose_type')}`}
              </div>
              <button className="sheet-close" onClick={() => setOpen(null)}>
                ✕
              </button>
            </div>

            <div className="sheet-body">
              {open === 'brand' &&
                brandList.map((b) => {
                  const checked = (draft.brand || []).includes(b);
                  return (
                    <div
                      key={b}
                      className={`sheet-row ${checked ? 'checked' : ''}`}
                      onClick={() => toggleBrand(b)}
                    >
                      <span className="sheet-row-label">{b}</span>
                      <span className="sheet-row-count">
                        {options.brand[b]}
                      </span>
                      <span className={`sheet-check ${checked ? 'on' : ''}`}>
                        {checked ? '✓' : ''}
                      </span>
                    </div>
                  );
                })}

              {open === 'type' &&
                typeList.map((ty) => {
                  const checked = (draft.type || []).includes(ty);
                  return (
                    <div
                      key={ty}
                      className={`sheet-row ${checked ? 'checked' : ''}`}
                      onClick={() => toggleType(ty)}
                    >
                      <span className="sheet-row-label">{ty}</span>
                      <span className="sheet-row-count">
                        {options.type[ty]}
                      </span>
                      <span className={`sheet-check ${checked ? 'on' : ''}`}>
                        {checked ? '✓' : ''}
                      </span>
                    </div>
                  );
                })}

              {open === 'price' && (
                <>
                  <div className="price-inputs">
                    <input
                      type="number"
                      className="input"
                      placeholder={t('filter_min')}
                      value={draft.min_price || ''}
                      onChange={(e) =>
                        setDraft({ ...draft, min_price: e.target.value })
                      }
                    />
                    <span className="price-dash">–</span>
                    <input
                      type="number"
                      className="input"
                      placeholder={t('filter_max')}
                      value={draft.max_price || ''}
                      onChange={(e) =>
                        setDraft({ ...draft, max_price: e.target.value })
                      }
                    />
                  </div>

                  <div className="sheet-section-title">
                    {t('filter_quick_ranges')}
                  </div>

                  {ranges.map(([mn, mx, label]) => {
                    const active =
                      String(draft.min_price || '') === String(mn) &&
                      String(draft.max_price || '') === String(mx);
                    return (
                      <div
                        key={label}
                        className={`sheet-row ${active ? 'checked' : ''}`}
                        onClick={() => setQuickRange(mn, mx)}
                      >
                        <span className="sheet-row-label">
                          {translateRange(label)} Br
                        </span>
                        <span className={`sheet-check ${active ? 'on' : ''}`}>
                          {active ? '✓' : ''}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="sheet-footer">
              <button className="btn-secondary" onClick={reset}>
                {t('reset')}
              </button>
              <button className="btn-primary" onClick={apply}>
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
