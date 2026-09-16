import { useNavigate } from 'react-router-dom';
import { haptic } from '../telegram';

export default function PageBack({ label = 'Back', to = null }) {
  const nav = useNavigate();

  const goBack = () => {
    haptic('light');
    if (to) nav(to);
    else nav(-1);
  };

  return (
    <button className="page-back" onClick={goBack} aria-label="Go back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>{label}</span>
    </button>
  );
}