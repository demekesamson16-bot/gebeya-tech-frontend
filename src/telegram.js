export const tg = window.Telegram?.WebApp;

export function initTelegram() {
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.('#ffffff');
    tg.setBackgroundColor?.('#ffffff');
    tg.enableClosingConfirmation?.();
  } catch (e) {
    console.warn('Telegram init failed', e);
  }
}

export function initData() {
  return tg?.initData || '';
}

export function haptic(type = 'light') {
  try {
    tg?.HapticFeedback?.impactOccurred(type);
  } catch {}
}

export function showAlert(message) {
  if (tg?.showAlert) tg.showAlert(message);
  else alert(message);
}

export function getUser() {
  return tg?.initDataUnsafe?.user || null;
}

export function isTelegram() {
  return Boolean(tg && tg.initData && tg.initData.length > 0);
}
