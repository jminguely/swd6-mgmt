<template>
  <div id="character">
    <section>
      <div class="profile">
        <div class="edit-character">
          <p>edit a character</p>
          <form>
            <input v-model.trim="character.name" type="text" id="characterName" />
            <select v-model="character.type">
              <option disabled value="">Choose</option>
              <option value="PC">PC</option>
              <option value="NPC">NPC</option>
              <option value="Archetype">Archetype</option>
            </select>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebase');

export default {
  name: 'Character',
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      character: {},
    };
  },
  watch: {
    character: {
      handler() {
        return this.updateCharacter();
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fb.charactersCollection
        .doc(this.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.exists) {
            this.character = querySnapshot.data();
          }
        });
    },
    updateCharacter() {
      fb.charactersCollection
        .doc(this.id)
        .set(this.character)
        .then(() => {});
    },
  },
};
</script>
