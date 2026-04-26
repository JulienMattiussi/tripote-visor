import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FicheGallery from '../src/components/FicheGallery.vue';
import { setLocale } from '../src/i18n/store.js';

beforeEach(() => setLocale('en'));

describe('FicheGallery', () => {
  it('renders the empty placeholder when fiche.photo is empty', () => {
    const wrapper = mount(FicheGallery, {
      props: { fiche: { nom: 'Mireille la folle', photo: '' } },
    });
    expect(wrapper.find('.fp-photo-main img').exists()).toBe(false);
    expect(wrapper.find('.fp-photo-empty').exists()).toBe(true);
  });

  it('renders the image when fiche.photo is set, using fiche.nom as alt', () => {
    const wrapper = mount(FicheGallery, {
      props: { fiche: { nom: 'Mireille la folle', photo: '/photos/mireille.jpg' } },
    });
    const img = wrapper.find('.fp-photo-main img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/photos/mireille.jpg');
    expect(img.attributes('alt')).toBe('Mireille la folle');
    expect(wrapper.find('.fp-photo-empty').exists()).toBe(false);
  });

  it('renders three thumbnail slots', () => {
    const wrapper = mount(FicheGallery, {
      props: { fiche: { nom: 'X', photo: '' } },
    });
    expect(wrapper.findAll('.fp-thumb')).toHaveLength(3);
  });

  it('switches the placeholder labels to French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(FicheGallery, {
      props: { fiche: { nom: 'X', photo: '' } },
    });
    expect(wrapper.find('.fp-photo-empty').text()).toBe('Principale');
    expect(wrapper.text()).toContain('Intérieur');
  });
});
