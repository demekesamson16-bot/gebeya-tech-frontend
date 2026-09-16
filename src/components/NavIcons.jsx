/**
 * Ethiopian-inspired bottom-nav icons.
 * Filled style for clarity at small sizes.
 */

export function ShopIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8 L12 3.5 L20.5 8" />
      <path d="M3.5 8 L20.5 8" />
      <path d="M5.5 8 L5.5 20 L18.5 20 L18.5 8" />
      <path d="M10 20 L10 14 L14 14 L14 20" />
    </svg>
  );
}

export function MesobCartIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Conical lid — filled triangle */}
      <path
        d="M7 9 L12 3 L17 9 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Lid band */}
      <rect x="5" y="9" width="14" height="1.8" rx="0.9" fill={color} />
      {/* Basket body — filled, tapered */}
      <path
        d="M6 11 L8 20 Q8 20.8 8.8 20.8 L15.2 20.8 Q16 20.8 16 20 L18 11 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Weave detail — 2 dark lines across body */}
      <line x1="7.2" y1="14" x2="16.8" y2="14" stroke="#fffdf7" strokeWidth="0.9" />
      <line x1="7.8" y1="17.5" x2="16.2" y2="17.5" stroke="#fffdf7" strokeWidth="0.9" />
    </svg>
  );
}

export function OrdersIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Page with folded corner (receipt style) */}
      <path d="M6 3.5 L15 3.5 L19 7.5 L19 20.5 L6 20.5 Z" />
      {/* Folded corner */}
      <path d="M15 3.5 L15 7.5 L19 7.5" />
      {/* Big checkmark inside */}
      <path d="M9.5 13 L11.5 15 L15.5 10.5" strokeWidth="2.2" />
    </svg>
  );
}