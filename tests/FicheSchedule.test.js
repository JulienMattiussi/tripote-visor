import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FicheSchedule from '../src/components/FicheSchedule.vue';
import { setLocale } from '../src/i18n/store.js';

const SAMPLE_SCHEDULE = {
  id: 'soir_classique',
  jours: {
    lundi: '18:00-02:00',
    mardi: '18:00-02:00',
    mercredi: '18:00-02:00',
    jeudi: '18:00-02:00',
    vendredi: '18:00-02:00',
    samedi: '18:00-02:00',
    dimanche: null,
  },
};

beforeEach(() => setLocale('en'));
afterEach(() => vi.useRealTimers());

describe('FicheSchedule', () => {
  it('renders all 7 weekdays in Monday-first order', () => {
    const wrapper = mount(FicheSchedule, { props: { schedule: SAMPLE_SCHEDULE } });
    const days = wrapper.findAll('.fp-hours th').map((t) => t.text());
    expect(days).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  it('shows the open hours and "Closed" for the dimanche row', () => {
    const wrapper = mount(FicheSchedule, { props: { schedule: SAMPLE_SCHEDULE } });
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[0].text()).toContain('18:00-02:00');
    expect(rows[6].text()).toContain('Closed');
    expect(rows[6].find('.fp-closed-cell').exists()).toBe(true);
  });

  it('marks today with the .today class and shows "Open until X" status', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-27T12:00:00')); // Monday
    const wrapper = mount(FicheSchedule, { props: { schedule: SAMPLE_SCHEDULE } });
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[0].classes()).toContain('today');
    const status = wrapper.find('.fp-status-tag');
    expect(status.classes()).toContain('open');
    expect(status.text()).toBe('Open until 02:00');
  });

  it('shows "Closed today" when the current day is closed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-26T12:00:00')); // Sunday
    const wrapper = mount(FicheSchedule, { props: { schedule: SAMPLE_SCHEDULE } });
    const status = wrapper.find('.fp-status-tag');
    expect(status.classes()).toContain('closed');
    expect(status.text()).toBe('Closed today');
  });

  it('renders the table with no time rows when schedule is null', () => {
    const wrapper = mount(FicheSchedule, { props: { schedule: null } });
    // 7 day rows still render, but every day cell should be the "Closed" placeholder
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows).toHaveLength(7);
    expect(wrapper.findAll('.fp-closed-cell')).toHaveLength(7);
  });

  it('renders day labels in French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(FicheSchedule, { props: { schedule: SAMPLE_SCHEDULE } });
    const days = wrapper.findAll('.fp-hours th').map((t) => t.text());
    expect(days).toEqual(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
  });
});
