import { useState, useEffect, useMemo, useCallback } from 'react';

const KEY = 'gebeya_cart_v1';

export function useCart() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          qty,
        },
      ];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    if (qty <= 0) return remove(id);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty } : i)));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items]
  );

  return { items, add, remove, setQty, clear, total, count };
}
