import { useNavigate } from 'react-router-dom';
import { haptic } from '../telegram';
import { API_BASE } from '../api';
import { useLanguage } from '../LanguageContext';

export default function ProductCard({ product, onAdd }) {
  const nav = useNavigate();
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.stopPropagation();
    haptic('medium');
    onAdd?.(product);
  };

  const condition =
    product.old_price && product.old_price > product.price
      ? t('product_used') || 'Used'
      : t('product_new') || 'Brand New';

  const location = (product.specs && product.specs.location) || 'Addis Ababa';

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(
          ((product.old_price - product.price) / product.old_price) * 100
        )
      : null;

  const rawImage =
    product.image_url ||
    (Array.isArray(product.image_urls) ? product.image_urls[0] : '');
  const imageSrc = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${API_BASE}${rawImage}`
    : '';

  return (
    <div className="card" onClick={() => nav(`/product/${product.id}`)}>
      <div className="card-media">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            onError={(e) => (e.target.style.opacity = 0.25)}
          />
        ) : (
          <div className="card-no-image">📷</div>
        )}

        {discount && <span className="card-discount">-{discount}%</span>}

        <span className="card-condition">{condition}</span>

        {product.warranty && (
          <span className="card-warranty">🛡️</span>
        )}
      </div>

      <div className="card-body">
        <div className="card-price">
          Br{Number(product.price).toLocaleString()}
        </div>

        {product.old_price && product.old_price > product.price && (
          <div className="card-old-price">
            Br{Number(product.old_price).toLocaleString()}
          </div>
        )}

        <div className="card-title">{product.name}</div>

        <div className="card-location">📍 {location}</div>

        <button className="add-btn" onClick={handleAdd}>
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
}