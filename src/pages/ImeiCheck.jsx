import { useState } from 'react';
import { haptic } from '../telegram';
import { useLanguage } from '../LanguageContext';
import { API_BASE } from '../api';

export default function ImeiCheck() {
  const { t } = useLanguage();
  const [imei, setImei] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const clean = imei.trim().replace(/\s/g, '');
    if (clean.length < 5) return;

    haptic('medium');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/imei/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei: clean }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImei('');
    setResult(null);
  };

  const reasonText = (reason) => {
    if (!reason) return '';
    if (reason.startsWith('wrong_length_')) {
      const n = reason.split('_').pop();
      return `IMEIs are exactly 15 digits — you entered ${n}.`;
    }
    if (reason === 'checksum_failed') {
      return 'This number fails the checksum test. Check for typos, or the number may be fabricated.';
    }
    if (reason === 'not_numeric') {
      return 'IMEI must contain only digits.';
    }
    return 'This number is not a valid IMEI.';
  };

  return (
    <div className="page">
      <div className="section-title">🔍 IMEI Checker</div>

      <p
        style={{
          color: '#7a6b55',
          fontSize: 14,
          lineHeight: 1.55,
          marginBottom: 20,
        }}
      >
        Verify any phone's IMEI before you buy it. Dial{' '}
        <strong>*#06#</strong> on the phone to see its IMEI.
      </p>

      <label className="label">IMEI number</label>
      <input
        className="input"
        type="tel"
        inputMode="numeric"
        placeholder="e.g. 356759040000007"
        value={imei}
        maxLength={20}
        onChange={(e) => setImei(e.target.value.replace(/[^\d]/g, ''))}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={submit}
          disabled={loading || imei.length < 5}
        >
          {loading ? 'Checking…' : '🔍 Check IMEI'}
        </button>
        {result && (
          <button className="btn-secondary" onClick={clear}>
            Clear
          </button>
        )}
      </div>

      {result && !result.error && (
        <div style={{ marginTop: 24 }}>
          {result.valid ? (
            <div className="imei-banner imei-banner-ok">
              <span style={{ fontSize: 28 }}>✅</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  Valid IMEI format
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                  Format and checksum both check out
                </div>
              </div>
            </div>
          ) : (
            <div className="imei-banner imei-banner-bad">
              <span style={{ fontSize: 28 }}>❌</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  Invalid IMEI
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                  {reasonText(result.reason)}
                </div>
              </div>
            </div>
          )}

          {result.valid && result.device && (
            <div className="imei-device-card">
              <div className="imei-device-icon">📱</div>
              <div>
                <div className="imei-device-label">
                  This IMEI belongs to:
                </div>
                <div className="imei-device-name">
                  {result.device.brand} · {result.device.model}
                </div>
              </div>
            </div>
          )}

          {result.valid && !result.device && (
            <div className="imei-device-card imei-device-unknown">
              <div className="imei-device-icon">⚪</div>
              <div>
                <div className="imei-device-label">
                  Device not in our database
                </div>
                <div
                  className="imei-device-name"
                  style={{ color: '#7a6b55', fontSize: 14 }}
                >
                  Probably a rare or regional model
                </div>
              </div>
            </div>
          )}

          {result.valid && (
            <div className="specs-table" style={{ marginTop: 16 }}>
              <h3>📋 Details</h3>
              {result.tac && (
                <div className="specs-row">
                  <span className="specs-label">TAC (device code)</span>
                  <span className="specs-value">{result.tac}</span>
                </div>
              )}
              {result.serial && (
                <div className="specs-row">
                  <span className="specs-label">Serial number</span>
                  <span className="specs-value">{result.serial}</span>
                </div>
              )}
              {result.check_digit && (
                <div className="specs-row">
                  <span className="specs-label">Check digit</span>
                  <span className="specs-value">{result.check_digit}</span>
                </div>
              )}
            </div>
          )}

          <div className="imei-warning">
            ⚠️ This tells you if the IMEI format is correct and which
            device it belongs to. It <strong>does not</strong> tell you if
            the phone is stolen or blacklisted. Always test the phone in
            person before paying.
          </div>
        </div>
      )}
    </div>
  );
}