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
  </tr>
</template>


<script>
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
  },
};
</script>
