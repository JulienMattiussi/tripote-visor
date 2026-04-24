import { createMemoryHistory } from 'vue-router';
import { createAppRouter } from '../../src/router/index.js';

// jsdom doesn't implement window.scrollTo — Vue Router's scrollBehavior calls
// it on every navigation, which spams the console. Stub it once.
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  window.scrollTo = () => {};
} else if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}

// Creates a Vue Router instance backed by memory history (no URL bar) and
// awaits its first navigation so `<router-view>` is ready to render.
export async function setupRouter(initialPath = '/') {
  const router = createAppRouter({ history: createMemoryHistory() });
  await router.push(initialPath);
  await router.isReady();
  return router;
}

export function withRouter(router) {
  return { global: { plugins: [router] } };
}
