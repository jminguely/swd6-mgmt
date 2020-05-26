import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router';
import store from './store';

import messages from './lang/messages';
import './assets/scss/app.scss';

const fb = require('./firebase');

Vue.config.productionTip = false;

Vue.use(VueI18n);
const locale = navigator.language;
const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale,
  messages,
});

// handle page reloads
let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: (h) => h(App),
      i18n,
    });
  }
});
