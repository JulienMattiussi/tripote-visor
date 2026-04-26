import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfileReviews from '../src/components/profile/ProfileReviews.vue';
import { setLocale } from '../src/i18n/store.js';

beforeEach(() => setLocale('en'));

const fakeReview = (i) => ({
  rating: (i % 5) + 1,
  title: `Review ${i}`,
  body: `Body of review ${i}`,
  author: `Author ${i}`,
  date: '2026-04-26',
  lang: 'en',
});

describe('ProfileReviews', () => {
  it('shows the empty state when reviews is empty', () => {
    const wrapper = mount(ProfileReviews, { props: { reviews: [] } });
    expect(wrapper.find('.fp-empty').exists()).toBe(true);
    expect(wrapper.find('.fp-empty').text()).toBe('No reviews yet.');
    expect(wrapper.find('.fp-reviews-summary').exists()).toBe(false);
    expect(wrapper.find('.fp-review').exists()).toBe(false);
  });

  it('renders the summary, the average rating and one li per review', () => {
    const reviews = [1, 2, 3].map(fakeReview);
    const wrapper = mount(ProfileReviews, { props: { reviews } });
    expect(wrapper.find('.fp-reviews-summary').exists()).toBe(true);
    const expected = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    expect(wrapper.find('.fp-reviews-avg').text()).toBe(expected.toFixed(1));
    expect(wrapper.findAll('.fp-review')).toHaveLength(3);
    expect(wrapper.find('.fp-reviews-more').exists()).toBe(false);
  });

  it('caps visible reviews at 5 and reveals all on "see all" click', async () => {
    const reviews = Array.from({ length: 8 }, (_, i) => fakeReview(i + 1));
    const wrapper = mount(ProfileReviews, { props: { reviews } });
    expect(wrapper.findAll('.fp-review')).toHaveLength(5);
    const more = wrapper.find('.fp-reviews-more');
    expect(more.exists()).toBe(true);
    await more.trigger('click');
    expect(wrapper.findAll('.fp-review')).toHaveLength(8);
    expect(wrapper.find('.fp-reviews-more').exists()).toBe(false);
  });

  it('emits add-review when the add button is clicked', async () => {
    const wrapper = mount(ProfileReviews, { props: { reviews: [] } });
    await wrapper.find('.fp-reviews-add').trigger('click');
    expect(wrapper.emitted('add-review')).toHaveLength(1);
  });

  it('renders the empty state in French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(ProfileReviews, { props: { reviews: [] } });
    expect(wrapper.find('.fp-empty').text()).toBe('Aucun avis pour le moment.');
  });
});
