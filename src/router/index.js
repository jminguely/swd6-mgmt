import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

import Login from '../components/Login.vue';
import Homepage from '../components/Homepage.vue';
import Campaign from '../components/Campaign.vue';
import Encounter from '../components/Encounter.vue';
import Campaigns from '../components/Campaigns.vue';
import Character from '../components/Character.vue';
import Characters from '../components/Characters.vue';

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
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    component: Campaigns,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/campaigns/:id',
    name: 'Campaign',
    component: Campaign,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/campaigns/:id/encounter',
    name: 'Encounter',
    component: Encounter,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/characters/:id',
    name: 'Character',
    component: Character,
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
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active',
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
