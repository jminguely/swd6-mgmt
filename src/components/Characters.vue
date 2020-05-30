<template>
  <div id="characters" class="container-fluid">
    <section class="row">
      <div class="col-12">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <div class="create-character">
            <p>create a character</p>
            <form @submit.prevent>
              <input v-model.trim="character.name" type="text" id="characterName" />
              <button
                @click="createCharacter"
                :disabled="character.name == ''"
                class="button"
              >character</button>
            </form>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped" v-if="characters.length">
            <thead>
              <tr>
                <th rowspan="2" class="align-top">Name</th>
                <th rowspan="2" class="align-top">Player</th>
                <th rowspan="2" class="align-top">Type</th>
                <th :colspan="attributes.length" class="border-bottom-0 pb-0">Attributes</th>
              </tr>
              <tr>
                <th
                  v-for="attribute in attributes"
                  class="border-top-0 text-muted pt-0"
                  v-bind:key="attribute"
                >{{ attribute }}</th>
              </tr>
            </thead>
            <tbody>
              <CharacterLine
                :character="character"
                v-for="character in characters"
                v-bind:key="character.id"
              />
            </tbody>
          </table>
          <div v-else>
            <p class="no-results">There are currently no characters</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CharacterLine from './shared/CharacterLine.vue';
import attributes from '../data/attributes.json';

const fb = require('../firebase');

export default {
  components: {
    CharacterLine,
  },
  data() {
    return {
      attributes,
      character: {
        name: '',
      },
    };
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'characters']),
  },
  methods: {
    createCharacter() {
      fb.charactersCollection
        .add({
          createdOn: new Date(),
          name: this.character.name,
          userId: this.currentUser.uid,
          type: 'NPC',
          attributes: {},
        })
        .then(() => {
          this.post.content = '';
        })
        .catch(() => {
          // console.log(err);
        });
    },
  },
};
</script>
