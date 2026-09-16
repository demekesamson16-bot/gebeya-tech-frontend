import { useEffect, useRef, useState } from 'react';
import { api, API_BASE } from '../api';
import { haptic, showAlert } from '../telegram';
import { getSpecsForCategory } from '../specs';
import { useLanguage } from '../LanguageContext';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  old_price: '',
  stock: '0',
  category_id: '',
  image_urls: [],
  specs: {},
  warranty: '',
};

export default function Admin() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const loadAll = async () => {
    try {
      const [p, c, o] = await Promise.all([
        api.products(),
        api.categories(),
        api.allOrders().catch(() => []),
      ]);
      setProducts(p);
      setCats(c);
      setOrders(o);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [...form.image_urls];
      for (const file of files) {
        const { url } = await api.uploadImage(file);
        uploaded.push(url);
      }
      setForm((f) => ({ ...f, image_urls: uploaded }));
      haptic('medium');
    } catch (err) {
      showAlert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setForm((f) => ({
      ...f,
      image_urls: f.image_urls.filter((_, i) => i !== index),
    }));
  };

  const submit = async () => {
    if (!form.name || !form.price) {
      showAlert('Name and price are required.');
      return;
    }
    if (form.image_urls.length === 0) {
      showAlert('Please add at least one photo.');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock: Number(form.stock) || 0,
      category_id: form.category_id ? Number(form.category_id) : null,
      image_url: form.image_urls[0] || '',
      image_urls: form.image_urls,
      specs: form.specs,
      warranty: form.warranty || null,
    };

    try {
      haptic('medium');
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      resetForm();
      await loadAll();
      showAlert(
        editingId ? t('admin_product_updated') : t('admin_product_added')
      );
      setTab('products');
    } catch (err) {
      showAlert('Error: ' + err.message);
    }
  };

  const startEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : '',
      stock: String(p.stock),
      category_id: p.category_id ? String(p.category_id) : '',
      image_urls:
        Array.isArray(p.image_urls) && p.image_urls.length > 0
          ? p.image_urls
          : p.image_url
          ? [p.image_url]
          : [],
      specs: p.specs || {},
      warranty: p.warranty || '',
    });
    setEditingId(p.id);
    setTab('add');
    window.scrollTo(0, 0);
  };

  const remove = async (id) => {
    haptic('medium');
    if (!confirm(t('admin_confirm_delete'))) return;
    try {
      await api.deleteProduct(id);
      await loadAll();
    } catch (err) {
      showAlert('Error: ' + err.message);
    }
  };

  const fullUrl = (u) => (u.startsWith('http') ? u : `${API_BASE}${u}`);

  const currentCat = cats.find(
    (c) => String(c.id) === String(form.category_id)
  );
  const specFields = currentCat
    ? getSpecsForCategory(currentCat.slug).fields
    : [];

  const updateSpec = (key, value) => {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  };

  return (
    <div className="page">
      <div className="section-title">{t('admin_title')}</div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'products' ? 'active' : ''}`}
          onClick={() => setTab('products')}
        >
          {t('admin_products')} ({products.length})
        </button>
        <button
          className={`admin-tab ${tab === 'add' ? 'active' : ''}`}
          onClick={() => setTab('add')}
        >
          {editingId ? t('admin_edit_product') : t('admin_add_product')}
        </button>
        <button
          className={`admin-tab ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          {t('admin_orders')} ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <div>
          {products.length === 0 && (
            <div className="empty">{t('no_products')}</div>
          )}
          {products.map((p) => (
            <div key={p.id} className="product-row">
              <img
                src={fullUrl(p.image_url || (p.image_urls?.[0] ?? ''))}
                alt={p.name}
                onError={(e) => (e.target.style.opacity = 0.3)}
              />
              <div className="product-row-info">
                <div className="product-row-name">{p.name}</div>
                <div className="product-row-price">
                  Br{Number(p.price).toLocaleString()} · stock {p.stock}
                </div>
              </div>
              <button
                className="admin-tab"
                onClick={() => startEdit(p)}
                style={{ marginRight: 6 }}
              >
                {t('edit')}
              </button>
              <button className="danger-btn" onClick={() => remove(p.id)}>
                {t('delete')}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'add' && (
        <div>
          <label className="label">
            {t('admin_photos')} ({form.image_urls.length})
          </label>

          <div className="photo-grid">
            {form.image_urls.map((url, i) => (
              <div key={i} className="photo-thumb">
                <img src={fullUrl(url)} alt={`Photo ${i + 1}`} />
                {i === 0 && (
                  <span className="photo-main">{t('admin_photo_main')}</span>
                )}
                <button
                  className="photo-remove"
                  onClick={() => removePhoto(i)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              className="photo-add"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? '…' : '+'}
              <span>
                {uploading ? t('admin_uploading') : t('admin_add_photo')}
              </span>
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
          />

          <label className="label">{t('admin_name')}</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('admin_name_placeholder')}
          />

          <label className="label">{t('admin_description')}</label>
          <textarea
            className="input textarea"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder={t('admin_description_placeholder')}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label className="label">{t('admin_price')}</label>
              <input
                className="input"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="70000"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">{t('admin_original_price')}</label>
              <input
                className="input"
                type="number"
                value={form.old_price}
                onChange={(e) =>
                  setForm({ ...form, old_price: e.target.value })
                }
                placeholder={t('optional')}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label className="label">{t('admin_stock')}</label>
              <input
                className="input"
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">{t('admin_category')}</label>
              <select
                className="input"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">{t('none')}</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="label">Warranty (optional)</label>
          <input
            className="input"
            value={form.warranty || ''}
            onChange={(e) =>
              setForm({ ...form, warranty: e.target.value })
            }
            placeholder="e.g. 6-Month Warranty"
          />

          {specFields.length > 0 && (
            <div className="spec-fields">
              <div className="spec-fields-title">
                🔍 {currentCat.name}
              </div>
              {specFields.map((field) => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="input"
                      value={form.specs[field.key] || ''}
                      onChange={(e) =>
                        updateSpec(field.key, e.target.value)
                      }
                    >
                      <option value="">{t('select')}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      value={form.specs[field.key] || ''}
                      onChange={(e) =>
                        updateSpec(field.key, e.target.value)
                      }
                      placeholder={field.placeholder || ''}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={submit}>
              {editingId ? t('save_changes') : t('admin_add_product')}
            </button>
            {editingId && (
              <button className="btn-secondary" onClick={resetForm}>
                {t('cancel')}
              </button>
            )}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.length === 0 && (
            <div className="empty">{t('orders_empty')}</div>
          )}
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <div className="order-id">#{o.id}</div>
                <div className={`order-status status-${o.status}`}>
                  {o.status}
                </div>
              </div>
              {o.items.map((it) => (
                <div key={it.product_id} className="order-item-line">
                  <span>
                    {it.quantity} × {it.name}
                  </span>
                  <span>
                    Br{Number(it.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="order-total">
                <span>{t('total')}</span>
                <span>Br{Number(o.total).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
                📞 {o.phone} · 📍 {o.address}
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    await api.setOrderStatus(o.id, 'delivered');
                    loadAll();
                  }}
                >
                  {t('admin_mark_delivered')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}