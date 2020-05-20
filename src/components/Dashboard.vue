<template>
  <div id="dashboard">
    <section>
      <div class="profile">
        <h5>{{ userProfile.name }}</h5>
        <div class="create-character">
          <p>create a character</p>
          <form @submit.prevent>
            <input v-model.trim="character.name" type="text" id="characterName" />
            <button @click="createCharacter" :disabled="character.name == ''" class="button">
              character
            </button>
          </form>
        </div>
      </div>

      <ul v-if="characters.length">
        <li v-for="character in characters" v-bind:key="character.id" class="character">
          <span>{{ character.userName }}</span> -
          <span>{{ character.name }}</span>
        </li>
      </ul>
      <div v-else>
        <p class="no-results">There are currently no characters</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const fb = require('../firebase');

export default {
  data() {
    return {
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
          userName: this.userProfile.name,
        })
        .then(() => {
          this.post.content = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
