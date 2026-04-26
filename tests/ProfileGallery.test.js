import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfileGallery from '../src/components/profile/ProfileGallery.vue';
import { setLocale } from '../src/i18n/store.js';

beforeEach(() => setLocale('en'));

describe('ProfileGallery', () => {
  it('renders the empty placeholder when profile.photo is empty', () => {
    const wrapper = mount(ProfileGallery, {
      props: { profile: { name: 'Mireille la folle', photo: '' } },
    });
    expect(wrapper.find('.fp-photo-main img').exists()).toBe(false);
    expect(wrapper.find('.fp-photo-empty').exists()).toBe(true);
  });

  it('renders the image when profile.photo is set, using profile.name as alt', () => {
    const wrapper = mount(ProfileGallery, {
      props: { profile: { name: 'Mireille la folle', photo: '/photos/mireille.jpg' } },
    });
    const img = wrapper.find('.fp-photo-main img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/photos/mireille.jpg');
    expect(img.attributes('alt')).toBe('Mireille la folle');
    expect(wrapper.find('.fp-photo-empty').exists()).toBe(false);
  });

  it('renders two thumbnail slots', () => {
    const wrapper = mount(ProfileGallery, {
      props: { profile: { name: 'X', photo: '' } },
    });
    expect(wrapper.findAll('.fp-thumb')).toHaveLength(2);
  });

  it('switches the placeholder labels to French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(ProfileGallery, {
      props: { profile: { name: 'X', photo: '' } },
    });
    expect(wrapper.find('.fp-photo-empty').text()).toBe('Principale');
    expect(wrapper.text()).toContain('Intérieur');
  });
});
