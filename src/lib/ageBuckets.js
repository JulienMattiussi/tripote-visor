export const AGE_BUCKETS = [
  {
    id: 'under-30',
    labelKey: 'age_groups.under_30',
    img: '/age/under-30.svg',
    test: (a) => a < 30,
  },
  {
    id: '30-45',
    labelKey: 'age_groups.b30_45',
    img: '/age/30-45.svg',
    test: (a) => a >= 30 && a < 45,
  },
  {
    id: '45-60',
    labelKey: 'age_groups.b45_60',
    img: '/age/45-60.svg',
    test: (a) => a >= 45 && a < 60,
  },
  { id: 'over-60', labelKey: 'age_groups.over_60', img: '/age/over-60.svg', test: (a) => a >= 60 },
];

const BUCKET_BY_ID = Object.fromEntries(AGE_BUCKETS.map((b) => [b.id, b]));

export const ageInBucket = (age, id) => {
  const b = BUCKET_BY_ID[id];
  return b ? b.test(age) : true;
};

export const ageBucketLabelKey = (id) => BUCKET_BY_ID[id]?.labelKey ?? '';
