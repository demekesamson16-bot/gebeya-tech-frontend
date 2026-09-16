import { useNavigate } from 'react-router-dom';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';
import ContactCard from '../components/ContactCard';
import PageBack from '../components/PageBack';

const SELLER_USERNAME = 'S_DY24';

export default function Checkout({ cart }) {
  const nav = useNavigate();
  const { t } = useLanguage();

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <PageBack to="/cart" label="Back to cart" />
        <div className="empty">{t('cart_empty')}</div>
      </div>
    );
  }

  const itemsText = cart.items
    .map(
      (i) =>
        `• ${i.qty} × ${i.name} — Br${Number(i.price).toLocaleString()}`
    )
    .join('\n');

  const cartSummary = cart.items.map((i) => `${i.qty} × ${i.name}`).join('\n');

  const sendOrder = () => {
    haptic('medium');

    const message =
      `Hello GEBEYA TECH! 🛒\n\n` +
      `I want to order the following items:\n\n` +
      `${itemsText}\n\n` +
      `💰 Total: Br${Number(cart.total).toLocaleString()}\n\n` +
      `Please confirm availability and arrange everything.`;

    const url = `https://t.me/${SELLER_USERNAME}?text=${encodeURIComponent(
      message
    )}`;

    cart.clear();

    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch {
      window.location.href = url;
    }

    setTimeout(() => nav('/'), 800);
  };

  return (
    <div className="page">
      <PageBack to="/cart" label="Back to cart" />

      <div className="section-title">{t('checkout_title')}</div>

      <div
        style={{
          background: '#fafafa',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#555',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {t('your_order')}
        </div>

        {cart.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              padding: '6px 0',
              color: '#333',
            }}
          >
            <span>
              {item.qty} × {item.name}
            </span>
            <span style={{ fontWeight: 600 }}>
              Br{Number(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 16,
            fontWeight: 800,
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span>{t('total')}</span>
          <span>Br{Number(cart.total).toLocaleString()}</span>
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', fontSize: 16, padding: 18 }}
        onClick={sendOrder}
      >
        ✈️ {t('contact_seller')}
      </button>

      <div
        style={{
          fontSize: 13,
          color: '#666',
          textAlign: 'center',
          marginTop: 14,
          lineHeight: 1.5,
        }}
      >
        {t('order_via')}
      </div>

      <ContactCard productName={cartSummary} price={cart.total} />
    </div>
  );
}