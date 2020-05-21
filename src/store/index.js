import Vue from 'vue';
import Vuex from 'vuex';

const fb = require('../firebase');

Vue.use(Vuex);

export default new Vuex.Store({
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
