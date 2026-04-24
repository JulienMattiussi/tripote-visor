import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TravelersChoicePage from '../pages/TravelersChoicePage.vue';
import TravelStoriesPage from '../pages/TravelStoriesPage.vue';
import UserReviewPage from '../pages/UserReviewPage.vue';
import PostPhotosPage from '../pages/PostPhotosPage.vue';
import CreateListingPage from '../pages/CreateListingPage.vue';
import HotelsPage from '../pages/HotelsPage.vue';
import AttractionsPage from '../pages/AttractionsPage.vue';
import HowTheSiteWorksPage from '../pages/HowTheSiteWorksPage.vue';

export const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/travelers-choice', name: 'travelers-choice', component: TravelersChoicePage },
  {
    path: '/travelers-choice/:category',
    name: 'travelers-choice-category',
    component: TravelersChoicePage,
    props: true,
  },
  { path: '/travel-stories', name: 'travel-stories', component: TravelStoriesPage },
  { path: '/write-review', name: 'write-review', component: UserReviewPage },
  { path: '/post-photos', name: 'post-photos', component: PostPhotosPage },
  { path: '/add-place', name: 'add-place', component: CreateListingPage },
  { path: '/hotels', name: 'hotels', component: HotelsPage },
  { path: '/attractions', name: 'attractions', component: AttractionsPage },
  { path: '/how-it-works', name: 'how-it-works', component: HowTheSiteWorksPage },
];

export function createAppRouter({ history } = {}) {
  return createRouter({
    history: history ?? createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition;
      return { top: 0 };
    },
  });
}
