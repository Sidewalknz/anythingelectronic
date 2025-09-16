// Simple localStorage store for selected products (client-only)
export const STORAGE_KEY = 'ae:selected-products';

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function getSelection() {
  if (!canUseStorage()) return [];
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') || [];
    // Backfill qty for any legacy items
    return Array.isArray(list) ? list.map(i => ({ ...i, qty: Math.max(1, Number(i?.qty) || 1) })) : [];
  } catch {
    return [];
  }
}

export function setSelection(items) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // notify listeners in other tabs/components
    window.dispatchEvent(new CustomEvent('ae-selection-change', { detail: items }));
  } catch {}
}

export function addItem(item) {
  const list = getSelection();
  const idx = list.findIndex((i) => i.partnumber === item.partnumber);
  if (idx === -1) {
    list.push({ ...item, qty: 1 });
  } else {
    // increment existing quantity
    const cur = list[idx];
    list[idx] = { ...cur, qty: Math.max(1, (Number(cur.qty) || 1) + 1) };
  }
  setSelection(list);
}

export function updateQuantity(partnumber, qty) {
  const list = getSelection();
  const idx = list.findIndex((i) => i.partnumber === partnumber);
  if (idx === -1) return;
  const n = Number(qty);
  if (!Number.isFinite(n)) return;
  if (n <= 0) {
    // treat zero or negative as remove
    setSelection(list.filter((i) => i.partnumber !== partnumber));
  } else {
    list[idx] = { ...list[idx], qty: Math.floor(n) };
    setSelection(list);
  }
}

export function removeItem(partnumber) {
  setSelection(getSelection().filter((i) => i.partnumber !== partnumber));
}

export function clearSelection() {
  setSelection([]);
}
