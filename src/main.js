import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/scss/app.scss';

const fb = require('./firebase');

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: (h) => h(App),
    });
  }
});
