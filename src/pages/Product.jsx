import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, API_BASE } from '../api';
import { haptic } from '../telegram';
import PhotoCarousel from '../components/PhotoCarousel';
import SafetyBox from '../components/SafetyBox';
import ContactCard from '../components/ContactCard';
import PageBack from '../components/PageBack';
import { getSpecsForCategory } from '../specs';
import { useLanguage } from '../LanguageContext';

export default function Product({ cart }) {
  const { t } = useLanguage();
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([api.product(id), api.categories().catch(() => [])])
      .then(([prod, cats]) => {
        setProduct(prod);
        if (prod.category_id && Array.isArray(cats)) {
          setCategory(cats.find((c) => c.id === prod.category_id) || null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    haptic('medium');
    cart.add(product, qty);
    setToast(product.name);
    setTimeout(() => setToast(''), 1600);
  };

  if (loading) return <div className="empty">{t('loading')}</div>;
  if (!product) return <div className="empty">{t('no_products')}</div>;

  const images =
    Array.isArray(product.image_urls) && product.image_urls.length > 0
      ? product.image_urls.map((u) =>
          u.startsWith('http') ? u : `${API_BASE}${u}`
        )
      : product.image_url
      ? [
          product.image_url.startsWith('http')
            ? product.image_url
            : `${API_BASE}${product.image_url}`,
        ]
      : [];

  const condition =
    product.old_price && product.old_price > product.price
      ? t('product_used')
      : t('product_new');

  const specs = product.specs || {};
  const specFields =
    category && category.slug
      ? getSpecsForCategory(category.slug).fields
      : [];

  const specRows = specFields
    .map((f) => ({
      label: f.label,
      value: specs[f.key] ? String(specs[f.key]) : '',
    }))
    .filter((r) => r.value);

  return (
    <div className="detail">
      <PageBack />

      <PhotoCarousel images={images} alt={product.name} />

      <h1>{product.name}</h1>

      <div className="price">
        Br{Number(product.price).toLocaleString()}
        {product.old_price && product.old_price > product.price && (
          <span className="old-price">
            Br{Number(product.old_price).toLocaleString()}
          </span>
        )}
      </div>

      <div className="detail-meta">
        <span className="meta-chip">📍 Edna Mall · Bole</span>
        <span className="meta-chip">{condition}</span>
      </div>

      {product.warranty && (
        <div className="warranty-pill">
          <span className="warranty-icon">🏅</span>
          <div className="warranty-text">
            <span className="warranty-label">{product.warranty}</span>
            <span className="warranty-sub">Covers manufacturing defects</span>
          </div>
        </div>
      )}

      {category && category.slug && (
        <SafetyBox categorySlug={category.slug} />
      )}

      {product.stock > 0 ? (
        <div style={{ fontSize: 14, color: '#16a34a', marginTop: 12 }}>
          ✓ {t('in_stock')} ({product.stock} {t('available')})
        </div>
      ) : (
        <div style={{ fontSize: 14, color: '#ef4444', marginTop: 12 }}>
          ✗ {t('sold_out')}
        </div>
      )}

      {product.description && <p className="desc">{product.description}</p>}

      {specRows.length > 0 && (
        <div className="specs-table">
          <h3>📋 {t('product_specs')}</h3>
          {specRows.map((r) => (
            <div key={r.label} className="specs-row">
              <span className="specs-label">{r.label}</span>
              <span className="specs-value">{r.value}</span>
            </div>
          ))}
        </div>
      )}

      <ContactCard productName={product.name} price={product.price} />

      <div className="qty-row" style={{ marginTop: 16, marginBottom: 12 }}>
        <button
          className="qty-btn"
          onClick={() => setQty(Math.max(1, qty - 1))}
        >
          −
        </button>
        <span className="qty-val">{qty}</span>
        <button className="qty-btn" onClick={() => setQty(qty + 1)}>
          +
        </button>
      </div>

      <button
        className="btn-secondary"
        style={{ width: '100%' }}
        onClick={handleAdd}
        disabled={product.stock === 0}
      >
        🛍️ {t('add_to_cart')} · Br
        {Number(product.price * qty).toLocaleString()}
      </button>

      <button
        className="btn-secondary"
        style={{ width: '100%', marginTop: 10 }}
        onClick={() => nav('/')}
      >
        {t('continue_shopping')}
      </button>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 200,
          }}
        >
          ✓ {toast}
        </div>
      )}
    </div>
  );
}