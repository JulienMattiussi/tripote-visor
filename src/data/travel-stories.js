// Placeholder articles for the Travel Stories page. Author names are proper
// nouns and stay untranslated. Title, excerpt and category labels live in
// translations.ts_page.story_<key>_* — they switch with the active locale.

const photo = (id, q = 70, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

export const STORIES = [
  {
    key: 'highlands',
    image: photo('photo-1469854523086-cc02fe5d8800', 70, 1200),
    author: 'Camille Reynaud',
    date_iso: '2026-03-12',
    read_minutes: 8,
    category_key: 'adventure',
    featured: true,
  },
  {
    key: 'hanoi',
    image: photo('photo-1528127269322-539801943592'),
    author: 'Étienne Mercier',
    date_iso: '2026-02-28',
    read_minutes: 6,
    category_key: 'culture',
  },
  {
    key: 'paris_bistros',
    image: photo('photo-1414235077428-338989a2e8c0'),
    author: 'Lucie Aubry',
    date_iso: '2026-02-14',
    read_minutes: 5,
    category_key: 'food',
  },
  {
    key: 'iceland_budget',
    image: photo('photo-1490650404312-a2175773bbf5'),
    author: 'Marion Vidal',
    date_iso: '2026-01-30',
    read_minutes: 7,
    category_key: 'tips',
  },
];
