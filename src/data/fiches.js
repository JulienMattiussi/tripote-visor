import advicesData from './advices.json';

export function reviewCountFor(id) {
  const list = advicesData[id];
  return Array.isArray(list) ? list.length : 0;
}

export function reviewAverageFor(id) {
  const list = advicesData[id];
  if (!Array.isArray(list) || !list.length) return 0;
  return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
}

export function formatLieu(fiche) {
  if (!fiche) return '';
  const ville = fiche.ville ?? '';
  const lieu = fiche.lieu ?? '';
  if (ville && lieu) return `${ville} (${lieu})`;
  return ville || lieu;
}
