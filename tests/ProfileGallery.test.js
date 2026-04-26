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

  it('renders an <img> in each thumb when secondary_photos are provided', () => {
    const wrapper = mount(ProfileGallery, {
      props: {
        profile: {
          name: 'X',
          photo: '',
          secondary_photos: ['/profiles/x/secondary-1.jpg', '/profiles/x/secondary-2.jpg'],
        },
      },
    });
    const imgs = wrapper.findAll('.fp-thumb img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0].attributes('src')).toBe('/profiles/x/secondary-1.jpg');
    expect(imgs[1].attributes('src')).toBe('/profiles/x/secondary-2.jpg');
  });

  it('falls back to the placeholder when a secondary slot is null', () => {
    const wrapper = mount(ProfileGallery, {
      props: {
        profile: {
          name: 'X',
          photo: '',
          secondary_photos: [null, '/profiles/x/secondary-2.jpg'],
        },
      },
    });
    const thumbs = wrapper.findAll('.fp-thumb');
    expect(thumbs[0].find('img').exists()).toBe(false);
    expect(thumbs[0].find('span').exists()).toBe(true);
    expect(thumbs[1].find('img').exists()).toBe(true);
    expect(thumbs[1].find('img').attributes('src')).toBe('/profiles/x/secondary-2.jpg');
  });
});
