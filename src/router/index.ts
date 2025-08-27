import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../App.vue'),
    meta: {
      title: 'Losted'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Add route-level performance monitoring
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = (to.meta?.title as string) || 'Losted';
  next();
});

export default router;
