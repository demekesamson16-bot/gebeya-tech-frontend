import { useEffect, useState } from 'react';
import { api } from '../api';
import { useLanguage } from '../LanguageContext';
import PageBack from '../components/PageBack';

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty">{t('loading')}</div>;

  if (orders.length === 0) {
    return (
      <div className="page">
        <PageBack to="/" label="Back to shop" />
        <div className="section-title">{t('orders_title')}</div>
        <div className="empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          {t('orders_empty')}
        </div>
      </div>
    );
  }

  const statusLabel = (s) => {
    const key = `order_status_${s}`;
    const translated = t(key);
    return translated === key ? s : translated;
  };

  return (
    <div className="page">
      <PageBack to="/" label="Back to shop" />

      <div className="section-title">{t('orders_title')}</div>

      {orders.map((o) => (
        <div key={o.id} className="order-card">
          <div className="order-header">
            <div className="order-id">#{o.id}</div>
            <div className={`order-status status-${o.status}`}>
              {statusLabel(o.status)}
            </div>
          </div>

          {o.items.map((it) => (
            <div key={it.product_id} className="order-item-line">
              <span>
                {it.quantity} × {it.name}
              </span>
              <span>Br{Number(it.price * it.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="order-total">
            <span>{t('total')}</span>
            <span>Br{Number(o.total).toLocaleString()}</span>
          </div>

          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            {new Date(o.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}