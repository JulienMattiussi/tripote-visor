import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import UserReviewPage from '../src/pages/UserReviewPage.vue';
import PostPhotosPage from '../src/pages/PostPhotosPage.vue';
import CreateListingPage from '../src/pages/CreateListingPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

let router;

describe('UserReviewPage (Write a review)', () => {
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/write-review');
  });

  it('renders the hero, all required fields and a disabled-style submit', () => {
    const wrapper = mount(UserReviewPage, withRouter(router));
    expect(wrapper.find('.form-hero-title').text()).toBe('Write a review');
    expect(wrapper.find('input[type="text"]').exists()).toBe(true); // place
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.findAll('.star-btn')).toHaveLength(5);
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(5); // trip types
    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('.form-submit').text()).toBe('Publish my review');
  });

  it('shows the inline error and stays on the form when required fields are missing', async () => {
    const wrapper = mount(UserReviewPage, withRouter(router));
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.form-error').exists()).toBe(true);
    expect(wrapper.find('.form-error').text()).toContain('every required field');
    expect(wrapper.find('.form-success').exists()).toBe(false);
  });

  it('submitting a fully filled form swaps the form for the success card', async () => {
    const wrapper = mount(UserReviewPage, withRouter(router));

    await wrapper.find('input[type="text"]').setValue('Hôtel Plaza Beaubourg');
    await wrapper.findAll('.star-btn')[4].trigger('click'); // 5 stars
    await wrapper.find('input[type="date"]').setValue('2026-03-10');
    await wrapper.findAll('input[type="radio"]')[0].setValue(); // first trip type
    await wrapper.findAll('input[type="text"]')[1].setValue('A perfect stay');
    await wrapper.find('textarea').setValue('Wonderful breakfast and warm staff.');

    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.form-success').exists()).toBe(true);
    expect(wrapper.find('.form-success h2').text()).toBe('Thanks — your review is in the queue!');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('star buttons toggle the rating and surface the matching label', async () => {
    const wrapper = mount(UserReviewPage, withRouter(router));
    await wrapper.findAll('.star-btn')[2].trigger('click'); // 3 stars
    expect(wrapper.findAll('.star-btn').filter((s) => s.classes('active'))).toHaveLength(3);
    expect(wrapper.find('.rating-text').text()).toBe('Average');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(UserReviewPage, withRouter(router));
    expect(wrapper.find('.form-hero-title').text()).toBe('Écrire un avis');
    expect(wrapper.find('.form-submit').text()).toBe('Publier mon avis');
  });

  it('navigates back to / when "Back to home" is clicked from the success card', async () => {
    const wrapper = mount(UserReviewPage, withRouter(router));
    await wrapper.find('input[type="text"]').setValue('A place');
    await wrapper.findAll('.star-btn')[4].trigger('click');
    await wrapper.find('input[type="date"]').setValue('2026-03-10');
    await wrapper.findAll('input[type="radio"]')[0].setValue();
    await wrapper.findAll('input[type="text"]')[1].setValue('Title');
    await wrapper.find('textarea').setValue('Body');
    await wrapper.find('form').trigger('submit');

    await wrapper.find('.form-success .pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });
});

describe('PostPhotosPage (Publish photos)', () => {
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/post-photos');
  });

  it('renders the hero, place input, drop zone, caption, and consent checkbox', () => {
    const wrapper = mount(PostPhotosPage, withRouter(router));
    expect(wrapper.find('.form-hero-title').text()).toBe('Post photos');
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('.drop-zone').exists()).toBe(true);
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('.consent input[type="checkbox"]').exists()).toBe(true);
  });

  it('blocks submission until place + at least one file + consent are present', async () => {
    const wrapper = mount(PostPhotosPage, withRouter(router));
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.form-error').exists()).toBe(true);
    expect(wrapper.find('.form-success').exists()).toBe(false);
  });

  it('staged files appear in the list and can be removed', async () => {
    const wrapper = mount(PostPhotosPage, withRouter(router));
    const fileInput = wrapper.find('input[type="file"]').element;
    const file = new File(['x'], 'cliché.jpg', { type: 'image/jpeg' });
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });
    await wrapper.find('input[type="file"]').trigger('change');

    expect(wrapper.find('.file-name').text()).toBe('cliché.jpg');
    expect(wrapper.find('.file-count').text()).toContain('1');

    await wrapper.find('.file-remove').trigger('click');
    expect(wrapper.find('.file-row').exists()).toBe(false);
  });

  it('successful submission swaps the form for the success card (FR locale)', async () => {
    setLocale('fr');
    const wrapper = mount(PostPhotosPage, withRouter(router));

    await wrapper.find('input[type="text"]').setValue('Hôtel des Trois Lunes');
    const fileInput = wrapper.find('input[type="file"]').element;
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['x'], 'a.jpg', { type: 'image/jpeg' })],
      configurable: true,
    });
    await wrapper.find('input[type="file"]').trigger('change');
    await wrapper.find('.consent input[type="checkbox"]').setValue(true);

    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.form-success h2').text()).toBe('Merci — photos bien reçues !');
  });
});

describe('CreateListingPage (Add a place)', () => {
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/add-place');
  });

  it('renders the hero, type chips, name + address fields, and relationship radios', () => {
    const wrapper = mount(CreateListingPage, withRouter(router));
    expect(wrapper.find('.form-hero-title').text()).toBe('Add a place');

    const typeChips = wrapper
      .findAll('.chip')
      .slice(0, 4)
      .map((c) => c.text());
    expect(typeChips).toEqual(['Hotel', 'Restaurant', 'Things to Do', 'Vacation Rental']);

    expect(wrapper.find('select').exists()).toBe(true); // country
    expect(wrapper.findAll('input[type="text"]').length).toBeGreaterThanOrEqual(4); // name, address, city, postal
    expect(wrapper.find('input[type="tel"]').exists()).toBe(true);
    expect(wrapper.find('input[type="url"]').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);

    const relationshipLabels = wrapper.findAll('.radio-row').map((r) => r.text());
    expect(relationshipLabels).toEqual([
      'I own or manage it',
      'I work there',
      'I’m a traveller who visited',
    ]);
  });

  it('submitting an empty form shows the inline error', async () => {
    const wrapper = mount(CreateListingPage, withRouter(router));
    // Clear the default-filled name to make sure validation fires
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.form-error').exists()).toBe(true);
  });

  it('fully filled submission shows the success card', async () => {
    const wrapper = mount(CreateListingPage, withRouter(router));

    const textInputs = wrapper.findAll('input[type="text"]');
    await textInputs[0].setValue('Hôtel des Trois Lunes'); // name
    await textInputs[1].setValue('12 rue de la République'); // address
    await textInputs[2].setValue('Lyon'); // city
    await textInputs[3].setValue('69002'); // postal
    await wrapper.find('textarea').setValue('A cosy 12-room boutique hotel in the heart of Lyon.');
    await wrapper.findAll('.radio-row input')[0].setValue();

    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.form-success').exists()).toBe(true);
    expect(wrapper.find('.form-success h2').text()).toBe('Thanks — listing submitted!');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(CreateListingPage, withRouter(router));
    expect(wrapper.find('.form-hero-title').text()).toBe('Ajouter un lieu');
    expect(wrapper.find('.form-submit').text()).toBe('Soumettre la fiche');
    expect(
      wrapper
        .findAll('.chip')
        .slice(0, 4)
        .map((c) => c.text()),
    ).toEqual(['Hôtel', 'Restaurant', 'Activité', 'Location de vacances']);
  });
});
