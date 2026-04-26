const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_BY_INDEX = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const todayName = () => DAY_BY_INDEX[new Date().getDay()];

export function todayStatus(schedule, t) {
  if (!schedule) return { open: false, label: '' };
  const todaySched = schedule.days[todayName()];
  if (!todaySched) return { open: false, label: t('profile_page.status_closed_today') };
  const [, end] = todaySched.split('-');
  return { open: true, label: t('profile_page.status_open', { time: end }) };
}

export function orderedDays(schedule, t) {
  const today = todayName();
  return DAYS_ORDER.map((day) => ({
    key: day,
    label: t(`profile_page.day_${day}`),
    time: schedule?.days?.[day] ?? null,
    isToday: day === today,
  }));
}

const PERIODS = [
  { key: 'morning', ranges: [[360, 720]] },
  { key: 'noon', ranges: [[720, 840]] },
  { key: 'afternoon', ranges: [[840, 1080]] },
  { key: 'evening', ranges: [[1080, 1320]] },
  {
    key: 'night',
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
  for (const time of Object.values(schedule.days)) {
    if (!time) continue;
    const segs = segmentsOf(time);
    for (const period of PERIODS) {
      if (matched.has(period.key)) continue;
      if (segs.some((s) => period.ranges.some((r) => overlap(s[0], s[1], r[0], r[1])))) {
        matched.add(period.key);
      }
    }
  }
  return PERIODS.filter((p) => matched.has(p.key)).map((p) => t(`profile_page.period_${p.key}`));
}
