import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';

const PHONE = '0977619012';
const PHONE_INTL = '+251977619012';
const TELEGRAM = 'S_DY24';

export default function ContactCard({ productName, price }) {
  const { t } = useLanguage();

  const openTelegram = () => {
    haptic('medium');
    const msg = encodeURIComponent(
      `Hello GEBEYA TECH!\n\nI'm interested in: ${productName}${
        price ? `\nPrice: Br${Number(price).toLocaleString()}` : ''
      }\n\nPlease send me more details.`
    );
    const url = `https://t.me/${TELEGRAM}?text=${msg}`;
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch {
      window.location.href = url;
    }
  };

  const callPhone = () => {
    haptic('medium');
    window.location.href = `tel:${PHONE_INTL}`;
  };

  return (
    <div className="contact-card">
      <div className="contact-card-top">
        <div className="contact-card-icon">💬</div>
        <div className="contact-card-title">
          <div className="contact-card-title-main">{t('contact_title')}</div>
          <div className="contact-card-title-sub">{t('contact_sub')}</div>
        </div>
      </div>

      <div className="contact-methods">
        {/* Telegram username — tap to open chat */}
        <button className="contact-method" onClick={openTelegram}>
          <span className="contact-method-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
          </span>
          <div className="contact-method-info">
            <div className="contact-method-label">{t('contact_telegram')}</div>
            <div className="contact-method-value">@{TELEGRAM}</div>
          </div>
          <span className="contact-method-arrow">›</span>
        </button>

        {/* Phone — tap to call */}
        <button className="contact-method" onClick={callPhone}>
          <span className="contact-method-icon">📞</span>
          <div className="contact-method-info">
            <div className="contact-method-label">{t('contact_phone')}</div>
            <div className="contact-method-value">{PHONE}</div>
          </div>
          <span className="contact-method-arrow">›</span>
        </button>
      </div>

      <button className="contact-primary" onClick={openTelegram}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
        </svg>
        {t('contact_button')}
      </button>

      <div className="contact-footnote">{t('contact_footnote')}</div>
    </div>
  );
}