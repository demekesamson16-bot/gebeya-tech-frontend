import { Link, useNavigate } from 'react-router-dom';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';
import { API_BASE } from '../api';
import ContactCard from '../components/ContactCard';
import PageBack from '../components/PageBack';

export default function Cart({ cart }) {
  const nav = useNavigate();
  const { t } = useLanguage();

  const imgUrl = (u) => {
    if (!u) return '';
    return u.startsWith('http') ? u : `${API_BASE}${u}`;
  };

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <PageBack to="/" label="Back to shop" />
        <div className="section-title">{t('cart_title')}</div>
        <div className="empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          {t('cart_empty')}
          <div style={{ marginTop: 16 }}>
            <Link
              to="/"
              className="btn-primary"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                textDecoration: 'none',
              }}
            >
              {t('cart_start')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartSummary = cart.items
    .map((i) => `${i.qty} × ${i.name}`)
    .join('\n');

  return (
    <div className="page">
            

      <div className="section-title">
        {t('cart_title')} ({cart.count})
      </div>

      <div>
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            {item.image_url ? (
              <img
                src={imgUrl(item.image_url)}
                alt={item.name}
                onError={(e) => (e.target.style.opacity = 0.3)}
              />
            ) : (
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 10,
                  background: '#f7f7f7',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 24,
                  color: '#ccc',
                }}
              >
                📷
              </div>
            )}

            <div className="cart-item-info">
              <div className="cart-item-title">{item.name}</div>
              <div className="cart-item-price">
                Br{Number(item.price).toLocaleString()}
              </div>

              <div className="qty-row">
                <button
                  className="qty-btn"
                  onClick={() => {
                    haptic('light');
                    cart.setQty(item.id, item.qty - 1);
                  }}
                >
                  −
                </button>
                <span className="qty-val">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => {
                    haptic('light');
                    cart.setQty(item.id, item.qty + 1);
                  }}
                >
                  +
                </button>

                <button
                  className="danger-btn"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {
                    haptic('light');
                    cart.remove(item.id);
                  }}
                >
                  {t('remove')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>{t('total')}</span>
          <span>Br{Number(cart.total).toLocaleString()}</span>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', fontSize: 16, padding: 18 }}
          onClick={() => {
            haptic('medium');
            nav('/checkout');
          }}
        >
          🛒 {t('proceed_to_order')}
        </button>

        <div
          style={{
            fontSize: 12,
            color: '#888',
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          {t('no_payment_note')}
        </div>

        <button
          className="btn-secondary"
          style={{ width: '100%', marginTop: 12 }}
          onClick={() => nav('/')}
        >
          {t('continue_shopping')}
        </button>
      </div>

      <ContactCard productName={cartSummary} price={cart.total} />
    </div>
  );
}