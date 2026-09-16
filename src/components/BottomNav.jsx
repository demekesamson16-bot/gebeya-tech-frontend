import { NavLink } from 'react-router-dom';
import { getUser } from '../telegram';
import { useLanguage } from '../LanguageContext';
import { ShopIcon, MesobCartIcon, OrdersIcon } from './NavIcons';

const ADMIN_TELEGRAM_ID = 5578558407;

export default function BottomNav({ cartCount = 0 }) {
  const { t } = useLanguage();
  const cls = ({ isActive }) => `nav-item ${isActive ? 'active' : ''}`;
  const user = getUser();
  const isAdmin = user?.id === ADMIN_TELEGRAM_ID;

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={cls}>
        <span className="nav-icon">
          <ShopIcon size={22} />
        </span>
        {t('nav_shop')}
      </NavLink>

      <NavLink to="/cart" className={cls}>
        <span className="nav-icon-wrap">
          <span className="nav-icon">
            <MesobCartIcon size={22} />
          </span>
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </span>
        {t('nav_cart')}
      </NavLink>

      <NavLink to="/orders" className={cls}>
        <span className="nav-icon">
          <OrdersIcon size={22} />
        </span>
        {t('nav_orders')}
      </NavLink>

      {isAdmin && (
        <NavLink to="/admin" className={cls}>
          <span className="nav-icon">⚙️</span>
          {t('nav_admin')}
        </NavLink>
      )}
    </nav>
  );
}