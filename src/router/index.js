import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import TravelStoriesPage from '../pages/TravelStoriesPage.vue';
import UserReviewPage from '../pages/UserReviewPage.vue';
import PostPhotosPage from '../pages/PostPhotosPage.vue';
import CreateListingPage from '../pages/CreateListingPage.vue';
import HotelsPage from '../pages/HotelsPage.vue';
import ParksPage from '../pages/ParksPage.vue';
import AlleysPage from '../pages/AlleysPage.vue';
import FichePage from '../pages/FichePage.vue';
import SearchResultsPage from '../pages/SearchResultsPage.vue';
import HowTheSiteWorksPage from '../pages/HowTheSiteWorksPage.vue';
import AccessibilityPage from '../pages/AccessibilityPage.vue';
import TermsPage from '../pages/TermsPage.vue';
import AboutPage from '../pages/AboutPage.vue';
import SafetyPage from '../pages/SafetyPage.vue';
import ResourcesPage from '../pages/ResourcesPage.vue';
import DiscoverPage from '../pages/DiscoverPage.vue';

export const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/encounters', name: 'encounters', component: TravelStoriesPage },
  { path: '/write-review', name: 'write-review', component: UserReviewPage },
  { path: '/post-photos', name: 'post-photos', component: PostPhotosPage },
  { path: '/add-sex-worker', name: 'add-sex-worker', component: CreateListingPage },
  { path: '/hotels', name: 'hotels', component: HotelsPage },
  { path: '/parks', name: 'parks', component: ParksPage },
  { path: '/alleys', name: 'alleys', component: AlleysPage },
  { path: '/p/:id', name: 'fiche', component: FichePage, props: true },
  { path: '/search', name: 'search', component: SearchResultsPage },
  { path: '/how-it-works', name: 'how-it-works', component: HowTheSiteWorksPage },
  { path: '/accessibility', name: 'accessibility', component: AccessibilityPage },
  { path: '/terms', name: 'terms', component: TermsPage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/safety', name: 'safety', component: SafetyPage },
  { path: '/resources', name: 'resources', component: ResourcesPage },
  { path: '/discover', name: 'discover', component: DiscoverPage },
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
