import Vue from 'vue';
import Vuex from 'vuex';

const fb = require('../firebase');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    characters: [],
    campaigns: [],
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setCharacters(state, val) {
      state.characters = val;
    },
    setCampaigns(state, val) {
      state.campaigns = val;
    },
    updateCampaigns(state, val) {
      fb.charactersCollection.update(val).then((res) => console.log('Message sent.', res))
        .catch((err) => console.log('Error', err));
    },
  },
  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null);
      commit('setUserProfile', {});
      commit('setCharacters', null);
      commit('setCampaigns', null);
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then((res) => {
          commit('setUserProfile', res.data());
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: {},
});

fb.auth.onAuthStateChanged((user) => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');

    // realtime updates from our posts collection
    fb.charactersCollection
      .where('userId', '==', user.uid)
      .orderBy('name', 'asc')
      .onSnapshot((querySnapshot) => {
        const characters = [];

        querySnapshot.forEach((doc) => {
          const character = doc.data();
          character.id = doc.id;
          characters.push(character);
        });

        store.commit('setCharacters', characters);
      });

    // realtime updates from our posts collection
    fb.campaignsCollection
      .where('userId', '==', user.uid)
      .orderBy('name', 'asc')
      .onSnapshot((querySnapshot) => {
        const campaigns = [];

        querySnapshot.forEach((doc) => {
          const character = doc.data();
          character.id = doc.id;
          campaigns.push(character);
        });

        store.commit('setCampaigns', campaigns);
      });
  }
});

export default store;
