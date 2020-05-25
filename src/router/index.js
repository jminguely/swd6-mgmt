import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

import Login from '../components/Login.vue';
import Homepage from '../components/Homepage.vue';
import Campaign from '../components/Campaign.vue';
import Campaigns from '../components/Campaigns.vue';
import Characters from '../components/Characters.vue';
import Settings from '../components/Settings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/campaigns',
    name: 'Campaigns',
    component: Campaigns,
    meta: {
      requiresAuth: true,
    },
  }, {
    path: '/campaign/:id',
    name: 'Campaign',
    component: Campaign,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/characters',
    name: 'Characters',
    component: Characters,
    meta: {
      requiresAuth: true,
    },
  }, {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const { currentUser } = firebase.auth();

  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
