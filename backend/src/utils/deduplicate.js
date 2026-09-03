/**
 * Deduplicates an array of objects by a derived key, keeping the first
 * occurrence. Used to collapse duplicate scientific papers/products that
 * different queries against the same source may return.
 */
export const deduplicateBy = (items = [], keyFn) => {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
};

export default deduplicateBy;
