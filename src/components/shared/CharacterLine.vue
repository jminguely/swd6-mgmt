<template>
  <tr>
    <td>
      <ClickToEditInput classes="lg font-weight-bold" v-model="character.name" />
    </td>
    <td>
      <ClickToEditInput classes="md" v-model="character.player" />
    </td>
    <td>
      <ClickToEditInput classes="sm" v-model="character.type" />
    </td>
    <td v-for="attribute in attributes" v-bind:key="attribute">
      <ClickToEditInput classes="sm" v-model="character.attributes[attribute]" />
    </td>
    <td>
      <button @click="removeCharacter" class="btn btn-sm btn-danger rounded-pill">-</button>
    </td>
  </tr>
</template>

<script>
import axios from 'axios';
import ClickToEditInput from './ClickToEditInput.vue';
import attributes from '../../data/attributes.json';

const fb = require('../../firebase');

export default {
  name: 'CharacterLine',
  components: { ClickToEditInput },
  props: ['character'],
  watch: {
    character: {
      handler(newValue, oldValue) {
        this.updateCharacter(newValue, oldValue);
      },
      deep: true,
    },
  },
  data() {
    return {
      attributes,
    };
  },
  methods: {
    updateCharacter(character) {
      fb.charactersCollection
        .doc(character.id)
        .set(character)
        .then(() => {});
    },
    removeCharacter() {
      // const removeCharacter = fb.fbFunctions.httpsCallable('removeCharacter');
      // removeCharacter({ characterId: this.character.id }).then((result) => {
      //   // Read result of the Cloud Function.
      //   console.log(result);
      //   // ...
      // });

      axios({
        method: 'post',
        url: 'https://us-central1-swd6-mgmt.cloudfunctions.net/removeCharacter',
        // url: 'http://localhost:5000/swd6-mgmt/us-central1/removeCharacter',
        data: {
          characterId: this.character.id,
        },
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      })
        .then((response) => {
          console.log(response);
          // this.setState({ newMatch: [{}] });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
