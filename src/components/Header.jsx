import { Link } from 'react-router-dom';
import { tg } from '../telegram';
import { useLanguage } from '../LanguageContext';

export default function Header({ onSearch }) {
  const { lang, setLang, t } = useLanguage();

  const share = () => {
    const url =
      'https://t.me/share/url?url=' +
      encodeURIComponent('https://t.me/Gebeya_tech_bot') +
      '&text=' +
      encodeURIComponent('Check out GEBEYA TECH - phones, laptops & tech!');
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, '_blank');
  };

  return (
    <>
      <div className="header">
        <div className="header-row">
          <Link to="/" className="brand-logo">
            <span>{t('brand')}</span>
          </Link>

          <div className="header-actions">
            <div className="lang-toggle">
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-label="English"
              >
                EN
              </button>
              <button
                className={`lang-btn ${lang === 'am' ? 'active' : ''}`}
                onClick={() => setLang('am')}
                aria-label="Amharic"
              >
                አማ
              </button>
            </div>

            <button className="icon-btn" onClick={share} aria-label="Share">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
            </button>

            <Link to="/imei" className="imei-header-btn">
              🔍 Check IMEI
            </Link>
          </div>
        </div>
      </div>

      <div className="search-wrap">
        <input
          className="search"
          placeholder={t('search_placeholder')}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </>
  );
}