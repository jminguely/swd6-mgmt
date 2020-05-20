import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/scss/app.scss';

const fb = require('./firebase');

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');

    // realtime updates from our posts collection
    fb.charactersCollection.orderBy('name', 'asc').onSnapshot((querySnapshot) => {
      const characters = [];

      querySnapshot.forEach((doc) => {
        const character = doc.data();
        character.id = doc.id;
        characters.push(character);
      });

      store.commit('setCharacters', characters);
    });
  }
});
