export const DAYS_ORDER = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const DAY_BY_INDEX = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export const todayName = () => DAY_BY_INDEX[new Date().getDay()];

export function todayStatus(schedule, t) {
  if (!schedule) return { open: false, label: '' };
  const todaySched = schedule.jours[todayName()];
  if (!todaySched) return { open: false, label: t('fiche_page.status_closed_today') };
  const [, end] = todaySched.split('-');
  return { open: true, label: t('fiche_page.status_open', { time: end }) };
}

export function orderedDays(schedule, t) {
  const today = todayName();
  return DAYS_ORDER.map((day) => ({
    key: day,
    label: t(`fiche_page.day_${day}`),
    time: schedule?.jours?.[day] ?? null,
    isToday: day === today,
  }));
}

const PERIODS = [
  { key: 'matin', ranges: [[360, 720]] },
  { key: 'midi', ranges: [[720, 840]] },
  { key: 'apres_midi', ranges: [[840, 1080]] },
  { key: 'soir', ranges: [[1080, 1320]] },
  {
    key: 'nuit',
    ranges: [
      [1320, 1440],
      [0, 360],
    ],
  },
];

const parseTime = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};

const segmentsOf = (range) => {
  const [s, e] = range.split('-').map(parseTime);
  if (e <= s)
    return [
      [s, 1440],
      [0, e],
    ];
  return [[s, e]];
};

const overlap = (a, b, c, d) => Math.max(a, c) < Math.min(b, d);

export function periodsOf(schedule, t) {
  if (!schedule) return [];
  const matched = new Set();
  for (const time of Object.values(schedule.jours)) {
    if (!time) continue;
    const segs = segmentsOf(time);
    for (const period of PERIODS) {
      if (matched.has(period.key)) continue;
      if (segs.some((s) => period.ranges.some((r) => overlap(s[0], s[1], r[0], r[1])))) {
        matched.add(period.key);
      }
    }
  }
  return PERIODS.filter((p) => matched.has(p.key)).map((p) => t(`fiche_page.period_${p.key}`));
}
