import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CoverSlider from '../components/CoverSlider';
import FilterChips from '../components/FilterChips';
import cover1 from '../assets/cover1.jpg';
import cover2 from '../assets/cover2.jpg';
import { api } from '../api';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';

const CATEGORY_SLUGS = ['all', 'phones', 'laptops', 'accessories', 'tablets'];

const EMPTY_FILTERS = { brand: [], type: [], min_price: '', max_price: '' };

export default function Home({ cart }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const catLabel = (slug, fallback) => {
    const key = `cat_${slug}`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  useEffect(() => {
    api
      .categories()
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setCats([{ slug: 'all', name: 'All' }, ...list]);
        } else {
          setCats([
            { slug: 'all', name: 'All' },
            { slug: 'phones', name: 'Phones' },
            { slug: 'laptops', name: 'Laptops' },
            { slug: 'accessories', name: 'Accessories' },
          ]);
        }
      })
      .catch(() => {
        setCats([
          { slug: 'all', name: 'All' },
          { slug: 'phones', name: 'Phones' },
          { slug: 'laptops', name: 'Laptops' },
          { slug: 'accessories', name: 'Accessories' },
        ]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (query) params.q = query;
    if (activeCat !== 'all') params.category = activeCat;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;

    api
      .products(params)
      .then((list) => {
        let out = list;

        if (filters.brand && filters.brand.length > 0) {
          out = out.filter((p) => {
            const b = p.specs && p.specs.brand;
            return b && filters.brand.includes(b);
          });
        }

        if (filters.type && filters.type.length > 0) {
          out = out.filter((p) => {
            const t2 = p.specs && p.specs.type;
            return t2 && filters.type.includes(t2);
          });
        }

        setProducts(out);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat, query, filters]);

  const handleCatChange = (slug) => {
    haptic('light');
    setActiveCat(slug);
    setFilters(EMPTY_FILTERS);
  };

  const handleAdd = (product) => {
    cart.add(product);
    setToast(product.name);
    setTimeout(() => setToast(''), 1600);
  };

  return (
    <>
      <Header cartCount={cart.count} onSearch={setQuery} />

      {/* Cover — sliding banner */}
      <CoverSlider images={[cover1, cover2]} />

      {/* Category chips */}
      <div className="cats">
        {cats.map((c) => (
          <button
            key={c.slug}
            className={`chip ${activeCat === c.slug ? 'active' : ''}`}
            onClick={() => handleCatChange(c.slug)}
          >
            {catLabel(c.slug, c.name)}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      {activeCat !== 'all' && (
        <FilterChips
          categorySlug={activeCat}
          filters={filters}
          onChange={setFilters}
        />
      )}

      {loading ? (
        <div className="empty">{t('loading_products')}</div>
      ) : products.length === 0 ? (
        <div className="empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          {t('no_products')}
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}

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
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          ✓ {toast}
        </div>
      )}
    </>
  );
}